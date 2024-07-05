import { MiddlewareFactory } from "@/defs/middleware-type";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";

export function stackMiddlewares(
  functions: MiddlewareFactory[] = [],
  index = 0,
): NextMiddleware {
  const current = functions[index];

  if (current) {
    const next = stackMiddlewares(functions, index + 1);
    return current(next);
  }

  return (req: NextRequest) => {
    // https://github.com/vercel/next.js/discussions/34263 (OBSOLETE)
    // const clonedRequest = req.clone();
    // clonedRequest.headers.set("user", JSON.stringify(req.headers.get("user")));
    // return NextResponse.rewrite(req.url.toString(), { request: clonedRequest });

    // You can set request and response headers using the NextResponse API (setting request headers is available since Next.js v13.0.0).

    // This headers contain the "user" data within "x-custom-data-user" key
    // const headers = new Headers();
    // headers.set(
    //   "x-custom-data-user",
    //   JSON.stringify(req.headers.get("x-custom-data-user"))
    // );

    // Pass the headers to the next middleware (or to the route handler)

    const clonedRequest = req.clone();

    // ?? Need to use the request instead of headers to not expose the data to the client
    return NextResponse.next({
      request: clonedRequest,
    });
  };
}
