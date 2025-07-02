import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import { MovieGenreService, MovieService } from "./movie.service";
import {
  createMovieGenreSchema,
  updateMovieGenreSchema,
  createMovieSchema,
  updateMovieSchema,
  movieQuerySchema,
} from "./movie.types";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";
import { ResponseDTO } from "@/shared/utils/response.dto";

export class MovieGenreController {
  private readonly logger = new Logger(MovieGenreController.name);

  constructor(private readonly genreService: MovieGenreService) {}

  public getAllGenres = async (_: Request, res: Response) => {
    this.logger.info("Fetching all movie genres");

    const genres = await this.genreService.getAllGenres();

    res
      .status(200)
      .json(ResponseDTO.success("Movie genres retrieved successfully", genres));
  };

  public getGenreById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching movie genre with ID: ${id}`);

    const genre = await this.genreService.getGenreById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Movie genre retrieved successfully", genre));
  };

  public createGenre = async (req: Request, res: Response) => {
    const validatedData = createMovieGenreSchema.parse(req.body);
    this.logger.info("Creating new movie genre:", validatedData);

    const genre = await this.genreService.createGenre(validatedData);

    res
      .status(201)
      .json(ResponseDTO.success("Movie genre created successfully", genre));
  };

  public updateGenre = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateMovieGenreSchema.parse(req.body);
    this.logger.info(`Updating movie genre ${id}:`, validatedData);

    const genre = await this.genreService.updateGenre(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Movie genre updated successfully", genre));
  };

  public deleteGenre = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting movie genre with ID: ${id}`);

    await this.genreService.deleteGenre(id);

    res
      .status(200)
      .json(ResponseDTO.success("Movie genre deleted successfully"));
  };
}

export class MovieController {
  private readonly logger = new Logger(MovieController.name);

  constructor(private readonly movieService: MovieService) {}

  public getAllMovies = async (_: Request, res: Response) => {
    this.logger.info("Fetching all movies");

    const movies = await this.movieService.getAllMovies();
    this.logger.info(`Fetched ${movies.length} movies`);

    res
      .status(200)
      .json(ResponseDTO.success("Movies retrieved successfully", movies));
  };

  public getMovieById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching movie with ID: ${id}`);

    const movie = await this.movieService.getMovieById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Movie retrieved successfully", movie));
  };

  public createMovie = async (req: Request, res: Response) => {
    const validatedData = createMovieSchema.parse(req.body);
    const authorId = req.user!.userId;

    this.logger.info(`Creating new movie by user ${authorId}:`, validatedData);

    const movie = await this.movieService.createMovie(validatedData, authorId);

    res
      .status(201)
      .json(ResponseDTO.success("Movie created successfully", movie));
  };

  public updateMovie = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateMovieSchema.parse(req.body);

    this.logger.info(`Updating movie ${id}:`, validatedData);

    const movie = await this.movieService.updateMovie(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Movie updated successfully", movie));
  };

  public updateMovieImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (!req.file) {
      throw new BadRequestError("No image file provided");
    }

    this.logger.info(`Updating image for movie ${id}`);

    const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
      folder: "movies",
      transformation: {
        width: 1200,
        height: 800,
        crop: "limit",
        quality: "auto",
      },
    });

    const movie = await this.movieService.updateMovieImage(
      id,
      uploadResult.secureUrl
    );

    res.status(200).json(
      ResponseDTO.success("Movie image updated successfully", {
        ...movie,
        uploadInfo: {
          publicId: uploadResult.publicId,
          url: uploadResult.secureUrl,
          format: uploadResult.format,
          width: uploadResult.width,
          height: uploadResult.height,
          bytes: uploadResult.bytes,
        },
      })
    );
  };

  public deleteMovie = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting movie with ID: ${id}`);

    await this.movieService.deleteMovie(id);

    res.status(200).json(ResponseDTO.success("Movie deleted successfully"));
  };
}

export class MoviePublicController {
  private readonly logger = new Logger(MoviePublicController.name);

  constructor(
    private readonly movieService: MovieService,
    private readonly genreService: MovieGenreService
  ) {}

  public getAllMoviesPublic = async (req: Request, res: Response) => {
    const validatedQuery = movieQuerySchema.parse(req.query);
    this.logger.info("Fetching public movies with query:", validatedQuery);

    const result = await this.movieService.getAllMoviesPublic(validatedQuery);

    res
      .status(200)
      .json(
        ResponseDTO.successPaginated(
          "Movies retrieved successfully",
          result.data,
          result.pagination
        )
      );
  };

  public getMovieByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public movie with ID: ${id}`);

    const movie = await this.movieService.getMovieByIdPublic(id);

    res
      .status(200)
      .json(ResponseDTO.success("Movie retrieved successfully", movie));
  };

  public getAllGenresPublic = async (req: Request, res: Response) => {
    this.logger.info("Fetching all public movie genres");
    const genres = await this.genreService.getAllGenres();

    res
      .status(200)
      .json(ResponseDTO.success("Movie genres retrieved successfully", genres));
  };
}
