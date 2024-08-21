import { MiddlewareFactory } from "@/defs/middleware-type";
import { extractUserFromHeader } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { ErrorMessage, ForbiddenError } from "@/utils/http-error";
import { UserRole } from "@prisma/client";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

let includePath = ["/add-user"];
let excludePath = ["null"];

export const withAuthorizationAdminOnly: MiddlewareFactory =
  (next: NextMiddleware) => async (req: NextRequest, _next: NextFetchEvent) => {
    let include = false;
    let exclude = false;

    includePath.forEach((path) => {
      if (req.nextUrl.pathname.includes(path)) {
        include = true;
      }
    });

    excludePath.forEach((path) => {
      if (req.nextUrl.pathname.includes(path)) {
        exclude = true;
      }
    });

    if (include && !exclude) {
      try {
        const user = extractUserFromHeader(req);

        if (user.role !== UserRole.Admin) {
          return errorCreator(new ForbiddenError(ErrorMessage.FORBIDDEN));
        }
      } catch (err) {
        return errorCreator(err);
      }
    }

    return next(req, _next);
  };
