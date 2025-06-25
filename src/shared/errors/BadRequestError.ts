import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
    this.name = "BadRequestError";
  }
}
