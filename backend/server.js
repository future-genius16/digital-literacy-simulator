require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Pool } = require("pg")

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors())

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Invalid or expired token" })
    }

    req.user = user
    next()
  })
}

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

app.post("/results", authenticateToken, async (req, res) => {
  const { module, score, total_questions } = req.body
  const user_id = req.user.id

  try {
    const result = await pool.query(
      `INSERT INTO results (user_id, module, score, total_questions)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, module, score, total_questions]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send("Error saving result")
  }
})

app.get("/results", authenticateToken, async (req, res) => {
  const user_id = req.user.id

  try {
    const result = await pool.query(
      `SELECT results.*, users.username
       FROM results
       LEFT JOIN users ON results.user_id = users.id
       WHERE results.user_id = $1
       ORDER BY results.created_at DESC`,
      [user_id]
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

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    )

    res.json({
      message: "Login successful",
      token,
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