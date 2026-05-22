require("dotenv").config()
const pool = require("../config/db")
const examScenariosData = require("./examScenariosDataCorrected")

const run = async () => {
  try {
    console.log("Удаляем старые задания модуля exam...")
    await pool.query("DELETE FROM scenarios WHERE module = 'exam';")

    console.log(`Загружаем ${examScenariosData.length} заданий...`)

    for (const scenario of examScenariosData) {
      await pool.query(
        `INSERT INTO scenarios (
          module,
          title,
          text,
          option_a,
          option_b,
          option_c,
          option_d,
          option_e,
          correct_option,
          correct_options,
          explanation,
          image_url,
          level,
          difficulty,
          task_type,
          exam_section,
          exam_task_number,
          exam_task_title,
          exam_topic,
          course_materials,
          digcomp_area,
          digcomp_competence,
          learning_outcome,
          option_feedback,
          is_active
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, true
        )`,
        [
          "exam",
          scenario.title,
          scenario.text,
          scenario.option_a,
          scenario.option_b,
          scenario.option_c || null,
          scenario.option_d || null,
          scenario.option_e || null,
          scenario.correct_option,
          JSON.stringify(scenario.correct_options),
          scenario.explanation || "",
          scenario.image_url || null,
          1,
          "exam",
          scenario.task_type,
          scenario.exam_section,
          Number(scenario.exam_task_number),
          scenario.exam_task_title,
          null,
          null,
          null,
          null,
          null,
          null,
        ]
      )
    }

    console.log("Готово! Исправленный банк заданий загружен.")
  } catch (error) {
    console.error("Ошибка загрузки исправленного банка:", error)
  } finally {
    await pool.end()
  }
}

run()
