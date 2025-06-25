import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  AuthResponse,
} from "./auth.types";
import { Logger } from "@/config/logger";

export class AuthController {
  private readonly authService: AuthService;
  private readonly logger = Logger.getInstance();

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public addUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request body
      const validatedData = RegisterRequestSchema.parse(req.body);

      // Process user creation
      const result = await this.authService.addUser(validatedData);

      // Prepare response
      const response: AuthResponse = {
        success: true,
        message: "User added successfully",
        data: result,
      };

      this.logger.info(`User added successfully for: ${result.user.email}`);

      res.status(201).json(response);
    } catch (error) {
      this.logger.error("Add user controller error:", error);
      next(error);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request body
      const validatedData = LoginRequestSchema.parse(req.body);

      // Process login
      const result = await this.authService.login(validatedData);

      // Prepare response
      const response: AuthResponse = {
        success: true,
        message: "Login successful",
        data: result,
      };

      this.logger.info(`Login successful for: ${result.user.email}`);

      res.status(200).json(response);
    } catch (error) {
      this.logger.error("Login controller error:", error);
      next(error);
    }
  };
}
