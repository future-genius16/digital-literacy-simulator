import { useState } from "react"

const modules = {
  phishing: [
    {
      id: 1,
      title: "Phishing Email",
      text: "You receive an email from your bank asking you to urgently confirm your account details...",
      options: [
        { text: "Click the link and enter details", isCorrect: false },
        { text: "Contact the bank directly", isCorrect: true },
      ],
      explanation:
        "Suspicious links and unusual sender addresses are signs of phishing.",
    },
    {
      id: 2,
      title: "Fake Prize",
      text: "You receive a message about winning a prize that requires personal data...",
      options: [
        { text: "Send your data", isCorrect: false },
        { text: "Ignore and report", isCorrect: true },
      ],
      explanation:
        "Requests for personal data combined with urgency indicate fraud.",
    },
  ],

  info: [
    {
      id: 1,
      title: "Suspicious News",
      text: "You see a shocking news article shared on social media...",
      options: [
        { text: "Share immediately", isCorrect: false },
        { text: "Check source credibility", isCorrect: true },
      ],
      explanation:
        "Always verify sources before sharing information.",
    },
  ],

  data: [
    {
      id: 1,
      title: "App Permissions",
      text: "An app asks for access to your contacts and location...",
      options: [
        { text: "Allow everything", isCorrect: false },
        { text: "Limit permissions", isCorrect: true },
      ],
      explanation:
        "Only grant permissions that are necessary.",
    },
  ],
}

const moduleTitles = {
  info: "Information Evaluation",
  phishing: "Phishing & Threats",
  data: "Data Protection",
}

function App() {
  const [started, setStarted] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)

  const currentScenarios = selectedModule
    ? modules[selectedModule]
    : []
  
  const currentScenario = currentScenarios[currentScenarioIndex]
  if (started && !finished && !currentScenario) {
    return (
      <div className="app">
        <div className="scenario">
          <p>No scenario available.</p>
        </div>
      </div>
    )
  }

  const handleAnswerClick = (isCorrect) => {
    setSelectedAnswer(isCorrect)
    setShowExplanation(true)

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1)
    }
  }

  const handleNextScenario = () => {
    if (currentScenarioIndex < currentScenarios.length - 1) {
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
          <button
            onClick={() => {
              setSelectedModule("info")
              setStarted(true)
            }}
          >
            Start training
          </button>
        </div>

        <div className="modules">
          <h2>Modules</h2>

          <div className="module-list">
            <div className="module-card">
              <h3>Information Evaluation</h3>
              <p>Learn how to identify fake news and unreliable sources.</p>
              <button
                onClick={() => {
                  setSelectedModule("info")
                  setStarted(true)
                }}
              >
                Start
              </button>
            </div>

            <div className="module-card">
              <h3>Phishing & Threats</h3>
              <p>Recognize phishing emails and online security risks.</p>
              <button
                onClick={() => {
                  setSelectedModule("phishing")
                  setStarted(true)
                }}
              >
                Start
              </button>
            </div>

            <div className="module-card">
              <h3>Data Protection</h3>
              <p>Understand how to protect your personal information online.</p>
              <button
                onClick={() => {
                  setSelectedModule("data")
                  setStarted(true)
                }}
              >
                Start
              </button>
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
          <p>You have completed the {moduleTitles[selectedModule]} module.</p>

          <p>
            Your score: {score} / {currentScenarios.length}
          </p>

          <button
            onClick={() => {
              setStarted(false)
              setSelectedModule(null)
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
          Scenario {currentScenarioIndex + 1} of {currentScenarios.length}
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