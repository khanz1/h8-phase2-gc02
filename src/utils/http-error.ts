export enum ErrorMessage {
  INVALID_TOKEN = "Invalid token",
  INVALID_LOGIN = "Invalid credentials",
  INVALID_CONTENT_TYPE = "Invalid content type",
  FORBIDDEN = "Unauthorized - Not enough permission to do this action",
  CATEGORY_NOT_FOUND = "Category not found",
  POST_NOT_FOUND = "Post not found",
  PRODUCT_NOT_FOUND = "Product not found",
  MOVIE_NOT_FOUND = "Movie not found",
  JOB_NOT_FOUND = "Job not found",
  ARTICLE_NOT_FOUND = "Article not found",
  LODGING_NOT_FOUND = "Lodging not found",
  TRANSPORTATION_NOT_FOUND = "Transportation not found",
  CUISINE_NOT_FOUND = "Cuisine not found",
  COMPANY_NOT_FOUND = "Company not found",
  GENRE_NOT_FOUND = "Genre not found",
  TYPE_NOT_FOUND = "Type not found",
  FORBIDDEN_BY_ENV = "Unauthorized - For sharing purpose, this action is disabled",
}

export class HttpError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad Request") {
    super(message, 400);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found") {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
