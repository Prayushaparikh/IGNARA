/**
 * Quiz placement.level values from backend TRACK_PLACEMENT / quiz submit.
 */
export function skipsFoundationTrack(placementLevel) {
  return placementLevel === "Intermediate" || placementLevel === "Advanced";
}

/** Main app path for “continue learning” from dashboard (Foundation B* vs global challenges). */
export function mainLearningHref(currentUnit) {
  if (!currentUnit) return "/foundation";
  const u = String(currentUnit).toUpperCase();
  if (/^B[1-4]$/.test(u)) return "/foundation";
  return "/challenges";
}
