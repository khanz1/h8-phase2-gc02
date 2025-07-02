import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import { BlogCategoryService, BlogPostService } from "./blog.service";
import {
  createBlogCategorySchema,
  updateBlogCategorySchema,
  createBlogPostSchema,
  updateBlogPostSchema,
  blogQuerySchema,
} from "./blog.types";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";
import { ResponseDTO } from "@/shared/utils/response.dto";

export class BlogCategoryController {
  private readonly logger = new Logger(BlogCategoryController.name);

  constructor(private readonly categoryService: BlogCategoryService) {}

  public getAllCategories = async (_: Request, res: Response) => {
    this.logger.info("Fetching all blog categories");

    const categories = await this.categoryService.getAllCategories();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Blog categories retrieved successfully",
          categories
        )
      );
  };

  public getCategoryById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching blog category with ID: ${id}`);

    const category = await this.categoryService.getCategoryById(id);

    res
      .status(200)
      .json(
        ResponseDTO.success("Blog category retrieved successfully", category)
      );
  };

  public createCategory = async (req: Request, res: Response) => {
    const validatedData = createBlogCategorySchema.parse(req.body);
    this.logger.info("Creating new blog category:", validatedData);

    const category = await this.categoryService.createCategory(validatedData);

    res
      .status(201)
      .json(
        ResponseDTO.success("Blog category created successfully", category)
      );
  };

  public updateCategory = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateBlogCategorySchema.parse(req.body);
    this.logger.info(`Updating blog category ${id}:`, validatedData);

    const category = await this.categoryService.updateCategory(
      id,
      validatedData
    );

    res
      .status(200)
      .json(
        ResponseDTO.success("Blog category updated successfully", category)
      );
  };

  public deleteCategory = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting blog category with ID: ${id}`);

    await this.categoryService.deleteCategory(id);

    res
      .status(200)
      .json(ResponseDTO.success("Blog category deleted successfully"));
  };
}

export class BlogPostController {
  private readonly logger = new Logger(BlogPostController.name);

  constructor(private readonly postService: BlogPostService) {}

  public getAllPosts = async (_: Request, res: Response) => {
    this.logger.info("Fetching all blog posts");

    const posts = await this.postService.getAllPosts();
    this.logger.info(`Fetched ${posts.length} blog posts`);

    res
      .status(200)
      .json(ResponseDTO.success("Blog posts retrieved successfully", posts));
  };

  public getAllPostsPublic = async (req: Request, res: Response) => {
    const validatedQuery = blogQuerySchema.parse(req.query);
    this.logger.info("Fetching public blog posts with query:", validatedQuery);

    const result = await this.postService.getAllPostsPublic(validatedQuery);

    res
      .status(200)
      .json(
        ResponseDTO.successPaginated(
          "Blog posts retrieved successfully",
          result.data,
          result.pagination
        )
      );
  };

  public getPostById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching blog post with ID: ${id}`);

    const post = await this.postService.getPostById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Blog post retrieved successfully", post));
  };

  public getPostByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public blog post with ID: ${id}`);

    const post = await this.postService.getPostByIdPublic(id);

    res.status(200).json({
      success: true,
      message: "Blog post retrieved successfully",
      data: post,
    });
  };

  public createPost = async (req: Request, res: Response) => {
    const validatedData = createBlogPostSchema.parse(req.body);
    const authorId = req.user!.userId;

    this.logger.info(
      `Creating new blog post by user ${authorId}:`,
      validatedData
    );

    const post = await this.postService.createPost(validatedData, authorId);

    res
      .status(201)
      .json(ResponseDTO.success("Blog post created successfully", post));
  };

  public updatePost = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateBlogPostSchema.parse(req.body);

    this.logger.info(`Updating blog post ${id}:`, validatedData);

    const post = await this.postService.updatePost(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Blog post updated successfully", post));
  };

  public updatePostImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (!req.file) {
      throw new BadRequestError("No image file provided");
    }

    this.logger.info(`Updating image for blog post ${id}`);

    const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
      folder: "blog-posts",
      transformation: {
        width: 1200,
        height: 800,
        crop: "limit",
        quality: "auto",
      },
    });

    const post = await this.postService.updatePostImage(
      id,
      uploadResult.secureUrl
    );

    res.status(200).json(
      ResponseDTO.success("Blog post image updated successfully", {
        ...post,
        uploadInfo: {
          publicId: uploadResult.publicId,
          url: uploadResult.secureUrl,
          format: uploadResult.format,
          width: uploadResult.width,
          height: uploadResult.height,
          bytes: uploadResult.bytes,
        },
      })
    );
  };

  public deletePost = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting blog post with ID: ${id}`);

    await this.postService.deletePost(id);

    res.status(200).json(ResponseDTO.success("Blog post deleted successfully"));
  };
}

export class BlogPublicController {
  private readonly logger = new Logger(BlogPublicController.name);

  constructor(
    private readonly postService: BlogPostService,
    private readonly categoryService: BlogCategoryService
  ) {}

  public getAllPostsPublic = async (req: Request, res: Response) => {
    const validatedQuery = blogQuerySchema.parse(req.query);
    this.logger.info("Fetching public blog posts with query:", validatedQuery);

    const result = await this.postService.getAllPostsPublic(validatedQuery);

    res
      .status(200)
      .json(ResponseDTO.success("Blog posts retrieved successfully", result));
  };

  public getPostByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public blog post with ID: ${id}`);

    const post = await this.postService.getPostByIdPublic(id);

    res
      .status(200)
      .json(ResponseDTO.success("Blog post retrieved successfully", post));
  };

  public getAllCategoriesPublic = async (req: Request, res: Response) => {
    this.logger.info("Fetching all public blog categories");
    const categories = await this.categoryService.getAllCategories();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Blog categories retrieved successfully",
          categories
        )
      );
  };
}
