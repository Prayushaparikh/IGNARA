// routes/progress.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db/connection.js";
import { getCurrentUnit, getUserUnitProgress } from "../utils/unitProgress.js";

const router = express.Router();

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
