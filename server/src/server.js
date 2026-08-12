import app from "./app.js";
import { PORT, NODE_ENV, JWT_SECRET } from "./config/env.js";
import { connectDb } from "./config/db.js";

if (!JWT_SECRET) {
  console.warn(
    "[auth] JWT_SECRET not set — using an insecure, randomly generated secret for this process only. " +
      "Set JWT_SECRET in server/.env before deploying (see server/.env.example)."
  );
}

// Optional MongoDB connection: skipped (with a warning) when MONGODB_URI is
// unset, so local dev keeps working on disk storage. Fails fast when a URI is
// configured but unreachable.
try {
  await connectDb();
} catch (err) {
  console.error("[db] MongoDB connection failed:", err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(
    `[server] Tile Visualizer API listening on http://localhost:${PORT} (${NODE_ENV})`
  );
});
