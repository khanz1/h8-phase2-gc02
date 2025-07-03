import { NotFoundError, ConflictError } from "@/shared/errors";
import {
  RestaurantCategoryRepository,
  RestaurantCuisineRepository,
} from "./restaurant.repository";
import {
  RestaurantCategoryResponse,
  RestaurantCuisineResponse,
  PaginatedRestaurantCuisinesResponse,
  CreateRestaurantCategoryDto,
  UpdateRestaurantCategoryDto,
  CreateRestaurantCuisineDto,
  UpdateRestaurantCuisineDto,
  CuisineQueryDto,
  IRestaurantCategoryService,
  IRestaurantCuisineService,
} from "./restaurant.types";

export class RestaurantCategoryService implements IRestaurantCategoryService {
  constructor(
    private readonly categoryRepository: RestaurantCategoryRepository
  ) {}

  public async getAllCategories(): Promise<RestaurantCategoryResponse[]> {
    return await this.categoryRepository.findAll();
  }

  public async getCategoryById(
    id: number
  ): Promise<RestaurantCategoryResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError(`Restaurant category with ID ${id} not found`);
    }

    return category;
  }

  public async createCategory(
    data: CreateRestaurantCategoryDto
  ): Promise<RestaurantCategoryResponse> {
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
    data: UpdateRestaurantCategoryDto
  ): Promise<RestaurantCategoryResponse> {
    try {
      const updatedCategory = await this.categoryRepository.update(id, data);

      if (!updatedCategory) {
        throw new NotFoundError(`Restaurant category with ID ${id} not found`);
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
        throw new NotFoundError(`Restaurant category with ID ${id} not found`);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        throw new ConflictError(
          "Cannot delete category that has associated cuisines"
        );
      }
      throw error;
    }
  }
}

export class RestaurantCuisineService implements IRestaurantCuisineService {
  constructor(
    private readonly cuisineRepository: RestaurantCuisineRepository,
    private readonly categoryRepository: RestaurantCategoryRepository
  ) {}

  public async getAllCuisines(): Promise<RestaurantCuisineResponse[]> {
    return await this.cuisineRepository.findAll();
  }

  public async getAllCuisinesPublic(
    query: CuisineQueryDto
  ): Promise<PaginatedRestaurantCuisinesResponse> {
    const { cuisines, total } = await this.cuisineRepository.findAllPublic(
      query
    );
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: cuisines,
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

  public async getCuisineById(id: number): Promise<RestaurantCuisineResponse> {
    const cuisine = await this.cuisineRepository.findById(id);

    if (!cuisine) {
      throw new NotFoundError(`Cuisine with ID ${id} not found`);
    }

    return cuisine;
  }

  public async getCuisineByIdPublic(
    id: number
  ): Promise<RestaurantCuisineResponse> {
    const cuisine = await this.cuisineRepository.findByIdPublic(id);

    if (!cuisine) {
      throw new NotFoundError(`Cuisine with ID ${id} not found`);
    }

    return cuisine;
  }

  public async createCuisine(
    data: CreateRestaurantCuisineDto,
    authorId: number
  ): Promise<RestaurantCuisineResponse> {
    // Verify category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new NotFoundError(
        `Restaurant category with ID ${data.categoryId} not found`
      );
    }

    return await this.cuisineRepository.create(data, authorId);
  }

  public async updateCuisine(
    id: number,
    data: UpdateRestaurantCuisineDto
  ): Promise<RestaurantCuisineResponse> {
    // Verify category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new NotFoundError(
        `Restaurant category with ID ${data.categoryId} not found`
      );
    }

    const updatedCuisine = await this.cuisineRepository.update(id, data);

    if (!updatedCuisine) {
      throw new NotFoundError(`Cuisine with ID ${id} not found`);
    }

    return updatedCuisine;
  }

  public async updateCuisineImage(
    id: number,
    imgUrl: string
  ): Promise<RestaurantCuisineResponse> {
    const updatedCuisine = await this.cuisineRepository.updateImage(id, imgUrl);

    if (!updatedCuisine) {
      throw new NotFoundError(`Cuisine with ID ${id} not found`);
    }

    return updatedCuisine;
  }

  public async deleteCuisine(id: number): Promise<void> {
    const deleted = await this.cuisineRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Cuisine with ID ${id} not found`);
    }
  }
}
