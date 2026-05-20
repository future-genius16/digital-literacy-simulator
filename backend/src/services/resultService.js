const pool = require("../config/db")
const progressService = require("./progressService")

const saveResult = async ({
  userId,
  module,
  level = 1,
  score,
  totalQuestions,
  exam_section = null,
  exam_task_number = null,
  exam_task_title = null,
}) => {
  const result = await pool.query(
    `INSERT INTO results (
       user_id,
       module,
       level,
       score,
       total_questions,
       exam_section,
       exam_task_number,
       exam_task_title
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      userId,
      module,
      level,
      score,
      totalQuestions,
      exam_section,
      exam_task_number ? Number(exam_task_number) : null,
      exam_task_title,
    ]
  )

  await progressService.updateProgressAfterResult({
    userId,
    module,
    level,
    score,
    totalQuestions,
  })

  return result.rows[0]
}

const getUserResults = async (userId) => {
  const result = await pool.query(
    `SELECT results.*, users.email
     FROM results
     LEFT JOIN users ON results.user_id = users.id
     WHERE results.user_id = $1
     ORDER BY results.created_at DESC`,
    [userId]
  )

  return result.rows
}

const getUserResultsSummary = async (userId) => {
  const result = await pool.query(
    `SELECT
       module,
       level,
       COUNT(*)::int AS attempts,
       MAX(score)::int AS best_score,
       MAX(total_questions)::int AS total_questions,
       ROUND(MAX((score::decimal / NULLIF(total_questions, 0)) * 100), 2) AS best_percentage
     FROM results
     WHERE user_id = $1
     GROUP BY module, level
     ORDER BY module, level`,
    [userId]
  )

  return result.rows
}

module.exports = {
  saveResult,
  getUserResults,
  getUserResultsSummary,
}