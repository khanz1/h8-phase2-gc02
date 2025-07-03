import { z } from "zod";

export const createRestaurantCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .trim(),
});

export const updateRestaurantCategorySchema = createRestaurantCategorySchema;

export const createRestaurantCuisineSchema = z.object({
  name: z
    .string()
    .min(2, "Cuisine name must be at least 2 characters")
    .max(255, "Cuisine name cannot exceed 255 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .trim(),
  price: z
    .number()
    .int("Price must be an integer")
    .min(1, "Price must be greater than 0"),
  imgUrl: z.string().url("Invalid image URL").optional(),
  categoryId: z
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be positive"),
});

export const updateRestaurantCuisineSchema = createRestaurantCuisineSchema;

export const cuisineQuerySchema = z.object({
  q: z.string().optional().describe("Search query for cuisine name"),
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

export interface CreateRestaurantCategoryDto {
  name: string;
}

export interface UpdateRestaurantCategoryDto {
  name: string;
}

export interface CreateRestaurantCuisineDto {
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  categoryId: number;
}

export interface UpdateRestaurantCuisineDto {
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  categoryId: number;
}

export interface CuisineQueryDto {
  q?: string;
  i?: string;
  limit: number;
  page: number;
  sort: "ASC" | "DESC";
}

export interface RestaurantCategoryResponse {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  cuisines?: RestaurantCuisineResponse[];
}

export interface RestaurantCuisineResponse {
  id: number;
  name: string;
  description: string;
  price: number;
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

export interface PaginatedRestaurantCuisinesResponse {
  data: RestaurantCuisineResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedRestaurantCategoriesResponse {
  data: RestaurantCategoryResponse[];
}

export interface IRestaurantCategoryRepository {
  findAll(): Promise<RestaurantCategoryResponse[]>;
  findById(id: number): Promise<RestaurantCategoryResponse | null>;
  create(
    data: CreateRestaurantCategoryDto
  ): Promise<RestaurantCategoryResponse>;
  update(
    id: number,
    data: UpdateRestaurantCategoryDto
  ): Promise<RestaurantCategoryResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface IRestaurantCuisineRepository {
  findAll(): Promise<RestaurantCuisineResponse[]>;
  findAllPublic(query: CuisineQueryDto): Promise<{
    cuisines: RestaurantCuisineResponse[];
    total: number;
  }>;
  findById(id: number): Promise<RestaurantCuisineResponse | null>;
  findByIdPublic(id: number): Promise<RestaurantCuisineResponse | null>;
  create(
    data: CreateRestaurantCuisineDto,
    authorId: number
  ): Promise<RestaurantCuisineResponse>;
  update(
    id: number,
    data: UpdateRestaurantCuisineDto
  ): Promise<RestaurantCuisineResponse | null>;
  updateImage(
    id: number,
    imgUrl: string
  ): Promise<RestaurantCuisineResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface IRestaurantCategoryService {
  getAllCategories(): Promise<RestaurantCategoryResponse[]>;
  getCategoryById(id: number): Promise<RestaurantCategoryResponse>;
  createCategory(
    data: CreateRestaurantCategoryDto
  ): Promise<RestaurantCategoryResponse>;
  updateCategory(
    id: number,
    data: UpdateRestaurantCategoryDto
  ): Promise<RestaurantCategoryResponse>;
  deleteCategory(id: number): Promise<void>;
}

export interface IRestaurantCuisineService {
  getAllCuisines(): Promise<RestaurantCuisineResponse[]>;
  getAllCuisinesPublic(
    query: CuisineQueryDto
  ): Promise<PaginatedRestaurantCuisinesResponse>;
  getCuisineById(id: number): Promise<RestaurantCuisineResponse>;
  getCuisineByIdPublic(id: number): Promise<RestaurantCuisineResponse>;
  createCuisine(
    data: CreateRestaurantCuisineDto,
    authorId: number
  ): Promise<RestaurantCuisineResponse>;
  updateCuisine(
    id: number,
    data: UpdateRestaurantCuisineDto
  ): Promise<RestaurantCuisineResponse>;
  updateCuisineImage(
    id: number,
    imgUrl: string
  ): Promise<RestaurantCuisineResponse>;
  deleteCuisine(id: number): Promise<void>;
}
