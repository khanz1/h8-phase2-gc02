import { User } from "@/features/users/user.model";
import { RegisterRequest } from "./auth.types";
import { UserProfile } from "@/features/users/user.types";
import { ConflictError, NotFoundError } from "@/shared/errors";
import { Logger } from "@/config/logger";

export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  public async createUser(userData: RegisterRequest): Promise<UserProfile> {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

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
  }

  public async findUserByEmail(email: string): Promise<User> {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  public async findUserById(id: string): Promise<UserProfile> {
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
  }

  public async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({
      where: { email },
      attributes: ["id"],
    });

    return !!user;
  }
}
