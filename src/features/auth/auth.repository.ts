import { User } from "@/features/users/user.model";
import { RegisterRequest } from "./auth.types";
import { UserProfile } from "@/features/users/user.types";
import { ConflictError, NotFoundError } from "@/shared/errors";
import { Logger } from "@/config/logger";

export class AuthRepository {
  private readonly logger = Logger.getInstance();

  public async createUser(userData: RegisterRequest): Promise<UserProfile> {
    try {
      // Check if user with email already exists
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new ConflictError("User with this email already exists");
      }

      // Create new user
      const newUser = await User.create(userData);

      this.logger.info(`New user created with email: ${userData.email}`);

      return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }

      this.logger.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  public async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      this.logger.error("Error finding user by email:", error);
      throw new Error("Failed to find user");
    }
  }

  public async findUserById(id: string): Promise<UserProfile> {
    try {
      const user = await User.findByPk(parseInt(id));

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      this.logger.error("Error finding user by ID:", error);
      throw new Error("Failed to find user");
    }
  }

  public async emailExists(email: string): Promise<boolean> {
    try {
      const user = await User.findOne({
        where: { email },
        attributes: ["id"],
      });

      return !!user;
    } catch (error) {
      this.logger.error("Error checking email existence:", error);
      return false;
    }
  }
}
