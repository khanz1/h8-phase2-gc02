import { NotFoundError, ConflictError } from "@/shared/errors";
import { MovieGenreRepository, MovieRepository } from "./movie.repository";
import {
  MovieGenreResponse,
  MovieResponse,
  PaginatedMoviesResponse,
  CreateMovieGenreDto,
  UpdateMovieGenreDto,
  CreateMovieDto,
  UpdateMovieDto,
  MovieQueryDto,
  IMovieGenreService,
  IMovieService,
} from "./movie.types";

export class MovieGenreService implements IMovieGenreService {
  constructor(private readonly genreRepository: MovieGenreRepository) {}

  public async getAllGenres(): Promise<MovieGenreResponse[]> {
    return await this.genreRepository.findAll();
  }

  public async getGenreById(id: number): Promise<MovieGenreResponse> {
    const genre = await this.genreRepository.findById(id);

    if (!genre) {
      throw new NotFoundError(`Movie genre with ID ${id} not found`);
    }

    return genre;
  }

  public async createGenre(
    data: CreateMovieGenreDto
  ): Promise<MovieGenreResponse> {
    try {
      return await this.genreRepository.create(data);
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ConflictError(
          `Genre with name '${data.name}' already exists`
        );
      }
      throw error;
    }
  }

  public async updateGenre(
    id: number,
    data: UpdateMovieGenreDto
  ): Promise<MovieGenreResponse> {
    try {
      const updatedGenre = await this.genreRepository.update(id, data);

      if (!updatedGenre) {
        throw new NotFoundError(`Movie genre with ID ${id} not found`);
      }

      return updatedGenre;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ConflictError(
          `Genre with name '${data.name}' already exists`
        );
      }
      throw error;
    }
  }

  public async deleteGenre(id: number): Promise<void> {
    try {
      const deleted = await this.genreRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError(`Movie genre with ID ${id} not found`);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        throw new ConflictError(
          "Cannot delete genre that has associated movies"
        );
      }
      throw error;
    }
  }
}

export class MovieService implements IMovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly genreRepository: MovieGenreRepository
  ) {}

  public async getAllMovies(): Promise<MovieResponse[]> {
    return await this.movieRepository.findAll();
  }

  public async getAllMoviesPublic(
    query: MovieQueryDto
  ): Promise<PaginatedMoviesResponse> {
    const { movies, total } = await this.movieRepository.findAllPublic(query);
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: movies,
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

  public async getMovieById(id: number): Promise<MovieResponse> {
    const movie = await this.movieRepository.findById(id);

    if (!movie) {
      throw new NotFoundError(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  public async getMovieByIdPublic(id: number): Promise<MovieResponse> {
    const movie = await this.movieRepository.findByIdPublic(id);

    if (!movie) {
      throw new NotFoundError(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  public async createMovie(
    data: CreateMovieDto,
    authorId: number
  ): Promise<MovieResponse> {
    const genre = await this.genreRepository.findById(data.genreId);
    if (!genre) {
      throw new NotFoundError(`Movie genre with ID ${data.genreId} not found`);
    }

    return await this.movieRepository.create(data, authorId);
  }

  public async updateMovie(
    id: number,
    data: UpdateMovieDto
  ): Promise<MovieResponse> {
    const genre = await this.genreRepository.findById(data.genreId);
    if (!genre) {
      throw new NotFoundError(`Movie genre with ID ${data.genreId} not found`);
    }

    const updatedMovie = await this.movieRepository.update(id, data);

    if (!updatedMovie) {
      throw new NotFoundError(`Movie with ID ${id} not found`);
    }

    return updatedMovie;
  }

  public async updateMovieImage(
    id: number,
    imgUrl: string
  ): Promise<MovieResponse> {
    const updatedMovie = await this.movieRepository.updateImage(id, imgUrl);

    if (!updatedMovie) {
      throw new NotFoundError(`Movie with ID ${id} not found`);
    }

    return updatedMovie;
  }

  public async deleteMovie(id: number): Promise<void> {
    const deleted = await this.movieRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Movie with ID ${id} not found`);
    }
  }
}
