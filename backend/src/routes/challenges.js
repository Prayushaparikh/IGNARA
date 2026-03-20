import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { recommendNextChallenge, computeStruggleScore } from "../services/ai/challengeRecommender.js";
import { query } from "../db/connection.js";

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
    const { difficulty, language, career, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params     = [];

    if (difficulty) { conditions.push(`difficulty = $${params.length+1}`); params.push(difficulty); }
    if (language)   { conditions.push(`$${params.length+1} = ANY(language)`); params.push(language); }
    if (career)     { conditions.push(`$${params.length+1} = ANY(career_tags)`); params.push(career); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await query(
      `SELECT id, title, description, difficulty, language, career_tags, skill_tags, sensor_tag, order_index
       FROM challenges ${where}
       ORDER BY order_index ASC
       LIMIT $${params.length+1} OFFSET $${params.length+2}`,
      [...params, limit, offset]
    );
    res.json(rows);
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

    // Patent #2 (MVP): prioritize misconceptions
    const topMis = await getTopMisconceptions(userId, 3);
    const topTags = topMis.map(m => m.tag);

    // Get all incomplete challenges (avoid `NOT IN (NULL)` which returns 0 rows)
    const excludeClause = completedChallengeIds.length
      ? `WHERE id NOT IN (${completedChallengeIds.map((_, i) => `$${i + 1}`).join(",")})`
      : "";

    const { rows: allChallenges } = await query(
      `SELECT id, title, difficulty, career_tags, skill_tags, sensor_tag
       FROM challenges
       ${excludeClause}`,
      completedChallengeIds.length ? completedChallengeIds : []
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

    res.json({ ...recommendation, struggleScore, topMisconceptions: topMis });
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
