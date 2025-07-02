import jwt, { SignOptions, JwtPayload as BaseJwtPayload } from "jsonwebtoken";
import { Logger } from "@/config/logger";
import { UnauthorizedError } from "@/shared/errors";

export interface JwtPayload extends BaseJwtPayload {
  userId: number;
  email: string;
  role: "Admin" | "Staff" | "User";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JwtHelper {
  private static readonly logger = Logger.getInstance();
  private static readonly ACCESS_TOKEN_SECRET =
    process.env.JWT_SECRET || "your-access-secret-key";
  private static readonly REFRESH_TOKEN_SECRET =
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
  private static readonly ACCESS_TOKEN_EXPIRES_IN =
    process.env.JWT_EXPIRES_IN || "15m";
  private static readonly REFRESH_TOKEN_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  private static readonly ISSUER = "phase2-gc-api";
  private static readonly AUDIENCE = "phase2-gc-client";

  static {
    if (!process.env.JWT_SECRET) {
      this.logger.warn(
        "JWT_SECRET not found in environment variables, using default"
      );
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      this.logger.warn(
        "JWT_REFRESH_SECRET not found in environment variables, using default"
      );
    }
  }

  /**
   * Generate an access token
   */
  public static generateAccessToken(payload: {
    userId: number;
    email: string;
    role: "Admin" | "Staff" | "User";
  }): string {
    try {
      const tokenPayload: Omit<JwtPayload, "iat" | "exp"> = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      const options: SignOptions = {
        expiresIn: this.ACCESS_TOKEN_EXPIRES_IN as unknown as number,
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      };

      const token = jwt.sign(tokenPayload, this.ACCESS_TOKEN_SECRET, options);

      this.logger.debug("Access token generated successfully", {
        userId: payload.userId,
        email: payload.email,
      });

      return token;
    } catch (error) {
      this.logger.error("Failed to generate access token", { error });
      throw new Error("Failed to generate authentication token");
    }
  }

  /**
   * Generate a refresh token
   */
  public static generateRefreshToken(payload: {
    userId: number;
    email: string;
  }): string {
    try {
      const tokenPayload = {
        userId: payload.userId,
        email: payload.email,
      };

      const options: SignOptions = {
        expiresIn: this.REFRESH_TOKEN_EXPIRES_IN as unknown as number,
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      };

      const token = jwt.sign(tokenPayload, this.REFRESH_TOKEN_SECRET, options);

      this.logger.debug("Refresh token generated successfully", {
        userId: payload.userId,
        email: payload.email,
      });

      return token;
    } catch (error) {
      this.logger.error("Failed to generate refresh token", { error });
      throw new Error("Failed to generate refresh token");
    }
  }

  /**
   * Generate both access and refresh tokens
   */
  public static generateTokenPair(payload: {
    userId: number;
    email: string;
    role: "Admin" | "Staff" | "User";
  }): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify an access token
   */
  public static verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET, {
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      }) as JwtPayload;

      this.logger.debug("Access token verified successfully", {
        userId: decoded.userId,
        email: decoded.email,
      });

      return decoded;
    } catch (error) {
      this.logger.debug("Access token verification failed", { error });

      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Token expired, please login again");
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid token");
      }

      throw new UnauthorizedError("Token verification failed");
    }
  }

  /**
   * Verify a refresh token
   */
  public static verifyRefreshToken(token: string): {
    userId: number;
    email: string;
  } {
    try {
      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET, {
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      }) as { userId: number; email: string };

      this.logger.debug("Refresh token verified successfully", {
        userId: decoded.userId,
        email: decoded.email,
      });

      return decoded;
    } catch (error) {
      this.logger.debug("Refresh token verification failed", { error });

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Refresh token expired");
      }

      throw new UnauthorizedError("Refresh token verification failed");
    }
  }

  /**
   * Extract token from Authorization header
   */
  public static extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new UnauthorizedError("Access token is required");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Type of access token should be a Bearer token"
      );
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedError("Access token is required");
    }

    return token;
  }

  /**
   * Get token expiration info
   */
  public static getTokenInfo(): {
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
  } {
    return {
      accessTokenExpiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
      refreshTokenExpiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    };
  }
}
