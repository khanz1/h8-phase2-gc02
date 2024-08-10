import { errorCreator } from "@/utils/error-creator";
import { NextRequest, NextResponse } from "next/server";

type RequestHandler<U> = (
  request: NextRequest,
  params: U,
) => Promise<NextResponse>;

export interface RequestParams {
  searchParams: URLSearchParams;
  params?: Record<string, string>;
}

export function withErrorHandler<T extends RequestParams = RequestParams>(
  fn: RequestHandler<T>,
) {
  return async (request: NextRequest, requestParams: T) => {
    requestParams.searchParams = request.nextUrl.searchParams;
    try {
      return await fn(request, requestParams);
    } catch (err) {
      return errorCreator(err);
    }
  };
}
