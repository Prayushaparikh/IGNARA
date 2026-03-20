-- ================================================================
-- IGNARA — Seed additional careers referenced by UI/quiz
-- Fixes FK errors when quiz suggests a career not present in `careers`.
-- ================================================================

INSERT INTO careers (id, title, description, avg_salary, growth_rate, icon, trait_vector, required_skills, challenge_tags)
VALUES
  ('ml-engineer', 'ML Engineer', 'Teach computers to learn from data.', '$110k–$180k', '34%', '🤖',
   '{"PROBLEM_SOLVING":0.8,"SYSTEMS_THINKING":0.7,"CREATIVITY":0.5,"COLLABORATION":0.5,"DATA_AFFINITY":1.0,"CURIOSITY":0.9}',
   ARRAY['python','ml-basics','math','data-viz'], ARRAY['arrays','sorting','math','recursion']),

  ('game-developer', 'Game Developer', 'Build interactive worlds and gameplay.', '$80k–$140k', '12%', '🎮',
   '{"PROBLEM_SOLVING":0.8,"SYSTEMS_THINKING":0.6,"CREATIVITY":1.0,"COLLABORATION":0.6,"DATA_AFFINITY":0.4,"CURIOSITY":0.7}',
   ARRAY['math','algorithms','debugging','graphics'], ARRAY['loops','math','functions','OOP']),

  ('mobile-developer', 'Mobile Developer', 'Build apps people use daily.', '$90k–$150k', '18%', '📱',
   '{"PROBLEM_SOLVING":0.7,"SYSTEMS_THINKING":0.7,"CREATIVITY":0.7,"COLLABORATION":0.7,"DATA_AFFINITY":0.4,"CURIOSITY":0.7}',
   ARRAY['ui','performance','debugging','apis'], ARRAY['strings','functions','arrays','OOP']),

  ('cloud-architect', 'Cloud Architect', 'Design scalable infrastructure.', '$120k–$190k', '20%', '☁️',
   '{"PROBLEM_SOLVING":0.9,"SYSTEMS_THINKING":1.0,"CREATIVITY":0.4,"COLLABORATION":0.6,"DATA_AFFINITY":0.6,"CURIOSITY":0.8}',
   ARRAY['docker','aws','networking','databases'], ARRAY['system-design','performance','debugging','apis']),

  ('blockchain-developer', 'Blockchain Developer', 'Build smart contracts and decentralized apps.', '$100k–$170k', '15%', '⛓️',
   '{"PROBLEM_SOLVING":0.8,"SYSTEMS_THINKING":0.8,"CREATIVITY":0.6,"COLLABORATION":0.5,"DATA_AFFINITY":0.5,"CURIOSITY":0.8}',
   ARRAY['cryptography','security','solidity','debugging'], ARRAY['algorithms','data-structures','security','OOP'])
ON CONFLICT (id) DO NOTHING;

