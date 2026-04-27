import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
import { connectDB } from "./db/connection.js";

import authRoutes       from "./routes/auth.js";
import quizRoutes       from "./routes/quiz.js";
import careerRoutes     from "./routes/careers.js";
import challengeRoutes  from "./routes/challenges.js";
import compilerRoutes   from "./routes/compiler.js";
import progressRoutes   from "./routes/progress.js";
import teacherRoutes    from "./routes/teacher.js";
import roadmapRoutes    from "./routes/roadmap.js";
import lessonRoutes     from "./routes/lessons.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;

// Production safety: never run with default or missing JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
const WEAK_SECRETS = new Set(["", "dev-secret", "change-me-in-production"]);
if (process.env.NODE_ENV === "production") {
  if (!JWT_SECRET || WEAK_SECRETS.has(JWT_SECRET)) {
    logger.error("Refusing to start: set a strong JWT_SECRET in production (not dev-secret / change-me-in-production).");
    process.exit(1);
  }
}

app.use(helmet());
app.use(compression());

// CORS: comma-separated origins in CLIENT_URL (e.g. https://ignaracodex.com,https://www.ignaracodex.com)
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      logger.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api", limiter);

const compilerLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: "Too many compile requests" });
app.use("/api/compiler", compilerLimiter);

app.use("/api/auth",       authRoutes);
app.use("/api/quiz",       quizRoutes);
app.use("/api/careers",    careerRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/compiler",   compilerRoutes);
app.use("/api/progress",   progressRoutes);
app.use("/api/teacher",    teacherRoutes);
app.use("/api/roadmap",    roadmapRoutes);
app.use("/api/lessons",    lessonRoutes);

app.get("/health", (_, res) => res.json({ status: "ok", ts: new Date() }));

app.use((err, req, res, _next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () =>
    logger.info(`🚀 API running on port ${PORT}`)
  );
});
