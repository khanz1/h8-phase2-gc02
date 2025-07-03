import { NotFoundError, ConflictError } from "@/shared/errors";
import {
  RentalTypeRepository,
  RentalTransportationRepository,
} from "./rental.repository";
import {
  RentalTypeResponse,
  RentalTransportationResponse,
  PaginatedRentalTransportationsResponse,
  CreateRentalTypeDto,
  UpdateRentalTypeDto,
  CreateRentalTransportationDto,
  UpdateRentalTransportationDto,
  RentalQueryDto,
  IRentalTypeService,
  IRentalTransportationService,
} from "./rental.types";

export class RentalTypeService implements IRentalTypeService {
  constructor(private readonly typeRepository: RentalTypeRepository) {}

  public async getAllTypes(): Promise<RentalTypeResponse[]> {
    return await this.typeRepository.findAll();
  }

  public async getTypeById(id: number): Promise<RentalTypeResponse> {
    const type = await this.typeRepository.findById(id);

    if (!type) {
      throw new NotFoundError(`Rental type with ID ${id} not found`);
    }

    return type;
  }

  public async createType(
    data: CreateRentalTypeDto
  ): Promise<RentalTypeResponse> {
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
    data: UpdateRentalTypeDto
  ): Promise<RentalTypeResponse> {
    try {
      const updatedType = await this.typeRepository.update(id, data);

      if (!updatedType) {
        throw new NotFoundError(`Rental type with ID ${id} not found`);
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
        throw new NotFoundError(`Rental type with ID ${id} not found`);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        throw new ConflictError(
          "Cannot delete type that has associated transportations"
        );
      }
      throw error;
    }
  }
}

export class RentalTransportationService
  implements IRentalTransportationService
{
  constructor(
    private readonly transportationRepository: RentalTransportationRepository,
    private readonly typeRepository: RentalTypeRepository
  ) {}

  public async getAllTransportations(): Promise<
    RentalTransportationResponse[]
  > {
    return await this.transportationRepository.findAll();
  }

  public async getAllTransportationsPublic(
    query: RentalQueryDto
  ): Promise<PaginatedRentalTransportationsResponse> {
    const { transportations, total } =
      await this.transportationRepository.findAllPublic(query);
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: transportations,
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

  public async getTransportationById(
    id: number
  ): Promise<RentalTransportationResponse> {
    const transportation = await this.transportationRepository.findById(id);

    if (!transportation) {
      throw new NotFoundError(`Rental transportation with ID ${id} not found`);
    }

    return transportation;
  }

  public async getTransportationByIdPublic(
    id: number
  ): Promise<RentalTransportationResponse> {
    const transportation = await this.transportationRepository.findByIdPublic(
      id
    );

    if (!transportation) {
      throw new NotFoundError(`Rental transportation with ID ${id} not found`);
    }

    return transportation;
  }

  public async createTransportation(
    data: CreateRentalTransportationDto,
    authorId: number
  ): Promise<RentalTransportationResponse> {
    const type = await this.typeRepository.findById(data.typeId);
    if (!type) {
      throw new NotFoundError(`Rental type with ID ${data.typeId} not found`);
    }

    return await this.transportationRepository.create(data, authorId);
  }

  public async updateTransportation(
    id: number,
    data: UpdateRentalTransportationDto
  ): Promise<RentalTransportationResponse> {
    const type = await this.typeRepository.findById(data.typeId);
    if (!type) {
      throw new NotFoundError(`Rental type with ID ${data.typeId} not found`);
    }

    const updatedTransportation = await this.transportationRepository.update(
      id,
      data
    );

    if (!updatedTransportation) {
      throw new NotFoundError(`Rental transportation with ID ${id} not found`);
    }

    return updatedTransportation;
  }

  public async updateTransportationImage(
    id: number,
    imgUrl: string
  ): Promise<RentalTransportationResponse> {
    const updatedTransportation =
      await this.transportationRepository.updateImage(id, imgUrl);

    if (!updatedTransportation) {
      throw new NotFoundError(`Rental transportation with ID ${id} not found`);
    }

    return updatedTransportation;
  }

  public async deleteTransportation(id: number): Promise<void> {
    const deleted = await this.transportationRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Rental transportation with ID ${id} not found`);
    }
  }
}
