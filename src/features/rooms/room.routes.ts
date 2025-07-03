import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { UploadMiddleware } from "@/shared/middleware/upload.middleware";
import {
  RoomTypeController,
  RoomLodgingController,
  RoomPublicController,
} from "./room.controller";
import { RoomTypeRepository, RoomLodgingRepository } from "./room.repository";
import { RoomTypeService, RoomLodgingService } from "./room.service";
import { Logger } from "@/config/logger";
import { RoomLodging } from "./room.model";
import { RouteWrapper } from "@/shared/utils/route-wrapper";

export class RoomRoutes {
  private readonly router: Router;
  private readonly publicRouter: Router;
  private readonly typeController: RoomTypeController;
  private readonly lodgingController: RoomLodgingController;
  private readonly publicController: RoomPublicController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();
    this.publicRouter = Router();

    const typeRepository = new RoomTypeRepository();
    const lodgingRepository = new RoomLodgingRepository();

    const typeService = new RoomTypeService(typeRepository);
    const lodgingService = new RoomLodgingService(
      lodgingRepository,
      typeRepository
    );

    this.typeController = new RoomTypeController(typeService);
    this.lodgingController = new RoomLodgingController(lodgingService);
    this.publicController = new RoomPublicController(
      lodgingService,
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
      "/lodgings",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.lodgingController.getAllLodgings)
    );

    this.router.get(
      "/lodgings/:id",
      AuthMiddleware.authenticate,
      RouteWrapper.withErrorHandler(this.lodgingController.getLodgingById)
    );

    this.router.post(
      "/lodgings",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      RouteWrapper.withErrorHandler(this.lodgingController.createLodging)
    );

    this.router.put(
      "/lodgings/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(RoomLodging),
      RouteWrapper.withErrorHandler(this.lodgingController.updateLodging)
    );

    this.router.patch(
      "/lodgings/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(RoomLodging),
      UploadMiddleware.singleImage("file"),
      RouteWrapper.withErrorHandler(this.lodgingController.updateLodgingImage)
    );

    this.router.delete(
      "/lodgings/:id",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdminOrStaff,
      AuthorizationMiddleware.requireOwnership(RoomLodging),
      RouteWrapper.withErrorHandler(this.lodgingController.deleteLodging)
    );

    this.logger.info("✅ Room authenticated routes configured successfully");
  }

  private setupPublicRoutes(): void {
    this.publicRouter.get(
      "/lodgings",
      RouteWrapper.withErrorHandler(this.publicController.getAllLodgingsPublic)
    );

    this.publicRouter.get(
      "/lodgings/:id",
      RouteWrapper.withErrorHandler(this.publicController.getLodgingByIdPublic)
    );

    this.publicRouter.get(
      "/types",
      RouteWrapper.withErrorHandler(this.publicController.getAllTypesPublic)
    );

    this.logger.info("✅ Room public routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPublicRouter(): Router {
    return this.publicRouter;
  }
}
