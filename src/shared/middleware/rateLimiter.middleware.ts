import { Request, Response, NextFunction } from "express";
import { Logger } from "@/config/logger";

interface RequestLog {
  timestamp: number;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

interface RateLimitResponse {
  success: boolean;
  message: string;
  data?: any;
  rateLimitInfo: RateLimitInfo;
  retryAfter: string;
}

export class SlidingWindowRateLimiter {
  private readonly requestLogs: Map<string, RequestLog[]> = new Map();
  private readonly windowSizeMs: number;
  private readonly maxRequests: number;
  private readonly logger = Logger.getInstance();

  constructor(windowSizeMs: number = 5000, maxRequests: number = 10) {
    this.windowSizeMs = windowSizeMs;
    this.maxRequests = maxRequests;

    // Clean up old entries every minute
    setInterval(() => {
      this.cleanupOldEntries();
    }, 60000);
  }

  private getClientIdentifier(req: Request): string {
    // Use IP address as client identifier
    const ip =
      (req.headers["x-real-ip"] as string) ||
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      req.ip ||
      "unknown";

    return ip;
  }

  private cleanupOldEntries(): void {
    const now = Date.now();
    const cutoff = now - this.windowSizeMs;

    for (const [clientId, logs] of this.requestLogs.entries()) {
      const validLogs = logs.filter((log) => log.timestamp > cutoff);

      if (validLogs.length === 0) {
        this.requestLogs.delete(clientId);
      } else {
        this.requestLogs.set(clientId, validLogs);
      }
    }
  }

  private getCurrentWindow(clientId: string): RequestLog[] {
    const now = Date.now();
    const cutoff = now - this.windowSizeMs;

    const logs = this.requestLogs.get(clientId) || [];
    const validLogs = logs.filter((log) => log.timestamp > cutoff);

    this.requestLogs.set(clientId, validLogs);
    return validLogs;
  }

  private calculateRateLimitInfo(logs: RequestLog[]): RateLimitInfo {
    const now = Date.now();
    const remaining = Math.max(0, this.maxRequests - logs.length);

    // Find the oldest request in current window
    const oldestRequest =
      logs.length > 0 ? Math.min(...logs.map((log) => log.timestamp)) : now;

    const resetTime = oldestRequest + this.windowSizeMs;

    return {
      limit: this.maxRequests,
      remaining,
      resetTime,
    };
  }

  private calculateRetryAfter(logs: RequestLog[]): number | undefined {
    if (logs.length < this.maxRequests) {
      return undefined;
    }

    const now = Date.now();
    const oldestRequest = Math.min(...logs.map((log) => log.timestamp));
    const retryAfter = Math.ceil(
      (oldestRequest + this.windowSizeMs - now) / 1000
    );

    return Math.max(1, retryAfter);
  }

  public middleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const clientId = this.getClientIdentifier(req);
      const currentWindow = this.getCurrentWindow(clientId);
      const now = Date.now();

      // Check if limit exceeded
      if (currentWindow.length >= this.maxRequests) {
        const rateLimitInfo = this.calculateRateLimitInfo(currentWindow);
        const retryAfter = this.calculateRetryAfter(currentWindow);

        const retryAfterTime = new Date(
          now + (retryAfter || 1) * 1000
        ).toISOString();

        const response: RateLimitResponse = {
          success: false,
          message: "Rate limit exceeded. Too many requests.",
          rateLimitInfo: {
            ...rateLimitInfo,
            retryAfter,
          },
          retryAfter: `You can try again at ${retryAfterTime} (in ${
            retryAfter || 1
          } seconds)`,
        };

        // Set rate limit headers
        res.set({
          "X-RateLimit-Limit": this.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": rateLimitInfo.resetTime.toString(),
          "Retry-After": retryAfter?.toString() || "1",
        });

        this.logger.warn(`Rate limit exceeded for client ${clientId}`, {
          clientId,
          requestCount: currentWindow.length,
          limit: this.maxRequests,
          retryAfter,
        });

        res.status(429).json(response);
        return;
      }

      // Add current request to window
      currentWindow.push({ timestamp: now });
      this.requestLogs.set(clientId, currentWindow);

      // Calculate updated rate limit info
      const rateLimitInfo = this.calculateRateLimitInfo(currentWindow);

      // Set rate limit headers for successful request
      res.set({
        "X-RateLimit-Limit": this.maxRequests.toString(),
        "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
        "X-RateLimit-Reset": rateLimitInfo.resetTime.toString(),
      });

      // Add rate limit info to response locals for potential use in controllers
      res.locals.rateLimitInfo = rateLimitInfo;

      this.logger.debug(`Request allowed for client ${clientId}`, {
        clientId,
        requestCount: currentWindow.length,
        remaining: rateLimitInfo.remaining,
      });

      next();
    } catch (error) {
      this.logger.error("Error in rate limiter middleware:", error);
      next(error);
    }
  };

  public getStats(): { totalClients: number; totalActiveRequests: number } {
    const totalClients = this.requestLogs.size;
    const totalActiveRequests = Array.from(this.requestLogs.values()).reduce(
      (sum, logs) => sum + logs.length,
      0
    );

    return {
      totalClients,
      totalActiveRequests,
    };
  }
}
