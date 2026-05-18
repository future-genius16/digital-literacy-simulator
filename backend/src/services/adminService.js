const pool = require("../config/db")

const allowedStatuses = [
  "invited",
  "active",
  "academic_leave",
  "graduated",
  "blocked",
]

const allowedRoles = ["student", "admin"]

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT 
       id,
       email,
       role,
       status,
       created_at,
       activated_at,
       updated_at
     FROM users
     ORDER BY id`
  )

  return result.rows
}

const createInvitedUser = async ({ email, role = "student" }) => {
  if (!email) {
    const error = new Error("Email is required")
    error.statusCode = 400
    throw error
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (!allowedRoles.includes(role)) {
    const error = new Error("Invalid role")
    error.statusCode = 400
    throw error
  }

  const result = await pool.query(
    `INSERT INTO users (username, email, password, role, status, updated_at)
     VALUES ($1, $2, NULL, $3, 'invited', CURRENT_TIMESTAMP)
     ON CONFLICT (email) DO NOTHING
     RETURNING 
       id,
       email,
       role,
       status,
       created_at,
       activated_at,
       updated_at`,
    [normalizedEmail, normalizedEmail, role]
  )

  if (result.rows.length === 0) {
    const error = new Error("User with this email already exists")
    error.statusCode = 400
    throw error
  }

  return result.rows[0]
}

const updateUserStatus = async ({ userId, status }) => {
  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid user status")
    error.statusCode = 400
    throw error
  }

  const result = await pool.query(
    `UPDATE users
     SET status = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING 
       id,
       email,
       role,
       status,
       created_at,
       activated_at,
       updated_at`,
    [status, userId]
  )

  if (result.rows.length === 0) {
    const error = new Error("User not found")
    error.statusCode = 404
    throw error
  }

  return result.rows[0]
}

const getAdminStatistics = async () => {
  const usersResult = await pool.query(
    `SELECT
       COUNT(*)::int AS total_users,
       COUNT(*) FILTER (WHERE role = 'student')::int AS total_students,
       COUNT(*) FILTER (WHERE role = 'admin')::int AS total_admins,
       COUNT(*) FILTER (WHERE status = 'invited')::int AS invited_users,
       COUNT(*) FILTER (WHERE status = 'active')::int AS active_users,
       COUNT(*) FILTER (WHERE status = 'academic_leave')::int AS academic_leave_users,
       COUNT(*) FILTER (WHERE status = 'graduated')::int AS graduated_users,
       COUNT(*) FILTER (WHERE status = 'blocked')::int AS blocked_users
     FROM users`
  )

  const resultsResult = await pool.query(
    `SELECT
       COUNT(*)::int AS total_attempts,
       ROUND(AVG(score)::numeric, 2) AS average_score,
       ROUND(AVG((score::decimal / NULLIF(total_questions, 0)) * 100), 2) AS average_percentage
     FROM results`
  )

  const modulesResult = await pool.query(
    `SELECT
       module,
       COUNT(*)::int AS attempts,
       ROUND(AVG(score)::numeric, 2) AS average_score,
       ROUND(AVG((score::decimal / NULLIF(total_questions, 0)) * 100), 2) AS average_percentage
     FROM results
     GROUP BY module
     ORDER BY module`
  )

  return {
    users: usersResult.rows[0],
    results: resultsResult.rows[0],
    modules: modulesResult.rows,
  }
}

module.exports = {
  getAllUsers,
  createInvitedUser,
  updateUserStatus,
  getAdminStatistics,
}