import { z } from "zod";

// =============================================================================
// Validation Schemas
// =============================================================================

export const CreateAnimeSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  synopsis: z
    .string()
    .min(10, "Synopsis must be at least 10 characters")
    .max(5000, "Synopsis must be less than 5000 characters"),
  coverUrl: z.string().url("Cover URL must be a valid URL").optional(),
});

export const UpdateAnimeSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  synopsis: z
    .string()
    .min(10, "Synopsis must be at least 10 characters")
    .max(5000, "Synopsis must be less than 5000 characters")
    .optional(),
  coverUrl: z.string().url("Cover URL must be a valid URL").optional(),
});

export const AnimeQuerySchema = z.object({
  q: z.string().optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .refine((val) => val >= 4 && val <= 12, "Limit must be between 4 and 12")
    .optional()
    .default("10"),
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .refine((val) => val >= 1, "Page must be at least 1")
    .optional()
    .default("1"),
  sort: z
    .enum(["ASC", "DESC"], {
      errorMap: () => ({ message: "Sort must be ASC or DESC" }),
    })
    .optional()
    .default("DESC"),
});

// =============================================================================
// DTOs (Data Transfer Objects)
// =============================================================================

export type CreateAnimeDto = z.infer<typeof CreateAnimeSchema>;
export type UpdateAnimeDto = z.infer<typeof UpdateAnimeSchema>;
export type AnimeQueryDto = z.infer<typeof AnimeQuerySchema>;

// =============================================================================
// Response Types
// =============================================================================

export interface AnimeResponse {
  id: number;
  title: string;
  synopsis: string;
  coverUrl?: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    username: string;
    email: string;
  } | null;
}

export interface PaginatedAnimesResponse {
  animes: AnimeResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// =============================================================================
// Repository Interfaces
// =============================================================================

export interface IAnimeRepository {
  findAll(): Promise<AnimeResponse[]>;
  findAllPublic(
    query: AnimeQueryDto
  ): Promise<{ animes: AnimeResponse[]; total: number }>;
  findById(id: number): Promise<AnimeResponse | null>;
  findByIdPublic(id: number): Promise<AnimeResponse | null>;
  create(data: CreateAnimeDto, authorId: number): Promise<AnimeResponse>;
  update(id: number, data: UpdateAnimeDto): Promise<AnimeResponse | null>;
  updateImage(id: number, coverUrl: string): Promise<AnimeResponse | null>;
  delete(id: number): Promise<boolean>;
}

// =============================================================================
// Service Interfaces
// =============================================================================

export interface IAnimeService {
  getAllAnimes(): Promise<AnimeResponse[]>;
  getAllAnimesPublic(query: AnimeQueryDto): Promise<PaginatedAnimesResponse>;
  getAnimeById(id: number): Promise<AnimeResponse>;
  getAnimeByIdPublic(id: number): Promise<AnimeResponse>;
  createAnime(data: CreateAnimeDto, authorId: number): Promise<AnimeResponse>;
  updateAnime(id: number, data: UpdateAnimeDto): Promise<AnimeResponse>;
  updateAnimeImage(id: number, coverUrl: string): Promise<AnimeResponse>;
  deleteAnime(id: number): Promise<void>;
}
