import { Request, Response, NextFunction } from "express";
import { JwtHelper, JwtPayload } from "@/shared/utils/jwt.helper";
import { UnauthorizedError } from "@/shared/errors";
import { Logger } from "@/config/logger";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export class AuthMiddleware {
  private static readonly logger = Logger.getInstance();

  /**
   * Authentication middleware - verifies JWT token
   */
  public static authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      this.logger.debug("Authentication middleware triggered", {
        path: req.path,
        method: req.method,
      });

      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      const token = JwtHelper.extractTokenFromHeader(authHeader);

      // Verify the token
      const decoded = JwtHelper.verifyAccessToken(token);

      // Attach user info to request
      req.user = decoded;

      this.logger.debug("Authentication successful", {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      });

      next();
    } catch (error) {
      this.logger.debug("Authentication failed", { error });
      next(error); // Pass error to error handler
    }
  };

  /**
   * Optional authentication middleware - doesn't throw if no token
   */
  public static optionalAuthenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        // No token provided, continue without user
        next();
        return;
      }

      const token = JwtHelper.extractTokenFromHeader(authHeader);
      const decoded = JwtHelper.verifyAccessToken(token);
      req.user = decoded;

      this.logger.debug("Optional authentication successful", {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      });

      next();
    } catch (error) {
      // For optional auth, we don't fail if token is invalid
      this.logger.debug("Optional authentication failed, continuing", {
        error,
      });
      next();
    }
  };
}
