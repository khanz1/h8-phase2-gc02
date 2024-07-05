import { MiddlewareFactory } from "@/defs/middleware-type";
import { errorCreator } from "@/utils/error-creator";
import { verifyToken } from "@/utils/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

const includePath = ["/apis"];
const excludePath = ["/apis/login", "/apis/pub"];

export const withAuthentication: MiddlewareFactory =
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
        const headerAuthorization = req.headers.get("authorization");

        if (!headerAuthorization) {
          throw new Error("INVALID_TOKEN");
        }

        const token = headerAuthorization.split(" ")[1];

        if (!token) {
          throw new Error("INVALID_TOKEN");
        }

        const payload = await verifyToken(token);

        const customHeaderPayload = {
          id: payload.payload.id,
          role: payload.payload.role,
        };

        /*
          Middleware allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.

          Middleware can only modify "headers" and "status" of the response. It cannot have additional data in the request or response body.
        */

        req.headers.set(
          "x-custom-data-user",
          JSON.stringify(customHeaderPayload),
        );
      } catch (err) {
        return errorCreator(err);
      }
    }

    return next(req, _next);
  };
