import { z } from "zod";

// Validation schemas
export const createRentalTypeSchema = z.object({
  name: z
    .string()
    .min(2, "Type name must be at least 2 characters")
    .max(50, "Type name cannot exceed 50 characters")
    .trim(),
});

export const updateRentalTypeSchema = createRentalTypeSchema;

export const createRentalTransportationSchema = z.object({
  name: z
    .string()
    .min(2, "Transportation name must be at least 2 characters")
    .max(255, "Transportation name cannot exceed 255 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .trim(),
  imgUrl: z.string().url("Invalid image URL").optional(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(255, "Location cannot exceed 255 characters")
    .trim(),
  price: z
    .number()
    .int("Price must be an integer")
    .min(1, "Price must be greater than 0"),
  typeId: z
    .number()
    .int("Type ID must be an integer")
    .positive("Type ID must be positive"),
});

export const updateRentalTransportationSchema =
  createRentalTransportationSchema;

export const rentalQuerySchema = z.object({
  q: z.string().optional().describe("Search query for transportation name"),
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
export interface CreateRentalTypeDto {
  name: string;
}

export interface UpdateRentalTypeDto {
  name: string;
}

export interface CreateRentalTransportationDto {
  name: string;
  description: string;
  imgUrl?: string;
  location: string;
  price: number;
  typeId: number;
}

export interface UpdateRentalTransportationDto {
  name: string;
  description: string;
  imgUrl?: string;
  location: string;
  price: number;
  typeId: number;
}

export interface RentalQueryDto {
  q?: string;
  i?: string;
  limit: number;
  page: number;
  sort: "ASC" | "DESC";
}

// Response types
export interface RentalTypeResponse {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  transportations?: RentalTransportationResponse[];
}

export interface RentalTransportationResponse {
  id: number;
  name: string;
  description: string;
  imgUrl?: string;
  location: string;
  price: number;
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

export interface PaginatedRentalTransportationsResponse {
  data: RentalTransportationResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedRentalTypesResponse {
  data: RentalTypeResponse[];
}

// Repository interfaces
export interface IRentalTypeRepository {
  findAll(): Promise<RentalTypeResponse[]>;
  findById(id: number): Promise<RentalTypeResponse | null>;
  create(data: CreateRentalTypeDto): Promise<RentalTypeResponse>;
  update(
    id: number,
    data: UpdateRentalTypeDto
  ): Promise<RentalTypeResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface IRentalTransportationRepository {
  findAll(): Promise<RentalTransportationResponse[]>;
  findAllPublic(
    query: RentalQueryDto
  ): Promise<{
    transportations: RentalTransportationResponse[];
    total: number;
  }>;
  findById(id: number): Promise<RentalTransportationResponse | null>;
  findByIdPublic(id: number): Promise<RentalTransportationResponse | null>;
  create(
    data: CreateRentalTransportationDto,
    authorId: number
  ): Promise<RentalTransportationResponse>;
  update(
    id: number,
    data: UpdateRentalTransportationDto
  ): Promise<RentalTransportationResponse | null>;
  updateImage(
    id: number,
    imgUrl: string
  ): Promise<RentalTransportationResponse | null>;
  delete(id: number): Promise<boolean>;
}

// Service interfaces
export interface IRentalTypeService {
  getAllTypes(): Promise<RentalTypeResponse[]>;
  getTypeById(id: number): Promise<RentalTypeResponse>;
  createType(data: CreateRentalTypeDto): Promise<RentalTypeResponse>;
  updateType(
    id: number,
    data: UpdateRentalTypeDto
  ): Promise<RentalTypeResponse>;
  deleteType(id: number): Promise<void>;
}

export interface IRentalTransportationService {
  getAllTransportations(): Promise<RentalTransportationResponse[]>;
  getAllTransportationsPublic(
    query: RentalQueryDto
  ): Promise<PaginatedRentalTransportationsResponse>;
  getTransportationById(id: number): Promise<RentalTransportationResponse>;
  getTransportationByIdPublic(
    id: number
  ): Promise<RentalTransportationResponse>;
  createTransportation(
    data: CreateRentalTransportationDto,
    authorId: number
  ): Promise<RentalTransportationResponse>;
  updateTransportation(
    id: number,
    data: UpdateRentalTransportationDto
  ): Promise<RentalTransportationResponse>;
  updateTransportationImage(
    id: number,
    imgUrl: string
  ): Promise<RentalTransportationResponse>;
  deleteTransportation(id: number): Promise<void>;
}
