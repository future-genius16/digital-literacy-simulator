const resultService = require("../services/resultService")

const saveResult = async (req, res) => {
  const { module, level = 1, score, total_questions } = req.body
  const userId = req.user.id

  try {
    const result = await resultService.saveResult({
      userId,
      module,
      level,
      score,
      totalQuestions: total_questions,
    })

    res.status(201).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error saving result" })
  }
}

const getResults = async (req, res) => {
  const userId = req.user.id

  try {
    const results = await resultService.getUserResults(userId)
    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching results" })
  }
}

const getResultsSummary = async (req, res) => {
  const userId = req.user.id

  try {
    const summary = await resultService.getUserResultsSummary(userId)
    res.json(summary)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching results summary" })
  }
}

module.exports = {
  saveResult,
  getResults,
  getResultsSummary,
}