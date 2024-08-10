import { UserJWTPayload } from "@/defs/jwt-payload";
import { MiddlewareFactory } from "@/defs/middleware-type";
import { errorCreator } from "@/utils/error-creator";
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
        const headersUserData = req.headers.get("x-custom-data-user");

        if (!headersUserData) {
          throw new Error("INVALID_TOKEN");
        }

        const parsedHeadersUserData: Pick<UserJWTPayload, "id" | "role"> =
          JSON.parse(headersUserData);

        if (parsedHeadersUserData.role !== UserRole.Admin) {
          throw new Error("FORBIDDEN");
        }
      } catch (err) {
        return errorCreator(err);
      }
    }

    return next(req, _next);
  };
