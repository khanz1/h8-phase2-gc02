import { NotFoundError, ConflictError } from "@/shared/errors";
import { RoomTypeRepository, RoomLodgingRepository } from "./room.repository";
import {
  RoomTypeResponse,
  RoomLodgingResponse,
  PaginatedRoomLodgingsResponse,
  CreateRoomTypeDto,
  UpdateRoomTypeDto,
  CreateRoomLodgingDto,
  UpdateRoomLodgingDto,
  LodgingQueryDto,
  IRoomTypeService,
  IRoomLodgingService,
} from "./room.types";

export class RoomTypeService implements IRoomTypeService {
  constructor(private readonly typeRepository: RoomTypeRepository) {}

  public async getAllTypes(): Promise<RoomTypeResponse[]> {
    return await this.typeRepository.findAll();
  }

  public async getTypeById(id: number): Promise<RoomTypeResponse> {
    const type = await this.typeRepository.findById(id);

    if (!type) {
      throw new NotFoundError(`Room type with ID ${id} not found`);
    }

    return type;
  }

  public async createType(data: CreateRoomTypeDto): Promise<RoomTypeResponse> {
    try {
      return await this.typeRepository.create(data);
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ConflictError(`Type with name '${data.name}' already exists`);
      }
      throw error;
    }
  }

  public async updateType(
    id: number,
    data: UpdateRoomTypeDto
  ): Promise<RoomTypeResponse> {
    try {
      const updatedType = await this.typeRepository.update(id, data);

      if (!updatedType) {
        throw new NotFoundError(`Room type with ID ${id} not found`);
      }

      return updatedType;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ConflictError(`Type with name '${data.name}' already exists`);
      }
      throw error;
    }
  }

  public async deleteType(id: number): Promise<void> {
    try {
      const deleted = await this.typeRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError(`Room type with ID ${id} not found`);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        throw new ConflictError(
          "Cannot delete type that has associated lodgings"
        );
      }
      throw error;
    }
  }
}

export class RoomLodgingService implements IRoomLodgingService {
  constructor(
    private readonly lodgingRepository: RoomLodgingRepository,
    private readonly typeRepository: RoomTypeRepository
  ) {}

  public async getAllLodgings(): Promise<RoomLodgingResponse[]> {
    return await this.lodgingRepository.findAll();
  }

  public async getAllLodgingsPublic(
    query: LodgingQueryDto
  ): Promise<PaginatedRoomLodgingsResponse> {
    const { lodgings, total } = await this.lodgingRepository.findAllPublic(
      query
    );
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: lodgings,
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

  public async getLodgingById(id: number): Promise<RoomLodgingResponse> {
    const lodging = await this.lodgingRepository.findById(id);

    if (!lodging) {
      throw new NotFoundError(`Lodging with ID ${id} not found`);
    }

    return lodging;
  }

  public async getLodgingByIdPublic(id: number): Promise<RoomLodgingResponse> {
    const lodging = await this.lodgingRepository.findByIdPublic(id);

    if (!lodging) {
      throw new NotFoundError(`Lodging with ID ${id} not found`);
    }

    return lodging;
  }

  public async createLodging(
    data: CreateRoomLodgingDto,
    authorId: number
  ): Promise<RoomLodgingResponse> {
    const type = await this.typeRepository.findById(data.typeId);
    if (!type) {
      throw new NotFoundError(`Room type with ID ${data.typeId} not found`);
    }

    return await this.lodgingRepository.create(data, authorId);
  }

  public async updateLodging(
    id: number,
    data: UpdateRoomLodgingDto
  ): Promise<RoomLodgingResponse> {
    const type = await this.typeRepository.findById(data.typeId);
    if (!type) {
      throw new NotFoundError(`Room type with ID ${data.typeId} not found`);
    }

    const updatedLodging = await this.lodgingRepository.update(id, data);

    if (!updatedLodging) {
      throw new NotFoundError(`Lodging with ID ${id} not found`);
    }

    return updatedLodging;
  }

  public async updateLodgingImage(
    id: number,
    imgUrl: string
  ): Promise<RoomLodgingResponse> {
    const updatedLodging = await this.lodgingRepository.updateImage(id, imgUrl);

    if (!updatedLodging) {
      throw new NotFoundError(`Lodging with ID ${id} not found`);
    }

    return updatedLodging;
  }

  public async deleteLodging(id: number): Promise<void> {
    const deleted = await this.lodgingRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Lodging with ID ${id} not found`);
    }
  }
}
