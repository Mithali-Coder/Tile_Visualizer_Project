import { verifyAdminToken } from "../utils/jwt.js";
import { findByIdWithTokenVersion } from "../repositories/admin.repository.js";

/**
 * Require a valid, non-stale Bearer token. On success attaches the admin
 * document (without password) to `req.admin`.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  let payload;
  try {
    payload = verifyAdminToken(token);
  } catch {
    return res.status(401).json({ error: "Invalid or expired session." });
  }

  const admin = await findByIdWithTokenVersion(payload.sub);
  if (!admin || admin.tokenVersion !== payload.tokenVersion) {
    // Admin deleted, or token was issued before a logout / password reset.
    return res.status(401).json({ error: "Invalid or expired session." });
  }

  req.admin = admin;
  next();
}

/** Require req.admin.role to be one of `roles`. Use after requireAuth. */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ error: "You do not have permission to do that." });
    }
    next();
  };
}
