-- ================================================================
-- IGNARA — Personalized transition event logging
-- Tracks whether students follow recommended transitions.
-- ================================================================

CREATE TABLE IF NOT EXISTS lesson_transition_events (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type           TEXT NOT NULL CHECK (event_type IN ('viewed','clicked','completed')),
  transition_type      TEXT NOT NULL CHECK (transition_type IN ('lesson','challenge','remediation')),
  unit_code            TEXT NOT NULL,
  recommended_item_id  UUID REFERENCES challenges(id),
  recommended_item_type TEXT NOT NULL DEFAULT 'challenge' CHECK (recommended_item_type IN ('challenge','lesson')),
  metadata             JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transition_events_user_time
  ON lesson_transition_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transition_events_type
  ON lesson_transition_events(transition_type, event_type);
