const express = require("express")
const progressController = require("../controllers/progressController")
const authenticateToken = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/progress", authenticateToken, progressController.getProgress)

module.exports = router