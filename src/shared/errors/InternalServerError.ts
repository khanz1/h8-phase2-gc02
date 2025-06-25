import { AppError } from "./AppError";

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error", code?: string) {
    super(message, 500, code);
    this.name = "InternalServerError";
  }
}
