import { z } from "zod";

// Validation schemas
export const createRoomTypeSchema = z.object({
  name: z
    .string()
    .min(2, "Type name must be at least 2 characters")
    .max(50, "Type name cannot exceed 50 characters")
    .trim(),
});

export const updateRoomTypeSchema = createRoomTypeSchema;

export const createRoomLodgingSchema = z.object({
  name: z
    .string()
    .min(2, "Lodging name must be at least 2 characters")
    .max(255, "Lodging name cannot exceed 255 characters")
    .trim(),
  facility: z
    .string()
    .min(10, "Facility description must be at least 10 characters")
    .trim(),
  roomCapacity: z
    .number()
    .int("Room capacity must be an integer")
    .min(1, "Room capacity must be greater than 0"),
  imgUrl: z.string().url("Invalid image URL").optional(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(255, "Location cannot exceed 255 characters")
    .trim(),
  typeId: z
    .number()
    .int("Type ID must be an integer")
    .positive("Type ID must be positive"),
});

export const updateRoomLodgingSchema = createRoomLodgingSchema;

export const lodgingQuerySchema = z.object({
  q: z.string().optional().describe("Search query for lodging name"),
  i: z.string().optional().describe("Search query for type name"),
  limit: z.coerce
    .number()
    .int()
    .min(4, "Limit must be at least 4")
    .max(12, "Limit cannot exceed 12")
    .default(10),
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  sort: z.enum(["ASC", "DESC"]).default("DESC"),
});

// DTOs
export interface CreateRoomTypeDto {
  name: string;
}

export interface UpdateRoomTypeDto {
  name: string;
}

export interface CreateRoomLodgingDto {
  name: string;
  facility: string;
  roomCapacity: number;
  imgUrl?: string;
  location: string;
  typeId: number;
}

export interface UpdateRoomLodgingDto {
  name: string;
  facility: string;
  roomCapacity: number;
  imgUrl?: string;
  location: string;
  typeId: number;
}

export interface LodgingQueryDto {
  q?: string;
  i?: string;
  limit: number;
  page: number;
  sort: "ASC" | "DESC";
}

// Response types
export interface RoomTypeResponse {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  lodgings?: RoomLodgingResponse[];
}

export interface RoomLodgingResponse {
  id: number;
  name: string;
  facility: string;
  roomCapacity: number;
  imgUrl?: string;
  location: string;
  typeId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  type: {
    id: number;
    name: string;
  } | null;
  author: {
    id: number;
    username: string;
    email: string;
  } | null;
}

export interface PaginatedRoomLodgingsResponse {
  data: RoomLodgingResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedRoomTypesResponse {
  data: RoomTypeResponse[];
}

// Repository interfaces
export interface IRoomTypeRepository {
  findAll(): Promise<RoomTypeResponse[]>;
  findById(id: number): Promise<RoomTypeResponse | null>;
  create(data: CreateRoomTypeDto): Promise<RoomTypeResponse>;
  update(id: number, data: UpdateRoomTypeDto): Promise<RoomTypeResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface IRoomLodgingRepository {
  findAll(): Promise<RoomLodgingResponse[]>;
  findAllPublic(
    query: LodgingQueryDto
  ): Promise<{ lodgings: RoomLodgingResponse[]; total: number }>;
  findById(id: number): Promise<RoomLodgingResponse | null>;
  findByIdPublic(id: number): Promise<RoomLodgingResponse | null>;
  create(
    data: CreateRoomLodgingDto,
    authorId: number
  ): Promise<RoomLodgingResponse>;
  update(
    id: number,
    data: UpdateRoomLodgingDto
  ): Promise<RoomLodgingResponse | null>;
  updateImage(id: number, imgUrl: string): Promise<RoomLodgingResponse | null>;
  delete(id: number): Promise<boolean>;
}

// Service interfaces
export interface IRoomTypeService {
  getAllTypes(): Promise<RoomTypeResponse[]>;
  getTypeById(id: number): Promise<RoomTypeResponse>;
  createType(data: CreateRoomTypeDto): Promise<RoomTypeResponse>;
  updateType(id: number, data: UpdateRoomTypeDto): Promise<RoomTypeResponse>;
  deleteType(id: number): Promise<void>;
}

export interface IRoomLodgingService {
  getAllLodgings(): Promise<RoomLodgingResponse[]>;
  getAllLodgingsPublic(
    query: LodgingQueryDto
  ): Promise<PaginatedRoomLodgingsResponse>;
  getLodgingById(id: number): Promise<RoomLodgingResponse>;
  getLodgingByIdPublic(id: number): Promise<RoomLodgingResponse>;
  createLodging(
    data: CreateRoomLodgingDto,
    authorId: number
  ): Promise<RoomLodgingResponse>;
  updateLodging(
    id: number,
    data: UpdateRoomLodgingDto
  ): Promise<RoomLodgingResponse>;
  updateLodgingImage(id: number, imgUrl: string): Promise<RoomLodgingResponse>;
  deleteLodging(id: number): Promise<void>;
}
