import pg from "pg";
import { logger } from "../utils/logger.js";

const { Pool } = pg;

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const poolConfig = hasDatabaseUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      // Render managed Postgres requires SSL in production.
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      // Managed Postgres (e.g. Render) can be slow on first connection when cold.
      connectionTimeoutMillis: process.env.NODE_ENV === "production" ? 30000 : 2000,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "dreampath",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

export const pool = new Pool(poolConfig);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Retries help Render free Postgres + web waking from sleep (first connect can fail or time out). */
export async function connectDB(maxAttempts = 8) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query("SELECT NOW()");
      logger.info("✅ PostgreSQL connected");
      return;
    } catch (err) {
      lastErr = err;
      logger.error(
        `❌ DB connection failed (attempt ${attempt}/${maxAttempts}):`,
        err.message
      );
      if (attempt < maxAttempts) {
        const delay = Math.min(2500 * attempt, 15000);
        await sleep(delay);
      }
    }
  }
  logger.error("❌ DB connection failed after all retries:", lastErr?.message);
  process.exit(1);
}

// Helper: tagged template for safe queries
export async function query(text, params) {
  const start = Date.now();
  const res   = await pool.query(text, params);
  logger.debug(`Query [${Date.now() - start}ms]: ${text.slice(0, 60)}`);
  return res;
}
