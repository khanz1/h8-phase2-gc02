import { AuthRepository } from "./auth.repository";
import {
  RegisterRequest,
  LoginRequest,
  AuthServiceResponse,
} from "./auth.types";
import { UserProfile } from "@/features/users/user.types";
import { JwtHelper, JwtPayload } from "@/shared/utils/jwt.helper";
import {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from "@/shared/errors";
import { Logger } from "@/config/logger";

export class AuthService {
  private readonly authRepository: AuthRepository;
  private readonly logger = Logger.getInstance();

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  public async addUser(
    userData: RegisterRequest
  ): Promise<AuthServiceResponse> {
    try {
      // Validate input data
      if (!userData.username || !userData.email || !userData.password) {
        throw new BadRequestError("Username, email and password are required");
      }

      // Create user through repository
      const user = await this.authRepository.createUser(userData);

      // Generate JWT tokens
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
    } catch (error) {
      this.logger.error("Add user failed:", error);
      throw error;
    }
  }

  public async login(credentials: LoginRequest): Promise<AuthServiceResponse> {
    try {
      // Validate input data
      if (!credentials.email || !credentials.password) {
        throw new BadRequestError("Email and password are required");
      }

      // Find user by email
      const user = await this.authRepository.findUserByEmail(credentials.email);

      // Verify password
      const isPasswordValid = await user.comparePassword(credentials.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
      }

      // Convert to UserProfile
      const userProfile: UserProfile = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Generate JWT tokens
      const tokens = JwtHelper.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      this.logger.info(`User logged in successfully: ${user.email}`);

      return {
        user: userProfile,
        token: tokens.accessToken,
      };
    } catch (error) {
      this.logger.error("Login failed:", error);
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError("Invalid email or password");
      }
      throw error;
    }
  }
}
