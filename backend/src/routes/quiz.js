import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  QUIZ_QUESTIONS,
  CAREER_VECTORS,
  resolveTrackPlacement,
  OBJECTIVE_QUESTION_IDS,
  FUNDAMENTAL_QUESTION_IDS,
} from "../data/quizSchema.js";

const OBJECTIVE_IDS = new Set(OBJECTIVE_QUESTION_IDS);
const FUNDAMENTAL_IDS = new Set(FUNDAMENTAL_QUESTION_IDS);
import { query } from "../db/connection.js";

const router = express.Router();

// GET /api/quiz/questions
router.get("/questions", (_, res) => {
  const safe = QUIZ_QUESTIONS.map(q => ({
    id: q.id, part: q.part, question: q.question,
    emoji: q.emoji, code: q.code || false,
    options: q.options.map(o => ({ label: o.label })),
  }));
  res.json(safe);
});

// POST /api/quiz/submit
router.post("/submit", authMiddleware, async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length < QUIZ_QUESTIONS.length)
      return res.status(400).json({ error: "Please answer all 10 questions" });

    const answeredIds = new Set(answers.map((a) => a.questionId));
    if (answeredIds.size !== QUIZ_QUESTIONS.length || QUIZ_QUESTIONS.some((q) => !answeredIds.has(q.id))) {
      return res.status(400).json({ error: "Please answer all 10 questions" });
    }

    // ── Score: interests + knowledge (q6 self-report + q7–q10 objective) ──
    let knowledgeScore = 0;
    let objectiveScore = 0;
    let fundamentalCorrectCount = 0;
    let q6SelectedIndex = 0;
    const interestWeights = {};

    for (const ans of answers) {
      const q = QUIZ_QUESTIONS.find((qq) => qq.id === ans.questionId);
      if (!q) continue;
      const opt = q.options[ans.selectedIndex];
      if (!opt) continue;

      if (q.part === "knowledge") {
        const pts = opt.score || 0;
        knowledgeScore += pts;
        if (q.id === "q6") q6SelectedIndex = ans.selectedIndex;
        if (OBJECTIVE_IDS.has(q.id)) {
          objectiveScore += pts;
          if (FUNDAMENTAL_IDS.has(q.id) && pts >= 2) fundamentalCorrectCount += 1;
        }
      }

      if (q.part === "interest" && opt.weights) {
        for (const [dim, val] of Object.entries(opt.weights)) {
          interestWeights[dim] = (interestWeights[dim] || 0) + val;
        }
      }
    }

    // Normalize interest weights 0-1
    const maxW = Math.max(...Object.values(interestWeights), 1);
    const studentProfile = Object.fromEntries(
      Object.entries(interestWeights).map(([k, v]) => [k, +(v / maxW).toFixed(2)])
    );

    const placement = resolveTrackPlacement({
      objectiveScore,
      q6SelectedIndex,
      fundamentalCorrectCount,
    });

    // Top interest trait → career suggestion (sidebar only)
    const topTrait = Object.entries(studentProfile).sort((a,b) => b[1]-a[1])[0]?.[0];
    const careerMap = {
      PROBLEM_SOLVING:  "software-engineer",
      DATA_AFFINITY:    "data-scientist",
      CREATIVITY:       "ux-engineer",
      SYSTEMS_THINKING: "devops-engineer",
      CURIOSITY:        "cybersecurity-analyst",
      COLLABORATION:    "mobile-developer",
    };
    const suggestedCareer = careerMap[topTrait] || "software-engineer";

    // Persist
    await query(
      `INSERT INTO quiz_results (user_id, answers, student_profile, career_scores, primary_career)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        req.user.id,
        JSON.stringify(answers),
        JSON.stringify({
          ...studentProfile,
          placement,
          knowledgeScore,
          objectiveScore,
          fundamentalCorrectCount,
          q6SelectedIndex,
        }),
        JSON.stringify([{ id: suggestedCareer, score: 1 }]),
        suggestedCareer,
      ]
    );

    await query(
      `INSERT INTO user_career_progress (user_id, career_id, completion_pct)
       VALUES ($1,$2,0) ON CONFLICT (user_id, career_id) DO NOTHING`,
      [req.user.id, suggestedCareer]
    );

    res.json({
      placement,
      studentProfile,
      suggestedCareer,
      knowledgeScore,
      objectiveScore,
      fundamentalCorrectCount,
    });
  } catch (err) { next(err); }
});

// GET /api/quiz/latest
router.get("/latest", authMiddleware, async (req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT * FROM quiz_results WHERE user_id=$1 ORDER BY taken_at DESC LIMIT 1",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "No quiz results found" });
    const r = rows[0];
    const profile = r.student_profile || {};
    res.json({
      placement:       profile.placement || { level: "Foundations", label: "High School Track" },
      student_profile: profile,
      knowledgeScore:  profile.knowledgeScore ?? 0,
      objectiveScore:  profile.objectiveScore ?? null,
      fundamentalCorrectCount: profile.fundamentalCorrectCount ?? null,
      primary_career:  r.primary_career,
      taken_at:        r.taken_at,
    });
  } catch (err) { next(err); }
});

export default router;
