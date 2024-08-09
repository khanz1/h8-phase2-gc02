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
  console.log(err, "<<< e", err instanceof ZodError);
  let statusCode = code;
  let errorMessage = "Internal Server Error";

  // Need to check this first,
  // since Prisma.PrismaClientKnownRequestError is an instance of Error
  if (isObjInstanceOfT(err, Prisma.PrismaClientKnownRequestError)) {
    // Dirty hack to get the error message
    let newError = err as Prisma.PrismaClientKnownRequestError;

    if (
      newError.code === "P2002" &&
      newError.meta &&
      newError.meta.target &&
      Array.isArray(newError.meta.target)
    ) {
      statusCode = 400;
      errorMessage = `${newError.meta.target[0]} - Duplicate key`;
    } else if (
      newError.code === "P2003" &&
      newError.meta &&
      newError.meta.field_name
    ) {
      statusCode = 400;
      errorMessage = `${newError.meta.field_name} - Foreign key invalid`;
    }
  } else if (err instanceof HttpError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else if (err instanceof ZodError) {
    const errPath = err.errors[0].path[0];
    const errMessage = err.errors[0].message;

    statusCode = 400;
    errorMessage = `${errPath} - ${errMessage}`;
  } else if (err instanceof Error) {
    if (err.message === "INVALID_CONTENT_TYPE") {
      statusCode = 400;
      errorMessage = "Invalid content type";
    } else if (err.message === "POST_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Post not found";
    } else if (err.message === "CATEGORY_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Category not found";
    } else if (err.message === "PRODUCT_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Product not found";
    } else if (err.message === "MOVIE_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Movie not found";
    } else if (err.message === "JOB_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Job not found";
    } else if (err.message === "ARTICLE_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Article not found";
    } else if (err.message === "LODGING_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Lodging not found";
    } else if (err.message === "TRANSPORTATION_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Transportation not found";
    } else if (err.message === "CUISINE_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Cuisine not found";
    } else if (err.message === "COMPANY_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Company not found";
    } else if (err.message === "GENRE_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Genre not found";
    } else if (err.message === "TYPE_NOT_FOUND") {
      statusCode = 404;
      errorMessage = "Type not found";
    } else if (
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
    } else if (err.message === "INVALID_CREDENTIALS") {
      statusCode = 401;
      errorMessage = "Invalid credentials";
    } else if (err.message === "FORBIDDEN") {
      statusCode = 403;
      errorMessage = "Unauthorized - Not enough permission to do this action";
    } else if (err.message === "FORBIDDEN_BY_ENV") {
      statusCode = 403;
      errorMessage =
        "Unauthorized - For sharing purpose, this action is disabled";
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
