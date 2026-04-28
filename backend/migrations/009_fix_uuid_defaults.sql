-- Switch all UUID primary keys from uuid_generate_v4() (requires uuid-ossp extension)
-- to gen_random_uuid() which is built into PostgreSQL 13+ with no extension needed.
ALTER TABLE users                   ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE classes                 ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE quiz_results            ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE challenges              ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE submissions             ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE submission_misconceptions ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE lesson_transition_events  ALTER COLUMN id SET DEFAULT gen_random_uuid();
