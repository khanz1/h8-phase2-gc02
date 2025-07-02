import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Logger } from "@/config/logger";
import { DatabaseConnection } from "@/config/database";
import { ErrorHandler } from "@/shared/middleware/errorHandler";
import { AuthRoutes } from "@/features/auth/auth.routes";
import { BlogRoutes } from "@/features/blog/blog.routes";
import { RouteMapper } from "@/shared/utils/route-mapper";
import { AppService } from "@/app.service";

export class App {
  private readonly app: Application;
  private readonly logger = Logger.getInstance();
  private readonly database = DatabaseConnection.getInstance();
  private readonly appService: AppService;

  constructor() {
    this.app = express();
    this.appService = new AppService();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
      })
    );

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Request logging with Morgan
    // Define custom token for real IP (from X-Real-IP header)
    morgan.token("real-ip", (req: Request) => {
      return (
        (req.headers["x-real-ip"] as string) ||
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        req.ip ||
        "unknown"
      );
    });

    // Custom format for production with real IP
    const productionFormat =
      ':real-ip - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

    const morganFormat =
      process.env.NODE_ENV === "production" ? productionFormat : "dev";

    this.app.use(
      morgan(morganFormat, {
        stream: {
          write: (message: string) => {
            this.logger.info(message.trim());
          },
        },
      })
    );

    this.logger.info("✅ Middleware setup completed");
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req: Request, res: Response) => {
      this.appService.getHealthStatus(req, res);
    });

    // API routes will be added here
    this.app.get("/", (req: Request, res: Response) => {
      this.appService.getAppInfo(req, res);
    });

    // Seed API endpoint
    this.app.get("/api/seed", (req: Request, res: Response) => {
      this.appService.handleSeedRequest(req, res);
    });

    // Authentication routes
    const authRoutes = new AuthRoutes();
    this.app.use("/apis/auth", authRoutes.getRouter());

    // Blog routes
    const blogRoutes = new BlogRoutes();
    this.app.use("/apis/blog", blogRoutes.getRouter());
    this.app.use("/apis/pub/blog", blogRoutes.getPublicRouter());

    // 404 handler for undefined routes
    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
        method: req.method,
      });
    });

    this.logger.info("✅ Routes setup completed");
  }

  private setupErrorHandling(): void {
    // Global error handler
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        ErrorHandler.handle(error, req, res, next);
      }
    );

    this.logger.info("✅ Error handling setup completed");
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize database connection
      await this.database.connect();
      this.logger.info("✅ Application initialized successfully");
    } catch (error) {
      this.logger.error("❌ Failed to initialize application:", error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    try {
      await this.database.disconnect();
      this.logger.info("✅ Application shutdown completed");
    } catch (error) {
      this.logger.error("❌ Error during application shutdown:", error);
      throw error;
    }
  }

  public mapRoutes(): void {
    const routeMapper = new RouteMapper();
    routeMapper.mapRoutes(this.app);
  }

  public getExpressApp(): Application {
    return this.app;
  }
}
