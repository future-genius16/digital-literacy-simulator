function UserDashboard({
  currentUser,
  progress,
  results,
  moduleTitles,
  openModuleLevels,
}) {
  const totalLevels = progress.length
  const completedLevels = progress.filter((item) => item.is_completed).length
  const unlockedLevels = progress.filter((item) => item.is_unlocked).length

  const averagePercentage =
    results.length > 0
      ? Math.round(
          results.reduce((sum, result) => {
            const percentage =
              result.total_questions > 0
                ? (result.score / result.total_questions) * 100
                : 0

            return sum + percentage
          }, 0) / results.length
        )
      : 0

  const recentResults = results.slice(0, 3)

  const getModuleProgress = (moduleKey) => {
    const moduleProgress = progress.filter((item) => item.module === moduleKey)
    const completed = moduleProgress.filter((item) => item.is_completed).length
    const unlocked = moduleProgress.filter((item) => item.is_unlocked).length

    return {
      completed,
      unlocked,
      total: moduleProgress.length || 3,
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="scenario-label">Personal dashboard</p>
          <h2>Welcome back</h2>
          <p>
            Track your progress, continue unlocked levels and review your latest
            training results.
          </p>
        </div>

        <div className="dashboard-user">
          <span>{currentUser.role}</span>
          <strong>{currentUser.email}</strong>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-card">
          <span>Completed levels</span>
          <strong>
            {completedLevels} / {totalLevels || 9}
          </strong>
        </div>

        <div className="dashboard-card">
          <span>Unlocked levels</span>
          <strong>
            {unlockedLevels} / {totalLevels || 9}
          </strong>
        </div>

        <div className="dashboard-card">
          <span>Average score</span>
          <strong>{averagePercentage}%</strong>
        </div>
      </div>

      <div className="module-progress-grid">
        {["info", "phishing", "data"].map((moduleKey) => {
          const moduleProgress = getModuleProgress(moduleKey)
          const progressPercentage =
            (moduleProgress.completed / moduleProgress.total) * 100

          return (
            <div key={moduleKey} className="module-progress-card">
              <div>
                <h3>{moduleTitles[moduleKey]}</h3>
                <p>
                  Completed {moduleProgress.completed} of {moduleProgress.total}{" "}
                  levels
                </p>
              </div>

              <div className="progress-bar">
                <div
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>

              <button onClick={() => openModuleLevels(moduleKey)}>
                Continue
              </button>
            </div>
          )
        })}
      </div>

      {recentResults.length > 0 && (
        <div className="recent-results">
          <h3>Recent attempts</h3>

          <div className="recent-results-list">
            {recentResults.map((result) => {
              const percentage =
                result.total_questions > 0
                  ? Math.round((result.score / result.total_questions) * 100)
                  : 0

              return (
                <div key={result.id} className="recent-result-card">
                  <span>{moduleTitles[result.module] || result.module}</span>
                  <strong>
                    Level {result.level || 1} · {percentage}%
                  </strong>
                  <p>
                    {result.score} / {result.total_questions} ·{" "}
                    {new Date(result.created_at).toLocaleDateString()}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard