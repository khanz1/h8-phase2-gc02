import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import { ResponseDTO } from "@/shared/utils/response.dto";
import { UnauthorizedError, BadRequestError } from "@/shared/errors";
import { SeedService } from "@/shared/services/seed.service";

export interface SeedQueryParams {
  code?: string;
  type?: "seed" | "re-seed" | "empty";
}

export interface SeedResponse {
  success: boolean;
  message: string;
  data?: {
    type: string;
    duration: number;
    recordsAffected?: number;
  };
}

export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly seedService: SeedService;

  constructor() {
    this.seedService = new SeedService();
  }

  /**
   * Handle seed API request with validation and proper error handling
   */
  public async handleSeedRequest(
    req: Request,
    res: Response
  ): Promise<Response> {
    const startTime = Date.now();
    const { code, type = "seed" } = req.query as SeedQueryParams;

    try {
      // Validate required parameters
      if (!code) {
        throw new BadRequestError("Code parameter is required");
      }

      // Validate code against environment variable
      const expectedCode = process.env.SEED_CODE;
      if (!expectedCode) {
        this.logger.error("SEED_CODE environment variable is not configured");
        throw new UnauthorizedError("Seed functionality is not configured");
      }

      if (code !== expectedCode) {
        this.logger.warn("Invalid seed code provided", {
          providedCode: code,
          ip: req.ip,
        });
        throw new UnauthorizedError("Invalid seed code");
      }

      // Validate type parameter
      if (!["seed", "re-seed", "empty"].includes(type)) {
        throw new BadRequestError(
          "Invalid type parameter. Must be one of: seed, re-seed, empty"
        );
      }

      this.logger.info("Starting seed operation", { type, ip: req.ip });

      // Execute based on type
      let message: string;
      let recordsAffected: number | undefined;

      switch (type) {
        case "seed":
          await this.seedService.seed(false); // Don't clear first
          message = "Database seeded successfully";
          break;

        case "re-seed":
          await this.seedService.seed(true); // Clear first
          message = "Database re-seeded successfully (cleared and seeded)";
          break;

        case "empty":
          await this.seedService.undoSeeds({
            truncate: true,
            restartIdentity: true,
            cascade: true,
          });
          message = "Database cleared successfully";
          break;

        default:
          throw new BadRequestError("Invalid seed type");
      }

      const duration = Date.now() - startTime;

      this.logger.info("Seed operation completed successfully", {
        type,
        duration: `${duration}ms`,
        ip: req.ip,
      });

      const response: SeedResponse = {
        success: true,
        message,
        data: {
          type,
          duration,
          recordsAffected,
        },
      };

      return res.status(200).json(response);
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error("Seed operation failed", {
        error: error instanceof Error ? error.message : error,
        type,
        duration: `${duration}ms`,
        ip: req.ip,
      });

      if (
        error instanceof UnauthorizedError ||
        error instanceof BadRequestError
      ) {
        return res
          .status(error.statusCode)
          .json(ResponseDTO.failed(error.message));
      }

      return res
        .status(500)
        .json(
          ResponseDTO.failed("Internal server error during seed operation")
        );
    }
  }

  /**
   * Get application health status
   */
  public async getHealthStatus(req: Request, res: Response): Promise<Response> {
    try {
      const healthData = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
      };

      return res
        .status(200)
        .json(ResponseDTO.success("Health check successful", healthData));
    } catch (error) {
      this.logger.error("Health check failed", { error });
      return res.status(500).json(ResponseDTO.failed("Health check failed"));
    }
  }

  /**
   * Get application information
   */
  public async getAppInfo(req: Request, res: Response): Promise<Response> {
    try {
      const appInfo = {
        name: "Phase2 Graded Challenge API",
        version: "1.0.0",
        description: "A comprehensive API for Phase2 Graded Challenge",
        documentation: "/api/docs",
        endpoints: {
          health: "/health",
          auth: "/apis/auth",
          blog: "/apis/blog",
          publicBlog: "/apis/pub/blog",
          careers: "/apis/careers",
          publicCareers: "/apis/pub/careers",
          movies: "/apis/movies",
          publicMovies: "/apis/pub/movies",
          news: "/apis/news",
          publicNews: "/apis/pub/news",
          seed: "/apis/seed",
        },
      };

      return res
        .status(200)
        .json(
          ResponseDTO.success("Application information retrieved", appInfo)
        );
    } catch (error) {
      this.logger.error("Failed to get app info", { error });
      return res
        .status(500)
        .json(ResponseDTO.failed("Failed to retrieve application information"));
    }
  }
}
