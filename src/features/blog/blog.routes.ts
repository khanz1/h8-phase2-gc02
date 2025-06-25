import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import {
  BlogCategoryController,
  BlogPostController,
  BlogPublicController,
} from "./blog.controller";
import {
  BlogCategoryRepositoryImpl,
  BlogPostRepositoryImpl,
} from "./blog.repository";
import { BlogCategoryServiceImpl, BlogPostServiceImpl } from "./blog.service";
import { Logger } from "@/config/logger";
import { BlogCategory, BlogPost } from "@/database/models";

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

    // Initialize dependencies
    const categoryRepository = new BlogCategoryRepositoryImpl();
    const postRepository = new BlogPostRepositoryImpl();

    const categoryService = new BlogCategoryServiceImpl(categoryRepository);
    const postService = new BlogPostServiceImpl(
      postRepository,
      categoryRepository
    );

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
    // Blog Categories Routes (Authenticated)
    this.router.get(
      "/categories",
      AuthMiddleware.authenticate,
      this.categoryController.getAllCategories
    );

    this.router.get(
      "/categories/:id",
      AuthMiddleware.authenticate,
      this.categoryController.getCategoryById
    );

    this.router.post(
      "/categories",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      this.categoryController.createCategory
    );

    this.router.put(
      "/categories/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      this.categoryController.updateCategory
    );

    this.router.delete(
      "/categories/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      this.categoryController.deleteCategory
    );

    // Blog Posts Routes (Authenticated)
    this.router.get(
      "/posts",
      AuthMiddleware.authenticate,
      this.postController.getAllPosts
    );

    this.router.get(
      "/posts/:id",
      AuthMiddleware.authenticate,
      this.postController.getPostById
    );

    this.router.post(
      "/posts",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      this.postController.createPost
    );

    this.router.put(
      "/posts/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(BlogPost),
      this.postController.updatePost
    );

    this.router.patch(
      "/posts/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(BlogPost),
      UploadMiddleware.singleImage("file"),
      this.postController.updatePostImage
    );

    this.router.delete(
      "/posts/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(BlogPost),
      this.postController.deletePost
    );

    this.logger.info("✅ Blog authenticated routes configured successfully");
  }

  private setupPublicRoutes(): void {
    // Public Blog Routes
    this.publicRouter.get("/posts", this.publicController.getAllPostsPublic);

    this.publicRouter.get(
      "/posts/:id",
      this.publicController.getPostByIdPublic
    );

    this.publicRouter.get(
      "/categories",
      this.publicController.getAllCategoriesPublic
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
