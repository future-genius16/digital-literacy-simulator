function ScenarioRenderer({
  currentScenario,
  currentScenarioIndex,
  currentScenariosLength,
  selectedLevel,
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
          Level {selectedLevel} · Scenario {currentScenarioIndex + 1} of{" "}
          {currentScenariosLength}
        </p>

        <h2>{currentScenario.title}</h2>

        <p>{currentScenario.text}</p>

        <h3>
          {currentScenario.task_type === "risk_analysis"
            ? "How would you assess the risk?"
            : currentScenario.task_type === "permission_check"
            ? "Which permissions should be allowed?"
            : "What would you do?"}
        </h3>

        {isMultiAnswerTask(currentScenario.task_type) ? (
          <>
            <div className="multi-select-hint">
              {currentScenario.task_type === "permission_check"
                ? "Select all permissions that should be allowed, then click “Check answer”."
                : "Select all correct options, then click “Check answer”."}
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
                          Correct answer
                        </span>
                      )}

                      {showExplanation && isSelected && (
                        <span className="answer-badge selected-badge">
                          Your choice
                        </span>
                      )}

                      {showExplanation && option.isCorrect && !isSelected && (
                        <span className="answer-badge missed-badge">
                          Missed
                        </span>
                      )}

                      {showExplanation && isSelected && !option.isCorrect && (
                        <span className="answer-badge wrong-badge">
                          Wrong choice
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
                Check answer
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
              {selectedAnswer ? "✅ Correct!" : "❌ Incorrect."}
            </p>

            {isMultiAnswerTask(currentScenario.task_type) && (
              <div className="correct-answers-box">
                <strong>Answer breakdown:</strong>

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
                              "✅ Correct choice: "}
                            {isMissed && "⚠️ Missed correct answer: "}
                            {isWrongChoice && "❌ Wrong choice: "}
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
              Next scenario
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScenarioRenderer