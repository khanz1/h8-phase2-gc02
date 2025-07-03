import { Op } from "sequelize";
import { RoomType, RoomLodging } from "./room.model";
import { User } from "@/features/users/user.model";
import { NotFoundError } from "@/shared/errors";
import {
  RoomTypeResponse,
  RoomLodgingResponse,
  CreateRoomTypeDto,
  UpdateRoomTypeDto,
  CreateRoomLodgingDto,
  UpdateRoomLodgingDto,
  LodgingQueryDto,
  IRoomTypeRepository,
  IRoomLodgingRepository,
} from "./room.types";

export class RoomTypeRepository implements IRoomTypeRepository {
  public async findAll(): Promise<RoomTypeResponse[]> {
    const types = await RoomType.findAll({
      order: [["createdAt", "DESC"]],
    });

    return types.map((type) => this.mapTypeToResponse(type));
  }

  public async findById(id: number): Promise<RoomTypeResponse | null> {
    const type = await RoomType.findByPk(id, {
      include: [
        {
          model: RoomLodging,
          as: "lodgings",
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

    return this.mapTypeToResponseWithLodgings(type);
  }

  public async create(data: CreateRoomTypeDto): Promise<RoomTypeResponse> {
    const type = await RoomType.create(data as any);
    return this.mapTypeToResponse(type);
  }

  public async update(
    id: number,
    data: UpdateRoomTypeDto
  ): Promise<RoomTypeResponse | null> {
    const [updatedCount] = await RoomType.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    const updatedType = await RoomType.findByPk(id);
    return updatedType ? this.mapTypeToResponse(updatedType) : null;
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await RoomType.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapTypeToResponse(type: RoomType): RoomTypeResponse {
    return {
      id: type.id,
      name: type.name,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    };
  }

  private mapTypeToResponseWithLodgings(type: RoomType): RoomTypeResponse {
    const response = this.mapTypeToResponse(type);

    if (type.lodgings) {
      response.lodgings = type.lodgings.map((lodging) => ({
        id: lodging.id,
        name: lodging.name,
        facility: lodging.facility,
        roomCapacity: lodging.roomCapacity,
        imgUrl: lodging.imgUrl,
        location: lodging.location,
        typeId: lodging.typeId,
        authorId: lodging.authorId,
        createdAt: lodging.createdAt,
        updatedAt: lodging.updatedAt,
        type: {
          id: type.id,
          name: type.name,
        },
        author: lodging.author
          ? {
              id: lodging.author.id,
              username: lodging.author.username,
              email: lodging.author.email,
            }
          : null,
      }));
    }

    return response;
  }
}

export class RoomLodgingRepository implements IRoomLodgingRepository {
  public async findAll(): Promise<RoomLodgingResponse[]> {
    const lodgings = await RoomLodging.findAll({
      include: [
        {
          model: RoomType,
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

    return lodgings.map((lodging) => this.mapLodgingToResponse(lodging));
  }

  public async findAllPublic(
    query: LodgingQueryDto
  ): Promise<{ lodgings: RoomLodgingResponse[]; total: number }> {
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
          model: RoomType,
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

    const { count, rows } = await RoomLodging.findAndCountAll(findOptions);

    return {
      lodgings: rows.map((lodging) => this.mapLodgingToResponse(lodging)),
      total: count,
    };
  }

  public async findById(id: number): Promise<RoomLodgingResponse | null> {
    const lodging = await RoomLodging.findByPk(id, {
      include: [
        {
          model: RoomType,
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

    return lodging ? this.mapLodgingToResponse(lodging) : null;
  }

  public async findByIdPublic(id: number): Promise<RoomLodgingResponse | null> {
    return this.findById(id);
  }

  public async create(
    data: CreateRoomLodgingDto,
    authorId: number
  ): Promise<RoomLodgingResponse> {
    const lodging = await RoomLodging.create({
      ...data,
      authorId,
    });

    const createdLodging = await this.findById(lodging.id);
    if (!createdLodging) {
      throw new NotFoundError("Created lodging not found");
    }

    return createdLodging;
  }

  public async update(
    id: number,
    data: UpdateRoomLodgingDto
  ): Promise<RoomLodgingResponse | null> {
    const [updatedCount] = await RoomLodging.update(data, {
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
  ): Promise<RoomLodgingResponse | null> {
    const [updatedCount] = await RoomLodging.update(
      { imgUrl },
      { where: { id } }
    );

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await RoomLodging.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapLodgingToResponse(lodging: RoomLodging): RoomLodgingResponse {
    return {
      id: lodging.id,
      name: lodging.name,
      facility: lodging.facility,
      roomCapacity: lodging.roomCapacity,
      imgUrl: lodging.imgUrl,
      location: lodging.location,
      typeId: lodging.typeId,
      authorId: lodging.authorId,
      createdAt: lodging.createdAt,
      updatedAt: lodging.updatedAt,
      type: lodging.type
        ? {
            id: lodging.type.id,
            name: lodging.type.name,
          }
        : null,
      author: lodging.author
        ? {
            id: lodging.author.id,
            username: lodging.author.username,
            email: lodging.author.email,
          }
        : null,
    };
  }
}
