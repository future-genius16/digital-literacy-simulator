const pool = require("../config/db")

const saveResult = async ({ userId, module, score, totalQuestions }) => {
  const result = await pool.query(
    `INSERT INTO results (user_id, module, score, total_questions)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, module, score, totalQuestions]
  )

  return result.rows[0]
}

const getUserResults = async (userId) => {
  const result = await pool.query(
    `SELECT results.*, users.username
     FROM results
     LEFT JOIN users ON results.user_id = users.id
     WHERE results.user_id = $1
     ORDER BY results.created_at DESC`,
    [userId]
  )

  return result.rows
}

module.exports = {
  saveResult,
  getUserResults,
}