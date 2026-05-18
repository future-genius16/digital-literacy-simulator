const authService = require("../services/authService")

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body)
    res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error registering user",
    })
  }
}

const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body)
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error logging in",
    })
  }
}

module.exports = {
  register,
  login,
}