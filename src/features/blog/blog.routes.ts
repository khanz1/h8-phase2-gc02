import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import {
  BlogCategoryController,
  BlogPostController,
  BlogPublicController,
} from "./blog.controller";
import { BlogCategoryRepository, BlogPostRepository } from "./blog.repository";
import { BlogCategoryService, BlogPostService } from "./blog.service";
import { Logger } from "@/config/logger";
import { BlogPost } from "./blog.model";
import { RouteWrapper } from "@/shared/utils/route-wrapper";

export class BlogRoutes {
  private readonly router: Router;
  private readonly publicRouter: Router;
  private readonly categoryController: BlogCategoryController;
  private readonly postController: BlogPostController;
  private readonly publicController: BlogPublicController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();
    this.publicRouter = Router();

    const categoryRepository = new BlogCategoryRepository();
    const postRepository = new BlogPostRepository();

    const categoryService = new BlogCategoryService(categoryRepository);
    const postService = new BlogPostService(postRepository, categoryRepository);

    this.categoryController = new BlogCategoryController(categoryService);
    this.postController = new BlogPostController(postService);
    this.publicController = new BlogPublicController(
      postService,
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
      "/posts",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.postController.getAllPosts)
    );

    this.router.get(
      "/posts/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.postController.getPostById)
    );

    this.router.post(
      "/posts",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      RouteWrapper.withErrorHandler(this.postController.createPost)
    );

    this.router.put(
      "/posts/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(BlogPost),
      RouteWrapper.withErrorHandler(this.postController.updatePost)
    );

    this.router.patch(
      "/posts/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(BlogPost),
      UploadMiddleware.singleImage("file"),
      RouteWrapper.withErrorHandler(this.postController.updatePostImage)
    );

    this.router.delete(
      "/posts/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(BlogPost),
      RouteWrapper.withErrorHandler(this.postController.deletePost)
    );

    this.logger.info("✅ Blog authenticated routes configured successfully");
  }

  private setupPublicRoutes(): void {
    this.publicRouter.get(
      "/posts",
      RouteWrapper.withErrorHandler(this.publicController.getAllPostsPublic)
    );

    this.publicRouter.get(
      "/posts/:id",
      RouteWrapper.withErrorHandler(this.publicController.getPostByIdPublic)
    );

    this.publicRouter.get(
      "/categories",
      RouteWrapper.withErrorHandler(
        this.publicController.getAllCategoriesPublic
      )
    );

    this.logger.info("✅ Blog public routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPublicRouter(): Router {
    return this.publicRouter;
  }
}
