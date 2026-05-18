const adminService = require("../services/adminService")

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching users" })
  }
}

const createUser = async (req, res) => {
  try {
    const user = await adminService.createInvitedUser(req.body)
    res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error creating user",
    })
  }
}

const updateStatus = async (req, res) => {
  try {
    const user = await adminService.updateUserStatus({
      userId: req.params.id,
      status: req.body.status,
    })

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error updating user status",
    })
  }
}

const getStatistics = async (req, res) => {
  try {
    const statistics = await adminService.getAdminStatistics()
    res.json(statistics)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching statistics" })
  }
}

module.exports = {
  getUsers,
  createUser,
  updateStatus,
  getStatistics,
}