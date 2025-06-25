import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 409, code);
    this.name = "ConflictError";
  }
}
