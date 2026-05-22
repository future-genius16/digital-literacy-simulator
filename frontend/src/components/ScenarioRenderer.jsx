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
  handleExitTraining,
}) {
  return (
    <div className="app">
      <div className="scenario">
        <div className="scenario-top-actions">
            <button
             type="button"
             className="secondary-button scenario-exit-button"
             onClick={handleExitTraining}
            >
             Выйти из тренировки
            </button>
      </div>
        <p className="scenario-label">
          {selectedExamTask
            ? `Задание ${selectedExamTask.number}. ${selectedExamTask.title}`
            : `Уровень ${selectedLevel}`}{" "}
        · Вопрос {currentScenarioIndex + 1} из {currentScenariosLength}
        </p>

        <h2>{currentScenario.title}</h2>

        <p>{currentScenario.text}</p>

        {currentScenario.image_url && (
          <div className="scenario-image-wrapper">
            <img
              src={currentScenario.image_url}
              alt="Иллюстрация к заданию"
              className="scenario-image"
            />
          </div>
        )}

        <h3>
          {currentScenario.task_type === "sequence"
            ? "Расположите действия в правильном порядке"
            : currentScenario.task_type === "multi_select"
            ? "Выберите все правильные ответы"
            : "Выберите ответ"}
        </h3>

        {isMultiAnswerTask(currentScenario.task_type) ? (
          <>
            <div className="multi-select-hint">
              {currentScenario.task_type === "sequence"
                ? "Нажимайте на шаги в правильном порядке, затем нажмите «Проверить ответ»."
                : "Выберите все правильные варианты, затем нажмите «Проверить ответ»."}
            </div>

            <div className="answers">
              {currentScenario.options.map((option) => {
                const isSelected = selectedAnswers.includes(option.key)
                const selectedOrder = selectedAnswers.indexOf(option.key) + 1
                const correctOrder = currentScenario.correct_options?.indexOf(option.key) + 1

                const isSequenceTask = currentScenario.task_type === "sequence"
                const isSequenceCorrectPosition =
                    isSequenceTask &&
                    isSelected &&
                    selectedOrder > 0 &&
                    correctOrder > 0 &&
                    selectedOrder === correctOrder

                const isSequenceWrongPosition =
                    isSequenceTask &&
                    showExplanation &&
                    isSelected &&
                    !isSequenceCorrectPosition

                return (
                  <button
                    key={option.key}
                    className={`option-button option-with-badge ${
                        isSelected ? "selected-option" : ""
                    } ${
                        showExplanation && !isSequenceTask && option.isCorrect
                          ? "correct-option"
                          : ""
                    } ${
                        showExplanation && !isSequenceTask && isSelected && !option.isCorrect
                          ? "wrong-option"
                          : ""
                    } ${
                        showExplanation && isSequenceCorrectPosition
                          ? "correct-option"
                          : ""
                    } ${
                        showExplanation && isSequenceWrongPosition
                          ? "wrong-option"
                          : ""
                    }`}
                    onClick={() => toggleMultiSelectAnswer(option.key)}
                    disabled={showExplanation}
                  >
                    <span>
                      {currentScenario.task_type === "sequence" && isSelected && (
                        <strong className="sequence-order-badge">{selectedOrder}</strong>
                      )}
                      {option.text}
                    </span>

                    {currentScenario.task_type !== "sequence" && (
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
                    )}
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
                {currentScenario.task_type === "sequence" ? (
                  <>
                    <div className="sequence-answer-review">
                      <strong>Ваш порядок:</strong>

                      <ol className="sequence-review-list">
                        {selectedAnswers.map((optionKey, index) => {
                          const option = currentScenario.options.find(
                            (item) => item.key === optionKey
                        )

                        const isCorrectPosition =
                            currentScenario.correct_options?.[index] === optionKey

                        if (!option) {
                            return null
                        }

                        return (
                          <li
                            key={optionKey}
                            className={
                                isCorrectPosition
                                  ? "sequence-review-correct"
                                  : "sequence-review-wrong"
                              }
                            >
                              {option.text}
                            </li>
                          )
                        })}
                      </ol>
                    </div>

                    <div className="sequence-answer-review">
                      <strong>Правильная последовательность:</strong>

                    <ol className="sequence-correct-list">
                      {(currentScenario.correct_options || []).map((optionKey) => {
                        const option = currentScenario.options.find(
                            (item) => item.key === optionKey
                        )

                        if (!option) {
                            return null
                        }

                        return <li key={optionKey}>{option.text}</li>
                      })}
                    </ol>
                  </div>
                </>
                ) : (
                <>
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
                                {option.isCorrect && isSelected && "✅ Верный выбор: "}
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
                  </>
                )}
            </div>
            )}

            {currentScenario.explanation?.trim() && (
              <p>{currentScenario.explanation}</p>
            )}

            <button className="next-button" onClick={handleNextScenario}>
              {currentScenarioIndex === currentScenariosLength - 1
                ? "Завершить тренировку"
                : "Следующий вопрос"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScenarioRenderer