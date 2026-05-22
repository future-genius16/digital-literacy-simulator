require("dotenv").config()
const pool = require("../config/db")

const run = async () => {
  try {
    const result = await pool.query(`
      SELECT id, exam_task_number
      FROM scenarios
      WHERE module = 'exam'
      ORDER BY exam_task_number, id;
    `)

    const countersByTask = {}

    for (const scenario of result.rows) {
      const taskNumber = scenario.exam_task_number || "unknown"

      countersByTask[taskNumber] = (countersByTask[taskNumber] || 0) + 1

      const questionNumber = countersByTask[taskNumber]

      const title = `Вопрос №${questionNumber}`

      await pool.query(
        `
          UPDATE scenarios
          SET title = $1
          WHERE id = $2;
        `,
        [title, scenario.id]
      )
    }

    console.log(`Готово! Переименовано ${result.rows.length} заданий.`)
  } catch (error) {
    console.error("Ошибка переименования заданий:", error)
  } finally {
    await pool.end()
  }
}

run()