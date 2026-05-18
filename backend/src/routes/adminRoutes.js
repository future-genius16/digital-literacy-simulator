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

module.exports = router