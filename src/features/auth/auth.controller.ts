import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterRequestSchema, LoginRequestSchema } from "./auth.types";
import { Logger } from "@/config/logger";
import { ResponseDTO } from "@/shared/utils/response.dto";

export class AuthController {
  private readonly authService: AuthService;
  private readonly logger = new Logger(AuthController.name);

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public addUser = async (req: Request, res: Response): Promise<void> => {
    const validatedData = RegisterRequestSchema.parse(req.body);

    const result = await this.authService.addUser(validatedData);
    this.logger.info(`User added successfully for: ${result.user.email}`);

    res
      .status(201)
      .json(ResponseDTO.success("User added successfully", result));
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const validatedData = LoginRequestSchema.parse(req.body);

    const result = await this.authService.login(validatedData);
    this.logger.info(`Login successful for: ${result.user.email}`);

    res.status(200).json(ResponseDTO.success("Login successful", result));
  };
}
