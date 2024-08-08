import { errorCreator } from "@/utils/error-creator";
import { NextRequest } from "next/server";

type Handler<T> = (request: NextRequest) => Promise<T>;

export function withErrorHandler<T>(fn: Handler<T>) {
  return async (request: NextRequest) => {
    try {
      return fn(request);
    } catch (err) {
      return errorCreator(err);
    }
  };
}
