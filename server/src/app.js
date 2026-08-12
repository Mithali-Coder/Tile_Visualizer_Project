import express from "express";
import healthRouter from "./routes/health.js";
import layoutsRouter from "./routes/layouts.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.set("trust proxy", true);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ name: "Tile Visualizer API", status: "ok" });
});

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/layouts", layoutsRouter);

export default app;
