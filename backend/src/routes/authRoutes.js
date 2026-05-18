const express = require("express")
const authController = require("../controllers/authController")

const router = express.Router()

router.post("/activate", authController.activate)
router.post("/register", authController.activate)
router.post("/login", authController.login)

module.exports = router