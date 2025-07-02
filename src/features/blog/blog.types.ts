import { z } from "zod";

// Validation schemas
export const createBlogCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .trim(),
});

export const updateBlogCategorySchema = createBlogCategorySchema;

export const createBlogPostSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(500, "Title cannot exceed 500 characters")
    .trim(),
  content: z.string().min(10, "Content must be at least 10 characters").trim(),
  imgUrl: z.string().url("Invalid image URL").optional(),
  categoryId: z
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be positive"),
});

export const updateBlogPostSchema = createBlogPostSchema;

export const blogQuerySchema = z.object({
  q: z.string().optional().describe("Search query for title"),
  i: z.string().optional().describe("Search query for category name"),
  limit: z.coerce
    .number()
    .int()
    .min(4, "Limit must be at least 4")
    .max(12, "Limit cannot exceed 12")
    .default(10),
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  sort: z.enum(["ASC", "DESC"]).default("DESC"),
});

// DTOs
export interface CreateBlogCategoryDto {
  name: string;
}

export interface UpdateBlogCategoryDto {
  name: string;
}

export interface CreateBlogPostDto {
  title: string;
  content: string;
  imgUrl?: string;
  categoryId: number;
}

export interface UpdateBlogPostDto {
  title: string;
  content: string;
  imgUrl?: string;
  categoryId: number;
}

export interface BlogQueryDto {
  q?: string;
  i?: string;
  limit: number;
  page: number;
  sort: "ASC" | "DESC";
}

// Response types
export interface BlogCategoryResponse {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  posts?: BlogPostResponse[];
}

export interface BlogPostResponse {
  id: number;
  title: string;
  content: string;
  imgUrl?: string;
  categoryId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: number;
    name: string;
  };
  author?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface PaginatedBlogPostsResponse {
  data: BlogPostResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedBlogCategoriesResponse {
  data: BlogCategoryResponse[];
}

// Repository interfaces
export interface BlogCategoryRepository {
  findAll(): Promise<BlogCategoryResponse[]>;
  findById(id: number): Promise<BlogCategoryResponse | null>;
  create(data: CreateBlogCategoryDto): Promise<BlogCategoryResponse>;
  update(
    id: number,
    data: UpdateBlogCategoryDto
  ): Promise<BlogCategoryResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface BlogPostRepository {
  findAll(): Promise<BlogPostResponse[]>;
  findAllPublic(
    query: BlogQueryDto
  ): Promise<{ posts: BlogPostResponse[]; total: number }>;
  findById(id: number): Promise<BlogPostResponse | null>;
  findByIdPublic(id: number): Promise<BlogPostResponse | null>;
  create(data: CreateBlogPostDto, authorId: number): Promise<BlogPostResponse>;
  update(id: number, data: UpdateBlogPostDto): Promise<BlogPostResponse | null>;
  updateImage(id: number, imgUrl: string): Promise<BlogPostResponse | null>;
  delete(id: number): Promise<boolean>;
}

// Service interfaces
export interface BlogCategoryService {
  getAllCategories(): Promise<BlogCategoryResponse[]>;
  getCategoryById(id: number): Promise<BlogCategoryResponse>;
  createCategory(data: CreateBlogCategoryDto): Promise<BlogCategoryResponse>;
  updateCategory(
    id: number,
    data: UpdateBlogCategoryDto
  ): Promise<BlogCategoryResponse>;
  deleteCategory(id: number): Promise<void>;
}

export interface BlogPostService {
  getAllPosts(): Promise<BlogPostResponse[]>;
  getAllPostsPublic(query: BlogQueryDto): Promise<PaginatedBlogPostsResponse>;
  getPostById(id: number): Promise<BlogPostResponse>;
  getPostByIdPublic(id: number): Promise<BlogPostResponse>;
  createPost(
    data: CreateBlogPostDto,
    authorId: number
  ): Promise<BlogPostResponse>;
  updatePost(id: number, data: UpdateBlogPostDto): Promise<BlogPostResponse>;
  updatePostImage(id: number, imgUrl: string): Promise<BlogPostResponse>;
  deletePost(id: number): Promise<void>;
}
