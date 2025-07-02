import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import {
  CareerCompanyController,
  CareerJobController,
  CareerPublicController,
} from "./career.controller";
import {
  CareerCompanyRepositoryImpl,
  CareerJobRepositoryImpl,
} from "./career.repository";
import { CareerCompanyService, CareerJobService } from "./career.service";
import { Logger } from "@/config/logger";
import { CareerJob } from "./career.model";
import { RouteWrapper } from "@/shared/utils/route-wrapper";

export class CareerRoutes {
  private readonly router: Router;
  private readonly publicRouter: Router;
  private readonly companyController: CareerCompanyController;
  private readonly jobController: CareerJobController;
  private readonly publicController: CareerPublicController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();
    this.publicRouter = Router();

    const companyRepository = new CareerCompanyRepositoryImpl();
    const jobRepository = new CareerJobRepositoryImpl();

    const companyService = new CareerCompanyService(companyRepository);
    const jobService = new CareerJobService(jobRepository, companyRepository);

    this.companyController = new CareerCompanyController(companyService);
    this.jobController = new CareerJobController(jobService);
    this.publicController = new CareerPublicController(
      jobService,
      companyService
    );

    this.setupAuthenticatedRoutes();
    this.setupPublicRoutes();
  }

  private setupAuthenticatedRoutes(): void {
    // Company routes
    this.router.get(
      "/companies",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.companyController.getAllCompanies)
    );

    this.router.get(
      "/companies/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.companyController.getCompanyById)
    );

    this.router.post(
      "/companies",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.companyController.createCompany)
    );

    this.router.put(
      "/companies/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.companyController.updateCompany)
    );

    this.router.delete(
      "/companies/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.companyController.deleteCompany)
    );

    // Job routes
    this.router.get(
      "/jobs",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.jobController.getAllJobs)
    );

    this.router.get(
      "/jobs/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.jobController.getJobById)
    );

    this.router.post(
      "/jobs",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      RouteWrapper.withErrorHandler(this.jobController.createJob)
    );

    this.router.put(
      "/jobs/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(CareerJob),
      RouteWrapper.withErrorHandler(this.jobController.updateJob)
    );

    this.router.patch(
      "/jobs/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(CareerJob),
      UploadMiddleware.singleImage("file"),
      RouteWrapper.withErrorHandler(this.jobController.updateJobImage)
    );

    this.router.delete(
      "/jobs/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(CareerJob),
      RouteWrapper.withErrorHandler(this.jobController.deleteJob)
    );

    this.logger.info("✅ Career authenticated routes configured successfully");
  }

  private setupPublicRoutes(): void {
    this.publicRouter.get(
      "/jobs",
      RouteWrapper.withErrorHandler(this.publicController.getAllJobsPublic)
    );

    this.publicRouter.get(
      "/jobs/:id",
      RouteWrapper.withErrorHandler(this.publicController.getJobByIdPublic)
    );

    this.publicRouter.get(
      "/companies",
      RouteWrapper.withErrorHandler(this.publicController.getAllCompaniesPublic)
    );

    this.logger.info("✅ Career public routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPublicRouter(): Router {
    return this.publicRouter;
  }
}
