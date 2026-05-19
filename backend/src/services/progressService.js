const pool = require("../config/db")

const MODULES = ["info", "phishing", "data"]
const LEVELS = [1, 2, 3]
const PASS_PERCENTAGE = 80

const ensureDefaultProgress = async (userId) => {
  for (const module of MODULES) {
    for (const level of LEVELS) {
      const isUnlocked = level === 1

      await pool.query(
        `INSERT INTO user_progress (
           user_id,
           module,
           level,
           is_unlocked,
           is_completed,
           best_score,
           best_percentage,
           updated_at
         )
         VALUES ($1, $2, $3, $4, false, 0, 0, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, module, level) DO NOTHING`,
        [userId, module, level, isUnlocked]
      )
    }
  }
}

const getUserProgress = async (userId) => {
  await ensureDefaultProgress(userId)

  const result = await pool.query(
    `SELECT
       id,
       user_id,
       module,
       level,
       is_unlocked,
       is_completed,
       best_score,
       best_percentage,
       updated_at
     FROM user_progress
     WHERE user_id = $1
     ORDER BY module, level`,
    [userId]
  )

  return result.rows
}

const updateProgressAfterResult = async ({
  userId,
  module,
  level,
  score,
  totalQuestions,
}) => {
  await ensureDefaultProgress(userId)

  const percentage =
    totalQuestions > 0 ? Number(((score / totalQuestions) * 100).toFixed(2)) : 0

  const isCompleted = percentage >= PASS_PERCENTAGE

  await pool.query(
    `INSERT INTO user_progress (
       user_id,
       module,
       level,
       is_unlocked,
       is_completed,
       best_score,
       best_percentage,
       updated_at
     )
     VALUES ($1, $2, $3, true, $4, $5, $6, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, module, level)
     DO UPDATE SET
       is_unlocked = true,
       is_completed = user_progress.is_completed OR EXCLUDED.is_completed,
       best_score = GREATEST(user_progress.best_score, EXCLUDED.best_score),
       best_percentage = GREATEST(user_progress.best_percentage, EXCLUDED.best_percentage),
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, module, level, isCompleted, score, percentage]
  )

  if (isCompleted && level < 3) {
    await pool.query(
      `INSERT INTO user_progress (
         user_id,
         module,
         level,
         is_unlocked,
         is_completed,
         best_score,
         best_percentage,
         updated_at
       )
       VALUES ($1, $2, $3, true, false, 0, 0, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, module, level)
       DO UPDATE SET
         is_unlocked = true,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, module, level + 1]
    )
  }

  return getUserProgress(userId)
}

module.exports = {
  MODULES,
  LEVELS,
  PASS_PERCENTAGE,
  getUserProgress,
  updateProgressAfterResult,
}