-- Migration: levels, progress tracking and DigComp metadata

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS difficulty VARCHAR(30) DEFAULT 'basic';

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS task_type VARCHAR(50) DEFAULT 'single_choice';

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS digcomp_area VARCHAR(150);

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS digcomp_competence VARCHAR(200);

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS learning_outcome TEXT;

ALTER TABLE results
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module VARCHAR(50) NOT NULL,
  level INTEGER NOT NULL,
  is_unlocked BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  best_score INTEGER DEFAULT 0,
  best_percentage NUMERIC(5,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module, level)
);

UPDATE scenarios
SET
  level = 1,
  difficulty = 'basic',
  task_type = 'single_choice'
WHERE level IS NULL OR level = 1;

UPDATE scenarios
SET
  digcomp_area = 'Information and data literacy',
  digcomp_competence = 'Evaluating data, information and digital content',
  learning_outcome = 'The learner can verify digital information using official and reliable sources.'
WHERE module = 'info';

UPDATE scenarios
SET
  digcomp_area = 'Safety',
  digcomp_competence = 'Protecting devices and personal data',
  learning_outcome = 'The learner can identify suspicious messages and choose safer verification methods.'
WHERE module = 'phishing';

UPDATE scenarios
SET
  digcomp_area = 'Safety',
  digcomp_competence = 'Protecting personal data and privacy',
  learning_outcome = 'The learner can evaluate digital privacy risks and limit unnecessary data access.'
WHERE module = 'data';