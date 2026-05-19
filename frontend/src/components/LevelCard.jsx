function LevelCard({ level, progressItem, onStart }) {
  const isUnlocked = progressItem?.is_unlocked
  const isCompleted = progressItem?.is_completed

  const levelTitle =
    level === 1 ? "Basic" : level === 2 ? "Intermediate" : "Advanced"

  return (
    <div
      className={`level-card ${
        isCompleted
          ? "level-completed"
          : isUnlocked
          ? "level-unlocked"
          : "level-locked"
      }`}
    >
      <div className="level-card-top">
        <span>Level {level}</span>
        <strong>{levelTitle}</strong>
      </div>

      <p>
        {isCompleted
          ? `Completed with best result: ${progressItem.best_percentage}%`
          : isUnlocked
          ? "Available for training"
          : "Locked until the previous level is completed"}
      </p>

      <button disabled={!isUnlocked} onClick={onStart}>
        {isCompleted ? "Train again" : isUnlocked ? "Start level" : "Locked"}
      </button>
    </div>
  )
}

export default LevelCard