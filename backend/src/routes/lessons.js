import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db/connection.js";
import { getCurrentUnit, getUserUnitProgress, UNIT_ORDER } from "../utils/unitProgress.js";

const router = express.Router();

const LESSONS = {
  B1: {
    unitCode: "B1",
    track: "beginner",
    title: "Foundations",
    summary: "Variables, input/output, and basic math operations.",
    goals: [
      "Use input/output with correct type conversion",
      "Apply arithmetic operators and precedence",
      "Build confidence with first coding wins",
    ],
  },
  B2: {
    unitCode: "B2",
    track: "beginner",
    title: "Control Flow",
    summary: "If/else, loops, and boundary-safe logic.",
    goals: [
      "Write correct if/elif/else branches",
      "Handle loop boundaries and termination",
      "Avoid off-by-one and infinite loop errors",
    ],
  },
  B3: {
    unitCode: "B3",
    track: "beginner",
    title: "Functions",
    summary: "Parameters, return values, scope, and recursion basics.",
    goals: [
      "Return values correctly from functions",
      "Use clean function decomposition",
      "Understand recursion base cases",
    ],
  },
  B4: {
    unitCode: "B4",
    track: "beginner",
    title: "Arrays and Strings",
    summary: "List/string iteration and dictionary patterns.",
    goals: [
      "Iterate collections safely",
      "Manipulate strings with split/join patterns",
      "Use map/set/dict tradeoffs intentionally",
    ],
  },
  I1: {
    unitCode: "I1",
    track: "intermediate",
    title: "Data Structures",
    summary: "Hashmaps, stacks, queues, and structure selection.",
    goals: [
      "Choose the right data structure for each problem",
      "Write O(n) hashmap solutions where possible",
      "Implement stack/queue flows safely",
    ],
  },
  I2: {
    unitCode: "I2",
    track: "intermediate",
    title: "Algorithms",
    summary: "Searching, sorting, two pointers, and sliding window.",
    goals: [
      "Apply standard algorithm templates correctly",
      "Maintain pointer/window invariants",
      "Reason about time complexity",
    ],
  },
  I3: {
    unitCode: "I3",
    track: "intermediate",
    title: "Recursion and DP",
    summary: "Memoization, DFS recursion, and dynamic programming.",
    goals: [
      "Define base cases and state transitions",
      "Avoid repeated work with memoization",
      "Track visited state correctly in traversal",
    ],
  },
  I4: {
    unitCode: "I4",
    track: "intermediate",
    title: "Real Projects",
    summary: "OOP, edge cases, and production-style robustness.",
    goals: [
      "Build with clean interfaces and validation",
      "Handle edge cases explicitly",
      "Manage state transitions safely",
    ],
  },
  A1: {
    unitCode: "A1",
    track: "advanced",
    title: "Advanced Data Structures",
    summary: "Trees, graphs, heaps, and traversal correctness.",
    goals: [
      "Implement graph/tree traversals with invariants",
      "Use visited/recursion-stack patterns correctly",
      "Apply heap strategy for top-K and ranking",
    ],
  },
  A2: {
    unitCode: "A2",
    track: "advanced",
    title: "System Design Basics",
    summary: "Caching, APIs, scalability, and failure handling.",
    goals: [
      "Model systems with clear constraints",
      "Handle collisions, limits, and boundaries",
      "Design resilient data and request flows",
    ],
  },
  A3: {
    unitCode: "A3",
    track: "advanced",
    title: "Interview Preparation",
    summary: "Big-O explanation, problem solving under time.",
    goals: [
      "Communicate solution tradeoffs clearly",
      "Solve with structure and test edge cases",
      "Explain complexity accurately",
    ],
  },
  A4: {
    unitCode: "A4",
    track: "advanced",
    title: "Portfolio and Career Launch",
    summary: "Ship polished projects and internship-ready profile.",
    goals: [
      "Deploy real projects with live links",
      "Document work clearly",
      "Show consistent execution quality",
    ],
  },
};

function normalizePassRate(passed, total) {
  if (!total) return 0;
  return Math.round((passed / total) * 100);
}

