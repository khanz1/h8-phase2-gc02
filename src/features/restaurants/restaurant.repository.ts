import { Op } from "sequelize";
import { RestaurantCategory, RestaurantCuisine } from "./restaurant.model";
import { User } from "@/features/users/user.model";
import { NotFoundError } from "@/shared/errors";
import {
  RestaurantCategoryResponse,
  RestaurantCuisineResponse,
  CreateRestaurantCategoryDto,
  UpdateRestaurantCategoryDto,
  CreateRestaurantCuisineDto,
  UpdateRestaurantCuisineDto,
  CuisineQueryDto,
  IRestaurantCategoryRepository,
  IRestaurantCuisineRepository,
} from "./restaurant.types";

export class RestaurantCategoryRepository
  implements IRestaurantCategoryRepository
{
  public async findAll(): Promise<RestaurantCategoryResponse[]> {
    const categories = await RestaurantCategory.findAll({
      order: [["createdAt", "DESC"]],
    });

    return categories.map((category) => this.mapCategoryToResponse(category));
  }

  public async findById(
    id: number
  ): Promise<RestaurantCategoryResponse | null> {
    const category = await RestaurantCategory.findByPk(id, {
      include: [
        {
          model: RestaurantCuisine,
          as: "cuisines",
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

    return this.mapCategoryToResponseWithCuisines(category);
  }

  public async create(
    data: CreateRestaurantCategoryDto
  ): Promise<RestaurantCategoryResponse> {
    const category = await RestaurantCategory.create(data as any);
    return this.mapCategoryToResponse(category);
  }

  public async update(
    id: number,
    data: UpdateRestaurantCategoryDto
  ): Promise<RestaurantCategoryResponse | null> {
    const [updatedCount] = await RestaurantCategory.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    const updatedCategory = await RestaurantCategory.findByPk(id);
    return updatedCategory ? this.mapCategoryToResponse(updatedCategory) : null;
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await RestaurantCategory.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapCategoryToResponse(
    category: RestaurantCategory
  ): RestaurantCategoryResponse {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private mapCategoryToResponseWithCuisines(
    category: RestaurantCategory
  ): RestaurantCategoryResponse {
    const response = this.mapCategoryToResponse(category);

    if (category.cuisines) {
      response.cuisines = category.cuisines.map((cuisine) => ({
        id: cuisine.id,
        name: cuisine.name,
        description: cuisine.description,
        price: cuisine.price,
        imgUrl: cuisine.imgUrl,
        categoryId: cuisine.categoryId,
        authorId: cuisine.authorId,
        createdAt: cuisine.createdAt,
        updatedAt: cuisine.updatedAt,
        category: {
          id: category.id,
          name: category.name,
        },
        author: cuisine.author
          ? {
              id: cuisine.author.id,
              username: cuisine.author.username,
              email: cuisine.author.email,
            }
          : null,
      }));
    }

    return response;
  }
}

export class RestaurantCuisineRepository
  implements IRestaurantCuisineRepository
{
  public async findAll(): Promise<RestaurantCuisineResponse[]> {
    const cuisines = await RestaurantCuisine.findAll({
      include: [
        {
          model: RestaurantCategory,
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

    return cuisines.map((cuisine) => this.mapCuisineToResponse(cuisine));
  }

  public async findAllPublic(
    query: CuisineQueryDto
  ): Promise<{ cuisines: RestaurantCuisineResponse[]; total: number }> {
    const { q, i, limit, page, sort } = query;
    const offset = (page - 1) * limit;

    const whereConditions: any = {};
    const categoryWhereConditions: any = {};

    if (q) {
      whereConditions.name = {
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
          model: RestaurantCategory,
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

    const { count, rows } = await RestaurantCuisine.findAndCountAll(
      findOptions
    );

    return {
      cuisines: rows.map((cuisine) => this.mapCuisineToResponse(cuisine)),
      total: count,
    };
  }

  public async findById(id: number): Promise<RestaurantCuisineResponse | null> {
    const cuisine = await RestaurantCuisine.findByPk(id, {
      include: [
        {
          model: RestaurantCategory,
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

    return cuisine ? this.mapCuisineToResponse(cuisine) : null;
  }

  public async findByIdPublic(
    id: number
  ): Promise<RestaurantCuisineResponse | null> {
    return this.findById(id);
  }

  public async create(
    data: CreateRestaurantCuisineDto,
    authorId: number
  ): Promise<RestaurantCuisineResponse> {
    const cuisine = await RestaurantCuisine.create({
      ...data,
      authorId,
    });

    const createdCuisine = await this.findById(cuisine.id);
    if (!createdCuisine) {
      throw new NotFoundError("Created cuisine not found");
    }

    return createdCuisine;
  }

  public async update(
    id: number,
    data: UpdateRestaurantCuisineDto
  ): Promise<RestaurantCuisineResponse | null> {
    const [updatedCount] = await RestaurantCuisine.update(data, {
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
  ): Promise<RestaurantCuisineResponse | null> {
    const [updatedCount] = await RestaurantCuisine.update(
      { imgUrl },
      { where: { id } }
    );

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await RestaurantCuisine.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapCuisineToResponse(
    cuisine: RestaurantCuisine
  ): RestaurantCuisineResponse {
    return {
      id: cuisine.id,
      name: cuisine.name,
      description: cuisine.description,
      price: cuisine.price,
      imgUrl: cuisine.imgUrl,
      categoryId: cuisine.categoryId,
      authorId: cuisine.authorId,
      createdAt: cuisine.createdAt,
      updatedAt: cuisine.updatedAt,
      category: cuisine.category
        ? {
            id: cuisine.category.id,
            name: cuisine.category.name,
          }
        : null,
      author: cuisine.author
        ? {
            id: cuisine.author.id,
            username: cuisine.author.username,
            email: cuisine.author.email,
          }
        : null,
    };
  }
}
