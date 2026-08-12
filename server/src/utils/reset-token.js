import crypto from "node:crypto";
import { RESET_TOKEN_TTL_MINUTES } from "../config/env.js";

/**
 * Generate a single-use password-reset token.
 * The raw token is only ever emailed to the user; only its SHA-256 hash is
 * persisted, so a leaked database never exposes usable reset tokens.
 * @returns {{ token: string, tokenHash: string, expiresAt: Date }}
 */
export function createResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
  return { token, tokenHash: hashResetToken(token), expiresAt };
}

/** Hash a raw reset token for lookup/comparison against the stored hash. */
export function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
