import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import {
  BrandedCategoryController,
  BrandedProductController,
  ProductPublicController,
} from "./product.controller";
import {
  BrandedCategoryRepository,
  BrandedProductRepository,
} from "./product.repository";
import {
  BrandedCategoryService,
  BrandedProductService,
} from "./product.service";
import { Logger } from "@/config/logger";
import { BrandedProduct } from "./product.model";
import { RouteWrapper } from "@/shared/utils/route-wrapper";

export class ProductRoutes {
  private readonly router: Router;
  private readonly publicRouter: Router;
  private readonly categoryController: BrandedCategoryController;
  private readonly productController: BrandedProductController;
  private readonly publicController: ProductPublicController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();
    this.publicRouter = Router();

    const categoryRepository = new BrandedCategoryRepository();
    const productRepository = new BrandedProductRepository();

    const categoryService = new BrandedCategoryService(categoryRepository);
    const productService = new BrandedProductService(
      productRepository,
      categoryRepository
    );

    this.categoryController = new BrandedCategoryController(categoryService);
    this.productController = new BrandedProductController(productService);
    this.publicController = new ProductPublicController(
      productService,
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
      "/products",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.productController.getAllProducts)
    );

    this.router.get(
      "/products/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.productController.getProductById)
    );

    this.router.post(
      "/products",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      RouteWrapper.withErrorHandler(this.productController.createProduct)
    );

    this.router.put(
      "/products/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(BrandedProduct),
      RouteWrapper.withErrorHandler(this.productController.updateProduct)
    );

    this.router.patch(
      "/products/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(BrandedProduct),
      UploadMiddleware.singleImage("file"),
      RouteWrapper.withErrorHandler(this.productController.updateProductImage)
    );

    this.router.delete(
      "/products/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(BrandedProduct),
      RouteWrapper.withErrorHandler(this.productController.deleteProduct)
    );

    this.logger.info("✅ Product authenticated routes configured successfully");
  }

  private setupPublicRoutes(): void {
    this.publicRouter.get(
      "/products",
      RouteWrapper.withErrorHandler(this.publicController.getAllProductsPublic)
    );

    this.publicRouter.get(
      "/products/:id",
      RouteWrapper.withErrorHandler(this.publicController.getProductByIdPublic)
    );

    this.publicRouter.get(
      "/categories",
      RouteWrapper.withErrorHandler(
        this.publicController.getAllCategoriesPublic
      )
    );

    this.logger.info("✅ Product public routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPublicRouter(): Router {
    return this.publicRouter;
  }
}
