import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import { NewsCategoryService, NewsArticleService } from "./news.service";
import {
  createNewsCategorySchema,
  updateNewsCategorySchema,
  createNewsArticleSchema,
  updateNewsArticleSchema,
  newsQuerySchema,
} from "./news.types";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";
import { ResponseDTO } from "@/shared/utils/response.dto";

export class NewsCategoryController {
  private readonly logger = new Logger(NewsCategoryController.name);

  constructor(private readonly categoryService: NewsCategoryService) {}

  public getAllCategories = async (_: Request, res: Response) => {
    this.logger.info("Fetching all news categories");

    const categories = await this.categoryService.getAllCategories();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "News categories retrieved successfully",
          categories
        )
      );
  };

  public getCategoryById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching news category with ID: ${id}`);

    const category = await this.categoryService.getCategoryById(id);

    res
      .status(200)
      .json(
        ResponseDTO.success("News category retrieved successfully", category)
      );
  };

  public createCategory = async (req: Request, res: Response) => {
    const validatedData = createNewsCategorySchema.parse(req.body);
    this.logger.info("Creating new news category:", validatedData);

    const category = await this.categoryService.createCategory(validatedData);

    res
      .status(201)
      .json(
        ResponseDTO.success("News category created successfully", category)
      );
  };

  public updateCategory = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateNewsCategorySchema.parse(req.body);
    this.logger.info(`Updating news category ${id}:`, validatedData);

    const category = await this.categoryService.updateCategory(
      id,
      validatedData
    );

    res
      .status(200)
      .json(
        ResponseDTO.success("News category updated successfully", category)
      );
  };

  public deleteCategory = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting news category with ID: ${id}`);

    await this.categoryService.deleteCategory(id);

    res
      .status(200)
      .json(ResponseDTO.success("News category deleted successfully"));
  };
}

export class NewsArticleController {
  private readonly logger = new Logger(NewsArticleController.name);

  constructor(private readonly articleService: NewsArticleService) {}

  public getAllArticles = async (_: Request, res: Response) => {
    this.logger.info("Fetching all news articles");

    const articles = await this.articleService.getAllArticles();
    this.logger.info(`Fetched ${articles.length} news articles`);

    res
      .status(200)
      .json(
        ResponseDTO.success("News articles retrieved successfully", articles)
      );
  };

  public getArticleById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching news article with ID: ${id}`);

    const article = await this.articleService.getArticleById(id);

    res
      .status(200)
      .json(
        ResponseDTO.success("News article retrieved successfully", article)
      );
  };

  public createArticle = async (req: Request, res: Response) => {
    const validatedData = createNewsArticleSchema.parse(req.body);
    const authorId = req.user!.userId;

    this.logger.info(
      `Creating new news article by user ${authorId}:`,
      validatedData
    );

    const article = await this.articleService.createArticle(
      validatedData,
      authorId
    );

    res
      .status(201)
      .json(ResponseDTO.success("News article created successfully", article));
  };

  public updateArticle = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateNewsArticleSchema.parse(req.body);

    this.logger.info(`Updating news article ${id}:`, validatedData);

    const article = await this.articleService.updateArticle(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("News article updated successfully", article));
  };

  public updateArticleImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (!req.file) {
      throw new BadRequestError("No image file provided");
    }

    this.logger.info(`Updating image for news article ${id}`);

    const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
      folder: "news-articles",
      transformation: {
        width: 1200,
        height: 800,
        crop: "limit",
        quality: "auto",
      },
    });

    const article = await this.articleService.updateArticleImage(
      id,
      uploadResult.secureUrl
    );

    res.status(200).json(
      ResponseDTO.success("News article image updated successfully", {
        ...article,
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

  public deleteArticle = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting news article with ID: ${id}`);

    await this.articleService.deleteArticle(id);

    res
      .status(200)
      .json(ResponseDTO.success("News article deleted successfully"));
  };
}

export class NewsPublicController {
  private readonly logger = new Logger(NewsPublicController.name);

  constructor(
    private readonly articleService: NewsArticleService,
    private readonly categoryService: NewsCategoryService
  ) {}

  public getAllArticlesPublic = async (req: Request, res: Response) => {
    const validatedQuery = newsQuerySchema.parse(req.query);
    this.logger.info(
      "Fetching public news articles with query:",
      validatedQuery
    );

    const result = await this.articleService.getAllArticlesPublic(
      validatedQuery
    );

    res
      .status(200)
      .json(
        ResponseDTO.successPaginated(
          "News articles retrieved successfully",
          result.data,
          result.pagination
        )
      );
  };

  public getArticleByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public news article with ID: ${id}`);

    const article = await this.articleService.getArticleByIdPublic(id);

    res
      .status(200)
      .json(
        ResponseDTO.success("News article retrieved successfully", article)
      );
  };

  public getAllCategoriesPublic = async (req: Request, res: Response) => {
    this.logger.info("Fetching all public news categories");
    const categories = await this.categoryService.getAllCategories();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "News categories retrieved successfully",
          categories
        )
      );
  };
}
