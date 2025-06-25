import { NextFunction, Request, Response } from "express";
import { Logger } from "@/config/logger";
import { BlogCategoryServiceImpl, BlogPostServiceImpl } from "./blog.service";
import {
  createBlogCategorySchema,
  updateBlogCategorySchema,
  createBlogPostSchema,
  updateBlogPostSchema,
  blogQuerySchema,
} from "./blog.types";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";

export class BlogCategoryController {
  private readonly logger = Logger.getInstance();

  constructor(private readonly categoryService: BlogCategoryServiceImpl) {}

  public getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info("Fetching all blog categories");

      const categories = await this.categoryService.getAllCategories();

      res.status(200).json({
        success: true,
        message: "Blog categories retrieved successfully",
        data: categories,
      });
    } catch (error) {
      this.logger.error("Error fetching blog categories:", error);
      next(error);
    }
  };

  public getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      this.logger.info(`Fetching blog category with ID: ${id}`);

      const category = await this.categoryService.getCategoryById(id);

      res.status(200).json({
        success: true,
        message: "Blog category retrieved successfully",
        data: category,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching blog category ${req.params.id}:`,
        error
      );
      next(error);
    }
  };

  public createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = createBlogCategorySchema.parse(req.body);

      this.logger.info("Creating new blog category:", validatedData);

      const category = await this.categoryService.createCategory(validatedData);

      res.status(201).json({
        success: true,
        message: "Blog category created successfully",
        data: category,
      });
    } catch (error) {
      this.logger.error("Error creating blog category:", error);
      next(error);
    }
  };

  public updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const validatedData = updateBlogCategorySchema.parse(req.body);

      this.logger.info(`Updating blog category ${id}:`, validatedData);

      const category = await this.categoryService.updateCategory(
        id,
        validatedData
      );

      res.status(200).json({
        success: true,
        message: "Blog category updated successfully",
        data: category,
      });
    } catch (error) {
      this.logger.error(
        `Error updating blog category ${req.params.id}:`,
        error
      );
      next(error);
    }
  };

  public deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      this.logger.info(`Deleting blog category with ID: ${id}`);

      await this.categoryService.deleteCategory(id);

      res.status(200).json({
        success: true,
        message: "Blog category deleted successfully",
      });
    } catch (error) {
      this.logger.error(
        `Error deleting blog category ${req.params.id}:`,
        error
      );
      next(error);
    }
  };
}

export class BlogPostController {
  private readonly logger = Logger.getInstance();

  constructor(private readonly postService: BlogPostServiceImpl) {}

  public getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info("Fetching all blog posts");

      const posts = await this.postService.getAllPosts();

      res.status(200).json({
        success: true,
        message: "Blog posts retrieved successfully",
        data: posts,
      });
    } catch (error) {
      this.logger.error("Error fetching blog posts:", error);
      next(error);
    }
  };

  public getAllPostsPublic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedQuery = blogQuerySchema.parse(req.query);

      this.logger.info(
        "Fetching public blog posts with query:",
        validatedQuery
      );

      const result = await this.postService.getAllPostsPublic(validatedQuery);

      res.status(200).json({
        success: true,
        message: "Blog posts retrieved successfully",
        ...result,
      });
    } catch (error) {
      this.logger.error("Error fetching public blog posts:", error);
      next(error);
    }
  };

  public getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      this.logger.info(`Fetching blog post with ID: ${id}`);

      const post = await this.postService.getPostById(id);

      res.status(200).json({
        success: true,
        message: "Blog post retrieved successfully",
        data: post,
      });
    } catch (error) {
      this.logger.error(`Error fetching blog post ${req.params.id}:`, error);
      next(error);
    }
  };

  public getPostByIdPublic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      this.logger.info(`Fetching public blog post with ID: ${id}`);

      const post = await this.postService.getPostByIdPublic(id);

      res.status(200).json({
        success: true,
        message: "Blog post retrieved successfully",
        data: post,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching public blog post ${req.params.id}:`,
        error
      );
      next(error);
    }
  };

  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.body, "<<reqbody");
      const validatedData = createBlogPostSchema.parse(req.body);
      const authorId = req.user!.userId;

      this.logger.info(
        `Creating new blog post by user ${authorId}:`,
        validatedData
      );

      const post = await this.postService.createPost(validatedData, authorId);

      res.status(201).json({
        success: true,
        message: "Blog post created successfully",
        data: post,
      });
    } catch (error) {
      this.logger.error("Error creating blog post:", error);
      next(error);
    }
  };

  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const validatedData = updateBlogPostSchema.parse(req.body);

      this.logger.info(`Updating blog post ${id}:`, validatedData);

      const post = await this.postService.updatePost(id, validatedData);

      res.status(200).json({
        success: true,
        message: "Blog post updated successfully",
        data: post,
      });
    } catch (error) {
      this.logger.error(`Error updating blog post ${req.params.id}:`, error);
      next(error);
    }
  };

  public updatePostImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      // Check if file was uploaded
      if (!req.file) {
        throw new BadRequestError("No image file provided");
      }

      this.logger.info(`Uploading image for blog post ${id}`, {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      // Upload image to Cloudinary
      const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
        folder: "blog-posts",
        transformation: {
          width: 1200,
          height: 800,
          crop: "limit",
          quality: "auto",
        },
      });

      this.logger.info(`Image uploaded successfully for blog post ${id}`, {
        publicId: uploadResult.publicId,
        url: uploadResult.secureUrl,
      });

      // Update blog post with new image URL
      const post = await this.postService.updatePostImage(
        id,
        uploadResult.secureUrl
      );

      res.status(200).json({
        success: true,
        message: "Blog post image updated successfully",
        data: {
          ...post,
          uploadInfo: {
            publicId: uploadResult.publicId,
            url: uploadResult.secureUrl,
            format: uploadResult.format,
            width: uploadResult.width,
            height: uploadResult.height,
            bytes: uploadResult.bytes,
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Error updating blog post ${req.params.id} image:`,
        error
      );
      next(error);
    }
  };

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      this.logger.info(`Deleting blog post with ID: ${id}`);

      await this.postService.deletePost(id);

      res.status(200).json({
        success: true,
        message: "Blog post deleted successfully",
      });
    } catch (error) {
      this.logger.error(`Error deleting blog post ${req.params.id}:`, error);
      next(error);
    }
  };
}

export class BlogPublicController {
  private readonly logger = Logger.getInstance();

  constructor(
    private readonly postService: BlogPostServiceImpl,
    private readonly categoryService: BlogCategoryServiceImpl
  ) {}

  public getAllPostsPublic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedQuery = blogQuerySchema.parse(req.query);

      this.logger.info(
        "Fetching public blog posts with query:",
        validatedQuery
      );

      const result = await this.postService.getAllPostsPublic(validatedQuery);

      res.status(200).json({
        success: true,
        message: "Blog posts retrieved successfully",
        ...result,
      });
    } catch (error) {
      this.logger.error("Error fetching public blog posts:", error);
      next(error);
    }
  };

  public getPostByIdPublic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      this.logger.info(`Fetching public blog post with ID: ${id}`);

      const post = await this.postService.getPostByIdPublic(id);

      res.status(200).json({
        success: true,
        message: "Blog post retrieved successfully",
        data: post,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching public blog post ${req.params.id}:`,
        error
      );
      next(error);
    }
  };

  public getAllCategoriesPublic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info("Fetching all public blog categories");

      const categories = await this.categoryService.getAllCategories();

      res.status(200).json({
        success: true,
        message: "Blog categories retrieved successfully",
        data: categories,
      });
    } catch (error) {
      this.logger.error("Error fetching public blog categories:", error);
      next(error);
    }
  };
}
