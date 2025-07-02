import { NotFoundError, ConflictError } from "@/shared/errors";
import {
  NewsCategoryRepository,
  NewsArticleRepository,
} from "./news.repository";
import {
  NewsCategoryResponse,
  NewsArticleResponse,
  PaginatedNewsArticlesResponse,
  CreateNewsCategoryDto,
  UpdateNewsCategoryDto,
  CreateNewsArticleDto,
  UpdateNewsArticleDto,
  NewsQueryDto,
  INewsCategoryService,
  INewsArticleService,
} from "./news.types";

export class NewsCategoryService implements INewsCategoryService {
  constructor(private readonly categoryRepository: NewsCategoryRepository) {}

  public async getAllCategories(): Promise<NewsCategoryResponse[]> {
    return await this.categoryRepository.findAll();
  }

  public async getCategoryById(id: number): Promise<NewsCategoryResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError(`News category with ID ${id} not found`);
    }

    return category;
  }

  public async createCategory(
    data: CreateNewsCategoryDto
  ): Promise<NewsCategoryResponse> {
    try {
      return await this.categoryRepository.create(data);
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ConflictError(
          `Category with name '${data.name}' already exists`
        );
      }
      throw error;
    }
  }

  public async updateCategory(
    id: number,
    data: UpdateNewsCategoryDto
  ): Promise<NewsCategoryResponse> {
    try {
      const updatedCategory = await this.categoryRepository.update(id, data);

      if (!updatedCategory) {
        throw new NotFoundError(`News category with ID ${id} not found`);
      }

      return updatedCategory;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ConflictError(
          `Category with name '${data.name}' already exists`
        );
      }
      throw error;
    }
  }

  public async deleteCategory(id: number): Promise<void> {
    try {
      const deleted = await this.categoryRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError(`News category with ID ${id} not found`);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        throw new ConflictError(
          "Cannot delete category that has associated articles"
        );
      }
      throw error;
    }
  }
}

export class NewsArticleService implements INewsArticleService {
  constructor(
    private readonly articleRepository: NewsArticleRepository,
    private readonly categoryRepository: NewsCategoryRepository
  ) {}

  public async getAllArticles(): Promise<NewsArticleResponse[]> {
    return await this.articleRepository.findAll();
  }

  public async getAllArticlesPublic(
    query: NewsQueryDto
  ): Promise<PaginatedNewsArticlesResponse> {
    const { articles, total } = await this.articleRepository.findAllPublic(
      query
    );
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: articles,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    };
  }

  public async getArticleById(id: number): Promise<NewsArticleResponse> {
    const article = await this.articleRepository.findById(id);

    if (!article) {
      throw new NotFoundError(`News article with ID ${id} not found`);
    }

    return article;
  }

  public async getArticleByIdPublic(id: number): Promise<NewsArticleResponse> {
    const article = await this.articleRepository.findByIdPublic(id);

    if (!article) {
      throw new NotFoundError(`News article with ID ${id} not found`);
    }

    return article;
  }

  public async createArticle(
    data: CreateNewsArticleDto,
    authorId: number
  ): Promise<NewsArticleResponse> {
    // Verify category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new NotFoundError(
        `News category with ID ${data.categoryId} not found`
      );
    }

    return await this.articleRepository.create(data, authorId);
  }

  public async updateArticle(
    id: number,
    data: UpdateNewsArticleDto
  ): Promise<NewsArticleResponse> {
    // Verify category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new NotFoundError(
        `News category with ID ${data.categoryId} not found`
      );
    }

    const updatedArticle = await this.articleRepository.update(id, data);

    if (!updatedArticle) {
      throw new NotFoundError(`News article with ID ${id} not found`);
    }

    return updatedArticle;
  }

  public async updateArticleImage(
    id: number,
    imgUrl: string
  ): Promise<NewsArticleResponse> {
    const updatedArticle = await this.articleRepository.updateImage(id, imgUrl);

    if (!updatedArticle) {
      throw new NotFoundError(`News article with ID ${id} not found`);
    }

    return updatedArticle;
  }

  public async deleteArticle(id: number): Promise<void> {
    const deleted = await this.articleRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`News article with ID ${id} not found`);
    }
  }
}
