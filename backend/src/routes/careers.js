// ── routes/careers.js ─────────────────────────────────────────────
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db/connection.js";

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const { rows } = await query("SELECT id, title, description, avg_salary, growth_rate, icon, required_skills FROM careers ORDER BY title");
    res.json(rows);
  } catch (err) { next(err); }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM careers WHERE id = $1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Career not found" });

    // Also fetch student's progress toward this career
    const { rows: progress } = await query(
      "SELECT completion_pct FROM user_career_progress WHERE user_id = $1 AND career_id = $2",
      [req.user.id, req.params.id]
    );

    res.json({ ...rows[0], userProgress: progress[0]?.completion_pct || 0 });
  } catch (err) { next(err); }
});

export default router;
