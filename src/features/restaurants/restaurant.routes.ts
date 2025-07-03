import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import {
  RestaurantCategoryController,
  RestaurantCuisineController,
  RestaurantPublicController,
} from "./restaurant.controller";
import {
  RestaurantCategoryRepository,
  RestaurantCuisineRepository,
} from "./restaurant.repository";
import {
  RestaurantCategoryService,
  RestaurantCuisineService,
} from "./restaurant.service";
import { Logger } from "@/config/logger";
import { RestaurantCuisine } from "./restaurant.model";
import { RouteWrapper } from "@/shared/utils/route-wrapper";

export class RestaurantRoutes {
  private readonly router: Router;
  private readonly publicRouter: Router;
  private readonly categoryController: RestaurantCategoryController;
  private readonly cuisineController: RestaurantCuisineController;
  private readonly publicController: RestaurantPublicController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();
    this.publicRouter = Router();

    const categoryRepository = new RestaurantCategoryRepository();
    const cuisineRepository = new RestaurantCuisineRepository();

    const categoryService = new RestaurantCategoryService(categoryRepository);
    const cuisineService = new RestaurantCuisineService(
      cuisineRepository,
      categoryRepository
    );

    this.categoryController = new RestaurantCategoryController(categoryService);
    this.cuisineController = new RestaurantCuisineController(cuisineService);
    this.publicController = new RestaurantPublicController(
      cuisineService,
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
      "/cuisines",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.cuisineController.getAllCuisines)
    );

    this.router.get(
      "/cuisines/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.cuisineController.getCuisineById)
    );

    this.router.post(
      "/cuisines",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      RouteWrapper.withErrorHandler(this.cuisineController.createCuisine)
    );

    this.router.put(
      "/cuisines/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(RestaurantCuisine),
      RouteWrapper.withErrorHandler(this.cuisineController.updateCuisine)
    );

    this.router.patch(
      "/cuisines/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(RestaurantCuisine),
      UploadMiddleware.singleImage("file"),
      RouteWrapper.withErrorHandler(this.cuisineController.updateCuisineImage)
    );

    this.router.delete(
      "/cuisines/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(RestaurantCuisine),
      RouteWrapper.withErrorHandler(this.cuisineController.deleteCuisine)
    );

    this.logger.info(
      "✅ Restaurant authenticated routes configured successfully"
    );
  }

  private setupPublicRoutes(): void {
    this.publicRouter.get(
      "/cuisines",
      RouteWrapper.withErrorHandler(this.publicController.getAllCuisinesPublic)
    );

    this.publicRouter.get(
      "/cuisines/:id",
      RouteWrapper.withErrorHandler(this.publicController.getCuisineByIdPublic)
    );

    this.publicRouter.get(
      "/categories",
      RouteWrapper.withErrorHandler(
        this.publicController.getAllCategoriesPublic
      )
    );

    this.logger.info("✅ Restaurant public routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPublicRouter(): Router {
    return this.publicRouter;
  }
}
