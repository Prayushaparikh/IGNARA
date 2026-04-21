// routes/progress.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db/connection.js";
import { getCurrentUnit, getUserUnitProgress, ensureUserUnitProgress } from "../utils/unitProgress.js";

const router = express.Router();

const FOUNDATION_UNITS = ["B1", "B2", "B3", "B4"];

// GET /api/progress/foundation
// Returns progress in the exact shape the frontend foundationProgress.js expects.
router.get("/foundation", authMiddleware, async (req, res, next) => {
  try {
    const uid = req.user.id;

    const [unitProgress, completedRows] = await Promise.all([
      getUserUnitProgress(uid),
      // Which specific challenge positions (1-5) has this user passed per unit?
      query(
        `SELECT DISTINCT c.unit_code, c.unit_order_index
         FROM submissions s
         JOIN challenges c ON c.id = s.challenge_id
         WHERE s.user_id = $1 AND s.passed = true AND c.unit_order_index BETWEEN 1 AND 5`,
        [uid]
      ),
    ]);

    // Build per-unit challenge map: { "B1": { "1": true, "2": true }, ... }
    const challengesByUnit = {};
    for (const row of completedRows.rows) {
      if (!challengesByUnit[row.unit_code]) challengesByUnit[row.unit_code] = {};
      challengesByUnit[row.unit_code][String(row.unit_order_index)] = true;
    }

    const units = {};
    for (let i = 0; i < FOUNDATION_UNITS.length; i++) {
      const code  = FOUNDATION_UNITS[i];
      const lower = code.toLowerCase();
      const up    = unitProgress.find((u) => u.unitCode === code) || {};
      // B1 always unlocked; subsequent units unlock when previous unit's project is done
      const prevDone = i === 0 || (unitProgress.find((u) => u.unitCode === FOUNDATION_UNITS[i - 1])?.projectPassed ?? false);
      units[lower] = {
        unlocked:   prevDone,
        lessonRead: up.lessonRead  || false,
        challenges: challengesByUnit[code] || {},
        projectDone: up.projectPassed || false,
      };
    }

    res.json({ units });
  } catch (err) { next(err); }
});

// PATCH /api/progress/foundation/:unitCode  { lessonRead?: bool, projectDone?: bool }
router.patch("/foundation/:unitCode", authMiddleware, async (req, res, next) => {
  try {
    const uid      = req.user.id;
    const unitCode = req.params.unitCode.toUpperCase();
    const { lessonRead, projectDone } = req.body;

    const setClauses = [];
    const params     = [uid, unitCode];

    if (typeof lessonRead === "boolean") {
      params.push(lessonRead);
      setClauses.push(`lesson_read = $${params.length}`);
    }
    if (typeof projectDone === "boolean") {
      params.push(projectDone);
      setClauses.push(`project_passed = $${params.length}`);
    }
    if (!setClauses.length) return res.status(400).json({ error: "Nothing to update" });

    // Guarantee the row exists before updating (new users may not have rows yet)
    await ensureUserUnitProgress(uid);

    await query(
      `UPDATE user_unit_progress SET ${setClauses.join(", ")}, updated_at = NOW()
       WHERE user_id = $1 AND unit_code = $2`,
      params
    );

    res.json({ ok: true, unitCode });
  } catch (err) { next(err); }
});

// GET /api/progress/me  — full student dashboard data
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const uid = req.user.id;

    const [skills, submissions, careerProgress, quizResult, unitProgress] = await Promise.all([
      query("SELECT skill_id, earned_at FROM user_skills WHERE user_id = $1", [uid]),
      query(
        `SELECT s.challenge_id, s.passed, s.submitted_at, c.title, c.difficulty
         FROM submissions s JOIN challenges c ON c.id = s.challenge_id
         WHERE s.user_id = $1 ORDER BY s.submitted_at DESC LIMIT 50`, [uid]
      ),
      query(
        `SELECT ucp.*, ca.title, ca.icon FROM user_career_progress ucp
         JOIN careers ca ON ca.id = ucp.career_id
         WHERE ucp.user_id = $1`, [uid]
      ),
      query(
        "SELECT primary_career, student_profile FROM quiz_results WHERE user_id = $1 ORDER BY taken_at DESC LIMIT 1",
        [uid]
      ),
      getUserUnitProgress(uid),
    ]);

    const completedChallenges = [...new Set(
      submissions.rows.filter(s => s.passed).map(s => s.challenge_id)
    )];

    const currentUnit = getCurrentUnit(unitProgress);
    const currentUnitProgress = unitProgress.find((u) => u.unitCode === currentUnit);

    res.json({
      skills:             skills.rows,
      recentSubmissions:  submissions.rows,
      completedCount:     completedChallenges.length,
      careerProgress:     careerProgress.rows,
      studentProfile:     quizResult.rows[0]?.student_profile || null,
      primaryCareer:      quizResult.rows[0]?.primary_career  || null,
      unitProgress,
      currentUnit,
      currentUnitProgress,
    });
  } catch (err) { next(err); }
});

export default router;
