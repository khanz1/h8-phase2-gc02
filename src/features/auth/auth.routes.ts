import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { AuthorizationMiddleware } from "@/shared/middleware/authorization.middleware";
import { Logger } from "@/config/logger";
import { RouteWrapper } from "@/shared/utils/route-wrapper";

export class AuthRoutes {
  private readonly router: Router;
  private readonly authController: AuthController;
  private readonly logger = Logger.getInstance();

  constructor() {
    this.router = Router();

    const authRepository = new AuthRepository();
    const authService = new AuthService(authRepository);
    this.authController = new AuthController(authService);

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/login",
      RouteWrapper.withErrorHandler(this.authController.login)
    );

    this.router.post(
      "/add-user",
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.requireAdmin,
      RouteWrapper.withErrorHandler(this.authController.addUser)
    );

    this.logger.info("✅ Auth routes configured successfully");
  }

  public getRouter(): Router {
    return this.router;
  }
}
