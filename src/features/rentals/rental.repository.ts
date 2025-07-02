import { Op } from "sequelize";
import { RentalType, RentalTransportation } from "./rental.model";
import { User } from "@/features/users/user.model";
import { NotFoundError } from "@/shared/errors";
import {
  RentalTypeResponse,
  RentalTransportationResponse,
  CreateRentalTypeDto,
  UpdateRentalTypeDto,
  CreateRentalTransportationDto,
  UpdateRentalTransportationDto,
  RentalQueryDto,
  IRentalTypeRepository,
  IRentalTransportationRepository,
} from "./rental.types";

export class RentalTypeRepository implements IRentalTypeRepository {
  public async findAll(): Promise<RentalTypeResponse[]> {
    const types = await RentalType.findAll({
      order: [["createdAt", "DESC"]],
    });

    return types.map((type) => this.mapTypeToResponse(type));
  }

  public async findById(id: number): Promise<RentalTypeResponse | null> {
    const type = await RentalType.findByPk(id, {
      include: [
        {
          model: RentalTransportation,
          as: "transportations",
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

    if (!type) {
      return null;
    }

    return this.mapTypeToResponseWithTransportations(type);
  }

  public async create(data: CreateRentalTypeDto): Promise<RentalTypeResponse> {
    const type = await RentalType.create(data as any);
    return this.mapTypeToResponse(type);
  }

  public async update(
    id: number,
    data: UpdateRentalTypeDto
  ): Promise<RentalTypeResponse | null> {
    const [updatedCount] = await RentalType.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    const updatedType = await RentalType.findByPk(id);
    return updatedType ? this.mapTypeToResponse(updatedType) : null;
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await RentalType.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapTypeToResponse(type: RentalType): RentalTypeResponse {
    return {
      id: type.id,
      name: type.name,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    };
  }

  private mapTypeToResponseWithTransportations(
    type: RentalType
  ): RentalTypeResponse {
    const response = this.mapTypeToResponse(type);

    if (type.transportations) {
      response.transportations = type.transportations.map((transportation) => ({
        id: transportation.id,
        name: transportation.name,
        description: transportation.description,
        imgUrl: transportation.imgUrl,
        location: transportation.location,
        price: transportation.price,
        typeId: transportation.typeId,
        authorId: transportation.authorId,
        createdAt: transportation.createdAt,
        updatedAt: transportation.updatedAt,
        type: {
          id: type.id,
          name: type.name,
        },
        author: transportation.author
          ? {
              id: transportation.author.id,
              username: transportation.author.username,
              email: transportation.author.email,
            }
          : null,
      }));
    }

    return response;
  }
}

export class RentalTransportationRepository
  implements IRentalTransportationRepository
{
  public async findAll(): Promise<RentalTransportationResponse[]> {
    const transportations = await RentalTransportation.findAll({
      include: [
        {
          model: RentalType,
          as: "type",
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

    return transportations.map((transportation) =>
      this.mapTransportationToResponse(transportation)
    );
  }

  public async findAllPublic(
    query: RentalQueryDto
  ): Promise<{
    transportations: RentalTransportationResponse[];
    total: number;
  }> {
    const { q, i, limit, page, sort } = query;
    const offset = (page - 1) * limit;

    const whereConditions: any = {};
    const typeWhereConditions: any = {};

    if (q) {
      whereConditions.name = {
        [Op.iLike]: `%${q}%`,
      };
    }

    if (i) {
      const typeNames = i.split(",").map((name) => name.trim());
      typeWhereConditions.name = {
        [Op.iLike]: { [Op.any]: typeNames.map((name) => `%${name}%`) },
      };
    }

    const findOptions: any = {
      where: whereConditions,
      include: [
        {
          model: RentalType,
          as: "type",
          attributes: ["id", "name"],
          where:
            Object.keys(typeWhereConditions).length > 0
              ? typeWhereConditions
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

    const { count, rows } = await RentalTransportation.findAndCountAll(
      findOptions
    );

    return {
      transportations: rows.map((transportation) =>
        this.mapTransportationToResponse(transportation)
      ),
      total: count,
    };
  }

  public async findById(
    id: number
  ): Promise<RentalTransportationResponse | null> {
    const transportation = await RentalTransportation.findByPk(id, {
      include: [
        {
          model: RentalType,
          as: "type",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    return transportation
      ? this.mapTransportationToResponse(transportation)
      : null;
  }

  public async findByIdPublic(
    id: number
  ): Promise<RentalTransportationResponse | null> {
    return this.findById(id);
  }

  public async create(
    data: CreateRentalTransportationDto,
    authorId: number
  ): Promise<RentalTransportationResponse> {
    const transportation = await RentalTransportation.create({
      ...data,
      authorId,
    });

    const createdTransportation = await this.findById(transportation.id);
    if (!createdTransportation) {
      throw new NotFoundError("Created transportation not found");
    }

    return createdTransportation;
  }

  public async update(
    id: number,
    data: UpdateRentalTransportationDto
  ): Promise<RentalTransportationResponse | null> {
    const [updatedCount] = await RentalTransportation.update(data, {
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
  ): Promise<RentalTransportationResponse | null> {
    const [updatedCount] = await RentalTransportation.update(
      { imgUrl },
      { where: { id } }
    );

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await RentalTransportation.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapTransportationToResponse(
    transportation: RentalTransportation
  ): RentalTransportationResponse {
    return {
      id: transportation.id,
      name: transportation.name,
      description: transportation.description,
      imgUrl: transportation.imgUrl,
      location: transportation.location,
      price: transportation.price,
      typeId: transportation.typeId,
      authorId: transportation.authorId,
      createdAt: transportation.createdAt,
      updatedAt: transportation.updatedAt,
      type: transportation.type
        ? {
            id: transportation.type.id,
            name: transportation.type.name,
          }
        : null,
      author: transportation.author
        ? {
            id: transportation.author.id,
            username: transportation.author.username,
            email: transportation.author.email,
          }
        : null,
    };
  }
}
