-- ================================================================
-- IGNARA — Linear unit progression (Main Path) + practice lane support
-- ================================================================

ALTER TABLE challenges
  ADD COLUMN IF NOT EXISTS unit_code TEXT,
  ADD COLUMN IF NOT EXISTS unit_order_index INT,
  ADD COLUMN IF NOT EXISTS is_practice BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_challenges_unit_code ON challenges(unit_code);
CREATE INDEX IF NOT EXISTS idx_challenges_unit_order ON challenges(unit_code, unit_order_index);

-- Map existing challenges into unit buckets (best-effort using order_index).
UPDATE challenges
SET unit_code = CASE
  WHEN order_index BETWEEN 1  AND 5  THEN 'B1'
  WHEN order_index BETWEEN 6  AND 10 THEN 'B2'
  WHEN order_index BETWEEN 11 AND 15 THEN 'B3'
  WHEN order_index BETWEEN 16 AND 20 THEN 'B4'
  WHEN order_index BETWEEN 21 AND 25 THEN 'I1'
  WHEN order_index BETWEEN 26 AND 30 THEN 'I2'
  WHEN order_index BETWEEN 31 AND 35 THEN 'I3'
  WHEN order_index BETWEEN 36 AND 40 THEN 'I4'
  WHEN order_index BETWEEN 41 AND 45 THEN 'A1'
  WHEN order_index BETWEEN 46 AND 50 THEN 'A2'
  WHEN order_index BETWEEN 51 AND 55 THEN 'A3'
  WHEN order_index BETWEEN 56 AND 60 THEN 'A4'
  ELSE COALESCE(unit_code, 'A4')
END
WHERE unit_code IS NULL;

WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY unit_code ORDER BY order_index ASC, created_at ASC) AS rn
  FROM challenges
)
UPDATE challenges c
SET unit_order_index = ranked.rn
FROM ranked
WHERE c.id = ranked.id
  AND c.unit_order_index IS NULL;

UPDATE challenges
SET is_practice = true
WHERE unit_order_index > 5;

CREATE TABLE IF NOT EXISTS user_unit_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_code TEXT NOT NULL,
  lesson_read BOOLEAN NOT NULL DEFAULT false,
  challenges_passed INT NOT NULL DEFAULT 0 CHECK (challenges_passed >= 0),
  project_passed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, unit_code)
);

CREATE INDEX IF NOT EXISTS idx_user_unit_progress_user ON user_unit_progress(user_id);
