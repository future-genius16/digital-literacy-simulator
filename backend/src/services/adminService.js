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
       study_program,
       course,
       created_at,
       activated_at,
       updated_at
     FROM users
     ORDER BY id`
  )

  return result.rows
}

const createInvitedUser = async ({
  email,
  role = "student",
  study_program = null,
  course = null,
}) => {
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

  const normalizedCourse =
    course === "" || course === null || course === undefined
      ? null
      : Number(course)

  if (normalizedCourse !== null && (normalizedCourse < 1 || normalizedCourse > 6)) {
    const error = new Error("Course must be between 1 and 6")
    error.statusCode = 400
    throw error
  }

  const result = await pool.query(
    `INSERT INTO users (
       username,
       email,
       password,
       role,
       status,
       study_program,
       course,
       updated_at
     )
     VALUES ($1, $2, NULL, $3, 'invited', $4, $5, CURRENT_TIMESTAMP)
     ON CONFLICT (email) DO NOTHING
     RETURNING 
       id,
       email,
       role,
       status,
       study_program,
       course,
       created_at,
       activated_at,
       updated_at`,
    [normalizedEmail, normalizedEmail, role, study_program, normalizedCourse]
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
       study_program,
       course,
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

  const programsResult = await pool.query(
    `SELECT
       study_program,
       course,
       COUNT(*)::int AS students
     FROM users
     WHERE role = 'student'
     GROUP BY study_program, course
     ORDER BY study_program, course`
  )

  return {
    users: usersResult.rows[0],
    results: resultsResult.rows[0],
    modules: modulesResult.rows,
    programs: programsResult.rows,
  }
}

const allowedTaskTypes = [
  "single_choice",
  "multi_select",
  "risk_analysis",
  "permission_check",
]

const allowedModules = ["info", "phishing", "data"]

const getAllScenariosAdmin = async () => {
  const result = await pool.query(
    `SELECT *
     FROM scenarios
     ORDER BY module, level, id`
  )

  return result.rows
}

const createScenario = async ({
  module,
  title,
  text,
  option_a,
  option_b,
  option_c = null,
  option_d = null,
  option_e = null,
  correct_option = null,
  correct_options = null,
  option_feedback = null,
  explanation,
  level = 1,
  difficulty = "basic",
  task_type = "single_choice",
  digcomp_area = null,
  digcomp_competence = null,
  learning_outcome = null,
}) => {
  if (!allowedModules.includes(module)) {
    const error = new Error("Invalid module")
    error.statusCode = 400
    throw error
  }

  if (!allowedTaskTypes.includes(task_type)) {
    const error = new Error("Invalid task type")
    error.statusCode = 400
    throw error
  }

  if (!title || !text || !option_a || !option_b || !explanation) {
    const error = new Error("Title, text, options A/B and explanation are required")
    error.statusCode = 400
    throw error
  }

  const normalizedLevel = Number(level)

  if (normalizedLevel < 1 || normalizedLevel > 3) {
    const error = new Error("Level must be between 1 and 3")
    error.statusCode = 400
    throw error
  }

  let normalizedCorrectOption = correct_option
  let normalizedCorrectOptions = correct_options

  if (task_type === "single_choice" || task_type === "risk_analysis") {
    if (!correct_option) {
      const error = new Error("Correct option is required for this task type")
      error.statusCode = 400
      throw error
    }

    normalizedCorrectOptions = [correct_option]
  }

  if (task_type === "multi_select" || task_type === "permission_check") {
    if (!Array.isArray(correct_options) || correct_options.length === 0) {
      const error = new Error("Correct options array is required for this task type")
      error.statusCode = 400
      throw error
    }

    normalizedCorrectOption = correct_options[0]
  }

  const result = await pool.query(
  `INSERT INTO scenarios (
     module,
     title,
     text,
     option_a,
     option_b,
     option_c,
     option_d,
     option_e,
     correct_option,
     correct_options,
     explanation,
     level,
     difficulty,
     task_type,
     digcomp_area,
     digcomp_competence,
     learning_outcome,
     option_feedback,
     is_active
   )
   VALUES (
     $1, $2, $3, $4, $5, $6, $7, $8,
     $9, $10, $11, $12, $13, $14,
     $15, $16, $17, $18, true
   )
   RETURNING *`,
    [
      module,
      title,
      text,
      option_a,
      option_b,
      option_c,
      option_d,
      option_e,
      normalizedCorrectOption,
      JSON.stringify(normalizedCorrectOptions),
      explanation,
      normalizedLevel,
      difficulty,
      task_type,
      digcomp_area,
      digcomp_competence,
      learning_outcome,
      option_feedback ? JSON.stringify(option_feedback) : null,
    ]
  )

  return result.rows[0]
}

const updateScenario = async ({
  scenarioId,
  module,
  title,
  text,
  option_a,
  option_b,
  option_c = null,
  option_d = null,
  option_e = null,
  correct_option = null,
  correct_options = null,
  option_feedback = null,
  explanation,
  level = 1,
  difficulty = "basic",
  task_type = "single_choice",
  digcomp_area = null,
  digcomp_competence = null,
  learning_outcome = null,
  is_active = true,
}) => {
  if (!allowedModules.includes(module)) {
    const error = new Error("Invalid module")
    error.statusCode = 400
    throw error
  }

  if (!allowedTaskTypes.includes(task_type)) {
    const error = new Error("Invalid task type")
    error.statusCode = 400
    throw error
  }

  let normalizedCorrectOption = correct_option
  let normalizedCorrectOptions = correct_options

  if (task_type === "single_choice" || task_type === "risk_analysis") {
    if (!correct_option) {
      const error = new Error("Correct option is required for this task type")
      error.statusCode = 400
      throw error
    }

    normalizedCorrectOptions = [correct_option]
  }

  if (task_type === "multi_select" || task_type === "permission_check") {
    if (!Array.isArray(correct_options) || correct_options.length === 0) {
      const error = new Error("Correct options array is required for this task type")
      error.statusCode = 400
      throw error
    }

    normalizedCorrectOption = correct_options[0]
  }

  const result = await pool.query(
    `UPDATE scenarios
     SET module = $1,
         title = $2,
         text = $3,
         option_a = $4,
         option_b = $5,
         option_c = $6,
         option_d = $7,
         option_e = $8,
         correct_option = $9,
         correct_options = $10,
         explanation = $11,
         level = $12,
         difficulty = $13,
         task_type = $14,
         digcomp_area = $15,
         digcomp_competence = $16,
         learning_outcome = $17,
        option_feedback = $18,
        is_active = $19
     WHERE id = $20
     RETURNING *`,
    [
        module,
        title,
        text,
        option_a,
        option_b,
        option_c,
        option_d,
        option_e,
        normalizedCorrectOption,
        JSON.stringify(normalizedCorrectOptions),
        explanation,
        Number(level),
        difficulty,
        task_type,
        digcomp_area,
        digcomp_competence,
        learning_outcome,
        option_feedback ? JSON.stringify(option_feedback) : null,
        is_active,
        scenarioId,
    ]
  )

  if (result.rows.length === 0) {
    const error = new Error("Scenario not found")
    error.statusCode = 404
    throw error
  }

  return result.rows[0]
}

const deleteScenario = async (scenarioId) => {
  const result = await pool.query(
    `UPDATE scenarios
     SET is_active = false
     WHERE id = $1
     RETURNING *`,
    [scenarioId]
  )

  if (result.rows.length === 0) {
    const error = new Error("Scenario not found")
    error.statusCode = 404
    throw error
  }

  return result.rows[0]
}

module.exports = {
  getAllUsers,
  createInvitedUser,
  updateUserStatus,
  getAdminStatistics,
  getAllScenariosAdmin,
  createScenario,
  updateScenario,
  deleteScenario,
}