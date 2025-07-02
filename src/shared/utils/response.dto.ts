import { Response } from "express";

// Base response interface
interface BaseResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Success response interface
interface SuccessResponse extends BaseResponse {
  success: true;
  data: any;
}

// Failed response interface (for error handler)
interface FailedResponse extends BaseResponse {
  success: false;
  data?: any;
}

// Paginated response interface
interface PaginatedResponse extends BaseResponse {
  success: true;
  data: any;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Created response interface
interface CreatedResponse extends BaseResponse {
  success: true;
  data: any;
}

/**
 * Response DTO class for standardized API response transformation
 */
export class ResponseDTO {
  /**
   * Transform data to success response format
   * @param message - Success message
   * @param data - Response data
   * @returns SuccessResponse object
   */
  static success(message: string, data?: any): SuccessResponse {
    return {
      success: true,
      message,
      data: data || null,
    };
  }

  /**
   * Transform data to failed response format
   * @param message - Error message
   * @param data - Optional error data
   * @returns FailedResponse object
   */
  static failed(message: string, data?: any): FailedResponse {
    return {
      success: false,
      message,
      data,
    };
  }

  /**
   * Transform data to paginated success response format
   * @param message - Success message
   * @param data - Response data
   * @param meta - Pagination metadata
   * @returns PaginatedResponse object
   */
  static successPaginated(
    message: string,
    data: any,
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }
  ): PaginatedResponse {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  /**
   * Send a created response (201)
   * @param res - Express response object
   * @param message - Success message
   * @param data - Created resource data
   */
  static created(res: Response, message: string, data: any): Response {
    const response: CreatedResponse = {
      success: true,
      message,
      data,
    };

    return res.status(201).json(response);
  }
}

// Export types for external use
export type {
  BaseResponse,
  SuccessResponse,
  FailedResponse,
  PaginatedResponse,
  CreatedResponse,
};
