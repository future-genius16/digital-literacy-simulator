import { describe, expect, test, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import ScenarioRenderer from "./ScenarioRenderer"

const baseScenario = {
  id: 1,
  title: "Вопрос №1",
  text: "Текст тестового вопроса",
  task_type: "single_choice",
  image_url: null,
  explanation: "",
  options: [
    {
      key: "option_a",
      text: "Вариант A",
      isCorrect: true,
    },
    {
      key: "option_b",
      text: "Вариант B",
      isCorrect: false,
    },
  ],
  correct_options: ["option_a"],
}

const renderScenario = (overrides = {}) => {
  const scenario = {
    ...baseScenario,
    ...overrides,
  }

  return render(
    <ScenarioRenderer
      currentScenario={scenario}
      currentScenarioIndex={0}
      currentScenariosLength={1}
      selectedLevel={1}
      selectedExamTask={{
        number: 1,
        title: "Безопасность. Поиск",
      }}
      selectedAnswer={null}
      selectedAnswers={[]}
      showExplanation={false}
      isMultiAnswerTask={(taskType) =>
        taskType === "multi_select" || taskType === "sequence"
      }
      toggleMultiSelectAnswer={vi.fn()}
      checkMultiSelectAnswer={vi.fn()}
      handleAnswerClick={vi.fn()}
      handleNextScenario={vi.fn()}
      handleExitTraining={vi.fn()}
    />
  )
}

describe("ScenarioRenderer", () => {
  test("renders scenario title and text", () => {
    renderScenario()

    expect(screen.getByText("Вопрос №1")).toBeInTheDocument()
    expect(screen.getByText("Текст тестового вопроса")).toBeInTheDocument()
  })

  test("shows finish button on the last question after answer is checked", () => {
    render(
      <ScenarioRenderer
        currentScenario={baseScenario}
        currentScenarioIndex={0}
        currentScenariosLength={1}
        selectedLevel={1}
        selectedExamTask={{
          number: 1,
          title: "Безопасность. Поиск",
        }}
        selectedAnswer={true}
        selectedAnswers={[]}
        showExplanation={true}
        isMultiAnswerTask={(taskType) =>
          taskType === "multi_select" || taskType === "sequence"
        }
        toggleMultiSelectAnswer={vi.fn()}
        checkMultiSelectAnswer={vi.fn()}
        handleAnswerClick={vi.fn()}
        handleNextScenario={vi.fn()}
        handleExitTraining={vi.fn()}
      />
    )

    expect(screen.getByText("Завершить тренировку")).toBeInTheDocument()
  })

  test("shows next question button when it is not the last question", () => {
    render(
      <ScenarioRenderer
        currentScenario={baseScenario}
        currentScenarioIndex={0}
        currentScenariosLength={2}
        selectedLevel={1}
        selectedExamTask={{
          number: 1,
          title: "Безопасность. Поиск",
        }}
        selectedAnswer={true}
        selectedAnswers={[]}
        showExplanation={true}
        isMultiAnswerTask={(taskType) =>
          taskType === "multi_select" || taskType === "sequence"
        }
        toggleMultiSelectAnswer={vi.fn()}
        checkMultiSelectAnswer={vi.fn()}
        handleAnswerClick={vi.fn()}
        handleNextScenario={vi.fn()}
        handleExitTraining={vi.fn()}
      />
    )

    expect(screen.getByText("Следующий вопрос")).toBeInTheDocument()
  })

  test("renders image when image_url is provided", () => {
    renderScenario({
      image_url: "/images/tasks/test.png",
    })

    const image = screen.getByAltText("Иллюстрация к заданию")

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "/images/tasks/test.png")
  })

  test("does not render explanation when explanation is empty", () => {
    render(
      <ScenarioRenderer
        currentScenario={baseScenario}
        currentScenarioIndex={0}
        currentScenariosLength={1}
        selectedLevel={1}
        selectedExamTask={{
          number: 1,
          title: "Безопасность. Поиск",
        }}
        selectedAnswer={true}
        selectedAnswers={[]}
        showExplanation={true}
        isMultiAnswerTask={(taskType) =>
          taskType === "multi_select" || taskType === "sequence"
        }
        toggleMultiSelectAnswer={vi.fn()}
        checkMultiSelectAnswer={vi.fn()}
        handleAnswerClick={vi.fn()}
        handleNextScenario={vi.fn()}
        handleExitTraining={vi.fn()}
      />
    )

    expect(screen.queryByText("Общее пояснение")).not.toBeInTheDocument()
  })

  test("renders sequence task hint", () => {
    renderScenario({
      task_type: "sequence",
      options: [
        {
          key: "option_a",
          text: "Первый шаг",
          isCorrect: false,
        },
        {
          key: "option_b",
          text: "Второй шаг",
          isCorrect: false,
        },
      ],
      correct_options: ["option_a", "option_b"],
    })

    expect(
      screen.getByText(
        "Нажимайте на шаги в правильном порядке, затем нажмите «Проверить ответ»."
      )
    ).toBeInTheDocument()
  })
})