import { UserJWTPayload } from "@/defs/jwt-payload";
import * as jwt from "jose";

const SECRET_KEY = process.env.JWT_SECRET || "secret";
const ENCODED_SECRET_KEY = new TextEncoder().encode(SECRET_KEY);

export const signPayload = async (payload: jwt.JWTPayload) => {
  return await new jwt.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(ENCODED_SECRET_KEY);
};

export const verifyToken = async (token: string) => {
  return await jwt.jwtVerify<UserJWTPayload>(token, ENCODED_SECRET_KEY);
};
