import express from "express";
import { exec }  from "child_process";
import { promisify } from "util";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db/connection.js";
import { getCurrentUnit, getUserUnitProgress, UNIT_ORDER } from "../utils/unitProgress.js";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";
import os from "os";

const router   = express.Router();
const execAsync = promisify(exec);

const LANG_CONFIG = {
  js:     { image: "node:20-alpine",   ext: "js",  cmd: (f) => `node ${f}` },
  python: { image: "python:3.11-slim", ext: "py",  cmd: (f) => `python3 ${f}` },
  cpp:    { image: "gcc:12",           ext: "cpp", cmd: (f) => `g++ -o /tmp/a.out ${f} && /tmp/a.out` },
};

const TIMEOUT_SECS = 10;
const MEM_LIMIT    = "128m";

async function runInSandbox(code, language, stdin = "") {
  const config  = LANG_CONFIG[language];
  if (!config) throw new Error(`Unsupported language: ${language}`);

  const runId   = uuid();
  const tmpDir  = path.join(os.tmpdir(), `codex-${runId}`);
  const srcFile = path.join(tmpDir, `solution.${config.ext}`);

  await fs.mkdir(tmpDir, { recursive: true });
  await fs.writeFile(srcFile, code, "utf-8");

  const stdinFlag = stdin ? `echo '${stdin.replace(/'/g, "'\\''")}' |` : "";
  const dockerCmd = [
    "docker run --rm",
    `--memory="${MEM_LIMIT}"`,
    "--cpus=0.5",
    "--network=none",           // ← no internet access
    "--read-only",
    `--volume="${tmpDir}:/code:ro"`,
    `--workdir="/code"`,
    // --timeout is not a valid docker flag; Node's execAsync timeout handles the wall-clock limit
    config.image,
    "sh", "-c", `"${stdinFlag} ${config.cmd(`/code/solution.${config.ext}`)}"`,
  ].join(" ");

  try {
    const { stdout, stderr } = await execAsync(dockerCmd, {
      timeout: (TIMEOUT_SECS + 2) * 1000,
      maxBuffer: 1024 * 256,
    });
    return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode: 0 };
  } catch (err) {
    const isTimeout = err.killed || err.signal === "SIGTERM";
    return {
      stdout: "",
      stderr: isTimeout ? `Time limit exceeded (${TIMEOUT_SECS}s)` : err.stderr?.trim() || err.message,
      exitCode: err.code || 1,
    };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

// POST /api/compiler/run  — free-form run (no test cases)
router.post("/run", authMiddleware, async (req, res, next) => {
  try {
    const { code, language, stdin = "" } = req.body;
    if (!code || !language) return res.status(400).json({ error: "code and language required" });

    const result = await runInSandbox(code, language, stdin);
    res.json(result);
  } catch (err) { next(err); }
});

// POST /api/compiler/submit  — run against challenge test cases
// Accepts either: { challengeId: uuid }  OR  { unitCode: "B1", position: 1 }
router.post("/submit", authMiddleware, async (req, res, next) => {
  try {
    const { code, language, challengeId, unitCode, position } = req.body;

    let challengeRows;
    if (challengeId) {
      ({ rows: challengeRows } = await query("SELECT * FROM challenges WHERE id = $1", [challengeId]));
    } else if (unitCode && position) {
      ({ rows: challengeRows } = await query(
        "SELECT * FROM challenges WHERE unit_code = $1 AND unit_order_index = $2",
        [unitCode.toUpperCase(), Number(position)]
      ));
    } else {
      return res.status(400).json({ error: "Provide challengeId or unitCode+position" });
    }

    const rows = challengeRows;
    if (!rows[0]) return res.status(404).json({ error: "Challenge not found" });

    const challenge  = rows[0];
    const progressRows = await getUserUnitProgress(req.user.id);
    const currentUnit = getCurrentUnit(progressRows);
    const unitProg = progressRows.find((u) => u.unitCode === challenge.unit_code);
    const challengeOrder = Number(challenge.unit_order_index || 0);

    if (challenge.unit_code && UNIT_ORDER.indexOf(challenge.unit_code) > UNIT_ORDER.indexOf(currentUnit)) {
      return res.status(403).json({ error: "Complete your current unit before attempting future units." });
    }
    if (challengeOrder > 0 && challengeOrder <= 5) {
      if (!unitProg?.lessonRead) {
        return res.status(403).json({ error: "Read the lesson first to unlock graded challenges." });
      }
      const unlockedUntil = Math.max(1, Number(unitProg?.challengesPassed || 0) + 1);
      if (challengeOrder > unlockedUntil) {
        return res.status(403).json({ error: "Finish previous challenges first. Challenges unlock in order." });
      }
    }

    const testCases  = challenge.test_cases;
    const results    = [];
    let allPassed    = true;

    for (const tc of testCases) {
      const { stdout, stderr, exitCode } = await runInSandbox(code, language, tc.input || "");
      const passed = exitCode === 0 && stdout.trim() === String(tc.expected_output).trim();
      if (!passed) allPassed = false;

      results.push({
        input:    tc.is_hidden ? "[hidden]"    : tc.input,
        expected: tc.is_hidden ? "[hidden]"    : tc.expected_output,
        actual:   tc.is_hidden ? (passed ? "✓" : "✗") : stdout,
        stderr,
        passed,
      });
    }

    // Persist submission
    const { rows: sub } = await query(
      `INSERT INTO submissions (user_id, challenge_id, language, code, passed, test_results)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.user.id, challenge.id, language, code, allPassed, JSON.stringify(results)]
    );

    // Patent #2 (MVP): if failed, log the challenge's sensor tag as a misconception signal
    let tutor = null;
    if (!allPassed && challenge.sensor_tag) {
      const tag = challenge.sensor_tag;

      await query(
        `INSERT INTO submission_misconceptions (submission_id, user_id, challenge_id, tag)
         VALUES ($1, $2, $3, $4)`,
        [sub[0].id, req.user.id, challenge.id, tag]
      );

      await query(
        `INSERT INTO user_misconception_profile (user_id, tag, times_seen, last_seen_at)
         VALUES ($1, $2, 1, NOW())
         ON CONFLICT (user_id, tag)
         DO UPDATE SET times_seen = user_misconception_profile.times_seen + 1, last_seen_at = NOW()`,
        [req.user.id, tag]
      );

      const { rows: tagRows } = await query(
        "SELECT tag, title, default_hint FROM misconception_tags WHERE tag = $1",
        [tag]
      );

      if (tagRows[0]) {
        tutor = {
          tag: tagRows[0].tag,
          title: tagRows[0].title,
          hint: tagRows[0].default_hint,
        };
      }
    }

    // Award skills on first pass
    if (allPassed && challenge.skill_tags?.length) {
      for (const skillId of challenge.skill_tags) {
        await query(
          `INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [req.user.id, skillId]
        ).catch(() => {}); // ignore if skill doesn't exist in table
      }
    }

    if (allPassed && challenge.unit_code && challengeOrder > 0 && challengeOrder <= 5) {
      const { rows: cRows } = await query(
        `SELECT COUNT(DISTINCT s.challenge_id) AS passed_count
         FROM submissions s
         JOIN challenges c ON c.id = s.challenge_id
         WHERE s.user_id = $1 AND s.passed = true AND c.unit_code = $2 AND c.unit_order_index <= 5`,
        [req.user.id, challenge.unit_code]
      );
      const passedCount = Number(cRows[0]?.passed_count || 0);
      await query(
        `UPDATE user_unit_progress
         SET challenges_passed = $3, updated_at = NOW()
         WHERE user_id = $1 AND unit_code = $2`,
        [req.user.id, challenge.unit_code, Math.min(5, passedCount)]
      );
    }

    res.json({ submissionId: sub[0].id, passed: allPassed, results, tutor });
  } catch (err) { next(err); }
});

export default router;
