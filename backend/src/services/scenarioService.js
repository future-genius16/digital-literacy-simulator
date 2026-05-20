const pool = require("../config/db")

const getAllScenarios = async ({
  module,
  level,
  exam_section,
  exam_task_number,
} = {}) => {
  const conditions = []
  const values = []

  conditions.push("is_active = true")

  if (module) {
    values.push(module)
    conditions.push(`module = $${values.length}`)
  }

  if (level) {
    values.push(Number(level))
    conditions.push(`level = $${values.length}`)
  }

  if (exam_section) {
    values.push(exam_section)
    conditions.push(`exam_section = $${values.length}`)
  }

  if (exam_task_number) {
    values.push(Number(exam_task_number))
    conditions.push(`exam_task_number = $${values.length}`)
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

  const result = await pool.query(
    `SELECT *
     FROM scenarios
     ${whereClause}
     ORDER BY module, level, id`,
    values
  )

  return result.rows
}

module.exports = {
  getAllScenarios,
}