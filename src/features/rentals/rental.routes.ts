import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import {
  RentalTypeController,
  RentalTransportationController,
  RentalPublicController,
} from "./rental.controller";
import {
  RentalTypeRepository,
  RentalTransportationRepository,
} from "./rental.repository";
import {
  RentalTypeService,
  RentalTransportationService,
} from "./rental.service";
import { Logger } from "@/config/logger";
import { RentalTransportation } from "./rental.model";
import { RouteWrapper } from "@/shared/utils/route-wrapper";

export class RentalRoutes {
  private readonly router: Router;
  private readonly publicRouter: Router;
  private readonly typeController: RentalTypeController;
  private readonly transportationController: RentalTransportationController;
  private readonly publicController: RentalPublicController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();
    this.publicRouter = Router();

    const typeRepository = new RentalTypeRepository();
    const transportationRepository = new RentalTransportationRepository();

    const typeService = new RentalTypeService(typeRepository);
    const transportationService = new RentalTransportationService(
      transportationRepository,
      typeRepository
    );

    this.typeController = new RentalTypeController(typeService);
    this.transportationController = new RentalTransportationController(
      transportationService
    );
    this.publicController = new RentalPublicController(
      transportationService,
      typeService
    );

    this.setupAuthenticatedRoutes();
    this.setupPublicRoutes();
  }

  private setupAuthenticatedRoutes(): void {
    this.router.get(
      "/types",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.typeController.getAllTypes)
    );

    this.router.get(
      "/types/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.typeController.getTypeById)
    );

    this.router.post(
      "/types",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.typeController.createType)
    );

    this.router.put(
      "/types/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.typeController.updateType)
    );

    this.router.delete(
      "/types/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.typeController.deleteType)
    );

    this.router.get(
      "/transportations",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(
        this.transportationController.getAllTransportations
      )
    );

    this.router.get(
      "/transportations/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(
        this.transportationController.getTransportationById
      )
    );

    this.router.post(
      "/transportations",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      RouteWrapper.withErrorHandler(
        this.transportationController.createTransportation
      )
    );

    this.router.put(
      "/transportations/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(RentalTransportation),
      RouteWrapper.withErrorHandler(
        this.transportationController.updateTransportation
      )
    );

    this.router.patch(
      "/transportations/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(RentalTransportation),
      UploadMiddleware.singleImage("file"),
      RouteWrapper.withErrorHandler(
        this.transportationController.updateTransportationImage
      )
    );

    this.router.delete(
      "/transportations/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(RentalTransportation),
      RouteWrapper.withErrorHandler(
        this.transportationController.deleteTransportation
      )
    );

    this.logger.info("✅ Rental authenticated routes configured successfully");
  }

  private setupPublicRoutes(): void {
    this.publicRouter.get(
      "/transportations",
      RouteWrapper.withErrorHandler(
        this.publicController.getAllTransportationsPublic
      )
    );

    this.publicRouter.get(
      "/transportations/:id",
      RouteWrapper.withErrorHandler(
        this.publicController.getTransportationByIdPublic
      )
    );

    this.publicRouter.get(
      "/types",
      RouteWrapper.withErrorHandler(this.publicController.getAllTypesPublic)
    );

    this.logger.info("✅ Rental public routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPublicRouter(): Router {
    return this.publicRouter;
  }
}
