function UserDashboard({ currentUser, results, examTasks, openExamTask }) {
  const examResults = results.filter((result) => result.exam_task_number)

  const getTaskStats = (taskNumber) => {
    const taskResults = examResults.filter(
      (result) => Number(result.exam_task_number) === Number(taskNumber)
    )

    if (taskResults.length === 0) {
      return {
        attempts: 0,
        bestPercentage: 0,
        status: "not_started",
      }
    }

    const bestPercentage = Math.max(
      ...taskResults.map((result) => {
        if (!result.total_questions || result.total_questions === 0) {
          return 0
        }

        return Math.round((result.score / result.total_questions) * 100)
      })
    )

    return {
      attempts: taskResults.length,
      bestPercentage,
      status: bestPercentage >= 80 ? "ready" : "in_progress",
    }
  }

  const readyTasks = examTasks.filter(
    (task) => getTaskStats(task.number).status === "ready"
  )

  const theoreticalTasks = examTasks.filter(
    (task) => task.section === "theoretical"
  )

  const practicalTasks = examTasks.filter((task) => task.section === "practical")

  const readyTheory = theoreticalTasks.filter(
    (task) => getTaskStats(task.number).status === "ready"
  ).length

  const readyPractice = practicalTasks.filter(
    (task) => getTaskStats(task.number).status === "ready"
  ).length

  const averagePercentage =
    examResults.length > 0
      ? Math.round(
          examResults.reduce((sum, result) => {
            const percentage =
              result.total_questions > 0
                ? (result.score / result.total_questions) * 100
                : 0

            return sum + percentage
          }, 0) / examResults.length
        )
      : 0

  const lastExamResult = examResults[0]

  const recommendedTask =
    examTasks.find((task) => getTaskStats(task.number).status === "in_progress") ||
    examTasks.find((task) => getTaskStats(task.number).status === "not_started")

  const overallProgress = Math.round((readyTasks.length / examTasks.length) * 100)

  return (
    <div className="dashboard exam-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="scenario-label">Личный кабинет</p>
          <h2>Подготовка к НЭ по цифровой грамотности</h2>
          <p>
            Здесь отображается общий прогресс подготовки по 14 заданиям
            независимого экзамена.
          </p>
        </div>

        <div className="dashboard-user">
          <span>{currentUser.role === "admin" ? "Администратор" : "Студент"}</span>
          <strong>{currentUser.email}</strong>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-card">
          <span>Готово заданий</span>
          <strong>
            {readyTasks.length} / {examTasks.length}
          </strong>
        </div>

        <div className="dashboard-card">
          <span>Теория</span>
          <strong>{readyTheory} / {theoreticalTasks.length}</strong>
        </div>

        <div className="dashboard-card">
          <span>Практика</span>
          <strong>{readyPractice} / {practicalTasks.length}</strong>
        </div>

        <div className="dashboard-card">
          <span>Средний результат</span>
          <strong>{averagePercentage}%</strong>
        </div>
      </div>

      <div className="exam-overall-card">
        <div>
            <h3>Общий прогресс подготовки</h3>
            <p>
              Раздел считается подготовленным, если лучший результат по нему — 80% или выше.
            </p>
        </div>

        <strong>{overallProgress}%</strong>

        <div className="exam-progress-bar">
            <div style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="dashboard-panel">
          <h3>Последняя тренировка</h3>

          {lastExamResult ? (
            <div className="recent-result-card">
              <span>
                Задание {lastExamResult.exam_task_number} ·{" "}
                {lastExamResult.exam_section === "theoretical"
                  ? "теория"
                  : "практика"}
              </span>

              <strong>
                {lastExamResult.exam_task_title} ·{" "}
                {Math.round(
                  (lastExamResult.score / lastExamResult.total_questions) * 100
                )}
                %
              </strong>

              <p>
                {lastExamResult.score} из {lastExamResult.total_questions} ·{" "}
                {new Date(lastExamResult.created_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="muted-text">
              Вы ещё не проходили тренировочные задания НЭ.
            </p>
          )}
        </div>

        <div className="dashboard-panel">
          <h3>Рекомендуем продолжить</h3>

          {recommendedTask ? (
            <>
              <p className="recommended-task-title">
                Задание {recommendedTask.number}. {recommendedTask.title}
              </p>

              <p className="muted-text">{recommendedTask.description}</p>

              <button onClick={() => openExamTask(recommendedTask.number)}>
                Перейти к тренировке
              </button>
            </>
          ) : (
            <p className="muted-text">
              Все разделы отмечены как подготовленные. Отличная работа!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard