import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", code?: string) {
    super(message, 403, code);
    this.name = "ForbiddenError";
  }
}
