import { AdminLoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from "@shared/schemas/index.js";

/**
 * Validate a single value against one field of a zod object schema.
 * Returns the first error message, or null if valid.
 * @param {import("zod").ZodObject<any>} schema
 * @param {string} field
 * @param {unknown} value
 * @returns {string | null}
 */
function fieldError(schema, field, value) {
  const result = schema.shape[field].safeParse(value);
  return result.success ? null : result.error.issues[0]?.message || "Invalid value";
}

export function validateLoginEmail(value) {
  return fieldError(AdminLoginSchema, "email", value.trim());
}

export function validateLoginPassword(value) {
  return fieldError(AdminLoginSchema, "password", value);
}

export function validateForgotPasswordEmail(value) {
  return fieldError(ForgotPasswordSchema, "email", value.trim());
}

export function validateNewPassword(value) {
  return fieldError(ResetPasswordSchema, "password", value);
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Please confirm your new password.";
  if (password !== confirm) return "Passwords do not match.";
  return null;
}
