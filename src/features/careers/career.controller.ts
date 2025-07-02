import { Request, Response } from "express";
import { Logger } from "@/config/logger";
import { CareerCompanyService, CareerJobService } from "./career.service";
import {
  createCareerCompanySchema,
  updateCareerCompanySchema,
  createCareerJobSchema,
  updateCareerJobSchema,
  careerQuerySchema,
} from "./career.types";
import { CloudinaryHelper } from "@/shared/utils/cloudinary.helper";
import { BadRequestError } from "@/shared/errors";
import { ResponseDTO } from "@/shared/utils/response.dto";

export class CareerCompanyController {
  private readonly logger = new Logger(CareerCompanyController.name);

  constructor(private readonly companyService: CareerCompanyService) {}

  public getAllCompanies = async (_: Request, res: Response) => {
    this.logger.info("Fetching all career companies");

    const companies = await this.companyService.getAllCompanies();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Career companies retrieved successfully",
          companies
        )
      );
  };

  public getCompanyById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching career company with ID: ${id}`);

    const company = await this.companyService.getCompanyById(id);

    res
      .status(200)
      .json(
        ResponseDTO.success("Career company retrieved successfully", company)
      );
  };

  public createCompany = async (req: Request, res: Response) => {
    const validatedData = createCareerCompanySchema.parse(req.body);
    this.logger.info("Creating new career company:", validatedData);

    const company = await this.companyService.createCompany(validatedData);

    res
      .status(201)
      .json(
        ResponseDTO.success("Career company created successfully", company)
      );
  };

  public updateCompany = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateCareerCompanySchema.parse(req.body);
    this.logger.info(`Updating career company ${id}:`, validatedData);

    const company = await this.companyService.updateCompany(id, validatedData);

    res
      .status(200)
      .json(
        ResponseDTO.success("Career company updated successfully", company)
      );
  };

  public deleteCompany = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting career company with ID: ${id}`);

    await this.companyService.deleteCompany(id);

    res
      .status(200)
      .json(ResponseDTO.success("Career company deleted successfully"));
  };
}

export class CareerJobController {
  private readonly logger = new Logger(CareerJobController.name);

  constructor(private readonly jobService: CareerJobService) {}

  public getAllJobs = async (_: Request, res: Response) => {
    this.logger.info("Fetching all career jobs");

    const jobs = await this.jobService.getAllJobs();
    this.logger.info(`Fetched ${jobs.length} career jobs`);

    res
      .status(200)
      .json(ResponseDTO.success("Career jobs retrieved successfully", jobs));
  };

  public getJobById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    this.logger.info(`Fetching career job with ID: ${id}`);

    const job = await this.jobService.getJobById(id);

    res
      .status(200)
      .json(ResponseDTO.success("Career job retrieved successfully", job));
  };

  public createJob = async (req: Request, res: Response) => {
    const validatedData = createCareerJobSchema.parse(req.body);
    const authorId = req.user!.userId;

    this.logger.info(
      `Creating new career job by user ${authorId}:`,
      validatedData
    );

    const job = await this.jobService.createJob(validatedData, authorId);

    res
      .status(201)
      .json(ResponseDTO.success("Career job created successfully", job));
  };

  public updateJob = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const validatedData = updateCareerJobSchema.parse(req.body);

    this.logger.info(`Updating career job ${id}:`, validatedData);

    const job = await this.jobService.updateJob(id, validatedData);

    res
      .status(200)
      .json(ResponseDTO.success("Career job updated successfully", job));
  };

  public updateJobImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (!req.file) {
      throw new BadRequestError("No image file provided");
    }

    this.logger.info(`Updating image for career job ${id}`);

    const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
      folder: "career-jobs",
      transformation: {
        width: 1200,
        height: 800,
        crop: "limit",
        quality: "auto",
      },
    });

    const job = await this.jobService.updateJobImage(
      id,
      uploadResult.secureUrl
    );

    res.status(200).json(
      ResponseDTO.success("Career job image updated successfully", {
        ...job,
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

  public deleteJob = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Deleting career job with ID: ${id}`);

    await this.jobService.deleteJob(id);

    res
      .status(200)
      .json(ResponseDTO.success("Career job deleted successfully"));
  };
}

export class CareerPublicController {
  private readonly logger = new Logger(CareerPublicController.name);

  constructor(
    private readonly jobService: CareerJobService,
    private readonly companyService: CareerCompanyService
  ) {}

  public getAllJobsPublic = async (req: Request, res: Response) => {
    const validatedQuery = careerQuerySchema.parse(req.query);
    this.logger.info("Fetching public career jobs with query:", validatedQuery);

    const result = await this.jobService.getAllJobsPublic(validatedQuery);

    res
      .status(200)
      .json(
        ResponseDTO.successPaginated(
          "Career jobs retrieved successfully",
          result.data,
          result.pagination
        )
      );
  };

  public getJobByIdPublic = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    this.logger.info(`Fetching public career job with ID: ${id}`);

    const job = await this.jobService.getJobByIdPublic(id);

    res
      .status(200)
      .json(ResponseDTO.success("Career job retrieved successfully", job));
  };

  public getAllCompaniesPublic = async (req: Request, res: Response) => {
    this.logger.info("Fetching all public career companies");
    const companies = await this.companyService.getAllCompanies();

    res
      .status(200)
      .json(
        ResponseDTO.success(
          "Career companies retrieved successfully",
          companies
        )
      );
  };
}
