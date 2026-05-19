const pool = require("../config/db")

const getAllScenarios = async ({ module, level } = {}) => {
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