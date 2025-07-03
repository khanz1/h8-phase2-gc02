import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Logger } from "@/config/logger";
import { DatabaseConnection } from "@/config/database";
import { ErrorHandler } from "@/shared/middleware/errorHandler";
import { SlidingWindowRateLimiter } from "@/shared/middleware/rateLimiter.middleware";
import { AuthRoutes } from "@/features/auth/auth.routes";
import { BlogRoutes } from "@/features/blog/blog.routes";
import { CareerRoutes } from "@/features/careers/career.routes";
import { MovieRoutes } from "@/features/movies/movie.routes";
import { NewsRoutes } from "@/features/news/news.routes";
import { ProductRoutes } from "@/features/products/product.routes";
import { RentalRoutes } from "@/features/rentals/rental.routes";
import { RouteMapper } from "@/shared/utils/route-mapper";
import { LectureRoutes } from "@/features/lecture/lecture.routes";
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
    this.app.use(helmet());

    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
      })
    );

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    morgan.token("real-ip", (req: Request) => {
      return (
        (req.headers["x-real-ip"] as string) ||
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        req.ip ||
        "unknown"
      );
    });

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

    const rateLimiter = new SlidingWindowRateLimiter(5000, 10);
    this.app.use(rateLimiter.middleware);

    this.logger.info("✅ Middleware setup completed");
  }

  private setupRoutes(): void {
    this.app.get("/health", (req: Request, res: Response) => {
      this.appService.getHealthStatus(req, res);
    });

    this.app.get("/", (req: Request, res: Response) => {
      this.appService.getAppInfo(req, res);
    });

    this.app.get("/apis/seed", (req: Request, res: Response) => {
      this.appService.handleSeedRequest(req, res);
    });

    const authRoutes = new AuthRoutes();
    this.app.use("/apis/auth", authRoutes.getRouter());

    const blogRoutes = new BlogRoutes();
    this.app.use("/apis/blog", blogRoutes.getRouter());
    this.app.use("/apis/pub/blog", blogRoutes.getPublicRouter());

    const careerRoutes = new CareerRoutes();
    this.app.use("/apis/careers", careerRoutes.getRouter());
    this.app.use("/apis/pub/careers", careerRoutes.getPublicRouter());

    const movieRoutes = new MovieRoutes();
    this.app.use("/apis/movies", movieRoutes.getRouter());
    this.app.use("/apis/pub/movies", movieRoutes.getPublicRouter());

    const newsRoutes = new NewsRoutes();
    this.app.use("/apis/news", newsRoutes.getRouter());
    this.app.use("/apis/pub/news", newsRoutes.getPublicRouter());

    const productRoutes = new ProductRoutes();
    this.app.use("/apis/products", productRoutes.getRouter());
    this.app.use("/apis/pub/products", productRoutes.getPublicRouter());

    const rentalRoutes = new RentalRoutes();
    this.app.use("/apis/rentals", rentalRoutes.getRouter());
    this.app.use("/apis/pub/rentals", rentalRoutes.getPublicRouter());

    const lectureRoutes = new LectureRoutes();
    this.app.use("/apis/lectures", lectureRoutes.getRouter());
    this.app.use("/apis/pub/lectures", lectureRoutes.getPublicRouter());

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
    this.app.use(ErrorHandler.handle);

    this.logger.info("✅ Error handling setup completed");
  }

  public async initialize(): Promise<void> {
    try {
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
