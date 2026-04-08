export const QUIZ_QUESTIONS = [

  // ══ PART 1 — Career Interest (5 questions) ══

  {
    id: "q1",
    part: "interest",
    question: "When you have a free afternoon, what sounds most exciting?",
    emoji: "🌟",
    options: [
      { label: "Building something — an app, a tool, a game",         weights: { PROBLEM_SOLVING: 2, CREATIVITY: 1 } },
      { label: "Digging into data and finding hidden patterns",        weights: { DATA_AFFINITY: 3, CURIOSITY: 1 } },
      { label: "Designing something that looks and feels amazing",     weights: { CREATIVITY: 3, COLLABORATION: 1 } },
      { label: "Figuring out how to break or protect a system",       weights: { PROBLEM_SOLVING: 2, CURIOSITY: 2 } },
    ],
  },

  {
    id: "q2",
    part: "interest",
    question: "Which of these problems would you most want to solve?",
    emoji: "🎯",
    options: [
      { label: "Make an app faster and more reliable for millions",    weights: { SYSTEMS_THINKING: 3, PROBLEM_SOLVING: 1 } },
      { label: "Help a company understand why their sales are dropping",weights: { DATA_AFFINITY: 3, CURIOSITY: 1 } },
      { label: "Make a confusing app simple and delightful to use",    weights: { CREATIVITY: 2, COLLABORATION: 2 } },
      { label: "Stop hackers from stealing people's data",            weights: { PROBLEM_SOLVING: 2, SYSTEMS_THINKING: 2 } },
    ],
  },

  {
    id: "q3",
    part: "interest",
    question: "How do you like to work?",
    emoji: "💡",
    options: [
      { label: "Deep focus — alone with a hard problem for hours",     weights: { PROBLEM_SOLVING: 2, SYSTEMS_THINKING: 2 } },
      { label: "Collaborating — whiteboard, ideas flying everywhere",  weights: { COLLABORATION: 3, CREATIVITY: 1 } },
      { label: "Experimenting — try, fail, tweak, repeat",            weights: { CURIOSITY: 3, DATA_AFFINITY: 1 } },
      { label: "Building systems — architecture, reliability, scale",  weights: { SYSTEMS_THINKING: 3, PROBLEM_SOLVING: 1 } },
    ],
  },

  {
    id: "q4",
    part: "interest",
    question: "Which of these excites you most about tech?",
    emoji: "🚀",
    options: [
      { label: "AI and machine learning — teaching computers to think",weights: { DATA_AFFINITY: 2, CURIOSITY: 2 } },
      { label: "Games and interactive experiences",                    weights: { CREATIVITY: 3, PROBLEM_SOLVING: 1 } },
      { label: "Cloud infrastructure — the backbone of the internet", weights: { SYSTEMS_THINKING: 3, PROBLEM_SOLVING: 1 } },
      { label: "Mobile apps — software that lives in people's pockets",weights: { CREATIVITY: 2, COLLABORATION: 2 } },
    ],
  },

  {
    id: "q5",
    part: "interest",
    question: "If you had to describe yourself, which fits best?",
    emoji: "🧠",
    options: [
      { label: "The builder — I want to make things that work",        weights: { PROBLEM_SOLVING: 2, SYSTEMS_THINKING: 2 } },
      { label: "The analyst — I want to understand why things happen", weights: { DATA_AFFINITY: 2, CURIOSITY: 2 } },
      { label: "The creator — I want to make things beautiful",        weights: { CREATIVITY: 3, COLLABORATION: 1 } },
      { label: "The protector — I want to keep people safe",           weights: { PROBLEM_SOLVING: 2, CURIOSITY: 2 } },
    ],
  },

  // ══ PART 2 — Coding Knowledge (5 questions) ══

  {
    id: "q6",
    part: "knowledge",
    question:
      "How much coding have you actually done? (Answer honestly — we combine this with the checks below so you land in the right track.)",
    emoji: "💻",
    options: [
      { label: "None yet — I'm completely new", score: 0 },
      { label: "A tiny bit — a lesson, hour of code, or one-off try", score: 0 },
      { label: "Some — a few small projects or a short course", score: 1 },
      { label: "A lot — I code regularly for school, work, or personal projects", score: 2 },
    ],
  },

  {
    id: "q7",
    part: "knowledge",
    question: "What does this print?\n\nfor i in range(3):\n    print(i)",
    emoji: "🔍",
    code: true,
    options: [
      { label: "1, 2, 3",    score: 0 },
      { label: "0, 1, 2",    score: 2 },
      { label: "3",          score: 0 },
      { label: "I'm not sure", score: 0 },
    ],
  },

  {
    id: "q8",
    part: "knowledge",
    question: "What is a variable?",
    emoji: "📦",
    options: [
      { label: "A type of loop that repeats code",                    score: 0 },
      { label: "A named container that stores a value",               score: 2 },
      { label: "A function that returns a number",                    score: 0 },
      { label: "I'm not sure",                                        score: 0 },
    ],
  },

  {
    id: "q9",
    part: "knowledge",
    question: "What does this function return?\n\ndef double(x):\n    return x * 2\n\ndouble(5)",
    emoji: "⚙️",
    code: true,
    options: [
      { label: "5",          score: 0 },
      { label: "2",          score: 0 },
      { label: "10",         score: 2 },
      { label: "I'm not sure", score: 0 },
    ],
  },

  {
    id: "q10",
    part: "knowledge",
    question:
      "You need to count how many times each word appears in a sentence. Which structure is the best fit?",
    emoji: "🗂️",
    options: [
      { label: "A list / array (scan the whole list each time)", score: 0 },
      { label: "A hash map / dictionary (word → count)", score: 2 },
      { label: "A single loop with no extra storage", score: 0 },
      { label: "I'm not sure", score: 0 },
    ],
  },
];

