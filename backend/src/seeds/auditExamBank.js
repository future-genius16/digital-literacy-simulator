require("dotenv").config()
const fs = require("fs")
const path = require("path")
const pool = require("../config/db")

const optionKeys = ["option_a", "option_b", "option_c", "option_d", "option_e"]

const getExistingOptions = (scenario) =>
  optionKeys.filter((key) => Boolean(scenario[key]?.trim()))

const normalizeCorrectOptions = (correctOptions) => {
  if (!correctOptions) {
    return []
  }

  if (Array.isArray(correctOptions)) {
    return correctOptions
  }

  if (typeof correctOptions === "string") {
    try {
      const parsed = JSON.parse(correctOptions)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return []
}

const run = async () => {
  const errors = []
  const warnings = []

  try {
    const result = await pool.query(`
      SELECT *
      FROM scenarios
      WHERE module = 'exam'
      ORDER BY exam_task_number, id;
    `)

    const scenarios = result.rows

    const stats = {
      total: scenarios.length,
      single_choice: 0,
      multi_select: 0,
      sequence: 0,
      active: 0,
      inactive: 0,
      with_images: 0,
      without_explanation: 0,
    }

    const countByExamTask = {}

    for (const scenario of scenarios) {
      const label = `ID ${scenario.id}, НЭ ${scenario.exam_task_number || "—"}, ${scenario.title || "без названия"}`

      if (stats[scenario.task_type] !== undefined) {
        stats[scenario.task_type] += 1
      }

      if (scenario.is_active) {
        stats.active += 1
      } else {
        stats.inactive += 1
      }

      if (scenario.exam_task_number) {
        countByExamTask[scenario.exam_task_number] =
          (countByExamTask[scenario.exam_task_number] || 0) + 1
      }

      if (!scenario.exam_task_number) {
        errors.push(`${label}: не указан номер задания НЭ`)
      }

      if (
        scenario.exam_task_number &&
        (scenario.exam_task_number < 1 || scenario.exam_task_number > 14)
      ) {
        errors.push(`${label}: номер задания НЭ вне диапазона 1–14`)
      }

      if (!scenario.exam_section) {
        errors.push(`${label}: не указана часть экзамена`)
      }

      if (
        scenario.exam_section &&
        !["theoretical", "practical"].includes(scenario.exam_section)
      ) {
        errors.push(
          `${label}: некорректная часть экзамена "${scenario.exam_section}"`
        )
      }

      if (!scenario.title?.trim()) {
        errors.push(`${label}: не указано название вопроса`)
      }

      if (!scenario.text?.trim()) {
        errors.push(`${label}: не указан текст вопроса`)
      }

      if (scenario.text?.trim() && scenario.text.trim().length < 20) {
        warnings.push(`${label}: подозрительно короткий текст вопроса`)
      }

      if (!["single_choice", "multi_select", "sequence"].includes(scenario.task_type)) {
        errors.push(`${label}: неизвестный тип задания "${scenario.task_type}"`)
      }

      const existingOptions = getExistingOptions(scenario)

      if (existingOptions.length < 2) {
        errors.push(`${label}: меньше двух вариантов ответа`)
      }

      const correctOptions = normalizeCorrectOptions(scenario.correct_options)

      if (scenario.task_type === "single_choice") {
        if (!scenario.correct_option) {
          errors.push(`${label}: single_choice без correct_option`)
        }

        if (scenario.correct_option && !existingOptions.includes(scenario.correct_option)) {
          errors.push(
            `${label}: correct_option="${scenario.correct_option}" не существует среди вариантов`
          )
        }

        if (correctOptions.length !== 1) {
          warnings.push(
            `${label}: single_choice обычно содержит один элемент correct_options, сейчас ${correctOptions.length}`
          )
        }
      }

      if (scenario.task_type === "multi_select") {
        if (correctOptions.length === 0) {
          errors.push(`${label}: multi_select без correct_options`)
        }

        for (const optionKey of correctOptions) {
          if (!existingOptions.includes(optionKey)) {
            errors.push(
              `${label}: correct_options содержит "${optionKey}", но такого варианта нет`
            )
          }
        }
      }

      if (scenario.task_type === "sequence") {
        if (correctOptions.length < 2) {
          errors.push(`${label}: sequence должен иметь минимум два шага`)
        }

        for (const optionKey of correctOptions) {
          if (!existingOptions.includes(optionKey)) {
            errors.push(
              `${label}: sequence содержит "${optionKey}", но такого шага нет`
            )
          }
        }
      }

      if (!scenario.explanation?.trim()) {
        stats.without_explanation += 1
      }

      if (scenario.image_url?.trim()) {
        stats.with_images += 1

        if (!scenario.image_url.startsWith("/images/")) {
          warnings.push(
            `${label}: image_url имеет нестандартный путь "${scenario.image_url}"`
          )
        }

        const imagePath = path.join(
          __dirname,
          "../../../frontend/public",
          scenario.image_url
        )

        if (!fs.existsSync(imagePath)) {
          errors.push(`${label}: файл изображения не найден "${scenario.image_url}"`)
        }
      }
    }

    for (let taskNumber = 1; taskNumber <= 14; taskNumber += 1) {
      if (!countByExamTask[taskNumber]) {
        errors.push(`НЭ ${taskNumber}: нет ни одного вопроса`)
      }
    }

    console.log("\n=== АВТОМАТИЗИРОВАННАЯ ПРОВЕРКА БАНКА ЗАДАНИЙ ===\n")

    console.log(`Проверено заданий: ${scenarios.length}`)

    console.log("\nСтатистика:")
    console.table(stats)

    console.log("\nКоличество вопросов по заданиям НЭ:")
    console.table(
      Object.entries(countByExamTask)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([exam_task_number, count]) => ({
          exam_task_number,
          count,
        }))
    )

    console.log("\nОшибки:")
    if (errors.length === 0) {
      console.log("Ошибок не найдено ✅")
    } else {
      errors.forEach((error) => console.log(`❌ ${error}`))
    }

    console.log("\nПредупреждения:")
    if (warnings.length === 0) {
      console.log("Предупреждений не найдено ✅")
    } else {
      warnings.forEach((warning) => console.log(`⚠️ ${warning}`))
    }

    console.log("\nИтог:")
    console.log(`Ошибок: ${errors.length}`)
    console.log(`Предупреждений: ${warnings.length}`)

    if (errors.length > 0) {
      process.exitCode = 1
    }
  } catch (error) {
    console.error("Ошибка автоматизированной проверки:", error)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

run()