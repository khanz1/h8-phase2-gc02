import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import { RoomTypeService, RoomLodgingService } from "./room.service";
import {
  createRoomTypeSchema,
  updateRoomTypeSchema,
  createRoomLodgingSchema,
  updateRoomLodgingSchema,
  lodgingQuerySchema,
} from "./room.types";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";
import { ResponseDTO } from "@/shared/utils/response.dto";

export class RoomTypeController {
  private readonly logger = new Logger(RoomTypeController.name);

  constructor(private readonly typeService: RoomTypeService) {}

  public getAllTypes = async (_: Request, res: Response) => {
    this.logger.info("Fetching all room types");

    const types = await this.typeService.getAllTypes();

    res
      .status(200)
      .json(ResponseDTO.success("Room types retrieved successfully", types));
  };

  public getTypeById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching room type with ID: ${id}`);

    const type = await this.typeService.getTypeById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Room type retrieved successfully", type));
  };

  public createType = async (req: Request, res: Response) => {
    const validatedData = createRoomTypeSchema.parse(req.body);
    this.logger.info("Creating new room type:", validatedData);

    const type = await this.typeService.createType(validatedData);

    res
      .status(201)
      .json(ResponseDTO.success("Room type created successfully", type));
  };

  public updateType = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateRoomTypeSchema.parse(req.body);
    this.logger.info(`Updating room type ${id}:`, validatedData);

    const type = await this.typeService.updateType(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Room type updated successfully", type));
  };

  public deleteType = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting room type with ID: ${id}`);

    await this.typeService.deleteType(id);

    res.status(200).json(ResponseDTO.success("Room type deleted successfully"));
  };
}

export class RoomLodgingController {
  private readonly logger = new Logger(RoomLodgingController.name);

  constructor(private readonly lodgingService: RoomLodgingService) {}

  public getAllLodgings = async (_: Request, res: Response) => {
    this.logger.info("Fetching all lodgings");

    const lodgings = await this.lodgingService.getAllLodgings();
    this.logger.info(`Fetched ${lodgings.length} lodgings`);

    res
      .status(200)
      .json(ResponseDTO.success("Lodgings retrieved successfully", lodgings));
  };

  public getLodgingById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching lodging with ID: ${id}`);

    const lodging = await this.lodgingService.getLodgingById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Lodging retrieved successfully", lodging));
  };

  public createLodging = async (req: Request, res: Response) => {
    const validatedData = createRoomLodgingSchema.parse(req.body);
    const authorId = req.user!.userId;

    this.logger.info(
      `Creating new lodging by user ${authorId}:`,
      validatedData
    );

    const lodging = await this.lodgingService.createLodging(
      validatedData,
      authorId
    );

    res
      .status(201)
      .json(ResponseDTO.success("Lodging created successfully", lodging));
  };

  public updateLodging = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateRoomLodgingSchema.parse(req.body);

    this.logger.info(`Updating lodging ${id}:`, validatedData);

    const lodging = await this.lodgingService.updateLodging(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Lodging updated successfully", lodging));
  };

  public updateLodgingImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (!req.file) {
      throw new BadRequestError("No image file provided");
    }

    this.logger.info(`Updating image for lodging ${id}`);

    const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
      folder: "room-lodgings",
      transformation: {
        width: 1200,
        height: 800,
        crop: "limit",
        quality: "auto",
      },
    });

    const lodging = await this.lodgingService.updateLodgingImage(
      id,
      uploadResult.secureUrl
    );

    res.status(200).json(
      ResponseDTO.success("Lodging image updated successfully", {
        ...lodging,
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

  public deleteLodging = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting lodging with ID: ${id}`);

    await this.lodgingService.deleteLodging(id);

    res.status(200).json(ResponseDTO.success("Lodging deleted successfully"));
  };
}

export class RoomPublicController {
  private readonly logger = new Logger(RoomPublicController.name);

  constructor(
    private readonly lodgingService: RoomLodgingService,
    private readonly typeService: RoomTypeService
  ) {}

  public getAllLodgingsPublic = async (req: Request, res: Response) => {
    const validatedQuery = lodgingQuerySchema.parse(req.query);
    this.logger.info("Fetching public lodgings with query:", validatedQuery);

    const result = await this.lodgingService.getAllLodgingsPublic(
      validatedQuery
    );

    res
      .status(200)
      .json(
        ResponseDTO.successPaginated(
          "Lodgings retrieved successfully",
          result.data,
          result.pagination
        )
      );
  };

  public getLodgingByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public lodging with ID: ${id}`);

    const lodging = await this.lodgingService.getLodgingByIdPublic(id);

    res
      .status(200)
      .json(ResponseDTO.success("Lodging retrieved successfully", lodging));
  };

  public getAllTypesPublic = async (req: Request, res: Response) => {
    this.logger.info("Fetching all public room types");
    const types = await this.typeService.getAllTypes();

    res
      .status(200)
      .json(ResponseDTO.success("Room types retrieved successfully", types));
  };
}
