import {
  validate,
  RegisterAdminSchema,
  AdminLoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@tile-visualizer/shared/schemas/index.js";

/**
 * Build middleware that validates `req.body` against a Zod schema, replacing
 * it with the parsed/normalized data on success or responding 400 on failure.
 * @param {import("zod").ZodType} schema
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = validate(schema, req.body);
    if (!result.ok) {
      return res.status(400).json({ error: result.errors.join("; ") });
    }
    req.body = result.data;
    next();
  };
}

export const validateRegister = validateBody(RegisterAdminSchema);
export const validateLogin = validateBody(AdminLoginSchema);
export const validateForgotPassword = validateBody(ForgotPasswordSchema);
export const validateResetPassword = validateBody(ResetPasswordSchema);
