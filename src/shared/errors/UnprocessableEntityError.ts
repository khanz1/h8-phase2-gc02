import { AppError } from "./AppError";

export class UnprocessableEntityError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 422, code);
    this.name = "UnprocessableEntityError";
  }
}
