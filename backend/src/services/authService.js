const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../config/db")

const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,50}$/

const registerUser = async ({ username, password }) => {
  if (!username || !password) {
    const error = new Error("Username and password are required")
    error.statusCode = 400
    throw error
  }

  if (!usernameRegex.test(username)) {
    const error = new Error(
      "Username must be 3-30 characters long and contain only Latin letters, numbers or underscore"
    )
    error.statusCode = 400
    throw error
  }

  if (!passwordRegex.test(password)) {
    const error = new Error(
      "Password must be 6-50 characters long and contain at least one letter and one number"
    )
    error.statusCode = 400
    throw error
  }

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  )

  if (existingUser.rows.length > 0) {
    const error = new Error("User already exists")
    error.statusCode = 400
    throw error
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await pool.query(
    `INSERT INTO users (username, password)
     VALUES ($1, $2)
     RETURNING id, username, created_at`,
    [username, hashedPassword]
  )

  return result.rows[0]
}

const loginUser = async ({ username, password }) => {
  if (!username || !password) {
    const error = new Error("Username and password are required")
    error.statusCode = 400
    throw error
  }

  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ])

  if (result.rows.length === 0) {
    const error = new Error("User not found")
    error.statusCode = 400
    throw error
  }

  const user = result.rows[0]
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    const error = new Error("Invalid password")
    error.statusCode = 400
    throw error
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  )

  return {
    message: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  }
}

module.exports = {
  registerUser,
  loginUser,
}