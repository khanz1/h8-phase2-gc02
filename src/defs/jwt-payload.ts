import * as jwt from "jose";

export interface UserJWTPayload extends jwt.JWTPayload {
  id: number;
  role: string;
}
