const pool = require("../config/db")

const getAllScenarios = async () => {
  const result = await pool.query("SELECT * FROM scenarios ORDER BY id")
  return result.rows
}

module.exports = {
  getAllScenarios,
}