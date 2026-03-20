// ── services/ai/careerScorer.js ───────────────────────────────────
const DIMENSIONS = ["PROBLEM_SOLVING","SYSTEMS_THINKING","CREATIVITY","COLLABORATION","DATA_AFFINITY","CURIOSITY"];

export function aggregateDimensionScores(answers, questions) {
  const raw = Object.fromEntries(DIMENSIONS.map(d => [d, 0]));
  for (const { questionId, selectedOptionIndex } of answers) {
    const question = questions.find(q => q.id === questionId);
    if (!question) continue;
    const option = question.options[selectedOptionIndex];
    if (!option?.weights) continue;
    for (const [dim, weight] of Object.entries(option.weights)) {
      raw[dim] = (raw[dim] || 0) + weight;
    }
  }
  return raw;
}

export function normalizeScores(raw) {
  const max = Math.max(...Object.values(raw)) || 1;
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, +(v / max).toFixed(3)]));
}

export function cosineSimilarity(a, b) {
  const keys = Object.keys(a);
  const dot  = keys.reduce((s, k) => s + a[k] * (b[k] || 0), 0);
  const magA = Math.sqrt(keys.reduce((s, k) => s + a[k] ** 2, 0));
  const magB = Math.sqrt(keys.reduce((s, k) => s + (b[k] || 0) ** 2, 0));
  if (!magA || !magB) return 0;
  return +(dot / (magA * magB)).toFixed(4);
}

export function rankCareers(studentVec, careers) {
  return careers
    .map(c => ({
      ...c,
      matchScore:   cosineSimilarity(studentVec, c.traits),
      matchPercent: Math.round(cosineSimilarity(studentVec, c.traits) * 100),
      traitGaps:    Object.entries(c.traits)
        .filter(([t, req]) => (studentVec[t] || 0) < req - 0.3)
        .map(([t]) => t),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function scoreCareerQuiz(answers, questions, careers) {
  const raw        = aggregateDimensionScores(answers, questions);
  const normalized = normalizeScores(raw);
  const ranked     = rankCareers(normalized, careers);
  return { studentProfile: normalized, topCareers: ranked.slice(0, 3), allRanked: ranked, primaryCareer: ranked[0] };
}
