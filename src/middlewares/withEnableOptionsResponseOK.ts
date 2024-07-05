import { MiddlewareFactory } from "@/defs/middleware-type";
import { errorCreator } from "@/utils/error-creator";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const includePath = ["/apis"];
const excludePath = ["null"];

export const withEnableOptionsResponse: MiddlewareFactory =
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
        if (req.method === "OPTIONS") {
          // Return OK
          return new NextResponse(null, { status: 200 });
        }
      } catch (err) {
        return errorCreator(err);
      }
    }

    return next(req, _next);
  };
