function App() {
  return (
    <div className="app">
      <div className="hero">
        <h1>Digital Literacy Simulator</h1>
        <p>
          An interactive training platform for improving digital literacy and
          online safety skills.
        </p>
        <button>Start training</button>
      </div>

      <div className="modules">
        <h2>Modules</h2>

        <div className="module-list">
          <div className="module-card">
            <h3>Information Evaluation</h3>
            <p>Learn how to identify fake news and unreliable sources.</p>
            <button>Start</button>
          </div>

          <div className="module-card">
            <h3>Phishing & Threats</h3>
            <p>Recognize phishing emails and online security risks.</p>
            <button>Start</button>
          </div>

          <div className="module-card">
            <h3>Data Protection</h3>
            <p>Understand how to protect your personal information online.</p>
            <button>Start</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App