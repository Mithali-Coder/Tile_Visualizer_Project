import { z } from "zod";

/** Admin roles per the MongoDB `admins` collection spec. */
export const ADMIN_ROLES = ["admin", "superadmin"];

/** Admin document shape (shared contract for seeding + API DTOs). */
export const AdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ADMIN_ROLES).default("admin"),
});

/** Login request body. */
export const AdminLoginSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

/** POST /api/auth/register body (superadmin-only). */
export const RegisterAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ADMIN_ROLES).default("admin"),
});

/** POST /api/auth/forgot-password body. */
export const ForgotPasswordSchema = z.object({
  email: z.string().email("A valid email is required"),
});

/** POST /api/auth/reset-password body. */
export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
