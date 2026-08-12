import { Admin } from "../models/index.js";

/** Find an admin by email, including the password hash (needed for login). */
export function findByEmailWithPassword(email) {
  return Admin.findOne({ email: email.toLowerCase() }).select(
    "+password +tokenVersion"
  );
}

/** Find an admin by email, public fields only. */
export function findByEmail(email) {
  return Admin.findOne({ email: email.toLowerCase() });
}

/** Find an admin by id, including tokenVersion (needed to validate a JWT). */
export function findByIdWithTokenVersion(id) {
  return Admin.findById(id).select("+tokenVersion");
}

export function findById(id) {
  return Admin.findById(id);
}

export function createAdmin({ name, email, passwordHash, role }) {
  return Admin.create({ name, email, password: passwordHash, role });
}

/** Look up an admin by the hash of a raw reset token (must not be expired). */
export function findByResetTokenHash(tokenHash) {
  return Admin.findOne({
    resetTokenHash: tokenHash,
    resetTokenExpiresAt: { $gt: new Date() },
  }).select("+resetTokenHash +resetTokenExpiresAt +tokenVersion");
}

export function setResetToken(adminId, { tokenHash, expiresAt }) {
  return Admin.findByIdAndUpdate(adminId, {
    resetTokenHash: tokenHash,
    resetTokenExpiresAt: expiresAt,
  });
}

/** Set a new password, consume the reset token, and bump tokenVersion (logs out all sessions). */
export function resetPasswordAndInvalidateSessions(adminId, passwordHash) {
  return Admin.findByIdAndUpdate(adminId, {
    password: passwordHash,
    resetTokenHash: null,
    resetTokenExpiresAt: null,
    $inc: { tokenVersion: 1 },
  });
}

/** Bump tokenVersion so previously issued JWTs stop validating (logout). */
export function invalidateSessions(adminId) {
  return Admin.findByIdAndUpdate(adminId, { $inc: { tokenVersion: 1 } });
}
