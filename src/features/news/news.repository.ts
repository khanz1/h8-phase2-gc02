import { Op } from "sequelize";
import { NewsCategory, NewsArticle } from "./news.model";
import { User } from "@/features/users/user.model";
import { NotFoundError } from "@/shared/errors";
import {
  NewsCategoryResponse,
  NewsArticleResponse,
  CreateNewsCategoryDto,
  UpdateNewsCategoryDto,
  CreateNewsArticleDto,
  UpdateNewsArticleDto,
  NewsQueryDto,
  INewsCategoryRepository,
  INewsArticleRepository,
} from "./news.types";

export class NewsCategoryRepository implements INewsCategoryRepository {
  public async findAll(): Promise<NewsCategoryResponse[]> {
    const categories = await NewsCategory.findAll({
      order: [["createdAt", "DESC"]],
    });

    return categories.map((category) => this.mapCategoryToResponse(category));
  }

  public async findById(id: number): Promise<NewsCategoryResponse | null> {
    const category = await NewsCategory.findByPk(id, {
      include: [
        {
          model: NewsArticle,
          as: "articles",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "username", "email"],
            },
          ],
        },
      ],
    });

    if (!category) {
      return null;
    }

    return this.mapCategoryToResponseWithArticles(category);
  }

  public async create(
    data: CreateNewsCategoryDto
  ): Promise<NewsCategoryResponse> {
    const category = await NewsCategory.create(data as any);
    return this.mapCategoryToResponse(category);
  }

  public async update(
    id: number,
    data: UpdateNewsCategoryDto
  ): Promise<NewsCategoryResponse | null> {
    const [updatedCount] = await NewsCategory.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    const updatedCategory = await NewsCategory.findByPk(id);
    return updatedCategory ? this.mapCategoryToResponse(updatedCategory) : null;
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await NewsCategory.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapCategoryToResponse(category: NewsCategory): NewsCategoryResponse {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private mapCategoryToResponseWithArticles(
    category: NewsCategory
  ): NewsCategoryResponse {
    const response = this.mapCategoryToResponse(category);

    if (category.articles) {
      response.articles = category.articles.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        imgUrl: article.imgUrl,
        categoryId: article.categoryId,
        authorId: article.authorId,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        category: {
          id: category.id,
          name: category.name,
        },
        author: article.author
          ? {
              id: article.author.id,
              username: article.author.username,
              email: article.author.email,
            }
          : null,
      }));
    }

    return response;
  }
}

export class NewsArticleRepository implements INewsArticleRepository {
  public async findAll(): Promise<NewsArticleResponse[]> {
    const articles = await NewsArticle.findAll({
      include: [
        {
          model: NewsCategory,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return articles.map((article) => this.mapArticleToResponse(article));
  }

  public async findAllPublic(
    query: NewsQueryDto
  ): Promise<{ articles: NewsArticleResponse[]; total: number }> {
    const { q, i, limit, page, sort } = query;
    const offset = (page - 1) * limit;

    const whereConditions: any = {};
    const categoryWhereConditions: any = {};

    if (q) {
      whereConditions.title = {
        [Op.iLike]: `%${q}%`,
      };
    }

    if (i) {
      const categoryNames = i.split(",").map((name) => name.trim());
      categoryWhereConditions.name = {
        [Op.iLike]: { [Op.any]: categoryNames.map((name) => `%${name}%`) },
      };
    }

    const findOptions: any = {
      where: whereConditions,
      include: [
        {
          model: NewsCategory,
          as: "category",
          attributes: ["id", "name"],
          where:
            Object.keys(categoryWhereConditions).length > 0
              ? categoryWhereConditions
              : undefined,
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", sort]],
      limit,
      offset,
    };

    const { count, rows } = await NewsArticle.findAndCountAll(findOptions);

    return {
      articles: rows.map((article) => this.mapArticleToResponse(article)),
      total: count,
    };
  }

  public async findById(id: number): Promise<NewsArticleResponse | null> {
    const article = await NewsArticle.findByPk(id, {
      include: [
        {
          model: NewsCategory,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    return article ? this.mapArticleToResponse(article) : null;
  }

  public async findByIdPublic(id: number): Promise<NewsArticleResponse | null> {
    return this.findById(id);
  }

  public async create(
    data: CreateNewsArticleDto,
    authorId: number
  ): Promise<NewsArticleResponse> {
    const article = await NewsArticle.create({
      ...data,
      authorId,
    });

    const createdArticle = await this.findById(article.id);
    if (!createdArticle) {
      throw new NotFoundError("Created article not found");
    }

    return createdArticle;
  }

  public async update(
    id: number,
    data: UpdateNewsArticleDto
  ): Promise<NewsArticleResponse | null> {
    const [updatedCount] = await NewsArticle.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async updateImage(
    id: number,
    imgUrl: string
  ): Promise<NewsArticleResponse | null> {
    const [updatedCount] = await NewsArticle.update(
      { imgUrl },
      { where: { id } }
    );

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await NewsArticle.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapArticleToResponse(article: NewsArticle): NewsArticleResponse {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      imgUrl: article.imgUrl,
      categoryId: article.categoryId,
      authorId: article.authorId,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: article.category
        ? {
            id: article.category.id,
            name: article.category.name,
          }
        : null,
      author: article.author
        ? {
            id: article.author.id,
            username: article.author.username,
            email: article.author.email,
          }
        : null,
    };
  }
}
