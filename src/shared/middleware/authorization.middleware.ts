import { Request, Response, NextFunction } from "express";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/shared/errors";
import { Logger } from "@/config/logger";
import { Model, ModelStatic } from "sequelize";

interface OwnableModel extends Model {
  authorId: number;
}

export class AuthorizationMiddleware {
  private static readonly logger = Logger.getInstance();

  /**
   * Check if user has required role
   */
  public static requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        // Check if user is authenticated
        if (!req.user) {
          throw new UnauthorizedError("Authentication required");
        }

        // Check if user has required role
        if (!allowedRoles.includes(req.user.role)) {
          this.logger.warn("Authorization failed - insufficient role", {
            userId: req.user.userId,
            userRole: req.user.role,
            requiredRoles: allowedRoles,
            path: req.path,
            method: req.method,
          });

          throw new ForbiddenError(
            `Access denied. Required role: ${allowedRoles.join(" or ")}`
          );
        }

        this.logger.debug("Authorization successful", {
          userId: req.user.userId,
          userRole: req.user.role,
          path: req.path,
          method: req.method,
        });

        next();
      } catch (error) {
        next(error);
      }
    };
  };

  /**
   * Require admin role
   */
  public static requireAdmin = AuthorizationMiddleware.requireRole(["Admin"]);

  /**
   * Require admin or staff role
   */
  public static requireAdminOrStaff = AuthorizationMiddleware.requireRole([
    "Admin",
    "Staff",
  ]);

  /**
   * Check if user owns the resource or is admin
   */
  public static requireOwnership = (model: ModelStatic<OwnableModel>) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.user) {
          throw new UnauthorizedError("Authentication required");
        }

        const resourceId = parseInt(req.params.id);
        const resource = await model.findByPk(resourceId);

        if (!resource) {
          throw new NotFoundError("Resource not found");
        }

        if (
          req.user.role === "Staff" &&
          resource.authorId !== req.user.userId
        ) {
          this.logger.warn("Authorization failed - not owner or admin", {
            userId: req.user.userId,
            resourceId,
            userRole: req.user.role,
            path: req.path,
            method: req.method,
          });

          throw new ForbiddenError(
            "Access denied. You can only access your own resources"
          );
        }

        this.logger.debug("Ownership or admin authorization successful", {
          userId: req.user.userId,
          resourceId,
          userRole: req.user.role,
        });

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
