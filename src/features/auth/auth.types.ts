import { z } from "zod";
import { UserProfile } from "@/features/users/user.types";

// Validation schemas
export const RegisterRequestSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(50, "Username must be at most 50 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["Admin", "Staff", "User"]).optional().default("Staff"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

export const LoginRequestSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

// Type definitions from schemas
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// Response interfaces
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
    token: string;
  };
}

// Remove this interface since we're using it from users module

// Remove JWT payload from here since it's now in the helper

// Service method return types
export interface AuthServiceResponse {
  user: UserProfile;
  token: string;
  refreshToken?: string;
}
