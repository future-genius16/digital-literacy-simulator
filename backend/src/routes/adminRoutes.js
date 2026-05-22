const express = require("express")
const adminController = require("../controllers/adminController")
const authenticateToken = require("../middleware/authMiddleware")
const requireAdmin = require("../middleware/adminMiddleware")

const router = express.Router()

router.get(
  "/admin/users",
  authenticateToken,
  requireAdmin,
  adminController.getUsers
)

router.post(
  "/admin/users",
  authenticateToken,
  requireAdmin,
  adminController.createUser
)

router.patch(
  "/admin/users/:id/status",
  authenticateToken,
  requireAdmin,
  adminController.updateStatus
)

router.get(
  "/admin/statistics",
  authenticateToken,
  requireAdmin,
  adminController.getStatistics
)

router.get(
  "/admin/scenarios",
  authenticateToken,
  requireAdmin,
  adminController.getScenarios
)

router.post(
  "/admin/scenarios",
  authenticateToken,
  requireAdmin,
  adminController.createScenario
)

router.put(
  "/admin/scenarios/:id",
  authenticateToken,
  requireAdmin,
  adminController.updateScenario
)

router.delete(
  "/admin/scenarios/:id",
  authenticateToken,
  requireAdmin,
  adminController.deleteScenario
)

router.patch(
  "/admin/scenarios/:id/active",
  authenticateToken,
  requireAdmin,
  adminController.updateScenarioActive
)

module.exports = router