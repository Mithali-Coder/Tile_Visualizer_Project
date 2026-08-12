import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { rateLimit } from "../middleware/rate-limit.middleware.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../validators/auth.validators.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again in a few minutes.",
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many password reset requests. Please try again later.",
});

// Only an existing superadmin can create new admin accounts.
router.post(
  "/register",
  requireAuth,
  requireRole("superadmin"),
  validateRegister,
  authController.register
);

router.post("/login", loginLimiter, validateLogin, authController.login);
router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateForgotPassword,
  authController.forgotPassword
);
router.post("/reset-password", validateResetPassword, authController.resetPassword);

export default router;
