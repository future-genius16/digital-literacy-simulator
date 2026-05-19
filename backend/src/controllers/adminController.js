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

const getScenarios = async (req, res) => {
  try {
    const scenarios = await adminService.getAllScenariosAdmin()
    res.json(scenarios)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching scenarios" })
  }
}

const createScenario = async (req, res) => {
  try {
    const scenario = await adminService.createScenario(req.body)
    res.status(201).json(scenario)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error creating scenario",
    })
  }
}

const updateScenario = async (req, res) => {
  try {
    const scenario = await adminService.updateScenario({
      scenarioId: req.params.id,
      ...req.body,
    })

    res.json(scenario)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error updating scenario",
    })
  }
}

const deleteScenario = async (req, res) => {
  try {
    const scenario = await adminService.deleteScenario(req.params.id)
    res.json(scenario)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error deleting scenario",
    })
  }
}

module.exports = {
  getUsers,
  createUser,
  updateStatus,
  getStatistics,
  getScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
}