const KEY = "foundation_progress";

const makeDefault = () => ({
  units: {
    b1: { lessonRead: false, challenges: {}, projectDone: false, unlocked: true },
    b2: { lessonRead: false, challenges: {}, projectDone: false, unlocked: false },
    b3: { lessonRead: false, challenges: {}, projectDone: false, unlocked: false },
    b4: { lessonRead: false, challenges: {}, projectDone: false, unlocked: false },
  },
});

export function getFoundationProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return makeDefault();
    const parsed = JSON.parse(raw);
    return { ...makeDefault(), ...parsed, units: { ...makeDefault().units, ...(parsed.units || {}) } };
  } catch {
    return makeDefault();
  }
}

export function saveFoundationProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function markLessonRead(unitId) {
  const progress = getFoundationProgress();
  progress.units[unitId].lessonRead = true;
  saveFoundationProgress(progress);
  return progress;
}

export function markChallengePassed(unitId, challengeId) {
  const progress = getFoundationProgress();
  progress.units[unitId].challenges[String(challengeId)] = true;
  saveFoundationProgress(progress);
  return progress;
}

export function markProjectDone(unitId) {
  const progress = getFoundationProgress();
  progress.units[unitId].projectDone = true;

  const next = { b1: "b2", b2: "b3", b3: "b4" }[unitId];
  if (next) progress.units[next].unlocked = true;

  saveFoundationProgress(progress);
  return progress;
}

export function getUnitCompletion(unitProgress) {
  const completed = (unitProgress.lessonRead ? 1 : 0)
    + Object.keys(unitProgress.challenges || {}).length
    + (unitProgress.projectDone ? 1 : 0);
  return Math.round((completed / 7) * 100);
}

export function canOpenChallenge(unitProgress, challengeId) {
  if (!unitProgress.lessonRead) return false;
  if (challengeId <= 1) return true;
  return Boolean(unitProgress.challenges[String(challengeId - 1)]);
}
