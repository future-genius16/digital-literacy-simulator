const express = require("express")
const scenarioController = require("../controllers/scenarioController")

const router = express.Router()

router.get("/scenarios", scenarioController.getScenarios)

module.exports = router