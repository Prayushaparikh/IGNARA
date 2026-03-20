-- DreamPath CodeX — Full Schema Migration
-- Run: node migrations/run.js

-- ── Extensions ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','teacher','admin')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Classes ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  join_code  TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_enrollments (
  class_id   UUID REFERENCES classes(id)  ON DELETE CASCADE,
  student_id UUID REFERENCES users(id)    ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (class_id, student_id)
);

-- ── Careers ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS careers (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT,
  avg_salary       TEXT,
  growth_rate      TEXT,
  icon             TEXT,
  trait_vector     JSONB NOT NULL,      -- { PROBLEM_SOLVING: 0.9, ... }
  required_skills  TEXT[] DEFAULT '{}',
  challenge_tags   TEXT[] DEFAULT '{}'
);

-- ── Quiz ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_results (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answers         JSONB NOT NULL,
  student_profile JSONB NOT NULL,       -- normalized dimension vector
  career_scores   JSONB NOT NULL,       -- [{ id, score }] all ranked
  primary_career  TEXT REFERENCES careers(id),
  taken_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Skills ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  description TEXT,
  category    TEXT
);

-- ── Challenges ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS challenges (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  starter_code  JSONB NOT NULL,   -- { js: '...', python: '...', cpp: '...' }
  test_cases    JSONB NOT NULL,   -- [{ input, expected_output, is_hidden }]
  difficulty    TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  language      TEXT[] DEFAULT '{js,python}',
  career_tags   TEXT[] DEFAULT '{}',
  skill_tags    TEXT[] DEFAULT '{}',
  order_index   INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Submissions ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id),
  language     TEXT NOT NULL,
  code         TEXT NOT NULL,
  passed       BOOLEAN NOT NULL,
  test_results JSONB,              -- [{ input, expected, actual, passed }]
  exec_time_ms INT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Progress ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_skills (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id   TEXT REFERENCES skills(id),
  earned_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS user_career_progress (
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  career_id       TEXT REFERENCES careers(id),
  completion_pct  FLOAT DEFAULT 0,
  last_updated    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, career_id)
);

-- ── Indexes ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_submissions_user     ON submissions(user_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user    ON quiz_results(user_id, taken_at DESC);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_tags       ON challenges USING GIN(career_tags);

-- ── Seed: Career Profiles ─────────────────────────────────────────
INSERT INTO careers (id, title, description, avg_salary, growth_rate, icon, trait_vector, required_skills, challenge_tags)
VALUES
  ('software-engineer', 'Software Engineer', 'Build products millions use daily.', '$95k–$160k', '25%', '💻',
   '{"PROBLEM_SOLVING":0.9,"SYSTEMS_THINKING":0.8,"CREATIVITY":0.5,"COLLABORATION":0.6,"DATA_AFFINITY":0.4,"CURIOSITY":0.8}',
   ARRAY['algorithms','data-structures','git','debugging'], ARRAY['arrays','loops','functions','OOP']),

  ('data-scientist', 'Data Scientist', 'Turn raw data into industry decisions.', '$100k–$170k', '36%', '📊',
   '{"PROBLEM_SOLVING":0.7,"SYSTEMS_THINKING":0.8,"CREATIVITY":0.4,"COLLABORATION":0.5,"DATA_AFFINITY":1.0,"CURIOSITY":0.9}',
   ARRAY['statistics','python','data-viz','ml-basics'], ARRAY['arrays','sorting','math','recursion']),

  ('ux-engineer', 'UX Engineer', 'Bridge between design and working code.', '$85k–$140k', '13%', '🎨',
   '{"PROBLEM_SOLVING":0.6,"SYSTEMS_THINKING":0.6,"CREATIVITY":1.0,"COLLABORATION":0.9,"DATA_AFFINITY":0.3,"CURIOSITY":0.7}',
   ARRAY['html-css','accessibility','user-research','prototyping'], ARRAY['DOM','events','styling','animations']),

  ('devops-engineer', 'DevOps Engineer', 'Keep the internet running. Automate everything.', '$105k–$165k', '22%', '⚙️',
   '{"PROBLEM_SOLVING":0.9,"SYSTEMS_THINKING":1.0,"CREATIVITY":0.3,"COLLABORATION":0.6,"DATA_AFFINITY":0.6,"CURIOSITY":0.8}',
   ARRAY['linux','docker','ci-cd','networking'], ARRAY['scripts','automation','debugging','performance']),

  ('cybersecurity-analyst', 'Cybersecurity Analyst', 'Protect systems. Be the shield.', '$90k–$150k', '32%', '🛡️',
   '{"PROBLEM_SOLVING":1.0,"SYSTEMS_THINKING":0.9,"CREATIVITY":0.5,"COLLABORATION":0.4,"DATA_AFFINITY":0.7,"CURIOSITY":1.0}',
   ARRAY['networking','cryptography','ethical-hacking','risk-analysis'], ARRAY['logic','bit-manipulation','algorithms','debugging'])
ON CONFLICT (id) DO NOTHING;
