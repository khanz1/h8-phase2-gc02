import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import { ResponseDTO } from "@/shared/utils/response.dto";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";
import { AnimeService } from "./lecture.service";
import {
  CreateAnimeSchema,
  UpdateAnimeSchema,
  AnimeQuerySchema,
} from "./lecture.types";

export class AnimeController {
  private readonly logger = new Logger(AnimeController.name);

  constructor(private readonly animeService: AnimeService) {}

  public getAllAnimes = async (_: Request, res: Response) => {
    this.logger.info("Fetching all animes");

    const animes = await this.animeService.getAllAnimes();

    res
      .status(200)
      .json(ResponseDTO.success("Animes retrieved successfully", animes));
  };

  public getAnimeById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching anime with ID: ${id}`);

    const anime = await this.animeService.getAnimeById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Anime retrieved successfully", anime));
  };

  public createAnime = async (req: Request, res: Response) => {
    const validatedData = CreateAnimeSchema.parse(req.body);
    const authorId = req.user!.userId;

    this.logger.info(`Creating new anime by user ${authorId}:`, validatedData);

    const anime = await this.animeService.createAnime(validatedData, authorId);

    res
      .status(201)
      .json(ResponseDTO.success("Anime created successfully", anime));
  };

  public updateAnime = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = UpdateAnimeSchema.parse(req.body);

    this.logger.info(`Updating anime ${id}:`, validatedData);

    const anime = await this.animeService.updateAnime(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Anime updated successfully", anime));
  };

  public updateAnimeImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (!req.file) {
      throw new BadRequestError("No image file provided");
    }

    this.logger.info(`Updating image for anime ${id}`);

    const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
      folder: "animes",
      transformation: {
        width: 800,
        height: 1200,
        crop: "limit",
        quality: "auto",
      },
    });

    const anime = await this.animeService.updateAnimeImage(
      id,
      uploadResult.secureUrl
    );

    res.status(200).json(
      ResponseDTO.success("Anime image updated successfully", {
        ...anime,
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

  public deleteAnime = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting anime with ID: ${id}`);

    await this.animeService.deleteAnime(id);

    res.status(200).json(ResponseDTO.success("Anime deleted successfully"));
  };
}

export class AnimePublicController {
  private readonly logger = new Logger(AnimePublicController.name);

  constructor(private readonly animeService: AnimeService) {}

  public getAllAnimesPublic = async (req: Request, res: Response) => {
    const validatedQuery = AnimeQuerySchema.parse(req.query);
    this.logger.info("Fetching public animes with query:", validatedQuery);

    const result = await this.animeService.getAllAnimesPublic(validatedQuery);

    res
      .status(200)
      .json(
        ResponseDTO.successPaginated(
          "Animes retrieved successfully",
          result.animes,
          result.pagination
        )
      );
  };

  public getAnimeByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public anime with ID: ${id}`);

    const anime = await this.animeService.getAnimeByIdPublic(id);

    res
      .status(200)
      .json(ResponseDTO.success("Anime retrieved successfully", anime));
  };
}
