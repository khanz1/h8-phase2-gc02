import { HttpError } from "@/utils/http-error";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Dirty hack to check if an object is an instance of a class
const isObjInstanceOfT = (obj: unknown, T: any) => {
  try {
    return obj instanceof T;
  } catch (e) {
    return false;
  }
};

export const errorCreator = (
  err: unknown,
  code: number = 500,
): NextResponse => {
  console.log(err, "errorCreator");
  let statusCode = code;
  let errorMessage = "Internal Server Error";

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    errorMessage = err.message;

    // Need to check this first,
    // since Prisma.PrismaClientKnownRequestError is an instance of Error
    // Dirty hack to get the error message
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (
      err.code === "P2002" &&
      err.meta &&
      err.meta.target &&
      Array.isArray(err.meta.target)
    ) {
      statusCode = 400;
      errorMessage = `${err.meta.target[0]} - Duplicate key`;
    } else if (err.code === "P2003" && err.meta && err.meta.field_name) {
      statusCode = 400;
      errorMessage = `${err.meta.field_name} - Foreign key invalid`;
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
      err.name === "JWTExpired" ||
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
