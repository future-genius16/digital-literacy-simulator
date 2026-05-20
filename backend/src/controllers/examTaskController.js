const examTaskService = require("../services/examTaskService")

const getExamTasks = async (req, res) => {
  try {
    const tasks = await examTaskService.getAllExamTasks()
    res.json(tasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching exam tasks" })
  }
}

const getExamTask = async (req, res) => {
  try {
    const task = await examTaskService.getExamTaskByNumber(
      Number(req.params.taskNumber)
    )

    res.json(task)
  } catch (error) {
    console.error(error)
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error fetching exam task" })
  }
}

const updateExamTask = async (req, res) => {
  const { section, title, description, knowledge, materials } = req.body

  if (!section || !title) {
    return res.status(400).json({
      message: "Section and title are required",
    })
  }

  try {
    const task = await examTaskService.updateExamTask({
      taskNumber: Number(req.params.taskNumber),
      section,
      title,
      description,
      knowledge,
      materials,
    })

    res.json(task)
  } catch (error) {
    console.error(error)
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error updating exam task" })
  }
}

module.exports = {
  getExamTasks,
  getExamTask,
  updateExamTask,
}