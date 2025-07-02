import { Op } from "sequelize";
import { BrandedCategory, BrandedProduct } from "./product.model";
import { User } from "@/features/users/user.model";
import { NotFoundError } from "@/shared/errors";
import {
  BrandedCategoryResponse,
  BrandedProductResponse,
  CreateBrandedCategoryDto,
  UpdateBrandedCategoryDto,
  CreateBrandedProductDto,
  UpdateBrandedProductDto,
  ProductQueryDto,
  IBrandedCategoryRepository,
  IBrandedProductRepository,
} from "./product.types";

export class BrandedCategoryRepository implements IBrandedCategoryRepository {
  public async findAll(): Promise<BrandedCategoryResponse[]> {
    const categories = await BrandedCategory.findAll({
      order: [["createdAt", "DESC"]],
    });

    return categories.map((category) => this.mapCategoryToResponse(category));
  }

  public async findById(id: number): Promise<BrandedCategoryResponse | null> {
    const category = await BrandedCategory.findByPk(id, {
      include: [
        {
          model: BrandedProduct,
          as: "products",
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

    return this.mapCategoryToResponseWithProducts(category);
  }

  public async create(
    data: CreateBrandedCategoryDto
  ): Promise<BrandedCategoryResponse> {
    const category = await BrandedCategory.create(data as any);
    return this.mapCategoryToResponse(category);
  }

  public async update(
    id: number,
    data: UpdateBrandedCategoryDto
  ): Promise<BrandedCategoryResponse | null> {
    const [updatedCount] = await BrandedCategory.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    const updatedCategory = await BrandedCategory.findByPk(id);
    return updatedCategory ? this.mapCategoryToResponse(updatedCategory) : null;
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await BrandedCategory.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapCategoryToResponse(
    category: BrandedCategory
  ): BrandedCategoryResponse {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private mapCategoryToResponseWithProducts(
    category: BrandedCategory
  ): BrandedCategoryResponse {
    const response = this.mapCategoryToResponse(category);

    if (category.products) {
      response.products = category.products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imgUrl: product.imgUrl,
        categoryId: product.categoryId,
        authorId: product.authorId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        category: {
          id: category.id,
          name: category.name,
        },
        author: product.author
          ? {
              id: product.author.id,
              username: product.author.username,
              email: product.author.email,
            }
          : null,
      }));
    }

    return response;
  }
}

export class BrandedProductRepository implements IBrandedProductRepository {
  public async findAll(): Promise<BrandedProductResponse[]> {
    const products = await BrandedProduct.findAll({
      include: [
        {
          model: BrandedCategory,
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

    return products.map((product) => this.mapProductToResponse(product));
  }

  public async findAllPublic(
    query: ProductQueryDto
  ): Promise<{ products: BrandedProductResponse[]; total: number }> {
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
          model: BrandedCategory,
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

    const { count, rows } = await BrandedProduct.findAndCountAll(findOptions);

    return {
      products: rows.map((product) => this.mapProductToResponse(product)),
      total: count,
    };
  }

  public async findById(id: number): Promise<BrandedProductResponse | null> {
    const product = await BrandedProduct.findByPk(id, {
      include: [
        {
          model: BrandedCategory,
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

    return product ? this.mapProductToResponse(product) : null;
  }

  public async findByIdPublic(
    id: number
  ): Promise<BrandedProductResponse | null> {
    return this.findById(id);
  }

  public async create(
    data: CreateBrandedProductDto,
    authorId: number
  ): Promise<BrandedProductResponse> {
    const product = await BrandedProduct.create({
      ...data,
      authorId,
    });

    const createdProduct = await this.findById(product.id);
    if (!createdProduct) {
      throw new NotFoundError("Created product not found");
    }

    return createdProduct;
  }

  public async update(
    id: number,
    data: UpdateBrandedProductDto
  ): Promise<BrandedProductResponse | null> {
    const [updatedCount] = await BrandedProduct.update(data, {
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
  ): Promise<BrandedProductResponse | null> {
    const [updatedCount] = await BrandedProduct.update(
      { imgUrl },
      { where: { id } }
    );

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await BrandedProduct.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapProductToResponse(
    product: BrandedProduct
  ): BrandedProductResponse {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: product.imgUrl,
      categoryId: product.categoryId,
      authorId: product.authorId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : null,
      author: product.author
        ? {
            id: product.author.id,
            username: product.author.username,
            email: product.author.email,
          }
        : null,
    };
  }
}
