import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db/connection.js";
import { getCurrentUnit, getUserUnitProgress } from "../utils/unitProgress.js";

const router  = express.Router();

const TRACK_THEMES = {
  beginner: [
    "Core Syntax and Confidence",
    "Control Flow Mastery",
    "Function Thinking",
    "Lists and Strings",
    "Problem Solving Patterns",
    "Debugging and Edge Cases",
    "Build and Ship Project",
    "Review and Prepare Next Unit",
  ],
  intermediate: [
    "Data Structures in Practice",
    "Algorithm Templates",
    "Two-Pointer and Window Patterns",
    "Recursion to Dynamic Programming",
    "Systematic Debugging",
    "Project Architecture",
    "Performance and Clean Code",
    "Interview-style Review",
  ],
  advanced: [
    "Advanced DSA Foundations",
    "Graph and Tree Fluency",
    "System Design Tradeoffs",
    "API and Scaling Patterns",
    "Interview Simulation",
    "Portfolio Evidence Building",
    "Behavioral and Communication Prep",
    "Readiness and Application Sprint",
  ],
};

function detectTrack(currentUnit) {
  if (currentUnit.startsWith("A")) return "advanced";
  if (currentUnit.startsWith("I")) return "intermediate";
  return "beginner";
}

function buildRuleBasedRoadmap({ careerTitle, currentUnit, passRate, track }) {
  const themes = TRACK_THEMES[track];
  return {
    headline: `Your ${track} roadmap starts now`,
    summary: `You are currently in ${currentUnit}. This 8-week plan keeps lessons, practice challenges, and projects in sequence while building confidence week by week.`,
    weeks: themes.map((theme, idx) => ({
      week: idx + 1,
      theme,
      goal: `Finish the planned lesson + ordered practice goals for week ${idx + 1}.`,
      topics: ["Lesson review", "Ordered micro-challenges", "Project progress checkpoint"],
      challengeTypes: ["main path", "practice lane"],
      tip: idx < 3
        ? "Focus on completing the locked main path first, then use practice lane for extra reps."
        : "Review mistakes from earlier weeks before moving on to harder tasks.",
    })),
    careerMilestones: [
      { milestone: `Complete one project aligned to ${careerTitle}`, week: 4 },
      { milestone: "Finish a portfolio-ready project and summary", week: 8 },
    ],
    motivationalNote: `You are at ${passRate}% recent pass rate. Consistency beats speed — one complete unit at a time.`,
  };
}

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
    const unitProgress = await getUserUnitProgress(uid);
    const currentUnit = getCurrentUnit(unitProgress);
    const track = detectTrack(currentUnit);
    const roadmap = buildRuleBasedRoadmap({
      careerTitle: career?.title || careerId,
      currentUnit,
      passRate,
      track,
    });

    res.json({
      roadmap,
      meta: { careerId, career: career?.title, passRate, skillsEarned: earnedSkills.length, track, currentUnit },
    });
  } catch (err) { next(err); }
});

export default router;
