import { z } from "zod";

export const createMovieGenreSchema = z.object({
  name: z
    .string()
    .min(2, "Genre name must be at least 2 characters")
    .max(50, "Genre name cannot exceed 50 characters")
    .trim(),
});

export const updateMovieGenreSchema = createMovieGenreSchema;

export const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(500, "Title cannot exceed 500 characters")
    .trim(),
  synopsis: z
    .string()
    .min(20, "Synopsis must be at least 20 characters")
    .trim(),
  trailerUrl: z.string().url("Invalid trailer URL").optional(),
  imgUrl: z.string().url("Invalid image URL").optional(),
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(10, "Rating cannot exceed 10"),
  genreId: z
    .number()
    .int("Genre ID must be an integer")
    .positive("Genre ID must be positive"),
});

export const updateMovieSchema = createMovieSchema;

export const movieQuerySchema = z.object({
  q: z.string().optional().describe("Search query for movie title"),
  i: z.string().optional().describe("Search query for genre name"),
  limit: z.coerce
    .number()
    .int()
    .min(4, "Limit must be at least 4")
    .max(12, "Limit cannot exceed 12")
    .default(10),
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  sort: z.enum(["ASC", "DESC"]).default("DESC"),
});

export interface CreateMovieGenreDto {
  name: string;
}

export interface UpdateMovieGenreDto {
  name: string;
}

export interface CreateMovieDto {
  title: string;
  synopsis: string;
  trailerUrl?: string;
  imgUrl?: string;
  rating: number;
  genreId: number;
}

export interface UpdateMovieDto {
  title: string;
  synopsis: string;
  trailerUrl?: string;
  imgUrl?: string;
  rating: number;
  genreId: number;
}

export interface MovieQueryDto {
  q?: string;
  i?: string;
  limit: number;
  page: number;
  sort: "ASC" | "DESC";
}

export interface MovieGenreResponse {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  movies?: MovieResponse[];
}

export interface MovieResponse {
  id: number;
  title: string;
  synopsis: string;
  trailerUrl?: string;
  imgUrl?: string;
  rating: number;
  genreId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  genre: {
    id: number;
    name: string;
  } | null;
  author: {
    id: number;
    username: string;
    email: string;
  } | null;
}

export interface PaginatedMoviesResponse {
  data: MovieResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedMovieGenresResponse {
  data: MovieGenreResponse[];
}

export interface IMovieGenreRepository {
  findAll(): Promise<MovieGenreResponse[]>;
  findById(id: number): Promise<MovieGenreResponse | null>;
  create(data: CreateMovieGenreDto): Promise<MovieGenreResponse>;
  update(
    id: number,
    data: UpdateMovieGenreDto
  ): Promise<MovieGenreResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface IMovieRepository {
  findAll(): Promise<MovieResponse[]>;
  findAllPublic(
    query: MovieQueryDto
  ): Promise<{ movies: MovieResponse[]; total: number }>;
  findById(id: number): Promise<MovieResponse | null>;
  findByIdPublic(id: number): Promise<MovieResponse | null>;
  create(data: CreateMovieDto, authorId: number): Promise<MovieResponse>;
  update(id: number, data: UpdateMovieDto): Promise<MovieResponse | null>;
  updateImage(id: number, imgUrl: string): Promise<MovieResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface IMovieGenreService {
  getAllGenres(): Promise<MovieGenreResponse[]>;
  getGenreById(id: number): Promise<MovieGenreResponse>;
  createGenre(data: CreateMovieGenreDto): Promise<MovieGenreResponse>;
  updateGenre(
    id: number,
    data: UpdateMovieGenreDto
  ): Promise<MovieGenreResponse>;
  deleteGenre(id: number): Promise<void>;
}

export interface IMovieService {
  getAllMovies(): Promise<MovieResponse[]>;
  getAllMoviesPublic(query: MovieQueryDto): Promise<PaginatedMoviesResponse>;
  getMovieById(id: number): Promise<MovieResponse>;
  getMovieByIdPublic(id: number): Promise<MovieResponse>;
  createMovie(data: CreateMovieDto, authorId: number): Promise<MovieResponse>;
  updateMovie(id: number, data: UpdateMovieDto): Promise<MovieResponse>;
  updateMovieImage(id: number, imgUrl: string): Promise<MovieResponse>;
  deleteMovie(id: number): Promise<void>;
}
