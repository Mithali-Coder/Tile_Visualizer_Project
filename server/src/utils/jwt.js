import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

// Falls back to a random, process-local secret when JWT_SECRET is unset so
// local dev keeps working (server.js already warns about this at startup).
// Every restart invalidates existing tokens in that case, which is fine for
// dev but NOT for production — always set JWT_SECRET there.
const SECRET = JWT_SECRET || crypto.randomBytes(48).toString("hex");

/**
 * Sign a session token for an admin.
 * @param {{ id: string, role: string, tokenVersion: number }} admin
 * @returns {string}
 */
export function signAdminToken(admin) {
  return jwt.sign(
    { sub: String(admin.id), role: admin.role, tokenVersion: admin.tokenVersion },
    SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify a session token.
 * @param {string} token
 * @returns {{ sub: string, role: string, tokenVersion: number }}
 * @throws if the token is missing, malformed, or expired.
 */
export function verifyAdminToken(token) {
  return jwt.verify(token, SECRET);
}
