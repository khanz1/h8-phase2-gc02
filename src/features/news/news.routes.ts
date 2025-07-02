import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import {
  NewsCategoryController,
  NewsArticleController,
  NewsPublicController,
} from "./news.controller";
import {
  NewsCategoryRepository,
  NewsArticleRepository,
} from "./news.repository";
import { NewsCategoryService, NewsArticleService } from "./news.service";
import { Logger } from "@/config/logger";
import { NewsArticle } from "./news.model";
import { RouteWrapper } from "@/shared/utils/route-wrapper";

export class NewsRoutes {
  private readonly router: Router;
  private readonly publicRouter: Router;
  private readonly categoryController: NewsCategoryController;
  private readonly articleController: NewsArticleController;
  private readonly publicController: NewsPublicController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();
    this.publicRouter = Router();

    const categoryRepository = new NewsCategoryRepository();
    const articleRepository = new NewsArticleRepository();

    const categoryService = new NewsCategoryService(categoryRepository);
    const articleService = new NewsArticleService(
      articleRepository,
      categoryRepository
    );

    this.categoryController = new NewsCategoryController(categoryService);
    this.articleController = new NewsArticleController(articleService);
    this.publicController = new NewsPublicController(
      articleService,
      categoryService
    );

    this.setupAuthenticatedRoutes();
    this.setupPublicRoutes();
  }

  private setupAuthenticatedRoutes(): void {
    this.router.get(
      "/categories",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.categoryController.getAllCategories)
    );

    this.router.get(
      "/categories/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.categoryController.getCategoryById)
    );

    this.router.post(
      "/categories",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.categoryController.createCategory)
    );

    this.router.put(
      "/categories/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.categoryController.updateCategory)
    );

    this.router.delete(
      "/categories/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.categoryController.deleteCategory)
    );

    this.router.get(
      "/articles",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.articleController.getAllArticles)
    );

    this.router.get(
      "/articles/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.articleController.getArticleById)
    );

    this.router.post(
      "/articles",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      RouteWrapper.withErrorHandler(this.articleController.createArticle)
    );

    this.router.put(
      "/articles/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(NewsArticle),
      RouteWrapper.withErrorHandler(this.articleController.updateArticle)
    );

    this.router.patch(
      "/articles/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(NewsArticle),
      UploadMiddleware.singleImage("file"),
      RouteWrapper.withErrorHandler(this.articleController.updateArticleImage)
    );

    this.router.delete(
      "/articles/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(NewsArticle),
      RouteWrapper.withErrorHandler(this.articleController.deleteArticle)
    );

    this.logger.info("✅ News authenticated routes configured successfully");
  }

  private setupPublicRoutes(): void {
    this.publicRouter.get(
      "/articles",
      RouteWrapper.withErrorHandler(this.publicController.getAllArticlesPublic)
    );

    this.publicRouter.get(
      "/articles/:id",
      RouteWrapper.withErrorHandler(this.publicController.getArticleByIdPublic)
    );

    this.publicRouter.get(
      "/categories",
      RouteWrapper.withErrorHandler(
        this.publicController.getAllCategoriesPublic
      )
    );

    this.logger.info("✅ News public routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPublicRouter(): Router {
    return this.publicRouter;
  }
}
