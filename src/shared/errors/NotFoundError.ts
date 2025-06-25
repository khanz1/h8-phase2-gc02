import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", code?: string) {
    super(message, 404, code);
    this.name = "NotFoundError";
  }
}
