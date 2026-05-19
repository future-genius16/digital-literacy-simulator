function ModuleCard({ icon, title, description, onStart }) {
  return (
    <div className="module-card">
      <h3>
        {icon} {title}
      </h3>
      <p>{description}</p>
      <button onClick={onStart}>Start</button>
    </div>
  )
}

export default ModuleCard