import { useState } from "react"

const scenarios = [
  {
    id: 1,
    title: "Phishing Email",
    text: "You receive an email from your bank asking you to urgently confirm your account details by clicking a link. The email looks official, but the sender address is slightly unusual.",
    options: [
      {
        text: "Click the link and enter details",
        isCorrect: false,
      },
      {
        text: "Ignore the email and contact the bank directly",
        isCorrect: true,
      },
    ],
    explanation:
      "This is likely a phishing attempt. Suspicious links and unusual sender addresses are important warning signs.",
  },
  {
    id: 2,
    title: "Urgent Prize Message",
    text: "You receive a message saying that you won a prize and need to confirm your phone number and bank card details within 10 minutes.",
    options: [
      {
        text: "Send the requested information immediately",
        isCorrect: false,
      },
      {
        text: "Do not respond and report the message as suspicious",
        isCorrect: true,
      },
    ],
    explanation:
      "Urgency and requests for sensitive information are common signs of online fraud.",
  },
]

function App() {
  const [started, setStarted] = useState(false)
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)

  const currentScenario = scenarios[currentScenarioIndex]

  const handleAnswerClick = (isCorrect) => {
  setSelectedAnswer(isCorrect)
  setShowExplanation(true)

  if (isCorrect) {
    setScore(score + 1)
  }
}

  const handleNextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setFinished(true)
    }
  }

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
              <button>Start</button>
            </div>

            <div className="module-card">
              <h3>Phishing & Threats</h3>
              <p>Recognize phishing emails and online security risks.</p>
              <button onClick={() => setStarted(true)}>Start</button>
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

  if (finished) {
  return (
    <div className="app">
      <div className="scenario">
        <h2>Module completed</h2>
        <p>You have completed the Phishing & Threats module.</p>

        <p>
          Your score: {score} / {scenarios.length}
        </p>

        <button
          onClick={() => {
            setStarted(false)
            setCurrentScenarioIndex(0)
            setSelectedAnswer(null)
            setShowExplanation(false)
            setFinished(false)
            setScore(0)
          }}
        >
          Back to homepage
        </button>
      </div>
    </div>
  )
}

  return (
    <div className="app">
      <div className="scenario">
        <p className="scenario-label">
          Scenario {currentScenarioIndex + 1} of {scenarios.length}
        </p>

        <h2>{currentScenario.title}</h2>

        <p>{currentScenario.text}</p>

        <h3>What would you do?</h3>

        <div className="answers">
          {currentScenario.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option.isCorrect)}
              disabled={showExplanation}
            >
              {option.text}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="feedback-box">
            <p className={selectedAnswer ? "correct" : "wrong"}>
              {selectedAnswer ? "✅ Correct!" : "❌ Incorrect."}
            </p>
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

export default App