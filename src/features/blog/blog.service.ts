import { NotFoundError, ConflictError } from "@/shared/errors";
import {
  BlogCategoryRepositoryImpl,
  BlogPostRepositoryImpl,
} from "./blog.repository";
import {
  BlogCategoryResponse,
  BlogPostResponse,
  PaginatedBlogPostsResponse,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogQueryDto,
  BlogCategoryService as IBlogCategoryService,
  BlogPostService as IBlogPostService,
} from "./blog.types";

export class BlogCategoryServiceImpl implements IBlogCategoryService {
  constructor(
    private readonly categoryRepository: BlogCategoryRepositoryImpl
  ) {}

  public async getAllCategories(): Promise<BlogCategoryResponse[]> {
    try {
      return await this.categoryRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  public async getCategoryById(id: number): Promise<BlogCategoryResponse> {
    try {
      const category = await this.categoryRepository.findById(id);

      if (!category) {
        throw new NotFoundError(`Blog category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      throw error;
    }
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

export class BlogPostServiceImpl implements IBlogPostService {
  constructor(
    private readonly postRepository: BlogPostRepositoryImpl,
    private readonly categoryRepository: BlogCategoryRepositoryImpl
  ) {}

  public async getAllPosts(): Promise<BlogPostResponse[]> {
    try {
      return await this.postRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  public async getAllPostsPublic(
    query: BlogQueryDto
  ): Promise<PaginatedBlogPostsResponse> {
    try {
      const { posts, total } = await this.postRepository.findAllPublic(query);
      const totalPages = Math.ceil(total / query.limit);

      return {
        data: posts,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async getPostById(id: number): Promise<BlogPostResponse> {
    try {
      const post = await this.postRepository.findById(id);

      if (!post) {
        throw new NotFoundError(`Blog post with ID ${id} not found`);
      }

      return post;
    } catch (error) {
      throw error;
    }
  }

  public async getPostByIdPublic(id: number): Promise<BlogPostResponse> {
    try {
      const post = await this.postRepository.findByIdPublic(id);

      if (!post) {
        throw new NotFoundError(`Blog post with ID ${id} not found`);
      }

      return post;
    } catch (error) {
      throw error;
    }
  }

  public async createPost(
    data: CreateBlogPostDto,
    authorId: number
  ): Promise<BlogPostResponse> {
    try {
      // Verify category exists
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new NotFoundError(
          `Blog category with ID ${data.categoryId} not found`
        );
      }

      return await this.postRepository.create(data, authorId);
    } catch (error) {
      throw error;
    }
  }

  public async updatePost(
    id: number,
    data: UpdateBlogPostDto
  ): Promise<BlogPostResponse> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  public async updatePostImage(
    id: number,
    imgUrl: string
  ): Promise<BlogPostResponse> {
    try {
      const updatedPost = await this.postRepository.updateImage(id, imgUrl);

      if (!updatedPost) {
        throw new NotFoundError(`Blog post with ID ${id} not found`);
      }

      return updatedPost;
    } catch (error) {
      throw error;
    }
  }

  public async deletePost(id: number): Promise<void> {
    try {
      const deleted = await this.postRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError(`Blog post with ID ${id} not found`);
      }
    } catch (error) {
      throw error;
    }
  }
}
