import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db/connection.js";

const router  = express.Router();
const CLAUDE  = "https://api.anthropic.com/v1/messages";
const API_KEY = process.env.ANTHROPIC_API_KEY;

// GET /api/roadmap/me  — generate or return cached roadmap
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const uid = req.user.id;

    // Gather student context
    const [quizRow, skillsRow, subsRow] = await Promise.all([
      query("SELECT student_profile, primary_career FROM quiz_results WHERE user_id=$1 ORDER BY taken_at DESC LIMIT 1", [uid]),
      query("SELECT skill_id FROM user_skills WHERE user_id=$1", [uid]),
      query("SELECT c.title, c.difficulty, s.passed FROM submissions s JOIN challenges c ON c.id=s.challenge_id WHERE s.user_id=$1 ORDER BY s.submitted_at DESC LIMIT 20", [uid]),
    ]);

    const profile      = quizRow.rows[0]?.student_profile || {};
    const careerId     = quizRow.rows[0]?.primary_career  || "software-engineer";
    const earnedSkills = skillsRow.rows.map(r => r.skill_id);
    const recentSubs   = subsRow.rows;
    const passRate     = recentSubs.length
      ? Math.round(recentSubs.filter(s => s.passed).length / recentSubs.length * 100)
      : 0;

    // Fetch career info
    const careerRow = await query("SELECT * FROM careers WHERE id=$1", [careerId]);
    const career    = careerRow.rows[0];

    // Build prompt for Claude
    const prompt = `You are a personalized coding mentor for a high school student using DreamPath CodeX.

STUDENT PROFILE:
- Target career: ${career?.title || careerId}
- Trait scores: ${JSON.stringify(profile)}
- Skills earned so far: ${earnedSkills.length ? earnedSkills.join(", ") : "none yet"}
- Required skills for career: ${career?.required_skills?.join(", ") || "unknown"}
- Recent challenge pass rate: ${passRate}%
- Recent challenges attempted: ${recentSubs.slice(0,5).map(s => `${s.title} (${s.passed ? "passed" : "failed"})`).join(", ") || "none yet"}

Generate a personalized 8-week learning roadmap for this student.

Respond ONLY with a JSON object (no markdown, no preamble) in this exact format:
{
  "headline": "short motivating headline for this student",
  "summary": "2-3 sentence personalized summary of their journey",
  "weeks": [
    {
      "week": 1,
      "theme": "short theme name",
      "goal": "what they will achieve this week",
      "topics": ["topic1", "topic2", "topic3"],
      "challengeTypes": ["type of challenges to focus on"],
      "tip": "one personalized tip for this student"
    }
  ],
  "careerMilestones": [
    { "milestone": "skill or project to achieve", "week": 4 },
    { "milestone": "skill or project to achieve", "week": 8 }
  ],
  "motivationalNote": "short personalized note based on their strengths and gaps"
}`;

    // Call Claude API
    const response = await fetch(CLAUDE, {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-opus-4-6",
        max_tokens: 2000,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude API error: ${err}`);
    }

    const aiData  = await response.json();
    const rawText = aiData.content?.[0]?.text || "{}";

    let roadmap;
    try {
      roadmap = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      roadmap = match ? JSON.parse(match[0]) : { error: "Could not parse roadmap" };
    }

    res.json({
      roadmap,
      meta: { careerId, career: career?.title, passRate, skillsEarned: earnedSkills.length },
    });
  } catch (err) { next(err); }
});

export default router;
