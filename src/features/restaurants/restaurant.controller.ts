import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import {
  RestaurantCategoryService,
  RestaurantCuisineService,
} from "./restaurant.service";
import {
  createRestaurantCategorySchema,
  updateRestaurantCategorySchema,
  createRestaurantCuisineSchema,
  updateRestaurantCuisineSchema,
  cuisineQuerySchema,
} from "./restaurant.types";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";
import { ResponseDTO } from "@/shared/utils/response.dto";

export class RestaurantCategoryController {
  private readonly logger = new Logger(RestaurantCategoryController.name);

  constructor(private readonly categoryService: RestaurantCategoryService) {}

  public getAllCategories = async (_: Request, res: Response) => {
    this.logger.info("Fetching all restaurant categories");

    const categories = await this.categoryService.getAllCategories();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Restaurant categories retrieved successfully",
          categories
        )
      );
  };

  public getCategoryById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching restaurant category with ID: ${id}`);

    const category = await this.categoryService.getCategoryById(id);

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Restaurant category retrieved successfully",
          category
        )
      );
  };

  public createCategory = async (req: Request, res: Response) => {
    const validatedData = createRestaurantCategorySchema.parse(req.body);
    this.logger.info("Creating new restaurant category:", validatedData);

    const category = await this.categoryService.createCategory(validatedData);

    res
      .status(201)
      .json(
        ResponseDTO.success(
          "Restaurant category created successfully",
          category
        )
      );
  };

  public updateCategory = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateRestaurantCategorySchema.parse(req.body);
    this.logger.info(`Updating restaurant category ${id}:`, validatedData);

    const category = await this.categoryService.updateCategory(
      id,
      validatedData
    );

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Restaurant category updated successfully",
          category
        )
      );
  };

  public deleteCategory = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting restaurant category with ID: ${id}`);

    await this.categoryService.deleteCategory(id);

    res
      .status(200)
      .json(ResponseDTO.success("Restaurant category deleted successfully"));
  };
}

export class RestaurantCuisineController {
  private readonly logger = new Logger(RestaurantCuisineController.name);

  constructor(private readonly cuisineService: RestaurantCuisineService) {}

  public getAllCuisines = async (_: Request, res: Response) => {
    this.logger.info("Fetching all cuisines");

    const cuisines = await this.cuisineService.getAllCuisines();
    this.logger.info(`Fetched ${cuisines.length} cuisines`);

    res
      .status(200)
      .json(ResponseDTO.success("Cuisines retrieved successfully", cuisines));
  };

  public getCuisineById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching cuisine with ID: ${id}`);

    const cuisine = await this.cuisineService.getCuisineById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Cuisine retrieved successfully", cuisine));
  };

  public createCuisine = async (req: Request, res: Response) => {
    const validatedData = createRestaurantCuisineSchema.parse(req.body);
    const authorId = req.user!.userId;

    this.logger.info(
      `Creating new cuisine by user ${authorId}:`,
      validatedData
    );

    const cuisine = await this.cuisineService.createCuisine(
      validatedData,
      authorId
    );

    res
      .status(201)
      .json(ResponseDTO.success("Cuisine created successfully", cuisine));
  };

  public updateCuisine = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateRestaurantCuisineSchema.parse(req.body);

    this.logger.info(`Updating cuisine ${id}:`, validatedData);

    const cuisine = await this.cuisineService.updateCuisine(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Cuisine updated successfully", cuisine));
  };

  public updateCuisineImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (!req.file) {
      throw new BadRequestError("No image file provided");
    }

    this.logger.info(`Updating image for cuisine ${id}`);

    const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
      folder: "restaurant-cuisines",
      transformation: {
        width: 1200,
        height: 800,
        crop: "limit",
        quality: "auto",
      },
    });

    const cuisine = await this.cuisineService.updateCuisineImage(
      id,
      uploadResult.secureUrl
    );

    res.status(200).json(
      ResponseDTO.success("Cuisine image updated successfully", {
        ...cuisine,
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

  public deleteCuisine = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting cuisine with ID: ${id}`);

    await this.cuisineService.deleteCuisine(id);

    res.status(200).json(ResponseDTO.success("Cuisine deleted successfully"));
  };
}

export class RestaurantPublicController {
  private readonly logger = new Logger(RestaurantPublicController.name);

  constructor(
    private readonly cuisineService: RestaurantCuisineService,
    private readonly categoryService: RestaurantCategoryService
  ) {}

  public getAllCuisinesPublic = async (req: Request, res: Response) => {
    const validatedQuery = cuisineQuerySchema.parse(req.query);
    this.logger.info("Fetching public cuisines with query:", validatedQuery);

    const result = await this.cuisineService.getAllCuisinesPublic(
      validatedQuery
    );

    res
      .status(200)
      .json(
        ResponseDTO.successPaginated(
          "Cuisines retrieved successfully",
          result.data,
          result.pagination
        )
      );
  };

  public getCuisineByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public cuisine with ID: ${id}`);

    const cuisine = await this.cuisineService.getCuisineByIdPublic(id);

    res
      .status(200)
      .json(ResponseDTO.success("Cuisine retrieved successfully", cuisine));
  };

  public getAllCategoriesPublic = async (req: Request, res: Response) => {
    this.logger.info("Fetching all public restaurant categories");
    const categories = await this.categoryService.getAllCategories();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Restaurant categories retrieved successfully",
          categories
        )
      );
  };
}
