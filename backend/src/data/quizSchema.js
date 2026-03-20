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
    question: "Have you ever written code before?",
    emoji: "💻",
    options: [
      { label: "Never — this is brand new to me",      score: 0 },
      { label: "A little — tried it once or twice",    score: 0 },
      { label: "Yes — I've built a few small projects", score: 1 },
      { label: "Yes — I code regularly",               score: 2 },
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
    question: "Which data structure would you use to count how many times each word appears in a sentence?",
    emoji: "🗂️",
    options: [
      { label: "A list / array",          score: 0 },
      { label: "A hashmap / dictionary",  score: 2 },
      { label: "A loop",                  score: 0 },
      { label: "I'm not sure",            score: 0 },
    ],
  },
];

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

export const TRACK_PLACEMENT = (score) => {
  if (score >= 7)  return { track: "internship-prep",      label: "Internship Prep",      level: "Advanced",      desc: "You're ready for interview-level challenges." };
  if (score >= 4)  return { track: "high-school",          label: "High School Track",    level: "Intermediate",  desc: "You know the basics. Let's level you up fast." };
  return           { track: "high-school",                 label: "High School Track",    level: "Foundations",   desc: "Perfect starting point. Everyone begins here." };
};
