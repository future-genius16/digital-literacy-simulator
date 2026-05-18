const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../config/db")

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,50}$/

const normalizeEmail = (email) => {
  return email.trim().toLowerCase()
}

const validateEmailAndPassword = ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required")
    error.statusCode = 400
    throw error
  }

  if (!emailRegex.test(email)) {
    const error = new Error("Please enter a valid email address")
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
}

const activateAccount = async ({ email, password }) => {
  validateEmailAndPassword({ email, password })

  const normalizedEmail = normalizeEmail(email)

  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    normalizedEmail,
  ])

  if (userResult.rows.length === 0) {
    const error = new Error("This email is not allowed to access the simulator")
    error.statusCode = 403
    throw error
  }

  const user = userResult.rows[0]

  if (user.status === "blocked") {
    const error = new Error("This account is blocked")
    error.statusCode = 403
    throw error
  }

  if (user.status === "academic_leave") {
    const error = new Error("This account is temporarily inactive")
    error.statusCode = 403
    throw error
  }

  if (user.status === "graduated") {
    const error = new Error("This account is no longer active")
    error.statusCode = 403
    throw error
  }

  if (user.status === "active" && user.password) {
    const error = new Error("Account is already activated. Please log in.")
    error.statusCode = 400
    throw error
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await pool.query(
    `UPDATE users
     SET password = $1,
         status = 'active',
         activated_at = COALESCE(activated_at, CURRENT_TIMESTAMP),
         updated_at = CURRENT_TIMESTAMP
     WHERE email = $2
     RETURNING id, email, role, status, activated_at, created_at`,
    [hashedPassword, normalizedEmail]
  )

  return {
    message: "Account activated successfully. Please log in.",
    user: result.rows[0],
  }
}

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required")
    error.statusCode = 400
    throw error
  }

  const normalizedEmail = normalizeEmail(email)

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    normalizedEmail,
  ])

  if (result.rows.length === 0) {
    const error = new Error("User not found")
    error.statusCode = 400
    throw error
  }

  const user = result.rows[0]

  if (!user.password || user.status === "invited") {
    const error = new Error("Account is not activated. Please activate it first.")
    error.statusCode = 400
    throw error
  }

  if (user.status !== "active") {
    const error = new Error("Account is not active")
    error.statusCode = 403
    throw error
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    const error = new Error("Invalid password")
    error.statusCode = 400
    throw error
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  )

  return {
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  }
}

module.exports = {
  activateAccount,
  loginUser,
}