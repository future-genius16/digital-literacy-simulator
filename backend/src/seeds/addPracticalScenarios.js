require("dotenv").config()
const pool = require("../config/db")

const practicalScenarios = [
  {
    exam_task_number: 12,
    exam_section: "practical",
    exam_task_title: "Практическое задание 12",
    title: "Вопрос №1",
    text: "Вы выполняете практическое задание с электронными таблицами. Какие действия помогут снизить риск ошибки перед отправкой результата?",
    task_type: "multi_select",
    option_a: "Проверить, что формулы ссылаются на нужные ячейки",
    option_b: "Сравнить несколько рассчитанных значений вручную или на тестовом примере",
    option_c: "Удалить исходные данные, чтобы таблица выглядела компактнее",
    option_d: "Проверить формат чисел, дат и заголовков столбцов",
    option_e: "Оставить пустые строки внутри диапазона данных",
    correct_options: ["option_a", "option_b", "option_d"],
    explanation:
      "Перед сдачей таблицы важно проверить формулы, формат данных и несколько результатов на тестовых значениях. Удалять исходные данные или нарушать структуру диапазона не следует.",
  },
  {
    exam_task_number: 12,
    exam_section: "practical",
    exam_task_title: "Практическое задание 12",
    title: "Вопрос №2",
    text: "Расположите действия в правильном порядке при выполнении практического задания с электронной таблицей.",
    task_type: "sequence",
    option_a: "Ознакомиться с условием и определить, какие показатели нужно получить",
    option_b: "Проверить структуру исходных данных и названия столбцов",
    option_c: "Ввести формулы или применить нужные функции",
    option_d: "Проверить результат и сохранить файл в требуемом формате",
    option_e: null,
    correct_options: ["option_a", "option_b", "option_c", "option_d"],
    explanation:
      "Сначала необходимо понять задачу и данные, затем выполнить расчёты и проверить итоговый файл перед отправкой.",
  },
  {
    exam_task_number: 13,
    exam_section: "practical",
    exam_task_title: "Практическое задание 13",
    title: "Вопрос №1",
    text: "Вы готовите документ для сдачи в рамках практического задания. Что следует проверить перед отправкой файла?",
    task_type: "multi_select",
    option_a: "Соответствие структуры документа требованиям задания",
    option_b: "Наличие понятных заголовков и единообразного оформления",
    option_c: "Корректность вставленных ссылок, таблиц или изображений",
    option_d: "Случайное изменение имени файла на любое удобное",
    option_e: "Открывается ли файл после сохранения",
    correct_options: ["option_a", "option_b", "option_c", "option_e"],
    explanation:
      "Перед отправкой документа важно проверить структуру, оформление, корректность вставленных объектов и возможность открыть файл.",
  },
  {
    exam_task_number: 13,
    exam_section: "practical",
    exam_task_title: "Практическое задание 13",
    title: "Вопрос №2",
    text: "Какой порядок действий наиболее корректен при подготовке текстового документа по заданным требованиям?",
    task_type: "sequence",
    option_a: "Прочитать требования к содержанию и оформлению",
    option_b: "Подготовить структуру документа",
    option_c: "Добавить текст, таблицы, изображения или ссылки согласно условию",
    option_d: "Проверить оформление, сохранить файл и убедиться, что он открывается",
    option_e: null,
    correct_options: ["option_a", "option_b", "option_c", "option_d"],
    explanation:
      "Работа с документом должна начинаться с анализа требований, затем выполняется наполнение и финальная проверка.",
  },
  {
    exam_task_number: 14,
    exam_section: "practical",
    exam_task_title: "Практическое задание 14",
    title: "Вопрос №1",
    text: "Вы работаете с датасетом и должны подготовить краткий вывод по данным. Какие действия являются корректными?",
    task_type: "multi_select",
    option_a: "Проверить, какие столбцы и типы данных представлены в датасете",
    option_b: "Отфильтровать или отсортировать данные согласно условию",
    option_c: "Выбрать подходящий способ визуализации, если требуется диаграмма",
    option_d: "Сделать вывод, не проверяя исходные данные",
    option_e: "Проверить, что вывод соответствует полученным расчётам",
    correct_options: ["option_a", "option_b", "option_c", "option_e"],
    explanation:
      "При анализе датасета важно понимать структуру данных, корректно применять фильтрацию или сортировку, выбирать подходящую визуализацию и делать вывод на основе результата.",
  },
  {
    exam_task_number: 14,
    exam_section: "practical",
    exam_task_title: "Практическое задание 14",
    title: "Вопрос №2",
    text: "Расположите действия в правильном порядке при анализе небольшого датасета.",
    task_type: "sequence",
    option_a: "Изучить условие задания и структуру датасета",
    option_b: "Очистить или проверить данные на очевидные ошибки, если это требуется",
    option_c: "Выполнить фильтрацию, сортировку или расчёты по условию",
    option_d: "Сформулировать вывод и проверить его соответствие полученным данным",
    option_e: null,
    correct_options: ["option_a", "option_b", "option_c", "option_d"],
    explanation:
      "Анализ датасета строится от понимания условия и структуры данных к обработке, расчётам и формулировке вывода.",
  },
]

const run = async () => {
  try {
    console.log("Удаляем старые задания для НЭ 12–14...")
    await pool.query(`
      DELETE FROM scenarios
      WHERE module = 'exam'
        AND exam_task_number IN (12, 13, 14);
    `)

    console.log(`Загружаем ${practicalScenarios.length} практических заданий...`)

    for (const scenario of practicalScenarios) {
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
          scenario.option_c,
          scenario.option_d,
          scenario.option_e,
          scenario.correct_options[0],
          JSON.stringify(scenario.correct_options),
          scenario.explanation,
          null,
          1,
          "exam",
          scenario.task_type,
          scenario.exam_section,
          scenario.exam_task_number,
          scenario.exam_task_title,
          "Практическая работа с файлами, таблицами, документами и данными.",
          "Материалы онлайн-курса по цифровой грамотности: электронные таблицы, документы, анализ данных, визуализация.",
          null,
          null,
          null,
          null,
        ]
      )
    }

    console.log("Готово! Практические задания 12–14 добавлены.")
  } catch (error) {
    console.error("Ошибка загрузки практических заданий:", error)
  } finally {
    await pool.end()
  }
}

run()