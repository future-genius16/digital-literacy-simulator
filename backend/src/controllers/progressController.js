const progressService = require("../services/progressService")

const getProgress = async (req, res) => {
  try {
    const progress = await progressService.getUserProgress(req.user.id)
    res.json(progress)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching progress" })
  }
}

module.exports = {
  getProgress,
}