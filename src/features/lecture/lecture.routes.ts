import { Router } from "express";
import { RouteWrapper } from "@/shared/utils/route-wrapper";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import { Logger } from "@/config/logger";
import { AnimeController, AnimePublicController } from "./lecture.controller";
import { AnimeService } from "./lecture.service";
import { AnimeRepository } from "./lecture.repository";
import { Anime } from "./lecture.model";

export class LectureRoutes {
  private readonly router: Router;
  private readonly publicRouter: Router;
  private readonly animeController: AnimeController;
  private readonly publicController: AnimePublicController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();
    this.publicRouter = Router();

    const animeRepository = new AnimeRepository();
    const animeService = new AnimeService(animeRepository);

    this.animeController = new AnimeController(animeService);
    this.publicController = new AnimePublicController(animeService);

    this.setupAuthenticatedRoutes();
    this.setupPublicRoutes();

    this.logger.info("Lecture routes initialized successfully");
  }

  private setupAuthenticatedRoutes(): void {
    this.router.get(
      "/movies",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.animeController.getAllAnimes)
    );

    this.router.get(
      "/movies/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.animeController.getAnimeById)
    );

    this.router.post(
      "/movies",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      RouteWrapper.withErrorHandler(this.animeController.createAnime)
    );

    this.router.put(
      "/movies/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(Anime),
      RouteWrapper.withErrorHandler(this.animeController.updateAnime)
    );

    this.router.patch(
      "/movies/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(Anime),
      UploadMiddleware.singleImage("file"),
      RouteWrapper.withErrorHandler(this.animeController.updateAnimeImage)
    );

    this.router.delete(
      "/movies/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(Anime),
      RouteWrapper.withErrorHandler(this.animeController.deleteAnime)
    );

    this.logger.info("✅ Lecture authenticated routes configured successfully");
  }

  private setupPublicRoutes(): void {
    this.publicRouter.get(
      "/movies",
      RouteWrapper.withErrorHandler(this.publicController.getAllAnimesPublic)
    );

    this.publicRouter.get(
      "/movies/:id",
      RouteWrapper.withErrorHandler(this.publicController.getAnimeByIdPublic)
    );

    this.publicRouter.post(
      "/movies",
      RouteWrapper.withErrorHandler(this.publicController.createAnimePublic)
    );

    this.publicRouter.delete(
      "/movies/:id",
      RouteWrapper.withErrorHandler(this.publicController.deleteAnimePublic)
    );

    this.publicRouter.put(
      "/movies/:id",
      RouteWrapper.withErrorHandler(this.publicController.updateAnimePublic)
    );

    this.publicRouter.patch(
      "/movies/:id",
      RouteWrapper.withErrorHandler(this.publicController.updateAnimePublic)
    );

    this.logger.info("✅ Lecture public routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPublicRouter(): Router {
    return this.publicRouter;
  }
}
