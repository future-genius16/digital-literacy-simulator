function ResultsPage({ currentUser, results, moduleTitles, onBack }) {
  return (
    <div className="app">
      <div className="results-page">
        <div className="results-header">
          <div>
            <p className="scenario-label">Training history</p>
            <h2>My Results</h2>
            <p>
              Review your attempts, scores and progress across all training
              modules.
            </p>
          </div>

          <button onClick={onBack}>Back to homepage</button>
        </div>

        {!currentUser && (
          <div className="empty-state">
            <h3>Please log in to view your results.</h3>
            <p>Your training history is connected to your university account.</p>
          </div>
        )}

        {currentUser && results.length === 0 && (
          <div className="empty-state">
            <h3>No results yet</h3>
            <p>Complete a level to see your training history here.</p>
          </div>
        )}

        {currentUser && results.length > 0 && (
          <div className="results-grid">
            {results.map((result) => {
              const percentage =
                result.total_questions > 0
                  ? Math.round((result.score / result.total_questions) * 100)
                  : 0

              const isPassed = percentage >= 80

              return (
                <div key={result.id} className="result-card result-card-wide">
                  <div className="result-card-top">
                    <div>
                      <span>{moduleTitles[result.module] || result.module}</span>
                      <h3>Level {result.level || 1}</h3>
                    </div>

                    <span
                      className={`result-status ${
                        isPassed ? "result-passed" : "result-not-passed"
                      }`}
                    >
                      {isPassed ? "Passed" : "Not passed"}
                    </span>
                  </div>

                  <div className="result-score-row">
                    <strong>{percentage}%</strong>
                    <span>
                      {result.score} / {result.total_questions} correct
                    </span>
                  </div>

                  <div className="result-progress-bar">
                    <div style={{ width: `${percentage}%` }} />
                  </div>

                  <p className="result-date">
                    Completed on {new Date(result.created_at).toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsPage