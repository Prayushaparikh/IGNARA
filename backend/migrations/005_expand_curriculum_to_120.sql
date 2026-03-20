-- ================================================================
-- IGNARA — Expand curriculum to 120 challenges (MVP content)
-- Adds 70 deterministic practice challenges (51–120)
-- ================================================================

-- If you already have 50 seeded challenges (003_zero_to_hero_challenges.sql),
-- this inserts 70 more without truncating existing data.

INSERT INTO challenges (
  title,
  description,
  starter_code,
  test_cases,
  difficulty,
  language,
  career_tags,
  skill_tags,
  order_index
)
SELECT
  'Square It #' || n AS title,
  'Read an integer N and print N×N.\n\nExample:\n  Input: 5\n  Output: 25' AS description,
  jsonb_build_object(
    'js',
    'const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\n// print n*n\n',
    'python',
    'n = int(input())\n# print n*n\n'
  ) AS starter_code,
  jsonb_build_array(
    jsonb_build_object(
      'input', n::text,
      'expected_output', (n*n)::text,
      'is_hidden', false
    )
  ) AS test_cases,
  'easy' AS difficulty,
  ARRAY['js','python'] AS language,
  ARRAY['software-engineer','data-scientist'] AS career_tags,
  ARRAY['math','functions'] AS skill_tags,
  n AS order_index
FROM generate_series(51, 120) AS n;

