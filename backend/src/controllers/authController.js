const authService = require("../services/authService")

const activate = async (req, res) => {
  try {
    const data = await authService.activateAccount(req.body)
    res.status(201).json(data)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error activating account",
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
  activate,
  login,
}