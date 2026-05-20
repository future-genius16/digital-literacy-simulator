-- Migration: add HSE independent exam fields to scenarios

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS exam_section VARCHAR(30);

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS exam_task_number INTEGER;

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS exam_task_title VARCHAR(255);

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS exam_topic TEXT;

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS course_materials TEXT;

UPDATE scenarios
SET exam_section = COALESCE(exam_section, 'legacy'),
    exam_task_number = COALESCE(exam_task_number, 0),
    exam_task_title = COALESCE(exam_task_title, 'Legacy training task'),
    exam_topic = COALESCE(exam_topic, 'Previous version of digital literacy training'),
    course_materials = COALESCE(course_materials, 'Previous DigComp-based content')
WHERE exam_section IS NULL
   OR exam_task_number IS NULL
   OR exam_task_title IS NULL
   OR exam_topic IS NULL
   OR course_materials IS NULL;