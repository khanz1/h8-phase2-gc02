import { Response } from "express";

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

interface BaseResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface SuccessResponse extends BaseResponse {
  success: true;
  data: any;
}

interface FailedResponse extends BaseResponse {
  success: false;
  data?: any;
  rateLimitInfo?: RateLimitInfo;
}

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
   * @param rateLimitInfo - Optional rate limit information (for 429 responses)
   * @returns FailedResponse object
   */
  static failed(
    message: string,
    data?: any,
    rateLimitInfo?: RateLimitInfo
  ): FailedResponse {
    const response: FailedResponse = {
      success: false,
      message,
      data,
    };

    if (rateLimitInfo) {
      response.rateLimitInfo = rateLimitInfo;
    }

    return response;
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

  /**
   * Helper method to extract rate limit info from response locals
   * @param res - Express response object
   * @returns RateLimitInfo or undefined
   */
  static getRateLimitInfo(res: Response): RateLimitInfo | undefined {
    return res.locals.rateLimitInfo as RateLimitInfo | undefined;
  }
}

export type {
  RateLimitInfo,
  BaseResponse,
  SuccessResponse,
  FailedResponse,
  PaginatedResponse,
  CreatedResponse,
};
