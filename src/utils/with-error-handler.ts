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

export function withErrorHandler<U extends RequestParams = RequestParams>(
  fn: RequestHandler<U>,
) {
  return async (request: NextRequest, requestParams: U) => {
    try {
      return await fn(request, requestParams);
    } catch (err) {
      return errorCreator(err);
    }
  };
}
