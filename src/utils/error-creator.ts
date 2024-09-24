import { HttpError } from "@/utils/http-error";
import { JWTExpired } from "jose/errors";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const errorCreator = (
  err: unknown,
  code: number = 500,
): NextResponse => {
  console.log(err, err instanceof JWTExpired, "errorCreator");
  let statusCode = code;
  let errorMessage = "Internal Server Error";

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else if (err instanceof JWTExpired) {
    statusCode = 401;
    errorMessage = "Access token expired, please re-login";
  } else if (err && typeof err === "object" && "code" in err) {
    const prismaError = err as { code: string; meta?: any };
    if (
      prismaError.code === "P2002" &&
      prismaError.meta &&
      prismaError.meta.target &&
      Array.isArray(prismaError.meta.target)
    ) {
      statusCode = 400;
      errorMessage = `${prismaError.meta.target[0]} - Duplicate key`;
    } else if (
      prismaError.code === "P2003" &&
      prismaError.meta &&
      prismaError.meta.field_name
    ) {
      statusCode = 400;
      errorMessage = `${prismaError.meta.field_name} - Foreign key invalid`;
    }
  } else if (err instanceof ZodError) {
    const errPath = err.errors[0].path[0];
    const errMessage = err.errors[0].message;

    statusCode = 400;
    errorMessage = `${errPath} - ${errMessage}`;
  } else if (err instanceof Error) {
    if (
      err.message === "INVALID_TOKEN" ||
      err.name === "JWSSignatureVerificationFailed" ||
      err.name === "JWSInvalid" ||
      err.name === "gi" ||
      err.name === "jn" ||
      err.name === "ke"
    ) {
      statusCode = 401;
      errorMessage = "Invalid token";
    }
  }

  return NextResponse.json(
    {
      statusCode,
      error: errorMessage,
    },
    {
      status: statusCode,
    },
  );
};
