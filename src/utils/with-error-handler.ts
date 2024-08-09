import { ApiResponse } from "@/defs/custom-response";
import { errorCreator } from "@/utils/error-creator";
import { NextRequest, NextResponse } from "next/server";

type RequestHandler<T, U> = (
  request: NextRequest,
  params: U,
) => Promise<NextResponse<ApiResponse<T>>>;
type RequestParams = {
  searchParams?: Record<string, string>;
  params?: Record<string, string>;
};

export function withErrorHandler<T, U extends RequestParams = RequestParams>(
  fn: RequestHandler<T, U>,
) {
  return async (request: NextRequest, requestParams: U) => {
    try {
      return await fn(request, requestParams);
    } catch (err) {
      return errorCreator(err);
    }
  };
}
