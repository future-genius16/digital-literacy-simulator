const resultService = require("../services/resultService")

const saveResult = async (req, res) => {
  const { module, score, total_questions } = req.body
  const userId = req.user.id

  try {
    const result = await resultService.saveResult({
      userId,
      module,
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

module.exports = {
  saveResult,
  getResults,
}