function ExamTaskInfo({ task, onBack, onStartTraining }) {
  return (
    <div className="app">
      <div className="exam-info-page">
        <button className="page-back-button" onClick={onBack}>
          Назад
        </button>

        <div className="results-header">
          <div>
            <p className="scenario-label">
              {task.section === "theoretical"
                ? "Теоретическая часть"
                : "Практическая часть"}
            </p>

            <h2>
              Задание {task.number}. {task.title}
            </h2>

            <p>{task.description}</p>
          </div>
        </div>

        <div className="exam-info-grid">
          <div className="exam-info-card">
            <h3>Что проверяется</h3>

            <ul className="knowledge-list">
              {task.knowledge.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="exam-info-card">
            <h3>Материалы для повторения</h3>

            <div className="materials-list">
              {task.materials.map((group) => (
                <div key={group.category} className="materials-group">
                  <h4>{group.category}</h4>

                  <div className="materials-links">
                    {group.links.map((link) => (
                      <a
                        key={`${group.category}-${link.title}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="exam-info-actions">
          <button onClick={() => onStartTraining(task.number)}>
            Перейти к тренировке
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExamTaskInfo