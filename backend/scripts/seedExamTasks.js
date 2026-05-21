const path = require("path")
const { pathToFileURL } = require("url")

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
})

const pool = require("../src/config/db")

const examTasksPath = path.join(
  __dirname,
  "../../frontend/src/examTasks.js"
)

const normalizeMaterials = (materials = []) => {
  return materials.map((group) => ({
    category: group.category,
    links: (group.links || []).map((link) => ({
      title: link.title,
      url: link.url,
    })),
  }))
}

const seedExamTasks = async () => {
  const examTasksModule = await import(pathToFileURL(examTasksPath).href)
  const examTasks = examTasksModule.examTasks

  for (const task of examTasks) {
    await pool.query(
      `INSERT INTO exam_tasks (
         task_number,
         section,
         title,
         description,
         knowledge,
         materials
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (task_number) DO UPDATE
       SET section = EXCLUDED.section,
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           knowledge = EXCLUDED.knowledge,
           materials = EXCLUDED.materials,
           updated_at = CURRENT_TIMESTAMP`,
      [
        task.number,
        task.section,
        task.title,
        task.description || null,
        JSON.stringify(task.knowledge || []),
        JSON.stringify(normalizeMaterials(task.materials || [])),
      ]
    )
  }

  console.log(`Seeded ${examTasks.length} exam tasks successfully.`)
}

seedExamTasks()
  .catch((error) => {
    console.error("Failed to seed exam tasks:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })