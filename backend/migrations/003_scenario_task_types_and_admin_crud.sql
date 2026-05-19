-- Migration: scenario task types and admin CRUD support

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS option_d TEXT;

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS option_e TEXT;

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS correct_options JSONB;

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

UPDATE scenarios
SET correct_options = jsonb_build_array(correct_option)
WHERE correct_options IS NULL;
