import { AuthRepository } from "./auth.repository";
import {
  RegisterRequest,
  LoginRequest,
  AuthServiceResponse,
} from "./auth.types";
import { JwtHelper } from "@/shared/utils/jwt.helper";
import {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from "@/shared/errors";
import { Logger } from "@/config/logger";

export class AuthService {
  private readonly authRepository: AuthRepository;
  private readonly logger = new Logger(AuthService.name);

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  public async addUser(
    userData: RegisterRequest
  ): Promise<AuthServiceResponse> {
    if (!userData.username || !userData.email || !userData.password) {
      throw new BadRequestError("Username, email and password are required");
    }

    const user = await this.authRepository.createUser(userData);

    const tokens = JwtHelper.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    this.logger.info(`User added successfully: ${user.email}`);

    return {
      user,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  public async login(credentials: LoginRequest): Promise<AuthServiceResponse> {
    try {
      if (!credentials.email || !credentials.password) {
        throw new BadRequestError("Email and password are required");
      }

      const user = await this.authRepository.findUserByEmail(credentials.email);

      // const isPasswordValid = await user.comparePassword(credentials.password);

      // if (!isPasswordValid) {
      //   throw new UnauthorizedError("Invalid email or password");
      // }

      const tokens = JwtHelper.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      this.logger.info(`User logged in successfully: ${user.email}`);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          address: user.address,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token: tokens.accessToken,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError("Invalid email or password");
      }
      throw error;
    }
  }
}
