import bcrypt from "bcryptjs";
import * as adminRepo from "../repositories/admin.repository.js";
import { signAdminToken } from "../utils/jwt.js";
import { createResetToken, hashResetToken } from "../utils/reset-token.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";
import { CLIENT_URL } from "../config/env.js";

const BCRYPT_ROUNDS = 10;

export class AuthError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Create a new admin account. Caller (controller) enforces who may do this. */
export async function registerAdmin({ name, email, password, role }) {
  const existing = await adminRepo.findByEmail(email);
  if (existing) throw new AuthError("An account with that email already exists.", 409);

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const admin = await adminRepo.createAdmin({ name, email, passwordHash, role });
  return admin;
}

/** Verify credentials and issue a session token. */
export async function authenticate({ email, password }) {
  const admin = await adminRepo.findByEmailWithPassword(email);
  if (!admin) throw new AuthError("Invalid email or password.", 401);

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) throw new AuthError("Invalid email or password.", 401);

  const token = signAdminToken({
    id: admin._id,
    role: admin.role,
    tokenVersion: admin.tokenVersion,
  });
  return { token, admin };
}

/** Invalidate all outstanding sessions for an admin (logout). */
export async function logout(adminId) {
  await adminRepo.invalidateSessions(adminId);
}

/**
 * Start the forgot-password flow. Always resolves the same way regardless of
 * whether the email is registered, to avoid user enumeration — the caller
 * should return a generic "if that email is registered…" response either way.
 */
export async function requestPasswordReset(email) {
  const admin = await adminRepo.findByEmail(email);
  if (!admin) return;

  const { token, tokenHash, expiresAt } = createResetToken();
  await adminRepo.setResetToken(admin._id, { tokenHash, expiresAt });

  const resetUrl = `${CLIENT_URL.replace(/\/+$/, "")}/reset-password?token=${token}`;
  await sendPasswordResetEmail({ to: admin.email, resetUrl });
}

/** Consume a reset token and set a new password. */
export async function resetPassword({ token, password }) {
  const tokenHash = hashResetToken(token);
  const admin = await adminRepo.findByResetTokenHash(tokenHash);
  if (!admin) throw new AuthError("This reset link is invalid or has expired.", 400);

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await adminRepo.resetPasswordAndInvalidateSessions(admin._id, passwordHash);
}
