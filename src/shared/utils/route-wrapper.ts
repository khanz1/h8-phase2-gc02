import { Request, Response, NextFunction } from "express";
import { Logger } from "@/config/logger";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

type SyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

type RequestHandler = AsyncRequestHandler | SyncRequestHandler;

export class RouteWrapper {
  private static readonly logger = Logger.getInstance();

  /**
   * Wraps an async route handler with automatic error handling
   * Eliminates the need for try-catch blocks in controllers
   */
  public static withErrorHandler(handler: RequestHandler): RequestHandler {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        await handler(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Wraps multiple route handlers with error handling
   * Useful for middleware chains
   */
  public static withErrorHandlers(
    ...handlers: RequestHandler[]
  ): RequestHandler[] {
    return handlers.map((handler) => this.withErrorHandler(handler));
  }

  /**
   * Creates a route handler with custom error context
   * Useful for adding operation-specific context to error logs
   */
  public static withErrorContext(
    handler: RequestHandler,
    context: string
  ): RequestHandler {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        await handler(req, res, next);
      } catch (error) {
        this.logger.error(`${context} error:`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          url: req.url,
          method: req.method,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
          context,
        });

        next(error);
      }
    };
  }
}
