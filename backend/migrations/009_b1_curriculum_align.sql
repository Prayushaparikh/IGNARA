-- ================================================================
-- MIGRATION 009 — Align B1 challenges with the frontend curriculum
-- ================================================================
-- The original seed placed trivial output-only challenges at positions
-- 1-2 (Say Hello, Print Your Name) that the B1 lesson already covers.
-- The frontend curriculum has 5 richer challenges that map perfectly
-- to the 5 B1 misconception sensor tags.  This migration replaces the
-- DB challenge set so submissions match what students see in the UI.
--
-- New sequence:
--   1. Add Two Numbers      → type-conversion-missing
--   2. Temperature Converter→ operator-precedence-error
--   3. Odd or Even          → modulo-confusion
--   4. Simple Average       → integer-division-confusion
--   5. Swap Two Values      → variable-assignment-confusion (unchanged title)
--
-- Input format: all challenges use a single-line, space-separated stdin
-- so the sandbox's `echo '...' | python3` delivery works correctly.
-- Students use `map(int, input().split())` to read multi-value inputs.
-- ================================================================

-- ── C1: Add Two Numbers ──────────────────────────────────────────
-- Tests: int conversion, a, b = map(int, input().split()), addition
UPDATE challenges SET
  title        = 'Add Two Numbers',
  description  ='Read two integers on one line separated by a space, then print their sum.',
  sensor_tag   = 'type-conversion-missing',
  skill_tags   = '{math,functions}',
  test_cases   = '[
    {"input":"5 3","expected_output":"8","is_hidden":false},
    {"input":"12 8","expected_output":"20","is_hidden":false},
    {"input":"-3 10","expected_output":"7","is_hidden":true},
    {"input":"0 0","expected_output":"0","is_hidden":true}
  ]'::jsonb
WHERE unit_code = 'B1' AND unit_order_index = 1;

-- ── C2: Temperature Converter ────────────────────────────────────
-- Tests: formula translation, operator precedence, float output to 1dp
-- F = C * 9/5 + 32; expected output must be formatted with :.1f
-- (raw float 37→98.60000000000001, formatted →98.6)
UPDATE challenges SET
  title        = 'Temperature Converter',
  description  ='Read an integer Celsius temperature and print the Fahrenheit equivalent, rounded to 1 decimal place. Formula: F = C * 9/5 + 32',
  sensor_tag   = 'operator-precedence-error',
  skill_tags   = '{math,functions}',
  test_cases   = '[
    {"input":"0","expected_output":"32.0","is_hidden":false},
    {"input":"100","expected_output":"212.0","is_hidden":false},
    {"input":"37","expected_output":"98.6","is_hidden":true},
    {"input":"-40","expected_output":"-40.0","is_hidden":true}
  ]'::jsonb
WHERE unit_code = 'B1' AND unit_order_index = 2;

-- ── C3: Odd or Even ──────────────────────────────────────────────
-- Tests: int() conversion, modulo operator, conditional output
UPDATE challenges SET
  title        = 'Odd or Even',
  description  ='Read an integer and print exactly "Even" or "Odd".',
  sensor_tag   = 'modulo-confusion',
  skill_tags   = '{math,functions}',
  test_cases   = '[
    {"input":"4","expected_output":"Even","is_hidden":false},
    {"input":"7","expected_output":"Odd","is_hidden":false},
    {"input":"0","expected_output":"Even","is_hidden":true},
    {"input":"-5","expected_output":"Odd","is_hidden":true}
  ]'::jsonb
WHERE unit_code = 'B1' AND unit_order_index = 3;

-- ── C4: Simple Average ───────────────────────────────────────────
-- Tests: map/split, float division vs integer division, :.1f formatting
UPDATE challenges SET
  title        = 'Simple Average',
  description  ='Read three integers on one line separated by spaces, then print their average with exactly 1 decimal place.',
  sensor_tag   = 'integer-division-confusion',
  skill_tags   = '{math,functions}',
  test_cases   = '[
    {"input":"3 4 5","expected_output":"4.0","is_hidden":false},
    {"input":"2 2 3","expected_output":"2.3","is_hidden":false},
    {"input":"10 20 30","expected_output":"20.0","is_hidden":true},
    {"input":"1 2 3","expected_output":"2.0","is_hidden":true}
  ]'::jsonb
WHERE unit_code = 'B1' AND unit_order_index = 4;

-- ── C5: Swap Two Values ──────────────────────────────────────────
-- Tests: tuple swap or temp-variable swap; no int conversion needed
-- (read as strings so it also works for "cat dog" style inputs later)
UPDATE challenges SET
  title        = 'Swap Two Values',
  description  ='Read two values on one line separated by a space and print them in reversed order, separated by a space.',
  sensor_tag   = 'variable-assignment-confusion',
  skill_tags   = '{math,functions}',
  test_cases   = '[
    {"input":"4 9","expected_output":"9 4","is_hidden":false},
    {"input":"0 1","expected_output":"1 0","is_hidden":false},
    {"input":"-3 7","expected_output":"7 -3","is_hidden":true},
    {"input":"99 1","expected_output":"1 99","is_hidden":true}
  ]'::jsonb
WHERE unit_code = 'B1' AND unit_order_index = 5;

-- Wipe any stale test submissions so progress starts clean after realignment
-- (keeps the users table; only removes submission + derived data)
DELETE FROM user_misconception_profile WHERE user_id IN (
  SELECT DISTINCT user_id FROM submissions s
  JOIN challenges c ON c.id = s.challenge_id
  WHERE c.unit_code = 'B1'
);
DELETE FROM submission_misconceptions WHERE challenge_id IN (
  SELECT id FROM challenges WHERE unit_code = 'B1'
);
DELETE FROM submissions WHERE challenge_id IN (
  SELECT id FROM challenges WHERE unit_code = 'B1'
);
UPDATE user_unit_progress SET challenges_passed = 0 WHERE unit_code = 'B1';
