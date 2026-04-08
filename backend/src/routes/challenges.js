import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { recommendNextChallenge, computeStruggleScore } from "../services/ai/challengeRecommender.js";
import { query } from "../db/connection.js";
import { getCurrentUnit, getUserUnitProgress } from "../utils/unitProgress.js";

const router = express.Router();

async function getTopMisconceptions(userId, limit = 3) {
  const { rows } = await query(
    `SELECT tag, times_seen, last_seen_at
     FROM user_misconception_profile
     WHERE user_id = $1
     ORDER BY times_seen DESC, last_seen_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return rows;
}

// GET /api/challenges  — paginated list
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { difficulty, language, career, unit, mode = "main", page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;
    const conditions = [];
    const params     = [];

    const progress = await getUserUnitProgress(userId);
    const currentUnit = getCurrentUnit(progress);
    const effectiveUnit = unit || currentUnit;
    const unitProgress = progress.find((u) => u.unitCode === effectiveUnit);
    const unlockedUntil = Math.max(1, Number(unitProgress?.challengesPassed || 0) + 1);

    if (difficulty) { conditions.push(`difficulty = $${params.length+1}`); params.push(difficulty); }
    if (language)   { conditions.push(`$${params.length+1} = ANY(language)`); params.push(language); }
    if (career)     { conditions.push(`$${params.length+1} = ANY(career_tags)`); params.push(career); }
    if (effectiveUnit) { conditions.push(`unit_code = $${params.length+1}`); params.push(effectiveUnit); }
    if (mode === "main") { conditions.push(`COALESCE(is_practice, false) = false AND unit_order_index <= 5`); }
    if (mode === "practice") { conditions.push(`COALESCE(is_practice, false) = true`); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await query(
      `SELECT id, title, description, difficulty, language, career_tags, skill_tags, sensor_tag, order_index, unit_code, unit_order_index, is_practice
       FROM challenges ${where}
       ORDER BY COALESCE(unit_order_index, order_index) ASC
       LIMIT $${params.length+1} OFFSET $${params.length+2}`,
      [...params, limit, offset]
    );

    const withLocks = rows.map((c) => {
      const isLocked =
        mode === "main" &&
        c.unit_code === effectiveUnit &&
        Number(c.unit_order_index || 999) > unlockedUntil;
      return { ...c, locked: isLocked };
    });

    res.json({ unitCode: effectiveUnit, currentUnit, unlockedUntil, mode, challenges: withLocks });
  } catch (err) { next(err); }
});

// GET /api/challenges/next  — AI recommended next challenge
router.get("/next", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get student's primary career
    const { rows: quizRows } = await query(
      "SELECT primary_career FROM quiz_results WHERE user_id = $1 ORDER BY taken_at DESC LIMIT 1",
      [userId]
    );
    const primaryCareerId = quizRows[0]?.primary_career || "software-engineer";

    // Get completed challenges
    const { rows: subRows } = await query(
      "SELECT DISTINCT challenge_id, passed FROM submissions WHERE user_id = $1",
      [userId]
    );
    const completedChallengeIds = subRows.filter(s => s.passed).map(s => s.challenge_id);

    // Compute struggle score from recent submissions
    const { rows: recentSubs } = await query(
      "SELECT passed FROM submissions WHERE user_id = $1 ORDER BY submitted_at DESC LIMIT 10",
      [userId]
    );
    const struggleScore = computeStruggleScore(recentSubs);

    // Get earned skills
    const { rows: skillRows } = await query(
      "SELECT skill_id FROM user_skills WHERE user_id = $1", [userId]
    );
    const earnedSkills = skillRows.map(s => s.skill_id);

    // Get career profiles
    const { rows: careers } = await query(
      "SELECT id, required_skills, challenge_tags, trait_vector AS traits FROM careers"
    );

    const progress = await getUserUnitProgress(userId);
    const currentUnit = getCurrentUnit(progress);

    // Patent #2 (MVP): prioritize misconceptions
    const topMis = await getTopMisconceptions(userId, 3);
    const topTags = topMis.map(m => m.tag);

    // Get all incomplete challenges within current unit
    const whereParts = [`unit_code = $${completedChallengeIds.length + 1}`];
    if (completedChallengeIds.length) {
      whereParts.push(`id NOT IN (${completedChallengeIds.map((_, i) => `$${i + 1}`).join(",")})`);
    }

    const { rows: allChallenges } = await query(
      `SELECT id, title, difficulty, career_tags, skill_tags, sensor_tag, unit_code, unit_order_index
       FROM challenges
       WHERE ${whereParts.join(" AND ")}`,
      [...(completedChallengeIds.length ? completedChallengeIds : []), currentUnit]
    );

    // If they have misconceptions, try to pick a micro-challenge that targets one.
    const remediationPool = topTags.length
      ? allChallenges.filter(c => c.sensor_tag && topTags.includes(c.sensor_tag))
      : [];

    const recommendation = remediationPool.length
      ? {
          recommended: remediationPool[0],
          alternatives: remediationPool.slice(1, 4),
          reasoning: `Let’s fix a common sticking point first (${topTags[0]}). This will make harder problems feel easier.`,
        }
      : recommendNextChallenge(
          { primaryCareerId, completedChallengeIds, earnedSkills, struggleScore, careerProfiles: careers },
          allChallenges
        );

    res.json({ ...recommendation, struggleScore, topMisconceptions: topMis, currentUnit });
  } catch (err) { next(err); }
});

// GET /api/challenges/:id
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM challenges WHERE id = $1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Challenge not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

export default router;
