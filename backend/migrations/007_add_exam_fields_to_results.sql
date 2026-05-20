-- Migration: add HSE independent exam fields to results

ALTER TABLE results
ADD COLUMN IF NOT EXISTS exam_section VARCHAR(30);

ALTER TABLE results
ADD COLUMN IF NOT EXISTS exam_task_number INTEGER;

ALTER TABLE results
ADD COLUMN IF NOT EXISTS exam_task_title VARCHAR(255);