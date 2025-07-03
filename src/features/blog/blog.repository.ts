import { Op } from "sequelize";
import { BlogCategory, BlogPost } from "./blog.model";
import { User } from "@/features/users/user.model";
import { NotFoundError } from "@/shared/errors";
import {
  BlogCategoryResponse,
  BlogPostResponse,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogQueryDto,
  IBlogCategoryRepository,
  IBlogPostRepository,
} from "./blog.types";

export class BlogCategoryRepository implements IBlogCategoryRepository {
  public async findAll(): Promise<BlogCategoryResponse[]> {
    const categories = await BlogCategory.findAll({
      order: [["createdAt", "DESC"]],
    });

    return categories.map((category) => this.mapCategoryToResponse(category));
  }

  public async findById(id: number): Promise<BlogCategoryResponse | null> {
    const category = await BlogCategory.findByPk(id, {
      include: [
        {
          model: BlogPost,
          as: "posts",
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

    return this.mapCategoryToResponseWithPosts(category);
  }

  public async create(
    data: CreateBlogCategoryDto
  ): Promise<BlogCategoryResponse> {
    const category = await BlogCategory.create(data as any);
    return this.mapCategoryToResponse(category);
  }

  public async update(
    id: number,
    data: UpdateBlogCategoryDto
  ): Promise<BlogCategoryResponse | null> {
    const [updatedCount] = await BlogCategory.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    const updatedCategory = await BlogCategory.findByPk(id);
    return updatedCategory ? this.mapCategoryToResponse(updatedCategory) : null;
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await BlogCategory.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapCategoryToResponse(category: BlogCategory): BlogCategoryResponse {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private mapCategoryToResponseWithPosts(
    category: BlogCategory
  ): BlogCategoryResponse {
    const response = this.mapCategoryToResponse(category);

    if (category.posts) {
      response.posts = category.posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        imgUrl: post.imgUrl,
        categoryId: post.categoryId,
        authorId: post.authorId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author
          ? {
              id: post.author.id,
              username: post.author.username,
              email: post.author.email,
            }
          : null,
        category: post.category
          ? {
              id: post.category.id,
              name: post.category.name,
            }
          : null,
      }));
    }

    return response;
  }
}

export class BlogPostRepository implements IBlogPostRepository {
  public async findAll(): Promise<BlogPostResponse[]> {
    const posts = await BlogPost.findAll({
      include: [
        {
          model: BlogCategory,
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

    return posts.map((post) => this.mapPostToResponse(post));
  }

  public async findAllPublic(
    query: BlogQueryDto
  ): Promise<{ posts: BlogPostResponse[]; total: number }> {
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
          model: BlogCategory,
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

    const { count, rows } = await BlogPost.findAndCountAll(findOptions);

    return {
      posts: rows.map((post) => this.mapPostToResponse(post)),
      total: count,
    };
  }

  public async findById(id: number): Promise<BlogPostResponse | null> {
    const post = await BlogPost.findByPk(id, {
      include: [
        {
          model: BlogCategory,
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

    return post ? this.mapPostToResponse(post) : null;
  }

  public async findByIdPublic(id: number): Promise<BlogPostResponse | null> {
    return this.findById(id);
  }

  public async create(
    data: CreateBlogPostDto,
    authorId: number
  ): Promise<BlogPostResponse> {
    const post = await BlogPost.create({
      ...data,
      authorId,
    });

    const createdPost = await this.findById(post.id);
    if (!createdPost) {
      throw new NotFoundError("Created post not found");
    }

    return createdPost;
  }

  public async update(
    id: number,
    data: UpdateBlogPostDto
  ): Promise<BlogPostResponse | null> {
    const [updatedCount] = await BlogPost.update(data, {
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
  ): Promise<BlogPostResponse | null> {
    const [updatedCount] = await BlogPost.update({ imgUrl }, { where: { id } });

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await BlogPost.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapPostToResponse(post: BlogPost): BlogPostResponse {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      imgUrl: post.imgUrl,
      categoryId: post.categoryId,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      category: post.category
        ? {
            id: post.category.id,
            name: post.category.name,
          }
        : null,
      author: post.author
        ? {
            id: post.author.id,
            username: post.author.username,
            email: post.author.email,
          }
        : null,
    };
  }
}
