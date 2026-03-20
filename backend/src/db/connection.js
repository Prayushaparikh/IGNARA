import pg from "pg";
import { logger } from "../utils/logger.js";

const { Pool } = pg;

export const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || "dreampath",
  user:     process.env.DB_USER     || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function connectDB() {
  try {
    await pool.query("SELECT NOW()");
    logger.info("✅ PostgreSQL connected");
  } catch (err) {
    logger.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
}

// Helper: tagged template for safe queries
export async function query(text, params) {
  const start = Date.now();
  const res   = await pool.query(text, params);
  logger.debug(`Query [${Date.now() - start}ms]: ${text.slice(0, 60)}`);
  return res;
}
