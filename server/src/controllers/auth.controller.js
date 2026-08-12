import * as authService from "../services/auth.service.js";

function handleAuthError(err, res, fallback = "Something went wrong.") {
  if (err instanceof authService.AuthError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error("[auth] unexpected error:", err);
  return res.status(500).json({ error: fallback });
}

/** POST /api/auth/register — superadmin only (see requireAuth/requireRole on the route). */
export async function register(req, res) {
  try {
    const admin = await authService.registerAdmin(req.body);
    res.status(201).json({ admin });
  } catch (err) {
    handleAuthError(err, res, "Failed to create admin account.");
  }
}

/** POST /api/auth/login */
export async function login(req, res) {
  try {
    const { token, admin } = await authService.authenticate(req.body);
    res.json({ token, admin });
  } catch (err) {
    handleAuthError(err, res, "Failed to sign in.");
  }
}

/** POST /api/auth/logout — requires requireAuth. */
export async function logout(req, res) {
  try {
    await authService.logout(req.admin.id);
    res.json({ ok: true });
  } catch (err) {
    handleAuthError(err, res, "Failed to sign out.");
  }
}

/** GET /api/auth/me — requires requireAuth. */
export async function me(req, res) {
  res.json({ admin: req.admin });
}

/** POST /api/auth/forgot-password */
export async function forgotPassword(req, res) {
  try {
    await authService.requestPasswordReset(req.body.email);
  } catch (err) {
    // Still don't leak whether the email exists — log and return the generic message.
    console.error("[auth] forgot-password error:", err);
  }
  // Always the same response, regardless of outcome above (avoids user enumeration).
  res.json({ message: "If that email is registered, a reset link was sent." });
}

/** POST /api/auth/reset-password */
export async function resetPassword(req, res) {
  try {
    await authService.resetPassword(req.body);
    res.json({ ok: true });
  } catch (err) {
    handleAuthError(err, res, "Failed to reset password.");
  }
}
