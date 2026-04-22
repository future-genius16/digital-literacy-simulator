const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors())

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digital_literacy_simulator",
  password: "postgres123",
  port: 5432,
})

app.get("/", (req, res) => {
  res.send("Backend is running")
})

app.get("/scenarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM scenarios")
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error")
  }
})

app.post("/results", async (req, res) => {
  const { module, score, total_questions } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO results (module, score, total_questions)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [module, score, total_questions]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send("Error saving result")
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})