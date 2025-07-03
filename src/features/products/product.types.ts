import { z } from "zod";

export const createBrandedCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .trim(),
});

export const updateBrandedCategorySchema = createBrandedCategorySchema;

export const createBrandedProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(255, "Product name cannot exceed 255 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .trim(),
  price: z
    .number()
    .int("Price must be an integer")
    .min(1, "Price must be greater than 0"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .default(0),
  imgUrl: z.string().url("Invalid image URL").optional(),
  categoryId: z
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be positive"),
});

export const updateBrandedProductSchema = createBrandedProductSchema;

export const productQuerySchema = z.object({
  q: z.string().optional().describe("Search query for product name"),
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

export interface CreateBrandedCategoryDto {
  name: string;
}

export interface UpdateBrandedCategoryDto {
  name: string;
}

export interface CreateBrandedProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl?: string;
  categoryId: number;
}

export interface UpdateBrandedProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl?: string;
  categoryId: number;
}

export interface ProductQueryDto {
  q?: string;
  i?: string;
  limit: number;
  page: number;
  sort: "ASC" | "DESC";
}

export interface BrandedCategoryResponse {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  products?: BrandedProductResponse[];
}

export interface BrandedProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
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

export interface PaginatedBrandedProductsResponse {
  data: BrandedProductResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedBrandedCategoriesResponse {
  data: BrandedCategoryResponse[];
}

export interface IBrandedCategoryRepository {
  findAll(): Promise<BrandedCategoryResponse[]>;
  findById(id: number): Promise<BrandedCategoryResponse | null>;
  create(data: CreateBrandedCategoryDto): Promise<BrandedCategoryResponse>;
  update(
    id: number,
    data: UpdateBrandedCategoryDto
  ): Promise<BrandedCategoryResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface IBrandedProductRepository {
  findAll(): Promise<BrandedProductResponse[]>;
  findAllPublic(
    query: ProductQueryDto
  ): Promise<{ products: BrandedProductResponse[]; total: number }>;
  findById(id: number): Promise<BrandedProductResponse | null>;
  findByIdPublic(id: number): Promise<BrandedProductResponse | null>;
  create(
    data: CreateBrandedProductDto,
    authorId: number
  ): Promise<BrandedProductResponse>;
  update(
    id: number,
    data: UpdateBrandedProductDto
  ): Promise<BrandedProductResponse | null>;
  updateImage(
    id: number,
    imgUrl: string
  ): Promise<BrandedProductResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface IBrandedCategoryService {
  getAllCategories(): Promise<BrandedCategoryResponse[]>;
  getCategoryById(id: number): Promise<BrandedCategoryResponse>;
  createCategory(
    data: CreateBrandedCategoryDto
  ): Promise<BrandedCategoryResponse>;
  updateCategory(
    id: number,
    data: UpdateBrandedCategoryDto
  ): Promise<BrandedCategoryResponse>;
  deleteCategory(id: number): Promise<void>;
}

export interface IBrandedProductService {
  getAllProducts(): Promise<BrandedProductResponse[]>;
  getAllProductsPublic(
    query: ProductQueryDto
  ): Promise<PaginatedBrandedProductsResponse>;
  getProductById(id: number): Promise<BrandedProductResponse>;
  getProductByIdPublic(id: number): Promise<BrandedProductResponse>;
  createProduct(
    data: CreateBrandedProductDto,
    authorId: number
  ): Promise<BrandedProductResponse>;
  updateProduct(
    id: number,
    data: UpdateBrandedProductDto
  ): Promise<BrandedProductResponse>;
  updateProductImage(
    id: number,
    imgUrl: string
  ): Promise<BrandedProductResponse>;
  deleteProduct(id: number): Promise<void>;
}
