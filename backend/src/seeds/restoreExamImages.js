require("dotenv").config()
const pool = require("../config/db")

const imageMappings = [
  { exam_task_number: 3, questionIndex: 1, image_url: "/images/tasks/task-3-question-1.png" },
  { exam_task_number: 3, questionIndex: 2, image_url: "/images/tasks/task-3-question-3.png" },
  { exam_task_number: 3, questionIndex: 3, image_url: "/images/tasks/task-3-question-4.png" },
  { exam_task_number: 3, questionIndex: 5, image_url: "/images/tasks/task-3-question-6.png" },
  { exam_task_number: 3, questionIndex: 8, image_url: "/images/tasks/task-3-question-10.png" },
  { exam_task_number: 3, questionIndex: 9, image_url: "/images/tasks/task-3-question-11.png" },
  { exam_task_number: 3, questionIndex: 10, image_url: "/images/tasks/task-3-question-12.png" },
  { exam_task_number: 3, questionIndex: 12, image_url: "/images/tasks/task-3-question-14.png" },
  { exam_task_number: 3, questionIndex: 13, image_url: "/images/tasks/task-3-question-15.png" },
  { exam_task_number: 3, questionIndex: 15, image_url: "/images/tasks/task-3-question-17.png" },
  { exam_task_number: 7, questionIndex: 3, image_url: "/images/tasks/task-7-question-3.png" },
  { exam_task_number: 7, questionIndex: 7, image_url: "/images/tasks/task-7-question-10.png" },
  { exam_task_number: 9, questionIndex: 2, image_url: "/images/tasks/task-9-question-2.png" },
  { exam_task_number: 9, questionIndex: 3, image_url: "/images/tasks/task-9-question-3.png" },
  { exam_task_number: 9, questionIndex: 4, image_url: "/images/tasks/task-9-question-4.png" },
  { exam_task_number: 9, questionIndex: 5, image_url: "/images/tasks/task-9-question-5.png" },
  { exam_task_number: 9, questionIndex: 12, image_url: "/images/tasks/task-9-question-13.png" },
  { exam_task_number: 9, questionIndex: 13, image_url: "/images/tasks/task-9-question-14.png" },
  { exam_task_number: 9, questionIndex: 16, image_url: "/images/tasks/task-9-question-17.png" },
  { exam_task_number: 9, questionIndex: 18, image_url: "/images/tasks/task-9-question-19.png" },
]

const run = async () => {
  try {
    console.log("Очищаем старые image_url...")
    await pool.query("UPDATE scenarios SET image_url = NULL WHERE module = 'exam';")

    let updated = 0

    for (const mapping of imageMappings) {
      const result = await pool.query(
        `WITH numbered AS (
          SELECT
            id,
            ROW_NUMBER() OVER (PARTITION BY exam_task_number ORDER BY id) AS question_index
          FROM scenarios
          WHERE module = 'exam'
            AND exam_task_number = $1
            AND task_type <> 'sequence'
        )
        UPDATE scenarios s
        SET image_url = $2
        FROM numbered n
        WHERE s.id = n.id
          AND n.question_index = $3
        RETURNING s.id, s.exam_task_number, s.title, s.image_url;`,
        [mapping.exam_task_number, mapping.image_url, mapping.questionIndex]
      )

      if (result.rows.length === 0) {
        console.warn(
          `Не найдено задание: НЭ ${mapping.exam_task_number}, вопрос ${mapping.questionIndex}`
        )
      } else {
        updated += result.rows.length
      }
    }

    console.log(`Готово! Картинки проставлены для ${updated} заданий.`)
  } catch (error) {
    console.error("Ошибка восстановления картинок:", error)
  } finally {
    await pool.end()
  }
}

run()
