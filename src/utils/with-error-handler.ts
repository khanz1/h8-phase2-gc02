import { errorCreator } from "@/utils/error-creator";
import { NextRequest, NextResponse } from "next/server";

type RequestHandler<U> = (
  request: NextRequest,
  params: U,
) => Promise<NextResponse>;

type RequestParams = {
  searchParams?: Record<string, string>;
  params?: Record<string, string>;
};

export function withErrorHandler<T extends RequestParams = RequestParams>(
  fn: RequestHandler<T>,
) {
  return async (request: NextRequest, requestParams: T) => {
    try {
      return await fn(request, requestParams);
    } catch (err) {
      return errorCreator(err);
    }
  };
}
