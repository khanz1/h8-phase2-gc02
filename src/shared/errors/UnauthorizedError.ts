import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", code?: string) {
    super(message, 401, code);
    this.name = "UnauthorizedError";
  }
}
