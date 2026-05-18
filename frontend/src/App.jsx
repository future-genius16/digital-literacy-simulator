import { useEffect } from "react"
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
    {
      id: 2,
      title: "Unknown Website",
      text: "You find an article on an unfamiliar website with no author or references. The information seems surprising.",
      options: [
        { text: "Trust the information and use it", isCorrect: false },
        { text: "Check other reliable sources to verify", isCorrect: true },
      ],
      explanation:
        "Reliable information should be verified across multiple trusted sources.",
    }
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
    {
      id: 2,
      title: "Public Wi-Fi",
      text: "You are using public Wi-Fi and need to log into your bank account.",
      options: [
        { text: "Log in as usual", isCorrect: false },
        { text: "Avoid logging in or use a secure connection", isCorrect: true },
      ],
      explanation:
        "Public Wi-Fi networks are often insecure and can expose sensitive data.",
    }
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
  const [scenariosFromServer, setScenariosFromServer] = useState([])
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState("")
  const [authMode, setAuthMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authMessage, setAuthMessage] = useState("")
  const [authMessageType, setAuthMessageType] = useState("")

  useEffect(() => {
    fetch("http://localhost:3001/scenarios")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA FROM SERVER:", data)
        setScenariosFromServer(data)
      })
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
  fetch("http://localhost:3001/scenarios")
    .then((res) => res.json())
    .then((data) => {
      console.log("DATA FROM SERVER:", data)
      setScenariosFromServer(data)
    })
    .catch((err) => console.error(err))
}, [])

  useEffect(() => {
    if (finished && token) {
      fetch("http://localhost:3001/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          module: selectedModule,
          score: score,
          total_questions: currentScenarios.length,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("RESULT SAVED:", data)
        })
        .catch((err) => console.error(err))
    }
  }, [finished, token])

  useEffect(() => {
    if (showResults && token) {
      fetch("http://localhost:3001/results", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setResults(data)
        })
        .catch((err) => console.error(err))
    }
  }, [showResults, token])

const handleAuth = async () => {
  const endpoint = authMode === "login" ? "login" : "activate"

  try {
    const response = await fetch(`http://localhost:3001/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setAuthMessage(data.message || "Authentication failed")
      setAuthMessageType("error")
      return
    }

    if (authMode === "login") {
      setCurrentUser(data.user)
      setToken(data.token)
      setAuthMessage(`Logged in as ${data.user.email}`)
      setAuthMessageType("success")
    } else {
      setAuthMessage("Account activated successfully. Please log in.")
      setAuthMessageType("success")
      setAuthMode("login")
    }

    setEmail("")
    setPassword("")
  } catch (error) {
    console.error(error)
    setAuthMessage("Server connection error")
    setAuthMessageType("error")
  }
}

const handleLogout = () => {
  setCurrentUser(null)
  setToken("")
  setResults([])
  setShowResults(false)
  setStarted(false)
  setSelectedModule(null)
  setAuthMessage("Logged out successfully.")
  setAuthMessageType("success")
}

const startModule = (moduleKey) => {
  if (!currentUser) {
    setAuthMessage("Please log in first.")
    setAuthMessageType("error")
    return
  }

  setSelectedModule(moduleKey)
  setStarted(true)
}

const currentScenarios = selectedModule
  ? scenariosFromServer
      .filter((scenario) => scenario.module === selectedModule)
      .map((scenario) => ({
        ...scenario,
        options: [
          {
            text: scenario.option_a,
            isCorrect: scenario.correct_option === "option_a",
          },
          {
            text: scenario.option_b,
            isCorrect: scenario.correct_option === "option_b",
          },
          ...(scenario.option_c
            ? [
                {
                  text: scenario.option_c,
                  isCorrect: scenario.correct_option === "option_c",
                },
              ]
            : []),
        ],
      }))
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

  if (showResults) {
    return (
      <div className="app">
        <div className="scenario">
          <h2>My Results</h2>

          {!currentUser && (
            <p>Please log in to view your results.</p>
          )}

          {currentUser && results.length === 0 && (
            <p>No results yet. Complete a module to see your progress.</p>
          )}

          {currentUser &&
            results.map((result) => (
              <div key={result.id} className="result-card">
                <p>
                  <strong>Module:</strong> {result.module}
                </p>
                <p>
                  <strong>Score:</strong> {result.score} /{" "}
                  {result.total_questions}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(result.created_at).toLocaleString()}
                </p>
              </div>
            ))}

          <button onClick={() => setShowResults(false)}>Back</button>
        </div>
      </div>
    )
  }
  
  if (!started) {
    return (
      <div className="app">
        <div className="hero">
          <span className="hero-badge">Web-based training platform</span>

          <h1>Digital Literacy Simulator</h1>
          <p>
            An interactive training platform for improving digital literacy and
            online safety skills.
          </p>
          <div className="hero-actions">
            <button onClick={() => startModule("info")}>
              Start training
            </button>

            <button className="secondary-button" onClick={() => setShowResults(true)}>
              View Results
            </button>
          </div>

          <div className="auth-box">
            {!currentUser && (
              <>
                <h3>{authMode === "login" ? "Login" : "Activate account"}</h3>

                <input
                  type="email"
                  placeholder="University email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <button onClick={handleAuth}>
                  {authMode === "login" ? "Login" : "Activate account"}
                </button>

                <button
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login")
                    setAuthMessage("")
                    setAuthMessageType("")
                    setEmail("")
                    setPassword("")
                  }}
                >
                  Switch to {authMode === "login" ? "Activate account" : "Login"}
                </button>
              </>
            )}

            {currentUser && (
              <div className="user-panel">
                <p>Signed in as {currentUser.username}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}

            {authMessage && (
              <p
                className={`auth-message ${
                  authMessageType === "error" ? "auth-error" : "auth-success"
                }`}
              >
                {authMessage}
              </p>
            )}
          </div>
        </div>

        <div className="modules">
          <h2>Modules</h2>

          <div className="module-list">
            <div className="module-card">
              <h3>📰 Information Evaluation</h3>
              <p>Learn how to identify fake news and unreliable sources.</p>
              <button
                onClick={() => startModule("info")}
              >
                Start
              </button>
            </div>

            <div className="module-card">
              <h3>🛡️ Phishing & Threats</h3>
              <p>Recognize phishing emails and online security risks.</p>
              <button
                onClick={() => startModule("phishing")}
              >
                Start
              </button>
            </div>

            <div className="module-card">
              <h3>🔐 Data Protection</h3>
              <p>Understand how to protect your personal information online.</p>
              <button
                onClick={() => startModule("data")}
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