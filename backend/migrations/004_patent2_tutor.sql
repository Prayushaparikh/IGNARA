-- ================================================================
-- IGNARA — PATENT #2 + AI TUTOR DATA MODEL (MVP)
-- Adds: misconception sensors, submission tagging, per-student profiles, tutor cache
-- ================================================================

-- ── Challenges: attach a single "sensor tag" per micro-challenge ──
ALTER TABLE challenges
  ADD COLUMN IF NOT EXISTS sensor_tag TEXT,
  ADD COLUMN IF NOT EXISTS tutor_hints JSONB; -- { default: "...", examples: [...] }

CREATE INDEX IF NOT EXISTS idx_challenges_sensor_tag ON challenges(sensor_tag);

-- ── Misconception tag catalog ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS misconception_tags (
  tag         TEXT PRIMARY KEY,
  track       TEXT NOT NULL CHECK (track IN ('beginner','intermediate','advanced')),
  unit_code   TEXT NOT NULL, -- ex: B1, I2
  title       TEXT NOT NULL, -- short human label
  default_hint TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Per-submission detected tags (event log) ──────────────────────
CREATE TABLE IF NOT EXISTS submission_misconceptions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id  UUID NOT NULL REFERENCES challenges(id),
  tag           TEXT NOT NULL REFERENCES misconception_tags(tag),
  detected_from TEXT NOT NULL DEFAULT 'sensor_tag', -- reserved for future: stderr_pattern, diff_mismatch, etc.
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_mis_user_time ON submission_misconceptions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sub_mis_tag_time  ON submission_misconceptions(tag, created_at DESC);

-- ── Per-student misconception profile (aggregated) ────────────────
CREATE TABLE IF NOT EXISTS user_misconception_profile (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag         TEXT NOT NULL REFERENCES misconception_tags(tag),
  times_seen  INT  NOT NULL DEFAULT 0,
  last_seen_at TIMESTAMPTZ,
  strength    FLOAT NOT NULL DEFAULT 0, -- 0..1 (optional; derived later)
  PRIMARY KEY (user_id, tag)
);

-- ── Tutor response cache (cost reduction) ─────────────────────────
CREATE TABLE IF NOT EXISTS tutor_cache (
  cache_key   TEXT PRIMARY KEY,
  response    JSONB NOT NULL,
  hit_count   INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- Seed the 48 sensor tags from the curriculum spec (v1.0)
-- ================================================================
INSERT INTO misconception_tags (tag, track, unit_code, title, default_hint) VALUES
  ('type-conversion-missing','beginner','B1','Type conversion missing','input() returns text. Wrap it: int(input()) (or Number(...) in JS).'),
  ('operator-precedence-error','beginner','B1','Operator precedence','Use parentheses to make the order of operations explicit.'),
  ('modulo-confusion','beginner','B1','Modulo confusion','% gives the remainder. For even numbers, n % 2 == 0.'),
  ('integer-division-confusion','beginner','B1','Integer vs float division','Use / for decimals (not //). Make sure you’re not truncating.'),
  ('variable-assignment-confusion','beginner','B1','Variable swap confusion','When swapping, don’t overwrite a value before you use it.'),

  ('condition-order-wrong','beginner','B2','Condition order','Check the most specific condition first (e.g. FizzBuzz before Fizz or Buzz).'),
  ('off-by-one-loop','beginner','B2','Off-by-one loop','range(1, n+1) includes n; range(n) ends at n-1.'),
  ('nested-loop-confusion','beginner','B2','Nested loop confusion','Outer loop controls rows; inner loop controls work per row.'),
  ('boundary-condition-error','beginner','B2','Boundary conditions','Edge values belong to exactly one branch. Order your elifs carefully.'),
  ('loop-termination-confusion','beginner','B2','Loop termination','Something inside the loop must change the condition.'),

  ('print-instead-of-return','beginner','B3','Print vs return','print shows output but returns None. Return the value instead.'),
  ('missing-return-value','beginner','B3','Missing return','Every code path should return the expected value.'),
  ('missing-base-case','beginner','B3','Missing base case','Recursion needs a stop condition (base case), e.g. factorial(0) = 1.'),
  ('off-by-one-sequence','beginner','B3','Off-by-one sequence','Double-check the first two values of the sequence and loop bounds.'),
  ('ascii-wrap-confusion','beginner','B3','Wrap-around logic','When you go past z, wrap back to a using modulo 26.'),

  ('built-in-shortcut-misuse','beginner','B4','Built-in misuse','Try the manual pattern first: loop and track the best-so-far.'),
  ('order-not-preserved','beginner','B4','Order not preserved','A set loses order. Track “seen” and append to a list in order.'),
  ('case-sensitivity-missed','beginner','B4','Case sensitivity','Normalize first (e.g. s = s.lower()) before checking letters.'),
  ('dict-key-missing-error','beginner','B4','Missing dict key','Use dict.get(key, 0) + 1 (or check key exists first).'),
  ('split-join-confusion','beginner','B4','Split/join confusion','Strings are immutable: split → modify list → join back.'),

  ('dict-value-sort-confusion','intermediate','I1','Sort by dict values','sorted(d) sorts keys. Use sorted(d.items(), key=lambda x: x[1]).'),
  ('brute-force-only-thinking','intermediate','I1','Brute force instinct','Can a hashmap store “what you need” so you avoid nested loops?'),
  ('stack-empty-not-checked','intermediate','I1','Empty stack','Check stack before pop. Empty list is falsy.'),
  ('order-dependency-missed','intermediate','I1','Order dependency','If order matters, don’t use a set. Use dict/list tracking.'),
  ('wrong-data-structure-choice','intermediate','I1','Wrong data structure','Use deque for queues; list pop(0) is O(n).'),

  ('binary-search-boundary-wrong','intermediate','I2','Binary search boundary','Use left <= right and move boundaries correctly to avoid infinite loops.'),
  ('sort-swap-logic-wrong','intermediate','I2','Swap logic','Swapping needs a temp variable (or tuple swap).'),
  ('two-pointer-overwrite-error','intermediate','I2','Two-pointer overwrite','Use a separate write index so you don’t overwrite unread data.'),
  ('sliding-window-shrink-missed','intermediate','I2','Window shrink','When a duplicate enters, move left pointer until it’s removed.'),
  ('running-max-not-reset','intermediate','I2','Kadane reset','At each step: extend the current run, or start fresh at this element?'),

  ('no-memoization-used','intermediate','I3','No memoization','Cache results in a dict so recursion doesn’t repeat work.'),
  ('dp-array-direction-wrong','intermediate','I3','DP direction','Build dp so dp[i] depends only on earlier-computed values.'),
  ('visited-not-marked','intermediate','I3','Visited not marked','Mark visited before exploring neighbors to prevent revisits.'),
  ('recursive-halving-missed','intermediate','I3','Recursive halving','Halve exponent/size to get O(log n) instead of subtracting 1.'),
  ('type-check-before-recurse-missed','intermediate','I3','Missing type check','If item is a list: recurse. Else: add it to result.'),

  ('window-expiry-logic-wrong','intermediate','I4','Window expiry','Remove expired timestamps before checking the count.'),
  ('error-not-raised-for-invalid','intermediate','I4','Invalid state accepted','Validate inputs/state; raise an error or return a clear message.'),
  ('eviction-order-wrong','intermediate','I4','LRU eviction order','LRU evicts the least recently used: move_to_end on access; evict oldest.'),
  ('edge-case-not-handled','intermediate','I4','Edge cases','Handle empty/missing/malformed input up front.'),
  ('greedy-logic-incomplete','intermediate','I4','Greedy incomplete','Account for idle slots/cooldowns when scheduling tasks.'),

  ('traversal-order-wrong','advanced','A1','Traversal order','Inorder: left → node → right.'),
  ('bfs-level-boundary-missed','advanced','A1','BFS level boundary','Use queue size per level to group nodes correctly.'),
  ('visited-check-too-late','advanced','A1','Visited too late','Mark visited when you enqueue, not when you dequeue.'),
  ('max-heap-vs-min-heap-confusion','advanced','A1','Heap type','For K largest, keep a min-heap of size K and pop extras.'),
  ('recursion-stack-not-used','advanced','A1','Recursion stack','Cycle detection in directed graphs needs visited + recursion stack.'),

  ('collision-not-handled','advanced','A2','Collision handling','If a short code exists, add a counter/rehash to avoid collisions.'),
  ('window-boundary-off','advanced','A2','Boundary off-by-one','Use strict comparisons (< vs <=) for window expiry logic.'),
  ('fan-out-order-wrong','advanced','A2','Fan-out mutability','Avoid sharing a mutable message object across subscribers.')
ON CONFLICT (tag) DO NOTHING;

-- ================================================================
-- Attach sensor tags to existing seeded curriculum challenges (best-effort by title)
-- ================================================================
UPDATE challenges SET sensor_tag = 'type-conversion-missing' WHERE title ILIKE 'Add Two Numbers';
UPDATE challenges SET sensor_tag = 'operator-precedence-error' WHERE title ILIKE 'Celsius to Fahrenheit';
UPDATE challenges SET sensor_tag = 'modulo-confusion' WHERE title ILIKE 'Odd or Even';
UPDATE challenges SET sensor_tag = 'variable-assignment-confusion' WHERE title ILIKE 'Swap Two Values';
UPDATE challenges SET sensor_tag = 'condition-order-wrong' WHERE title ILIKE 'FizzBuzz';
UPDATE challenges SET sensor_tag = 'off-by-one-loop' WHERE title ILIKE 'Count Down';
UPDATE challenges SET sensor_tag = 'nested-loop-confusion' WHERE title ILIKE 'Star Pattern';
UPDATE challenges SET sensor_tag = 'boundary-condition-error' WHERE title ILIKE 'Grade Calculator';
UPDATE challenges SET sensor_tag = 'loop-termination-confusion' WHERE title ILIKE 'Sum of Digits';
UPDATE challenges SET sensor_tag = 'print-instead-of-return' WHERE title ILIKE 'Reverse a String';
UPDATE challenges SET sensor_tag = 'missing-return-value' WHERE title ILIKE 'Is Palindrome';
UPDATE challenges SET sensor_tag = 'missing-base-case' WHERE title ILIKE 'Factorial';
UPDATE challenges SET sensor_tag = 'off-by-one-sequence' WHERE title ILIKE 'Fibonacci';
UPDATE challenges SET sensor_tag = 'ascii-wrap-confusion' WHERE title ILIKE 'Caesar Cipher';
UPDATE challenges SET sensor_tag = 'built-in-shortcut-misuse' WHERE title ILIKE 'Find Maximum';
UPDATE challenges SET sensor_tag = 'dict-key-missing-error' WHERE title ILIKE 'Word Frequency';
UPDATE challenges SET sensor_tag = 'case-sensitivity-missed' WHERE title ILIKE 'Count Vowels';
UPDATE challenges SET sensor_tag = 'wrong-data-structure-choice' WHERE title ILIKE 'Queue Simulation';
UPDATE challenges SET sensor_tag = 'binary-search-boundary-wrong' WHERE title ILIKE 'Binary Search';
UPDATE challenges SET sensor_tag = 'sort-swap-logic-wrong' WHERE title ILIKE 'Bubble Sort';
UPDATE challenges SET sensor_tag = 'two-pointer-overwrite-error' WHERE title ILIKE 'Move Zeros';
UPDATE challenges SET sensor_tag = 'sliding-window-shrink-missed' WHERE title ILIKE 'Longest Substring%';
UPDATE challenges SET sensor_tag = 'dp-array-direction-wrong' WHERE title ILIKE 'Climbing Stairs';
UPDATE challenges SET sensor_tag = 'visited-not-marked' WHERE title ILIKE 'Count Islands';
UPDATE challenges SET sensor_tag = 'edge-case-not-handled' WHERE title ILIKE 'JSON Parser Lite';
UPDATE challenges SET sensor_tag = 'window-expiry-logic-wrong' WHERE title ILIKE 'Rate Limiter';
UPDATE challenges SET sensor_tag = 'eviction-order-wrong' WHERE title ILIKE 'LRU Cache';
UPDATE challenges SET sensor_tag = 'error-not-raised-for-invalid' WHERE title ILIKE 'Inventory System';
UPDATE challenges SET sensor_tag = 'greedy-logic-incomplete' WHERE title ILIKE 'Task Scheduler';
