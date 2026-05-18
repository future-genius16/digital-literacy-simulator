const express = require("express")
const resultController = require("../controllers/resultController")
const authenticateToken = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/results", authenticateToken, resultController.saveResult)
router.get("/results", authenticateToken, resultController.getResults)

module.exports = router