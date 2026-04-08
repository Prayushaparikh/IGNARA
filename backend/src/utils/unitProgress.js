import { query } from "../db/connection.js";

export const UNIT_ORDER = ["B1", "B2", "B3", "B4", "I1", "I2", "I3", "I4", "A1", "A2", "A3", "A4"];

function startUnitFromQuizPlacement(level) {
  if (level === "Intermediate") return "I1";
  if (level === "Advanced") return "A1";
  return "B1";
}

export async function ensureUserUnitProgress(userId) {
  const { rows: quizRows } = await query(
    "SELECT student_profile FROM quiz_results WHERE user_id = $1 ORDER BY taken_at DESC LIMIT 1",
    [userId]
  );
  const placementLevel = quizRows[0]?.student_profile?.placement?.level || "Foundations";
  const startUnit = startUnitFromQuizPlacement(placementLevel);
  const startIndex = UNIT_ORDER.indexOf(startUnit);

  for (let i = 0; i < UNIT_ORDER.length; i += 1) {
    const unitCode = UNIT_ORDER[i];
    await query(
      `INSERT INTO user_unit_progress (user_id, unit_code, lesson_read, challenges_passed, project_passed, updated_at)
       VALUES ($1, $2, $3, 0, false, NOW())
       ON CONFLICT (user_id, unit_code) DO NOTHING`,
      [userId, unitCode, i < startIndex]
    );
  }
}

export async function getUserUnitProgress(userId) {
  await ensureUserUnitProgress(userId);
  const { rows } = await query(
    `SELECT unit_code, lesson_read, challenges_passed, project_passed, updated_at
     FROM user_unit_progress
     WHERE user_id = $1`,
    [userId]
  );
  const map = new Map(rows.map((r) => [r.unit_code, r]));
  return UNIT_ORDER.map((unitCode) => ({
    unitCode,
    lessonRead: Boolean(map.get(unitCode)?.lesson_read),
    challengesPassed: Number(map.get(unitCode)?.challenges_passed || 0),
    projectPassed: Boolean(map.get(unitCode)?.project_passed),
  }));
}

export function getCurrentUnit(progressRows) {
  const pending = progressRows.find((u) => !u.projectPassed);
  return pending?.unitCode || "A4";
}