/** q7–q10 only — objective checks (max 8). q6 is self-report for placement routing. */
export const OBJECTIVE_QUESTION_IDS = ["q7", "q8", "q9", "q10"];

/** Core syntax / semantics — Advanced requires strength here, not only data-structure trivia. */
export const FUNDAMENTAL_QUESTION_IDS = ["q7", "q8", "q9"];

export const CAREER_VECTORS = {
  "software-engineer":     { PROBLEM_SOLVING: 0.8, SYSTEMS_THINKING: 0.7, CREATIVITY: 0.5, COLLABORATION: 0.5, DATA_AFFINITY: 0.3, CURIOSITY: 0.6 },
  "data-scientist":        { PROBLEM_SOLVING: 0.6, SYSTEMS_THINKING: 0.5, CREATIVITY: 0.3, COLLABORATION: 0.4, DATA_AFFINITY: 0.9, CURIOSITY: 0.8 },
  "ml-engineer":           { PROBLEM_SOLVING: 0.7, SYSTEMS_THINKING: 0.6, CREATIVITY: 0.4, COLLABORATION: 0.3, DATA_AFFINITY: 0.9, CURIOSITY: 0.8 },
  "ux-engineer":           { PROBLEM_SOLVING: 0.5, SYSTEMS_THINKING: 0.4, CREATIVITY: 0.9, COLLABORATION: 0.8, DATA_AFFINITY: 0.3, CURIOSITY: 0.6 },
  "cybersecurity-analyst": { PROBLEM_SOLVING: 0.9, SYSTEMS_THINKING: 0.8, CREATIVITY: 0.4, COLLABORATION: 0.3, DATA_AFFINITY: 0.5, CURIOSITY: 0.9 },
  "devops-engineer":       { PROBLEM_SOLVING: 0.7, SYSTEMS_THINKING: 0.9, CREATIVITY: 0.3, COLLABORATION: 0.5, DATA_AFFINITY: 0.4, CURIOSITY: 0.6 },
  "game-developer":        { PROBLEM_SOLVING: 0.7, SYSTEMS_THINKING: 0.6, CREATIVITY: 0.9, COLLABORATION: 0.5, DATA_AFFINITY: 0.3, CURIOSITY: 0.7 },
  "mobile-developer":      { PROBLEM_SOLVING: 0.6, SYSTEMS_THINKING: 0.5, CREATIVITY: 0.8, COLLABORATION: 0.6, DATA_AFFINITY: 0.3, CURIOSITY: 0.6 },
  "cloud-architect":       { PROBLEM_SOLVING: 0.7, SYSTEMS_THINKING: 0.9, CREATIVITY: 0.3, COLLABORATION: 0.4, DATA_AFFINITY: 0.5, CURIOSITY: 0.6 },
  "blockchain-developer":  { PROBLEM_SOLVING: 0.8, SYSTEMS_THINKING: 0.7, CREATIVITY: 0.5, COLLABORATION: 0.3, DATA_AFFINITY: 0.6, CURIOSITY: 0.9 },
};

