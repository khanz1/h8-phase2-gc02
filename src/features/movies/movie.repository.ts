import { Op } from "sequelize";
import { MovieGenre, Movie } from "./movie.model";
import { User } from "@/features/users/user.model";
import { NotFoundError } from "@/shared/errors";
import {
  MovieGenreResponse,
  MovieResponse,
  CreateMovieGenreDto,
  UpdateMovieGenreDto,
  CreateMovieDto,
  UpdateMovieDto,
  MovieQueryDto,
  IMovieGenreRepository,
  IMovieRepository,
} from "./movie.types";

export class MovieGenreRepository implements IMovieGenreRepository {
  public async findAll(): Promise<MovieGenreResponse[]> {
    const genres = await MovieGenre.findAll({
      order: [["createdAt", "DESC"]],
    });

    return genres.map((genre) => this.mapGenreToResponse(genre));
  }

  public async findById(id: number): Promise<MovieGenreResponse | null> {
    const genre = await MovieGenre.findByPk(id, {
      include: [
        {
          model: Movie,
          as: "movies",
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

    if (!genre) {
      return null;
    }

    return this.mapGenreToResponseWithMovies(genre);
  }

  public async create(data: CreateMovieGenreDto): Promise<MovieGenreResponse> {
    const genre = await MovieGenre.create(data as any);
    return this.mapGenreToResponse(genre);
  }

  public async update(
    id: number,
    data: UpdateMovieGenreDto
  ): Promise<MovieGenreResponse | null> {
    const [updatedCount] = await MovieGenre.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    const updatedGenre = await MovieGenre.findByPk(id);
    return updatedGenre ? this.mapGenreToResponse(updatedGenre) : null;
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await MovieGenre.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapGenreToResponse(genre: MovieGenre): MovieGenreResponse {
    return {
      id: genre.id,
      name: genre.name,
      createdAt: genre.createdAt,
      updatedAt: genre.updatedAt,
    };
  }

  private mapGenreToResponseWithMovies(genre: MovieGenre): MovieGenreResponse {
    const response = this.mapGenreToResponse(genre);

    if (genre.movies) {
      response.movies = genre.movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        synopsis: movie.synopsis,
        trailerUrl: movie.trailerUrl,
        imgUrl: movie.imgUrl,
        rating: movie.rating,
        genreId: movie.genreId,
        authorId: movie.authorId,
        createdAt: movie.createdAt,
        updatedAt: movie.updatedAt,
        genre: {
          id: genre.id,
          name: genre.name,
        },
        author: movie.author
          ? {
              id: movie.author.id,
              username: movie.author.username,
              email: movie.author.email,
            }
          : null,
      }));
    }

    return response;
  }
}

export class MovieRepository implements IMovieRepository {
  public async findAll(): Promise<MovieResponse[]> {
    const movies = await Movie.findAll({
      include: [
        {
          model: MovieGenre,
          as: "genre",
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

    return movies.map((movie) => this.mapMovieToResponse(movie));
  }

  public async findAllPublic(
    query: MovieQueryDto
  ): Promise<{ movies: MovieResponse[]; total: number }> {
    const { q, i, limit, page, sort } = query;
    const offset = (page - 1) * limit;

    const whereConditions: any = {};
    const genreWhereConditions: any = {};

    if (q) {
      whereConditions.title = {
        [Op.iLike]: `%${q}%`,
      };
    }

    if (i) {
      const genreNames = i.split(",").map((name) => name.trim());
      genreWhereConditions.name = {
        [Op.iLike]: { [Op.any]: genreNames.map((name) => `%${name}%`) },
      };
    }

    const findOptions: any = {
      where: whereConditions,
      include: [
        {
          model: MovieGenre,
          as: "genre",
          attributes: ["id", "name"],
          where:
            Object.keys(genreWhereConditions).length > 0
              ? genreWhereConditions
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

    const { count, rows } = await Movie.findAndCountAll(findOptions);

    return {
      movies: rows.map((movie) => this.mapMovieToResponse(movie)),
      total: count,
    };
  }

  public async findById(id: number): Promise<MovieResponse | null> {
    const movie = await Movie.findByPk(id, {
      include: [
        {
          model: MovieGenre,
          as: "genre",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    return movie ? this.mapMovieToResponse(movie) : null;
  }

  public async findByIdPublic(id: number): Promise<MovieResponse | null> {
    return this.findById(id);
  }

  public async create(
    data: CreateMovieDto,
    authorId: number
  ): Promise<MovieResponse> {
    const movie = await Movie.create({
      ...data,
      authorId,
    });

    const createdMovie = await this.findById(movie.id);
    if (!createdMovie) {
      throw new NotFoundError("Created movie not found");
    }

    return createdMovie;
  }

  public async update(
    id: number,
    data: UpdateMovieDto
  ): Promise<MovieResponse | null> {
    const [updatedCount] = await Movie.update(data, {
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
  ): Promise<MovieResponse | null> {
    const [updatedCount] = await Movie.update({ imgUrl }, { where: { id } });

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await Movie.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapMovieToResponse(movie: Movie): MovieResponse {
    return {
      id: movie.id,
      title: movie.title,
      synopsis: movie.synopsis,
      trailerUrl: movie.trailerUrl,
      imgUrl: movie.imgUrl,
      rating: movie.rating,
      genreId: movie.genreId,
      authorId: movie.authorId,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
      genre: movie.genre
        ? {
            id: movie.genre.id,
            name: movie.genre.name,
          }
        : null,
      author: movie.author
        ? {
            id: movie.author.id,
            username: movie.author.username,
            email: movie.author.email,
          }
        : null,
    };
  }
}
