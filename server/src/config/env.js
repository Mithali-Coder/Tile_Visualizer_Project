import "dotenv/config";

export const PORT = Number(process.env.PORT || 4000);
export const NODE_ENV = process.env.NODE_ENV || "development";
export const STORAGE_ROOT = process.env.STORAGE_ROOT || "storage";
export const MONGODB_URI = process.env.MONGODB_URI || "";

// Auth
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";
// Base URL of the client app, used to build password-reset links.
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const RESET_TOKEN_TTL_MINUTES = Number(
  process.env.RESET_TOKEN_TTL_MINUTES || 60
);

// Email (forgot-password). When SMTP_HOST is unset, the reset link is logged
// to the server console instead of sent — keeps local dev working without an
// email provider (mirrors the MONGODB_URI fallback in config/db.js).
export const SMTP_HOST = process.env.SMTP_HOST || "";
export const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const SMTP_FROM = process.env.SMTP_FROM || "Tile Visualizer <no-reply@tile-visualizer.local>";
