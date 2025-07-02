import { NotFoundError, ConflictError } from "@/shared/errors";
import { BlogCategoryRepository, BlogPostRepository } from "./blog.repository";
import {
  BlogCategoryResponse,
  BlogPostResponse,
  PaginatedBlogPostsResponse,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogQueryDto,
  IBlogCategoryService,
  IBlogPostService,
} from "./blog.types";

export class BlogCategoryService implements IBlogCategoryService {
  constructor(private readonly categoryRepository: BlogCategoryRepository) {}

  public async getAllCategories(): Promise<BlogCategoryResponse[]> {
    return await this.categoryRepository.findAll();
  }

  public async getCategoryById(id: number): Promise<BlogCategoryResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError(`Blog category with ID ${id} not found`);
    }

    return category;
  }

  public async createCategory(
    data: CreateBlogCategoryDto
  ): Promise<BlogCategoryResponse> {
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
    data: UpdateBlogCategoryDto
  ): Promise<BlogCategoryResponse> {
    try {
      const updatedCategory = await this.categoryRepository.update(id, data);

      if (!updatedCategory) {
        throw new NotFoundError(`Blog category with ID ${id} not found`);
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
        throw new NotFoundError(`Blog category with ID ${id} not found`);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        throw new ConflictError(
          "Cannot delete category that has associated blog posts"
        );
      }
      throw error;
    }
  }
}

export class BlogPostService implements IBlogPostService {
  constructor(
    private readonly postRepository: BlogPostRepository,
    private readonly categoryRepository: BlogCategoryRepository
  ) {}

  public async getAllPosts(): Promise<BlogPostResponse[]> {
    return await this.postRepository.findAll();
  }

  public async getAllPostsPublic(
    query: BlogQueryDto
  ): Promise<PaginatedBlogPostsResponse> {
    const { posts, total } = await this.postRepository.findAllPublic(query);
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: posts,
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

  public async getPostById(id: number): Promise<BlogPostResponse> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }

    return post;
  }

  public async getPostByIdPublic(id: number): Promise<BlogPostResponse> {
    const post = await this.postRepository.findByIdPublic(id);

    if (!post) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }

    return post;
  }

  public async createPost(
    data: CreateBlogPostDto,
    authorId: number
  ): Promise<BlogPostResponse> {
    // Verify category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new NotFoundError(
        `Blog category with ID ${data.categoryId} not found`
      );
    }

    return await this.postRepository.create(data, authorId);
  }

  public async updatePost(
    id: number,
    data: UpdateBlogPostDto
  ): Promise<BlogPostResponse> {
    // Verify category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new NotFoundError(
        `Blog category with ID ${data.categoryId} not found`
      );
    }

    const updatedPost = await this.postRepository.update(id, data);

    if (!updatedPost) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }

    return updatedPost;
  }

  public async updatePostImage(
    id: number,
    imgUrl: string
  ): Promise<BlogPostResponse> {
    const updatedPost = await this.postRepository.updateImage(id, imgUrl);

    if (!updatedPost) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }

    return updatedPost;
  }

  public async deletePost(id: number): Promise<void> {
    const deleted = await this.postRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }
  }
}
