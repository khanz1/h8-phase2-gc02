import bcrypt from "bcrypt";
import { Logger } from "@/config/logger";
import { UnauthorizedError } from "../errors";

export class BcryptHelper {
  private static readonly logger = Logger.getInstance();
  private static readonly DEFAULT_SALT_ROUNDS = 12;

  /**
   * Hash a password with bcrypt
   */
  public static async hashPassword(
    password: string,
    saltRounds: number = this.DEFAULT_SALT_ROUNDS
  ): Promise<string> {
    try {
      if (!password) {
        throw new Error("Password is required for hashing");
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      this.logger.debug("Password hashed successfully");

      return hashedPassword;
    } catch (error) {
      this.logger.error("Failed to hash password", { error });
      throw new Error("Password hashing failed");
    }
  }

  /**
   * Compare a plain text password with a hashed password
   */
  public static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      if (!plainPassword || !hashedPassword) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      this.logger.debug("Password comparison completed", { isMatch });

      return isMatch;
    } catch (error) {
      this.logger.error("Failed to compare passwords", { error });
      throw new UnauthorizedError("Invalid email or password");
    }
  }

  /**
   * Get the salt rounds used for hashing
   */
  public static getSaltRounds(): number {
    return this.DEFAULT_SALT_ROUNDS;
  }

  /**
   * Validate password strength
   */
  public static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!password) {
      errors.push("Password is required");
    } else {
      if (password.length < 6) {
        errors.push("Password must be at least 6 characters long");
      }

      if (password.length > 255) {
        errors.push("Password must not exceed 255 characters");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
