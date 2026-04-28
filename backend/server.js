const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
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

app.get("/results", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM results ORDER BY created_at DESC"
    )
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error fetching results")
  }
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (username, password)
       VALUES ($1, $2)
       RETURNING id, username, created_at`,
      [username, hashedPassword]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send("Error registering user")
  }
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" })
    }

    const user = result.rows[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" })
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error logging in")
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})