import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import {
  MovieGenreController,
  MovieController,
  MoviePublicController,
} from "./movie.controller";
import { MovieGenreRepository, MovieRepository } from "./movie.repository";
import { MovieGenreService, MovieService } from "./movie.service";
import { Logger } from "@/config/logger";
import { Movie } from "./movie.model";
import { RouteWrapper } from "@/shared/utils/route-wrapper";

export class MovieRoutes {
  private readonly router: Router;
  private readonly publicRouter: Router;
  private readonly genreController: MovieGenreController;
  private readonly movieController: MovieController;
  private readonly publicController: MoviePublicController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();
    this.publicRouter = Router();

    const genreRepository = new MovieGenreRepository();
    const movieRepository = new MovieRepository();

    const genreService = new MovieGenreService(genreRepository);
    const movieService = new MovieService(movieRepository, genreRepository);

    this.genreController = new MovieGenreController(genreService);
    this.movieController = new MovieController(movieService);
    this.publicController = new MoviePublicController(
      movieService,
      genreService
    );

    this.setupAuthenticatedRoutes();
    this.setupPublicRoutes();
  }

  private setupAuthenticatedRoutes(): void {
    this.router.get(
      "/genres",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.genreController.getAllGenres)
    );

    this.router.get(
      "/genres/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.genreController.getGenreById)
    );

    this.router.post(
      "/genres",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.genreController.createGenre)
    );

    this.router.put(
      "/genres/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.genreController.updateGenre)
    );

    this.router.delete(
      "/genres/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.genreController.deleteGenre)
    );

    this.router.get(
      "/movies",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.movieController.getAllMovies)
    );

    this.router.get(
      "/movies/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.movieController.getMovieById)
    );

    this.router.post(
      "/movies",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      RouteWrapper.withErrorHandler(this.movieController.createMovie)
    );

    this.router.put(
      "/movies/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(Movie),
      RouteWrapper.withErrorHandler(this.movieController.updateMovie)
    );

    this.router.patch(
      "/movies/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(Movie),
      UploadMiddleware.singleImage("file"),
      RouteWrapper.withErrorHandler(this.movieController.updateMovieImage)
    );

    this.router.delete(
      "/movies/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(Movie),
      RouteWrapper.withErrorHandler(this.movieController.deleteMovie)
    );

    this.logger.info("✅ Movie authenticated routes configured successfully");
  }

  private setupPublicRoutes(): void {
    this.publicRouter.get(
      "/movies",
      RouteWrapper.withErrorHandler(this.publicController.getAllMoviesPublic)
    );

    this.publicRouter.get(
      "/movies/:id",
      RouteWrapper.withErrorHandler(this.publicController.getMovieByIdPublic)
    );

    this.publicRouter.get(
      "/genres",
      RouteWrapper.withErrorHandler(this.publicController.getAllGenresPublic)
    );

    this.logger.info("✅ Movie public routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPublicRouter(): Router {
    return this.publicRouter;
  }
}
