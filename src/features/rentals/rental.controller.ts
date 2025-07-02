import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import {
  RentalTypeService,
  RentalTransportationService,
} from "./rental.service";
import {
  createRentalTypeSchema,
  updateRentalTypeSchema,
  createRentalTransportationSchema,
  updateRentalTransportationSchema,
  rentalQuerySchema,
} from "./rental.types";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";
import { ResponseDTO } from "@/shared/utils/response.dto";

export class RentalTypeController {
  private readonly logger = new Logger(RentalTypeController.name);

  constructor(private readonly typeService: RentalTypeService) {}

  public getAllTypes = async (_: Request, res: Response) => {
    this.logger.info("Fetching all rental types");

    const types = await this.typeService.getAllTypes();

    res
      .status(200)
      .json(ResponseDTO.success("Rental types retrieved successfully", types));
  };

  public getTypeById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching rental type with ID: ${id}`);

    const type = await this.typeService.getTypeById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Rental type retrieved successfully", type));
  };

  public createType = async (req: Request, res: Response) => {
    const validatedData = createRentalTypeSchema.parse(req.body);
    this.logger.info("Creating new rental type:", validatedData);

    const type = await this.typeService.createType(validatedData);

    res
      .status(201)
      .json(ResponseDTO.success("Rental type created successfully", type));
  };

  public updateType = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateRentalTypeSchema.parse(req.body);
    this.logger.info(`Updating rental type ${id}:`, validatedData);

    const type = await this.typeService.updateType(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Rental type updated successfully", type));
  };

  public deleteType = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting rental type with ID: ${id}`);

    await this.typeService.deleteType(id);

    res
      .status(200)
      .json(ResponseDTO.success("Rental type deleted successfully"));
  };
}

export class RentalTransportationController {
  private readonly logger = new Logger(RentalTransportationController.name);

  constructor(
    private readonly transportationService: RentalTransportationService
  ) {}

  public getAllTransportations = async (_: Request, res: Response) => {
    this.logger.info("Fetching all rental transportations");

    const transportations =
      await this.transportationService.getAllTransportations();
    this.logger.info(`Fetched ${transportations.length} transportations`);

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Rental transportations retrieved successfully",
          transportations
        )
      );
  };

  public getTransportationById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching rental transportation with ID: ${id}`);

    const transportation =
      await this.transportationService.getTransportationById(id);

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Rental transportation retrieved successfully",
          transportation
        )
      );
  };

  public createTransportation = async (req: Request, res: Response) => {
    const validatedData = createRentalTransportationSchema.parse(req.body);
    const authorId = req.user!.userId;

    this.logger.info(
      `Creating new rental transportation by user ${authorId}:`,
      validatedData
    );

    const transportation =
      await this.transportationService.createTransportation(
        validatedData,
        authorId
      );

    res
      .status(201)
      .json(
        ResponseDTO.success(
          "Rental transportation created successfully",
          transportation
        )
      );
  };

  public updateTransportation = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateRentalTransportationSchema.parse(req.body);

    this.logger.info(`Updating rental transportation ${id}:`, validatedData);

    const transportation =
      await this.transportationService.updateTransportation(id, validatedData);

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Rental transportation updated successfully",
          transportation
        )
      );
  };

  public updateTransportationImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (!req.file) {
      throw new BadRequestError("No image file provided");
    }

    this.logger.info(`Updating image for rental transportation ${id}`);

    const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
      folder: "rental-transportations",
      transformation: {
        width: 1200,
        height: 800,
        crop: "limit",
        quality: "auto",
      },
    });

    const transportation =
      await this.transportationService.updateTransportationImage(
        id,
        uploadResult.secureUrl
      );

    res.status(200).json(
      ResponseDTO.success("Rental transportation image updated successfully", {
        ...transportation,
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

  public deleteTransportation = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting rental transportation with ID: ${id}`);

    await this.transportationService.deleteTransportation(id);

    res
      .status(200)
      .json(ResponseDTO.success("Rental transportation deleted successfully"));
  };
}

export class RentalPublicController {
  private readonly logger = new Logger(RentalPublicController.name);

  constructor(
    private readonly transportationService: RentalTransportationService,
    private readonly typeService: RentalTypeService
  ) {}

  public getAllTransportationsPublic = async (req: Request, res: Response) => {
    const validatedQuery = rentalQuerySchema.parse(req.query);
    this.logger.info(
      "Fetching public rental transportations with query:",
      validatedQuery
    );

    const result = await this.transportationService.getAllTransportationsPublic(
      validatedQuery
    );

    res
      .status(200)
      .json(
        ResponseDTO.successPaginated(
          "Rental transportations retrieved successfully",
          result.data,
          result.pagination
        )
      );
  };

  public getTransportationByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public rental transportation with ID: ${id}`);

    const transportation =
      await this.transportationService.getTransportationByIdPublic(id);

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Rental transportation retrieved successfully",
          transportation
        )
      );
  };

  public getAllTypesPublic = async (req: Request, res: Response) => {
    this.logger.info("Fetching all public rental types");
    const types = await this.typeService.getAllTypes();

    res
      .status(200)
      .json(ResponseDTO.success("Rental types retrieved successfully", types));
  };
}
