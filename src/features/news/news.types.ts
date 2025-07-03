import { z } from "zod";

export const createNewsCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .trim(),
});

export const updateNewsCategorySchema = createNewsCategorySchema;

export const createNewsArticleSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(500, "Title cannot exceed 500 characters")
    .trim(),
  content: z.string().min(50, "Content must be at least 50 characters").trim(),
  imgUrl: z.string().url("Invalid image URL").optional(),
  categoryId: z
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be positive"),
});

export const updateNewsArticleSchema = createNewsArticleSchema;

export const newsQuerySchema = z.object({
  q: z.string().optional().describe("Search query for article title"),
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

export interface CreateNewsCategoryDto {
  name: string;
}

export interface UpdateNewsCategoryDto {
  name: string;
}

export interface CreateNewsArticleDto {
  title: string;
  content: string;
  imgUrl?: string;
  categoryId: number;
}

export interface UpdateNewsArticleDto {
  title: string;
  content: string;
  imgUrl?: string;
  categoryId: number;
}

export interface NewsQueryDto {
  q?: string;
  i?: string;
  limit: number;
  page: number;
  sort: "ASC" | "DESC";
}

export interface NewsCategoryResponse {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  articles?: NewsArticleResponse[];
}

export interface NewsArticleResponse {
  id: number;
  title: string;
  content: string;
  imgUrl?: string;
  categoryId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
  } | null;
  author: {
    id: number;
    username: string;
    email: string;
  } | null;
}

export interface PaginatedNewsArticlesResponse {
  data: NewsArticleResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedNewsCategoriesResponse {
  data: NewsCategoryResponse[];
}

export interface INewsCategoryRepository {
  findAll(): Promise<NewsCategoryResponse[]>;
  findById(id: number): Promise<NewsCategoryResponse | null>;
  create(data: CreateNewsCategoryDto): Promise<NewsCategoryResponse>;
  update(
    id: number,
    data: UpdateNewsCategoryDto
  ): Promise<NewsCategoryResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface INewsArticleRepository {
  findAll(): Promise<NewsArticleResponse[]>;
  findAllPublic(
    query: NewsQueryDto
  ): Promise<{ articles: NewsArticleResponse[]; total: number }>;
  findById(id: number): Promise<NewsArticleResponse | null>;
  findByIdPublic(id: number): Promise<NewsArticleResponse | null>;
  create(
    data: CreateNewsArticleDto,
    authorId: number
  ): Promise<NewsArticleResponse>;
  update(
    id: number,
    data: UpdateNewsArticleDto
  ): Promise<NewsArticleResponse | null>;
  updateImage(id: number, imgUrl: string): Promise<NewsArticleResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface INewsCategoryService {
  getAllCategories(): Promise<NewsCategoryResponse[]>;
  getCategoryById(id: number): Promise<NewsCategoryResponse>;
  createCategory(data: CreateNewsCategoryDto): Promise<NewsCategoryResponse>;
  updateCategory(
    id: number,
    data: UpdateNewsCategoryDto
  ): Promise<NewsCategoryResponse>;
  deleteCategory(id: number): Promise<void>;
}

export interface INewsArticleService {
  getAllArticles(): Promise<NewsArticleResponse[]>;
  getAllArticlesPublic(
    query: NewsQueryDto
  ): Promise<PaginatedNewsArticlesResponse>;
  getArticleById(id: number): Promise<NewsArticleResponse>;
  getArticleByIdPublic(id: number): Promise<NewsArticleResponse>;
  createArticle(
    data: CreateNewsArticleDto,
    authorId: number
  ): Promise<NewsArticleResponse>;
  updateArticle(
    id: number,
    data: UpdateNewsArticleDto
  ): Promise<NewsArticleResponse>;
  updateArticleImage(id: number, imgUrl: string): Promise<NewsArticleResponse>;
  deleteArticle(id: number): Promise<void>;
}
