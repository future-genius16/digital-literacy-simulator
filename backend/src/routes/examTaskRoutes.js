const express = require("express")
const examTaskController = require("../controllers/examTaskController")
const authenticateToken = require("../middleware/authMiddleware")
const requireAdmin = require("../middleware/adminMiddleware")

const router = express.Router()

router.get("/exam-tasks", examTaskController.getExamTasks)
router.get("/exam-tasks/:taskNumber", examTaskController.getExamTask)

router.patch(
  "/exam-tasks/:taskNumber",
  authenticateToken,
  requireAdmin,
  examTaskController.updateExamTask
)

module.exports = router