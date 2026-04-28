import dotenv from "dotenv";
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env before the pool is initialised (static imports are hoisted,
// so pool must be loaded via dynamic import after dotenv.config runs).
// Resolve from this file's URL so it works regardless of process cwd.
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const { pool } = await import("../src/db/connection.js");

function loadSql(filename) {
  return readFileSync(path.join(__dirname, filename), "utf-8");
}

async function run() {
  // Create a tiny bookkeeping table so we can safely run multiple files.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const { rows } = await pool.query("SELECT filename FROM schema_migrations");
  const applied = new Set(rows.map(r => r.filename));

  const files = readdirSync(__dirname)
    .filter(f => /^\d+_.*\.sql$/.test(f))
    .sort((a, b) => a.localeCompare(b));

  console.log(`🔧 Running ${files.length} migration file(s)...`);

  for (const f of files) {
    if (applied.has(f)) continue;

    const sql = loadSql(f);
    console.log(`→ Applying ${f}`);

    try {
      await pool.query("BEGIN");
      await pool.query(sql);
      await pool.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [f]);
      await pool.query("COMMIT");
    } catch (err) {
      await pool.query("ROLLBACK").catch(() => {});
      throw new Error(`${f}: ${err.message}`);
    }
  }

  console.log("✅ Migrations complete");
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  });
