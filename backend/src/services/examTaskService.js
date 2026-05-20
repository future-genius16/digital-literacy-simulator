const pool = require("../config/db")

const getAllExamTasks = async () => {
  const result = await pool.query(
    `SELECT 
       id,
       task_number,
       section,
       title,
       description,
       knowledge,
       materials,
       created_at,
       updated_at
     FROM exam_tasks
     ORDER BY task_number`
  )

  return result.rows
}

const getExamTaskByNumber = async (taskNumber) => {
  const result = await pool.query(
    `SELECT 
       id,
       task_number,
       section,
       title,
       description,
       knowledge,
       materials,
       created_at,
       updated_at
     FROM exam_tasks
     WHERE task_number = $1`,
    [taskNumber]
  )

  if (result.rows.length === 0) {
    const error = new Error("Exam task not found")
    error.statusCode = 404
    throw error
  }

  return result.rows[0]
}

const updateExamTask = async ({
  taskNumber,
  section,
  title,
  description,
  knowledge,
  materials,
}) => {
  const result = await pool.query(
    `UPDATE exam_tasks
     SET section = $1,
         title = $2,
         description = $3,
         knowledge = $4,
         materials = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE task_number = $6
     RETURNING 
       id,
       task_number,
       section,
       title,
       description,
       knowledge,
       materials,
       created_at,
       updated_at`,
    [
      section,
      title,
      description,
      JSON.stringify(knowledge || []),
      JSON.stringify(materials || []),
      taskNumber,
    ]
  )

  if (result.rows.length === 0) {
    const error = new Error("Exam task not found")
    error.statusCode = 404
    throw error
  }

  return result.rows[0]
}

module.exports = {
  getAllExamTasks,
  getExamTaskByNumber,
  updateExamTask,
}