function ScenarioRenderer({
  currentScenario,
  currentScenarioIndex,
  currentScenariosLength,
  selectedLevel,
  selectedExamTask,
  selectedAnswer,
  selectedAnswers,
  showExplanation,
  isMultiAnswerTask,
  toggleMultiSelectAnswer,
  checkMultiSelectAnswer,
  handleAnswerClick,
  handleNextScenario,
}) {
  return (
    <div className="app">
      <div className="scenario">
        <p className="scenario-label">
          {selectedExamTask
            ? `Задание ${selectedExamTask.number}. ${selectedExamTask.title}`
            : `Уровень ${selectedLevel}`}{" "}
        · Вопрос {currentScenarioIndex + 1} из {currentScenariosLength}
        </p>

        <h2>{currentScenario.title}</h2>

        <p>{currentScenario.text}</p>

        <h3>
          {currentScenario.task_type === "risk_analysis"
            ? "Как вы оцените уровень риска?"
            : currentScenario.task_type === "permission_check"
            ? "Какие разрешения следует предоставить?"
            : "Выберите ответ"}
        </h3>

        {isMultiAnswerTask(currentScenario.task_type) ? (
          <>
            <div className="multi-select-hint">
              {currentScenario.task_type === "permission_check"
                ? "Выберите все разрешения, которые следует предоставить, затем нажмите «Проверить ответ»."
                : "Выберите все правильные варианты, затем нажмите «Проверить ответ»."}
            </div>

            <div className="answers">
              {currentScenario.options.map((option) => {
                const isSelected = selectedAnswers.includes(option.key)

                return (
                  <button
                    key={option.key}
                    className={`option-button option-with-badge ${
                      isSelected ? "selected-option" : ""
                    } ${
                      showExplanation && option.isCorrect
                        ? "correct-option"
                        : ""
                    } ${
                      showExplanation && isSelected && !option.isCorrect
                        ? "wrong-option"
                        : ""
                    }`}
                    onClick={() => toggleMultiSelectAnswer(option.key)}
                    disabled={showExplanation}
                  >
                    <span>{option.text}</span>

                    <span className="answer-badges">
                      {showExplanation && option.isCorrect && (
                        <span className="answer-badge correct-badge">
                          Правильный ответ
                        </span>
                      )}

                      {showExplanation && isSelected && (
                        <span className="answer-badge selected-badge">
                          Ваш выбор
                        </span>
                      )}

                      {showExplanation && option.isCorrect && !isSelected && (
                        <span className="answer-badge missed-badge">
                          Пропущено
                        </span>
                      )}

                      {showExplanation && isSelected && !option.isCorrect && (
                        <span className="answer-badge wrong-badge">
                          Ошибочный выбор
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            {!showExplanation && (
              <button
                className="check-answer-button"
                disabled={selectedAnswers.length === 0}
                onClick={checkMultiSelectAnswer}
              >
                Проверить ответ
              </button>
            )}
          </>
        ) : (
          <div className="answers">
            {currentScenario.options.map((option) => (
              <button
                key={option.key}
                className={`option-button ${
                  showExplanation && option.isCorrect ? "correct-option" : ""
                } ${
                  showExplanation &&
                  selectedAnswer === false &&
                  option.isCorrect === false
                    ? "wrong-option"
                    : ""
                }`}
                onClick={() => handleAnswerClick(option.isCorrect)}
                disabled={showExplanation}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}

        {showExplanation && (
          <div className="feedback-box">
            <p className={selectedAnswer ? "correct" : "wrong"}>
              {selectedAnswer ? "✅ Верно!" : "❌ Неверно."}
            </p>

            {isMultiAnswerTask(currentScenario.task_type) && (
              <div className="correct-answers-box">
                <strong>Разбор ответа:</strong>

                <ul>
                  {currentScenario.options
                    .filter(
                      (option) =>
                        option.isCorrect || selectedAnswers.includes(option.key)
                    )
                    .map((option) => {
                      const isSelected = selectedAnswers.includes(option.key)
                      const isMissed = option.isCorrect && !isSelected
                      const isWrongChoice = isSelected && !option.isCorrect

                      return (
                        <li key={option.key}>
                          <span>
                            {option.isCorrect &&
                              isSelected &&
                              "✅ Верный выбор: "}
                            {isMissed && "⚠️ Пропущенный верный ответ: "}
                            {isWrongChoice && "❌ Ошибочный выбор: "}
                            <strong>{option.text}</strong>
                          </span>

                          {option.feedback && (
                            <p className="option-feedback-text">
                              {option.feedback}
                            </p>
                          )}
                        </li>
                      )
                    })}
                </ul>
              </div>
            )}

            <p>{currentScenario.explanation}</p>

            <button className="next-button" onClick={handleNextScenario}>
              Следующий вопрос
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScenarioRenderer