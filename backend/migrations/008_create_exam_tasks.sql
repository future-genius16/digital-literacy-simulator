-- Migration: create HSE exam tasks metadata table

CREATE TABLE IF NOT EXISTS exam_tasks (
  id SERIAL PRIMARY KEY,
  task_number INTEGER UNIQUE NOT NULL CHECK (task_number BETWEEN 1 AND 14),
  section VARCHAR(30) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  knowledge JSONB DEFAULT '[]'::jsonb,
  materials JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO exam_tasks (
  task_number,
  section,
  title,
  description,
  knowledge,
  materials
)
VALUES (
  1,
  'theoretical',
  'Безопасность. Поиск',
  'Фишинг, спам, SMS-угрозы, разрешения приложений и безопасный поиск.',
  '[
    "Антивирусная защита и её границы применимости",
    "Фишинг",
    "SMS-угрозы",
    "Разрешения приложений",
    "Магазины приложений",
    "Спам и критерии спама",
    "Поиск и ключевые слова"
  ]'::jsonb,
  '[
    {
      "category": "Компьютерная безопасность",
      "links": [
        {
          "title": "Спам в почте, социальных сетях и прочих платформах",
          "url": "https://edu.hse.ru/mod/page/view.php?id=507530"
        },
        {
          "title": "Какой бывает спам",
          "url": "https://edu.hse.ru/mod/page/view.php?id=507532"
        },
        {
          "title": "Социальные угрозы. Кто может разговаривать с незнакомцами?",
          "url": "https://edu.hse.ru/mod/page/view.php?id=507547"
        },
        {
          "title": "Мошенничество и фишинг: социальная инженерия",
          "url": "https://edu.hse.ru/mod/page/view.php?id=507543"
        },
        {
          "title": "Угрозы для устройств Android и iOS",
          "url": "https://edu.hse.ru/mod/page/view.php?id=507520"
        }
      ]
    },
    {
      "category": "Академическая грамотность",
      "links": [
        {
          "title": "Введение: как найти нужную статью",
          "url": "https://edu.hse.ru/mod/page/view.php?id=507661"
        }
      ]
    },
    {
      "category": "Компьютерная грамотность",
      "links": [
        {
          "title": "Установка / Обновление",
          "url": "https://edu.hse.ru/mod/page/view.php?id=507657"
        }
      ]
    }
  ]'::jsonb
)
ON CONFLICT (task_number) DO UPDATE
SET section = EXCLUDED.section,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    knowledge = EXCLUDED.knowledge,
    materials = EXCLUDED.materials,
    updated_at = CURRENT_TIMESTAMP;