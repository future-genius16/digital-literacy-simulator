import { useState } from "react"

function App() {
  const [started, setStarted] = useState(false)
  const [answer, setAnswer] = useState(null)

  if (!started) {
    return (
      <div className="app">
        <div className="hero">
          <h1>Digital Literacy Simulator</h1>
          <p>
            An interactive training platform for improving digital literacy and
            online safety skills.
          </p>
          <button onClick={() => setStarted(true)}>Start training</button>
        </div>

        <div className="modules">
          <h2>Modules</h2>

          <div className="module-list">
            <div className="module-card">
              <h3>Information Evaluation</h3>
              <p>Learn how to identify fake news and unreliable sources.</p>
              <button onClick={() => setStarted(true)}>Start</button>
            </div>

            <div className="module-card">
              <h3>Phishing & Threats</h3>
              <p>Recognize phishing emails and online security risks.</p>
              <button onClick={() => setStarted(true)}>Start</button>
            </div>

            <div className="module-card">
              <h3>Data Protection</h3>
              <p>Understand how to protect your personal information online.</p>
              <button onClick={() => setStarted(true)}>Start</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="scenario">
        <h2>Scenario</h2>

        <p>
          You receive an email from your bank asking you to urgently confirm your
          account details by clicking a link. The email looks official, but the
          sender address is slightly unusual.
        </p>

        <h3>What would you do?</h3>

        <div className="answers">
          <button onClick={() => setAnswer("wrong")}>
            Click the link and enter details
          </button>

          <button onClick={() => setAnswer("correct")}>
            Ignore the email and contact the bank directly
          </button>
        </div>

        {answer === "correct" && (
          <p className="correct">
            ✅ Correct! This is likely a phishing attempt.
          </p>
        )}

        {answer === "wrong" && (
          <p className="wrong">
            ❌ Incorrect. You should never click suspicious links.
          </p>
        )}
      </div>
    </div>
  )
}

export default App