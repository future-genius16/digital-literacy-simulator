require("dotenv").config()
const pool = require("../config/db")

const run = async () => {
  try {
    const result = await pool.query(`
      SELECT id, exam_task_number, title, image_url
      FROM scenarios
      WHERE module = 'exam'
        AND image_url IS NOT NULL
        AND image_url <> ''
      ORDER BY exam_task_number, id;
    `)

    console.log(`Заданий с картинками в базе: ${result.rows.length}`)
    console.table(result.rows)
  } catch (error) {
    console.error(error)
  } finally {
    await pool.end()
  }
}

run()