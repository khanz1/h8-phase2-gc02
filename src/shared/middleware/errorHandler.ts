import { Request, Response, NextFunction } from "express";
import { Logger } from "@/config/logger";
import { AppError } from "@/shared/errors";
import { ResponseDTO } from "../utils/response.dto";

export class ErrorHandler {
  private static readonly logger = Logger.getInstance();

  public static handle(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Log the error
    ErrorHandler.logger.error("Error occurred:", {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    // Handle different types of errors
    if (error instanceof AppError) {
      ErrorHandler.handleAppError(error, res);
    } else if (error.name === "ZodError") {
      ErrorHandler.handleZodError(error, res);
    } else if (error.name === "ValidationError") {
      ErrorHandler.handleValidationError(error, res);
    } else if (error.name === "SequelizeError") {
      ErrorHandler.handleSequelizeError(error, res);
    } else if (error.name === "JsonWebTokenError") {
      ErrorHandler.handleJWTError(error, res);
    } else {
      ErrorHandler.handleGenericError(error, res);
    }
  }

  private static handleAppError(error: AppError, res: Response): void {
    res.status(error.statusCode).json(
      ResponseDTO.failed(error.message, {
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      })
    );
  }

  private static handleZodError(error: any, res: Response): void {
    const formattedErrors =
      error.issues?.map((issue: any) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })) || [];

    res.status(400).json(
      ResponseDTO.failed(error.issues?.[0]?.message || "Validation failed", {
        message: error.issues?.[0]?.message || "Validation failed",
        code: "VALIDATION_ERROR",
        details: formattedErrors,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      })
    );
  }

  private static handleValidationError(error: Error, res: Response): void {
    res.status(400).json(
      ResponseDTO.failed("Validation failed", {
        message: "Validation failed",
        details: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      })
    );
  }

  private static handleSequelizeError(error: Error, res: Response): void {
    let statusCode = 500;
    let message = "Database error occurred";

    // Handle specific Sequelize errors
    if (error.name === "SequelizeUniqueConstraintError") {
      statusCode = 409;
      message = "Resource already exists";
    } else if (error.name === "SequelizeValidationError") {
      statusCode = 400;
      message = "Data validation failed";
    } else if (error.name === "SequelizeForeignKeyConstraintError") {
      statusCode = 400;
      message = "Foreign key constraint violation";
    }

    res.status(statusCode).json(
      ResponseDTO.failed(message, {
        message,
        ...(process.env.NODE_ENV === "development" && {
          details: error.message,
          stack: error.stack,
        }),
      })
    );
  }

  private static handleJWTError(error: Error, res: Response): void {
    let message = "Authentication failed";

    if (error.message === "jwt expired") {
      message = "Token has expired";
    } else if (error.message === "invalid token") {
      message = "Invalid token provided";
    }

    res.status(401).json(
      ResponseDTO.failed(message, {
        message,
        code: "AUTHENTICATION_ERROR",
      })
    );
  }

  private static handleGenericError(error: Error, res: Response): void {
    const statusCode = 500;
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message;

    res.status(statusCode).json(
      ResponseDTO.failed(message, {
        message,
        ...(process.env.NODE_ENV === "development" && {
          stack: error.stack,
        }),
      })
    );
  }
}
