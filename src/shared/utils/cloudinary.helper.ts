import { v2 as cloudinary } from "cloudinary";
import { Logger } from "@/config/logger";
import { BadRequestError, InternalServerError } from "@/shared/errors";

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  };
  allowedFormats?: string[];
  maxFileSize?: number; // in bytes
}

export class CloudinaryHelper {
  private static readonly logger = Logger.getInstance();
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB default
  private static readonly ALLOWED_IMAGE_FORMATS = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "bmp",
    "svg",
  ];

  static {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Warn if environment variables are missing
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      this.logger.warn(
        "CLOUDINARY_CLOUD_NAME not found in environment variables"
      );
    }
    if (!process.env.CLOUDINARY_API_KEY) {
      this.logger.warn("CLOUDINARY_API_KEY not found in environment variables");
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
      this.logger.warn(
        "CLOUDINARY_API_SECRET not found in environment variables"
      );
    }
  }

  /**
   * Upload image to Cloudinary
   */
  public static async uploadImage(
    file: Express.Multer.File,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      // Validate file
      this.validateImageFile(file, options);

      const {
        folder = "uploads",
        transformation = {},
        allowedFormats = this.ALLOWED_IMAGE_FORMATS,
      } = options;

      this.logger.info("Uploading image to Cloudinary", {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        folder,
      });

      // Convert buffer to base64 data URL for Cloudinary
      const base64Data = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64Data, {
        folder,
        resource_type: "image",
        allowed_formats: allowedFormats,
        transformation: transformation,
        use_filename: true,
        unique_filename: true,
      });

      this.logger.info("Image uploaded successfully to Cloudinary", {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      });

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      };
    } catch (error) {
      this.logger.error("Failed to upload image to Cloudinary", {
        error,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      if (error instanceof BadRequestError) {
        throw error;
      }

      throw new InternalServerError("Failed to upload image");
    }
  }

  /**
   * Upload image from buffer
   */
  public static async uploadImageFromBuffer(
    buffer: Buffer,
    filename: string,
    mimetype: string,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      // Create a mock file object for validation
      const mockFile = {
        buffer,
        originalname: filename,
        mimetype,
        size: buffer.length,
      } as Express.Multer.File;

      // Validate file
      this.validateImageFile(mockFile, options);

      const {
        folder = "uploads",
        transformation = {},
        allowedFormats = this.ALLOWED_IMAGE_FORMATS,
      } = options;

      this.logger.info("Uploading image buffer to Cloudinary", {
        filename,
        mimetype,
        size: buffer.length,
        folder,
      });

      // Convert buffer to base64
      const base64 = `data:${mimetype};base64,${buffer.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64, {
        folder,
        resource_type: "image",
        allowed_formats: allowedFormats,
        transformation: [transformation],
        use_filename: true,
        unique_filename: true,
      });

      this.logger.info("Image buffer uploaded successfully to Cloudinary", {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      });

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      };
    } catch (error) {
      this.logger.error("Failed to upload image buffer to Cloudinary", {
        error,
        filename,
        mimetype,
        size: buffer.length,
      });

      if (error instanceof BadRequestError) {
        throw error;
      }

      throw new InternalServerError("Failed to upload image");
    }
  }

  /**
   * Delete image from Cloudinary
   */
  public static async deleteImage(publicId: string): Promise<void> {
    try {
      this.logger.info("Deleting image from Cloudinary", { publicId });

      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== "ok") {
        throw new Error(`Failed to delete image: ${result.result}`);
      }

      this.logger.info("Image deleted successfully from Cloudinary", {
        publicId,
      });
    } catch (error) {
      this.logger.error("Failed to delete image from Cloudinary", {
        error,
        publicId,
      });
      throw new InternalServerError("Failed to delete image");
    }
  }

  /**
   * Get optimized image URL
   */
  public static getOptimizedImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    const {
      width,
      height,
      crop = "fill",
      quality = "auto",
      format = "auto",
    } = options;

    return cloudinary.url(publicId, {
      transformation: [
        {
          width,
          height,
          crop,
          quality,
          fetch_format: format,
        },
      ],
    });
  }

  /**
   * Validate image file
   */
  private static validateImageFile(
    file: Express.Multer.File,
    options: UploadOptions
  ): void {
    const {
      maxFileSize = this.MAX_FILE_SIZE,
      allowedFormats = this.ALLOWED_IMAGE_FORMATS,
    } = options;

    // Check if file exists
    if (!file) {
      throw new BadRequestError("No file provided");
    }

    // Check file size
    if (file.size > maxFileSize) {
      throw new BadRequestError(
        `File size too large. Maximum allowed size is ${Math.round(
          maxFileSize / 1024 / 1024
        )}MB`
      );
    }

    // Check if it's an image
    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestError("File must be an image");
    }

    // Check allowed formats
    const fileExtension = file.originalname.split(".").pop()?.toLowerCase();
    if (fileExtension && !allowedFormats.includes(fileExtension)) {
      throw new BadRequestError(
        `Invalid file format. Allowed formats: ${allowedFormats.join(", ")}`
      );
    }

    // Additional MIME type validation
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/svg+xml",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestError(
        `Invalid MIME type. Allowed types: ${allowedMimeTypes.join(", ")}`
      );
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  public static extractPublicIdFromUrl(url: string): string | null {
    try {
      const regex = /\/(?:v\d+\/)?([^/.]+)(?:\.[^.]+)?$/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      this.logger.error("Failed to extract public ID from URL", { error, url });
      return null;
    }
  }

  /**
   * Check Cloudinary configuration
   */
  public static isConfigured(): boolean {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }
}
