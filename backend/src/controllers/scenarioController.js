const scenarioService = require("../services/scenarioService")

const getScenarios = async (req, res) => {
  try {
    const scenarios = await scenarioService.getAllScenarios({
      module: req.query.module,
      level: req.query.level,
    })

    res.json(scenarios)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching scenarios" })
  }
}

module.exports = {
  getScenarios,
}