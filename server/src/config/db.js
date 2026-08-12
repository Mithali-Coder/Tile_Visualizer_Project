import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "./env.js";

/** readyStates that mean we already have a live/connecting connection. */
const CONNECTING_STATES = new Set([1, 2]);

/**
 * Connect to MongoDB. When `MONGODB_URI` is unset (local dev without a DB)
 * this logs a warning and returns null — the disk-based layout storage keeps
 * working as the default. When the URI is set, connection failures throw.
 *
 * @returns {Promise<import("mongoose").Connection | null>}
 */
export async function connectDb() {
  if (!MONGODB_URI) {
    console.warn(
      "[db] MONGODB_URI not set — skipping MongoDB connection (layout storage stays on disk)."
    );
    return null;
  }
  if (CONNECTING_STATES.has(mongoose.connection.readyState)) {
    return mongoose.connection;
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`[db] MongoDB connected (${NODE_ENV})`);
  return mongoose.connection;
}

/** Gracefully disconnect (used by seed scripts / shutdown hooks). */
export async function disconnectDb() {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
}

export default connectDb;
