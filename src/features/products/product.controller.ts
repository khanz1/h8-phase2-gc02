import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import {
  BrandedCategoryService,
  BrandedProductService,
} from "./product.service";
import {
  createBrandedCategorySchema,
  updateBrandedCategorySchema,
  createBrandedProductSchema,
  updateBrandedProductSchema,
  productQuerySchema,
} from "./product.types";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";
import { ResponseDTO } from "@/shared/utils/response.dto";

export class BrandedCategoryController {
  private readonly logger = new Logger(BrandedCategoryController.name);

  constructor(private readonly categoryService: BrandedCategoryService) {}

  public getAllCategories = async (_: Request, res: Response) => {
    this.logger.info("Fetching all product categories");

    const categories = await this.categoryService.getAllCategories();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Product categories retrieved successfully",
          categories
        )
      );
  };

  public getCategoryById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching product category with ID: ${id}`);

    const category = await this.categoryService.getCategoryById(id);

    res
      .status(200)
      .json(
        ResponseDTO.success("Product category retrieved successfully", category)
      );
  };

  public createCategory = async (req: Request, res: Response) => {
    const validatedData = createBrandedCategorySchema.parse(req.body);
    this.logger.info("Creating new product category:", validatedData);

    const category = await this.categoryService.createCategory(validatedData);

    res
      .status(201)
      .json(
        ResponseDTO.success("Product category created successfully", category)
      );
  };

  public updateCategory = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateBrandedCategorySchema.parse(req.body);
    this.logger.info(`Updating product category ${id}:`, validatedData);

    const category = await this.categoryService.updateCategory(
      id,
      validatedData
    );

    res
      .status(200)
      .json(
        ResponseDTO.success("Product category updated successfully", category)
      );
  };

  public deleteCategory = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting product category with ID: ${id}`);

    await this.categoryService.deleteCategory(id);

    res
      .status(200)
      .json(ResponseDTO.success("Product category deleted successfully"));
  };
}

export class BrandedProductController {
  private readonly logger = new Logger(BrandedProductController.name);

  constructor(private readonly productService: BrandedProductService) {}

  public getAllProducts = async (_: Request, res: Response) => {
    this.logger.info("Fetching all products");

    const products = await this.productService.getAllProducts();
    this.logger.info(`Fetched ${products.length} products`);

    res
      .status(200)
      .json(ResponseDTO.success("Products retrieved successfully", products));
  };

  public getProductById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching product with ID: ${id}`);

    const product = await this.productService.getProductById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Product retrieved successfully", product));
  };

  public createProduct = async (req: Request, res: Response) => {
    const validatedData = createBrandedProductSchema.parse(req.body);
    const authorId = req.user!.userId;

    this.logger.info(
      `Creating new product by user ${authorId}:`,
      validatedData
    );

    const product = await this.productService.createProduct(
      validatedData,
      authorId
    );

    res
      .status(201)
      .json(ResponseDTO.success("Product created successfully", product));
  };

  public updateProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateBrandedProductSchema.parse(req.body);

    this.logger.info(`Updating product ${id}:`, validatedData);

    const product = await this.productService.updateProduct(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Product updated successfully", product));
  };

  public updateProductImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (!req.file) {
      throw new BadRequestError("No image file provided");
    }

    this.logger.info(`Updating image for product ${id}`);

    const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
      folder: "branded-products",
      transformation: {
        width: 1200,
        height: 800,
        crop: "limit",
        quality: "auto",
      },
    });

    const product = await this.productService.updateProductImage(
      id,
      uploadResult.secureUrl
    );

    res.status(200).json(
      ResponseDTO.success("Product image updated successfully", {
        ...product,
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

  public deleteProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting product with ID: ${id}`);

    await this.productService.deleteProduct(id);

    res.status(200).json(ResponseDTO.success("Product deleted successfully"));
  };
}

export class ProductPublicController {
  private readonly logger = new Logger(ProductPublicController.name);

  constructor(
    private readonly productService: BrandedProductService,
    private readonly categoryService: BrandedCategoryService
  ) {}

  public getAllProductsPublic = async (req: Request, res: Response) => {
    const validatedQuery = productQuerySchema.parse(req.query);
    this.logger.info("Fetching public products with query:", validatedQuery);

    const result = await this.productService.getAllProductsPublic(
      validatedQuery
    );

    res
      .status(200)
      .json(
        ResponseDTO.successPaginated(
          "Products retrieved successfully",
          result.data,
          result.pagination
        )
      );
  };

  public getProductByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public product with ID: ${id}`);

    const product = await this.productService.getProductByIdPublic(id);

    res
      .status(200)
      .json(ResponseDTO.success("Product retrieved successfully", product));
  };

  public getAllCategoriesPublic = async (req: Request, res: Response) => {
    this.logger.info("Fetching all public product categories");
    const categories = await this.categoryService.getAllCategories();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Product categories retrieved successfully",
          categories
        )
      );
  };
}
