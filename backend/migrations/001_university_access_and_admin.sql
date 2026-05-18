-- Migration: university access model and admin support

ALTER TABLE users
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student';

ALTER TABLE users
ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'active';

ALTER TABLE users
ADD COLUMN IF NOT EXISTS activated_at TIMESTAMP;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users
ALTER COLUMN password DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
ON users (email);

-- Example university users for local development/demo
INSERT INTO users (username, email, password, role, status)
VALUES
  ('student1@edu.hse.ru', 'student1@edu.hse.ru', NULL, 'student', 'invited'),
  ('student2@edu.hse.ru', 'student2@edu.hse.ru', NULL, 'student', 'invited'),
  ('student3@edu.hse.ru', 'student3@edu.hse.ru', NULL, 'student', 'invited'),
  ('admin@edu.hse.ru', 'admin@edu.hse.ru', NULL, 'admin', 'invited')
ON CONFLICT (email) DO NOTHING;