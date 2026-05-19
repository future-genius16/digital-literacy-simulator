const express = require("express")
const resultController = require("../controllers/resultController")
const authenticateToken = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/results", authenticateToken, resultController.saveResult)
router.get("/results", authenticateToken, resultController.getResults)
router.get(
  "/results/summary",
  authenticateToken,
  resultController.getResultsSummary
)

module.exports = router