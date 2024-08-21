import { MiddlewareFactory } from "@/defs/middleware-type";
import { errorCreator } from "@/utils/error-creator";
import { ErrorMessage, ForbiddenError } from "@/utils/http-error";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

let includePath = [
  "/apis/blog/categories",
  "/apis/branded-things/categories",
  "/apis/career-portal/companies",
  "/apis/movie/genres",
  "/apis/news-portal/categories",
  "/apis/rent-room/types",
  "/apis/rental-transportation/types",
  "/apis/restaurant-app/categories",
];

// check from process.env.PERMISSION_TO_DELETE_SECOND_ENTITY
const numberToCheck = Number(process.env.PERMISSION_TO_DELETE_SECOND_ENTITY);
const PERMISSION = isNaN(numberToCheck) ? false : numberToCheck > 0;

export const withEnableDeletion: MiddlewareFactory =
  (next: NextMiddleware) => async (req: NextRequest, _next: NextFetchEvent) => {
    let include = false;

    includePath.forEach((path) => {
      if (req.nextUrl.pathname.includes(path)) {
        include = true;
      }
    });

    if (include && req.method.toUpperCase() === "DELETE" && !PERMISSION) {
      return errorCreator(new ForbiddenError(ErrorMessage.FORBIDDEN_BY_ENV));
    }

    return next(req, _next);
  };