const LESSON_CONTENT = {
  B1: {
    hookCode: `name = input("What is your name? ")\nprint("Hello, " + name + "!")`,
    hookPrompt: "Where do you think the name gets stored?",
    concept:
      "A variable is a labeled box that stores a value. input() reads text from the user, and print() shows output. In Python, input() always returns a string, so convert to int() when you need math.",
    commonMistakes: [
      "Wrong: '3' + '5' -> '35'. Why: both are text. Right: int('3') + int('5') -> 8",
      "Wrong: input() + 5 raises type error. Right: int(input()) + 5",
    ],
    realWorld: "Apps like Spotify store your typed username in variables before using it in logic.",
  },
  B2: {
    hookCode: `for i in range(1, 6):\n    print(i)`,
    hookPrompt: "Why does this stop at 5 and not continue forever?",
    concept:
      "Control flow decides what runs and how many times. if/elif/else picks one path; loops repeat work. Most beginner bugs happen at boundaries: start, end, and stop conditions.",
    commonMistakes: [
      "Wrong: range(5) when you need 1..5. Right: range(1, 6)",
      "Wrong: while n > 0 with n never changing. Right: update n each loop",
    ],
    realWorld: "Notification systems use loop + condition logic to decide who gets which message.",
  },
  B3: {
    hookCode: `def greet(name):\n    return "Hi " + name`,
    hookPrompt: "Why is return better than print inside reusable functions?",
    concept:
      "Functions package one job into reusable blocks. Parameters bring input in, return sends output out. Keep each function focused and predictable, and avoid hidden side effects.",
    commonMistakes: [
      "Wrong: print(result) inside helper. Right: return result",
      "Wrong: recursion without base case. Right: define smallest stopping input first",
    ],
    realWorld: "Backend APIs rely on small functions so teams can test and debug safely.",
  },
};

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [progressRows, { rows: unitRows }, { rows: profileRows }] = await Promise.all([
      getUserUnitProgress(userId),
      query(
        `SELECT
           c.unit_code,
           COUNT(DISTINCT c.id) AS total_challenges,
           COUNT(DISTINCT CASE WHEN s.passed THEN c.id END) AS passed_challenges
         FROM challenges c
         LEFT JOIN submissions s ON s.challenge_id = c.id AND s.user_id = $1
         WHERE c.unit_order_index <= 5
         GROUP BY c.unit_code`,
        [userId]
      ),
      query(
        `SELECT ump.tag, ump.times_seen, mt.unit_code, mt.default_hint
         FROM user_misconception_profile ump
         JOIN misconception_tags mt ON mt.tag = ump.tag
         WHERE ump.user_id = $1
         ORDER BY ump.times_seen DESC, ump.last_seen_at DESC
         LIMIT 5`,
        [userId]
      ),
    ]);

    const unitProgressMap = new Map(
      unitRows.map((r) => [
        r.unit_code,
        {
          totalChallenges: Number(r.total_challenges || 0),
          passedChallenges: Number(r.passed_challenges || 0),
        },
      ])
    );

    const currentUnitCode = getCurrentUnit(progressRows);

    const units = UNIT_ORDER.map((code) => {
      const progress = unitProgressMap.get(code) || { totalChallenges: 0, passedChallenges: 0 };
      const unitProg = progressRows.find((u) => u.unitCode === code);
      const completed = Boolean(unitProg?.projectPassed);
      const unlocked = UNIT_ORDER.indexOf(code) <= UNIT_ORDER.indexOf(currentUnitCode);
      return {
        ...LESSONS[code],
        totalChallenges: progress.totalChallenges,
        passedChallenges: progress.passedChallenges,
        passRate: normalizePassRate(progress.passedChallenges, progress.totalChallenges),
        completed,
        lessonRead: Boolean(unitProg?.lessonRead),
        projectPassed: Boolean(unitProg?.projectPassed),
        unlocked,
      };
    });

    const currentUnit = units.find((u) => u.unitCode === currentUnitCode) || units[0];

    const unitMisconception = profileRows.find((p) => p.unit_code === currentUnit.unitCode) || null;
    const globalTopMisconception = profileRows[0] || null;

    const [{ rows: nextChallengeRows }, { rows: remediationRows }] = await Promise.all([
      query(
        `SELECT c.id, c.title, c.difficulty, c.sensor_tag
         FROM challenges c
         LEFT JOIN submissions s
           ON s.challenge_id = c.id
          AND s.user_id = $1
          AND s.passed = true
         WHERE c.sensor_tag IN (SELECT tag FROM misconception_tags WHERE unit_code = $2)
           AND s.id IS NULL
         ORDER BY c.order_index ASC
         LIMIT 1`,
        [userId, currentUnit.unitCode]
      ),
      query(
        `SELECT c.id, c.title, c.difficulty, c.sensor_tag
         FROM challenges c
         LEFT JOIN submissions s
           ON s.challenge_id = c.id
          AND s.user_id = $1
          AND s.passed = true
         WHERE c.sensor_tag = $2
           AND s.id IS NULL
         ORDER BY c.order_index ASC
         LIMIT 3`,
        [userId, globalTopMisconception?.tag || ""]
      ),
    ]);

    const currentIndex = UNIT_ORDER.indexOf(currentUnit.unitCode);
    const nextUnit = currentIndex >= 0 ? units[currentIndex + 1] : null;

    let transition = {
      type: "challenge",
      title: "Continue this unit",
      reason: "You are progressing through this unit. Keep momentum with the next challenge.",
      recommendedChallenge: nextChallengeRows[0] || null,
      remediation: [],
      nextLesson: null,
    };

    if (unitMisconception && unitMisconception.times_seen >= 2 && remediationRows.length > 0) {
      transition = {
        type: "remediation",
        title: "Personalized misconception practice",
        reason: `You repeatedly hit "${unitMisconception.tag}". Do short targeted practice before continuing.`,
        recommendedChallenge: remediationRows[0],
        remediation: remediationRows,
        nextLesson: null,
      };
    } else if (currentUnit.completed && nextUnit) {
      transition = {
        type: "lesson",
        title: `Transition to ${nextUnit.title}`,
        reason: `You completed ${currentUnit.title}. Start the next lesson before jumping into new challenge patterns.`,
        recommendedChallenge: null,
        remediation: [],
        nextLesson: {
          unitCode: nextUnit.unitCode,
          title: nextUnit.title,
          summary: nextUnit.summary,
        },
      };
    }

    res.json({
      currentLesson: currentUnit,
      lessonContent: LESSON_CONTENT[currentUnit.unitCode] || {
        hookCode: "# Lesson content coming soon",
        hookPrompt: "What do you think happens next?",
        concept: currentUnit.summary,
        commonMistakes: ["Be careful with edge cases and type conversions."],
        realWorld: "This concept appears in real product code every day.",
      },
      unlock: {
        lessonRead: Boolean(progressRows.find((u) => u.unitCode === currentUnit.unitCode)?.lessonRead),
      },
      units,
      topMisconceptions: profileRows,
      transition,
      lessonTips: [
        unitMisconception?.default_hint || null,
        globalTopMisconception && globalTopMisconception !== unitMisconception
          ? globalTopMisconception.default_hint
          : null,
      ].filter(Boolean),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/mark-read", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { unitCode } = req.body || {};
    if (!unitCode || !UNIT_ORDER.includes(unitCode)) {
      return res.status(400).json({ error: "Valid unitCode is required" });
    }
    await query(
      `UPDATE user_unit_progress
       SET lesson_read = true, updated_at = NOW()
       WHERE user_id = $1 AND unit_code = $2`,
      [userId, unitCode]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post("/project-complete", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { unitCode } = req.body || {};
    if (!unitCode || !UNIT_ORDER.includes(unitCode)) {
      return res.status(400).json({ error: "Valid unitCode is required" });
    }
    const { rows: prog } = await query(
      "SELECT challenges_passed FROM user_unit_progress WHERE user_id = $1 AND unit_code = $2",
      [userId, unitCode]
    );
    const passed = Number(prog[0]?.challenges_passed || 0);
    if (passed < 5) {
      return res.status(400).json({ error: "Complete all 5 challenges before project unlock." });
    }
    await query(
      `UPDATE user_unit_progress
       SET project_passed = true, updated_at = NOW()
       WHERE user_id = $1 AND unit_code = $2`,
      [userId, unitCode]
    );
    const idx = UNIT_ORDER.indexOf(unitCode);
    const next = UNIT_ORDER[idx + 1];
    if (next) {
      await query(
        `UPDATE user_unit_progress
         SET lesson_read = true, updated_at = NOW()
         WHERE user_id = $1 AND unit_code = $2 AND lesson_read = false`,
        [userId, next]
      );
    }
    res.json({ ok: true, nextUnitCode: next || null });
  } catch (err) {
    next(err);
  }
});

router.post("/transition-event", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      eventType,
      transitionType,
      unitCode,
      recommendedItemId = null,
      recommendedItemType = "challenge",
      metadata = {},
    } = req.body || {};

    if (!eventType || !transitionType || !unitCode) {
      return res.status(400).json({ error: "eventType, transitionType, and unitCode are required" });
    }

    await query(
      `INSERT INTO lesson_transition_events
       (user_id, event_type, transition_type, unit_code, recommended_item_id, recommended_item_type, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, eventType, transitionType, unitCode, recommendedItemId, recommendedItemType, metadata]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/transition-analytics", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { rows } = await query(
      `SELECT
         transition_type,
         COUNT(*) FILTER (WHERE event_type = 'viewed')   AS viewed_count,
         COUNT(*) FILTER (WHERE event_type = 'clicked')  AS clicked_count,
         COUNT(*) FILTER (WHERE event_type = 'completed') AS completed_count
       FROM lesson_transition_events
       WHERE user_id = $1
       GROUP BY transition_type`,
      [userId]
    );

    const normalized = rows.map((r) => {
      const viewed = Number(r.viewed_count || 0);
      const clicked = Number(r.clicked_count || 0);
      const completed = Number(r.completed_count || 0);
      return {
        transitionType: r.transition_type,
        viewed,
        clicked,
        completed,
        clickThroughRate: viewed ? Math.round((clicked / viewed) * 100) : 0,
        completionRate: clicked ? Math.round((completed / clicked) * 100) : 0,
      };
    });

    res.json({ transitions: normalized });
  } catch (err) {
    next(err);
  }
});

export default router;
