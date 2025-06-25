import multer, { FileFilterCallback, MulterError } from "multer";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@/shared/errors";
import { Logger } from "@/config/logger";

export class UploadMiddleware {
  private static readonly logger = Logger.getInstance();
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
  ];

  /**
   * File filter for images only
   */
  private static fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void => {
    // Check if file is an image
    if (!file.mimetype.startsWith("image/")) {
      this.logger.warn("File upload rejected - not an image", {
        mimetype: file.mimetype,
        originalname: file.originalname,
      });
      return cb(new BadRequestError("Only image files are allowed"));
    }

    // Check allowed MIME types
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      this.logger.warn("File upload rejected - invalid MIME type", {
        mimetype: file.mimetype,
        originalname: file.originalname,
        allowedTypes: this.ALLOWED_MIME_TYPES,
      });
      return cb(
        new BadRequestError(
          `Invalid image type. Allowed types: ${this.ALLOWED_MIME_TYPES.join(
            ", "
          )}`
        )
      );
    }

    this.logger.debug("File upload accepted", {
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    });

    cb(null, true);
  };

  /**
   * Multer configuration for memory storage
   */
  private static upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: this.MAX_FILE_SIZE,
      files: 1, // Only allow single file upload
    },
    fileFilter: this.fileFilter,
  });

  /**
   * Single image upload middleware
   */
  public static singleImage = (fieldName: string = "file") => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const uploadSingle = this.upload.single(fieldName);

      uploadSingle(req, res, (error: any) => {
        if (error) {
          this.logger.error("File upload error", {
            error: error.message,
            code: error.code,
            field: error.field,
          });

          if (error instanceof MulterError) {
            switch (error.code) {
              case "LIMIT_FILE_SIZE":
                return next(
                  new BadRequestError(
                    `File too large. Maximum size allowed is ${Math.round(
                      this.MAX_FILE_SIZE / 1024 / 1024
                    )}MB`
                  )
                );
              case "LIMIT_FILE_COUNT":
                return next(new BadRequestError("Only one file is allowed"));
              case "LIMIT_UNEXPECTED_FILE":
                return next(
                  new BadRequestError(`Unexpected field: ${error.field}`)
                );
              default:
                return next(
                  new BadRequestError(`Upload error: ${error.message}`)
                );
            }
          }

          if (error instanceof BadRequestError) {
            return next(error);
          }

          return next(new BadRequestError("File upload failed"));
        }

        // Check if file was uploaded
        if (!req.file) {
          this.logger.warn("No file uploaded", {
            fieldName,
            body: req.body,
          });
          return next(new BadRequestError("No file uploaded"));
        }

        this.logger.info("File uploaded successfully", {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          fieldName,
        });

        next();
      });
    };
  };

  /**
   * Optional single image upload middleware (doesn't require file)
   */
  public static optionalSingleImage = (fieldName: string = "file") => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const uploadSingle = this.upload.single(fieldName);

      uploadSingle(req, res, (error: any) => {
        if (error) {
          this.logger.error("Optional file upload error", {
            error: error.message,
            code: error.code,
            field: error.field,
          });

          if (error instanceof MulterError) {
            switch (error.code) {
              case "LIMIT_FILE_SIZE":
                return next(
                  new BadRequestError(
                    `File too large. Maximum size allowed is ${Math.round(
                      this.MAX_FILE_SIZE / 1024 / 1024
                    )}MB`
                  )
                );
              case "LIMIT_FILE_COUNT":
                return next(new BadRequestError("Only one file is allowed"));
              case "LIMIT_UNEXPECTED_FILE":
                return next(
                  new BadRequestError(`Unexpected field: ${error.field}`)
                );
              default:
                return next(
                  new BadRequestError(`Upload error: ${error.message}`)
                );
            }
          }

          if (error instanceof BadRequestError) {
            return next(error);
          }

          return next(new BadRequestError("File upload failed"));
        }

        // File is optional, so continue even if no file
        if (req.file) {
          this.logger.info("Optional file uploaded successfully", {
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            fieldName,
          });
        } else {
          this.logger.debug("No optional file uploaded", { fieldName });
        }

        next();
      });
    };
  };

  /**
   * Get upload configuration info
   */
  public static getUploadInfo(): {
    maxFileSize: number;
    maxFileSizeMB: number;
    allowedMimeTypes: string[];
  } {
    return {
      maxFileSize: this.MAX_FILE_SIZE,
      maxFileSizeMB: Math.round(this.MAX_FILE_SIZE / 1024 / 1024),
      allowedMimeTypes: this.ALLOWED_MIME_TYPES,
    };
  }
}
