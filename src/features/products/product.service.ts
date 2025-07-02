import { NotFoundError, ConflictError } from "@/shared/errors";
import {
  BrandedCategoryRepository,
  BrandedProductRepository,
} from "./product.repository";
import {
  BrandedCategoryResponse,
  BrandedProductResponse,
  PaginatedBrandedProductsResponse,
  CreateBrandedCategoryDto,
  UpdateBrandedCategoryDto,
  CreateBrandedProductDto,
  UpdateBrandedProductDto,
  ProductQueryDto,
  IBrandedCategoryService,
  IBrandedProductService,
} from "./product.types";

export class BrandedCategoryService implements IBrandedCategoryService {
  constructor(private readonly categoryRepository: BrandedCategoryRepository) {}

  public async getAllCategories(): Promise<BrandedCategoryResponse[]> {
    return await this.categoryRepository.findAll();
  }

  public async getCategoryById(id: number): Promise<BrandedCategoryResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError(`Product category with ID ${id} not found`);
    }

    return category;
  }

  public async createCategory(
    data: CreateBrandedCategoryDto
  ): Promise<BrandedCategoryResponse> {
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
    data: UpdateBrandedCategoryDto
  ): Promise<BrandedCategoryResponse> {
    try {
      const updatedCategory = await this.categoryRepository.update(id, data);

      if (!updatedCategory) {
        throw new NotFoundError(`Product category with ID ${id} not found`);
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
        throw new NotFoundError(`Product category with ID ${id} not found`);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        throw new ConflictError(
          "Cannot delete category that has associated products"
        );
      }
      throw error;
    }
  }
}

export class BrandedProductService implements IBrandedProductService {
  constructor(
    private readonly productRepository: BrandedProductRepository,
    private readonly categoryRepository: BrandedCategoryRepository
  ) {}

  public async getAllProducts(): Promise<BrandedProductResponse[]> {
    return await this.productRepository.findAll();
  }

  public async getAllProductsPublic(
    query: ProductQueryDto
  ): Promise<PaginatedBrandedProductsResponse> {
    const { products, total } = await this.productRepository.findAllPublic(
      query
    );
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: products,
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

  public async getProductById(id: number): Promise<BrandedProductResponse> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    return product;
  }

  public async getProductByIdPublic(
    id: number
  ): Promise<BrandedProductResponse> {
    const product = await this.productRepository.findByIdPublic(id);

    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    return product;
  }

  public async createProduct(
    data: CreateBrandedProductDto,
    authorId: number
  ): Promise<BrandedProductResponse> {
    // Verify category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new NotFoundError(
        `Product category with ID ${data.categoryId} not found`
      );
    }

    return await this.productRepository.create(data, authorId);
  }

  public async updateProduct(
    id: number,
    data: UpdateBrandedProductDto
  ): Promise<BrandedProductResponse> {
    // Verify category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new NotFoundError(
        `Product category with ID ${data.categoryId} not found`
      );
    }

    const updatedProduct = await this.productRepository.update(id, data);

    if (!updatedProduct) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }

  public async updateProductImage(
    id: number,
    imgUrl: string
  ): Promise<BrandedProductResponse> {
    const updatedProduct = await this.productRepository.updateImage(id, imgUrl);

    if (!updatedProduct) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }

  public async deleteProduct(id: number): Promise<void> {
    const deleted = await this.productRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
  }
}