/** Legacy total-score bands (q6–q10 sum, max 10). Prefer `resolveTrackPlacement`. */
export const TRACK_PLACEMENT = (score) => {
  if (score >= 7) {
    return {
      track: "internship-prep",
      label: "Internship Prep",
      level: "Advanced",
      desc: "You're ready for interview-level challenges.",
    };
  }
  if (score >= 4) {
    return {
      track: "high-school",
      label: "High School Track",
      level: "Intermediate",
      desc: "You know the basics. Let's level you up fast.",
    };
  }
  return {
    track: "high-school",
    label: "High School Track",
    level: "Foundations",
    desc: "Perfect starting point. Everyone begins here.",
  };
};

const PLACEMENT = {
  foundations: {
    track: "high-school",
    label: "High School Track",
    level: "Foundations",
    desc: "We'll start with B1 foundations and build confidence step by step.",
  },
  intermediate: {
    track: "high-school",
    label: "High School Track",
    level: "Intermediate",
    desc: "You've got solid basics — we'll move faster through patterns and problem solving.",
  },
  advanced: {
    track: "internship-prep",
    label: "Internship Prep",
    level: "Advanced",
    desc: "Strong fundamentals — you're ready for tougher structures and interview-style problems.",
  },
};

/**
 * Placement uses:
 * - q6 index 0–1: always Foundations (no/minimal real experience).
 * - q6 index 2 ("some" projects): never Advanced; objective score drives Foundations vs Intermediate.
 * - q6 index 3 ("a lot"): full range, but Advanced needs high objective score + 2+ fundamentals correct.
 * - q6 index 3 with very low objective: Foundations (likely overstated experience or test anxiety).
 *
 * @param {object} opts
 * @param {number} opts.objectiveScore — sum of scores on q7–q10 only (max 8)
 * @param {number} opts.q6SelectedIndex — 0..3
 * @param {number} opts.fundamentalCorrectCount — how many of q7,q8,q9 were fully correct (0..3)
 */
export function resolveTrackPlacement({
  objectiveScore,
  q6SelectedIndex,
  fundamentalCorrectCount,
}) {
  const idx = Number.isInteger(q6SelectedIndex) ? q6SelectedIndex : 0;
  const obj = typeof objectiveScore === "number" ? objectiveScore : 0;
  const fc = typeof fundamentalCorrectCount === "number" ? fundamentalCorrectCount : 0;

  if (idx === 0 || idx === 1) {
    return {
      ...PLACEMENT.foundations,
      desc:
        idx === 0
          ? "You're brand new to code — we'll begin with B1 foundations at a comfortable pace."
          : "You're just getting started — we'll build from B1 foundations before speeding up.",
    };
  }

  if (idx === 2) {
    if (obj >= 3) {
      return {
        ...PLACEMENT.intermediate,
        desc: "You have some project experience and your checks show you're ready to level up past pure basics.",
      };
    }
    return {
      ...PLACEMENT.foundations,
      desc: "You've tried a bit of code — we'll solidify fundamentals in B1 before moving faster.",
    };
  }

  if (idx === 3) {
    if (obj <= 1) {
      return {
        ...PLACEMENT.foundations,
        desc: "Your answers suggest brushing up on core syntax first — we'll start in B1 and reassess as you progress.",
      };
    }
    if (obj >= 6 && fc >= 2) {
      return { ...PLACEMENT.advanced };
    }
    if (obj >= 2) {
      return {
        ...PLACEMENT.intermediate,
        desc:
          obj >= 5 && fc < 2
            ? "Strong on some topics — we'll tighten loops, variables, and functions before the deep end."
            : PLACEMENT.intermediate.desc,
      };
    }
  }

  return { ...PLACEMENT.foundations };
}
