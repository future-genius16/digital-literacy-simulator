function ResultsPage({ currentUser, results, examTasks, onBack, openExamTask }) {
  const examResults = results.filter((result) => result.exam_task_number)

  const getTaskStats = (taskNumber) => {
    const taskResults = examResults.filter(
      (result) => Number(result.exam_task_number) === Number(taskNumber)
    )

    if (taskResults.length === 0) {
      return {
        attempts: 0,
        bestPercentage: 0,
        bestScore: 0,
        totalQuestions: 0,
        status: "not_started",
      }
    }

    const mappedResults = taskResults.map((result) => {
      const percentage =
        result.total_questions > 0
          ? Math.round((result.score / result.total_questions) * 100)
          : 0

      return {
        ...result,
        percentage,
      }
    })

    const bestResult = mappedResults.reduce((best, current) =>
      current.percentage > best.percentage ? current : best
    )

    return {
      attempts: taskResults.length,
      bestPercentage: bestResult.percentage,
      bestScore: bestResult.score,
      totalQuestions: bestResult.total_questions,
      status: bestResult.percentage >= 80 ? "ready" : "in_progress",
    }
  }

  const getStatusLabel = (status) => {
    if (status === "ready") return "Готово"
    if (status === "in_progress") return "В процессе"
    return "Не начато"
  }

  const readyTasks = examTasks.filter(
    (task) => getTaskStats(task.number).status === "ready"
  )

  const inProgressTasks = examTasks.filter(
    (task) => getTaskStats(task.number).status === "in_progress"
  )

  const notStartedTasks = examTasks.filter(
    (task) => getTaskStats(task.number).status === "not_started"
  )

  const averageBestPercentage =
    examTasks.length > 0
      ? Math.round(
          examTasks.reduce((sum, task) => {
            return sum + getTaskStats(task.number).bestPercentage
          }, 0) / examTasks.length
        )
      : 0

  const recentExamResults = examResults.slice(0, 5)

  return (
    <div className="app">
      <div className="results-page">
        <button className="page-back-button" onClick={onBack}>
          Назад
        </button>
        <div className="results-header">
          <div>
            <p className="scenario-label">Аналитика подготовки</p>
            <h2>Мои результаты</h2>
            <p>
              Здесь отображается прогресс по каждому заданию Независимого
              экзамена по цифровой грамотности.
            </p>
          </div>
        </div>

        {!currentUser && (
          <div className="empty-state">
            <h3>Войдите в систему</h3>
            <p>История подготовки связана с вашим университетским аккаунтом.</p>
          </div>
        )}

        {currentUser && (
          <>
            <div className="results-summary-grid">
              <div className="dashboard-card">
                <span>Готово</span>
                <strong>
                  {readyTasks.length} / {examTasks.length}
                </strong>
              </div>

              <div className="dashboard-card">
                <span>В процессе</span>
                <strong>{inProgressTasks.length}</strong>
              </div>

              <div className="dashboard-card">
                <span>Не начато</span>
                <strong>{notStartedTasks.length}</strong>
              </div>

              <div className="dashboard-card">
                <span>Средний лучший результат</span>
                <strong>{averageBestPercentage}%</strong>
              </div>
            </div>

            <div className="exam-results-section">
              <h3>Прогресс по заданиям НЭ</h3>

              <div className="exam-results-grid">
                {examTasks.map((task) => {
                  const stats = getTaskStats(task.number)

                  return (
                    <div key={task.number} className="exam-result-card">
                      <div className="exam-result-card-top">
                        <div>
                          <span>
                            Задание {task.number} ·{" "}
                            {task.section === "theoretical"
                              ? "теория"
                              : "практика"}
                          </span>

                          <h4>{task.title}</h4>
                        </div>

                        <span
                          className={`exam-status exam-status-${stats.status}`}
                        >
                          {getStatusLabel(stats.status)}
                        </span>
                      </div>

                      <p>{task.description}</p>

                      <div className="exam-result-stats">
                        <div>
                          <span>Лучший результат</span>
                          <strong>{stats.bestPercentage}%</strong>
                        </div>

                        <div>
                          <span>Попыток</span>
                          <strong>{stats.attempts}</strong>
                        </div>
                      </div>

                      <div className="result-progress-bar">
                        <div style={{ width: `${stats.bestPercentage}%` }} />
                      </div>

                      {stats.attempts > 0 && (
                        <p className="muted-text">
                          Лучший результат: {stats.bestScore} из{" "}
                          {stats.totalQuestions}
                        </p>
                      )}

                      <button onClick={() => openExamTask(task.number)}>
                        {stats.status === "not_started"
                          ? "Начать тренировку"
                          : "Пройти ещё раз"}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="attempt-history-section">
              <h3>Последние попытки</h3>

              {recentExamResults.length === 0 ? (
                <div className="empty-state">
                  <h3>Пока нет попыток</h3>
                  <p>
                    Пройдите тренировку по любому заданию НЭ, и результат
                    появится здесь.
                  </p>
                </div>
              ) : (
                <div className="attempt-history-list">
                  {recentExamResults.map((result) => {
                    const percentage =
                      result.total_questions > 0
                        ? Math.round(
                            (result.score / result.total_questions) * 100
                          )
                        : 0

                    return (
                      <div key={result.id} className="attempt-history-item">
                        <div>
                          <span>
                            Задание {result.exam_task_number} ·{" "}
                            {result.exam_section === "theoretical"
                              ? "теория"
                              : "практика"}
                          </span>

                          <strong>{result.exam_task_title}</strong>
                        </div>

                        <div>
                          <strong>{percentage}%</strong>
                          <span>
                            {result.score} из {result.total_questions} ·{" "}
                            {new Date(result.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ResultsPage