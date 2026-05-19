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
  const [selectedAnswers, setSelectedAnswers] = useState([])
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
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminUsers, setAdminUsers] = useState([])
  const [adminStats, setAdminStats] = useState(null)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("student")
  const [adminMessage, setAdminMessage] = useState("")
  const [adminMessageType, setAdminMessageType] = useState("")
  const [newUserStudyProgram, setNewUserStudyProgram] = useState("")
  const [newUserCourse, setNewUserCourse] = useState("")
  const [userSearch, setUserSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [programFilter, setProgramFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")
  const [progress, setProgress] = useState([])
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [showLevels, setShowLevels] = useState(false)

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
        level: selectedLevel,
        score,
        total_questions: currentScenarios.length,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("RESULT SAVED:", data)
        loadProgress()
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

  useEffect(() => {
    if (showAdmin && currentUser?.role === "admin") {
      loadAdminData()
    }
  }, [showAdmin, token])

  useEffect(() => {
    if (token && currentUser) {
      loadProgress()
    }
  }, [token, currentUser])

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
  setShowAdmin(false)
  setStarted(false)
  setSelectedModule(null)
  setAdminUsers([])
  setAdminStats(null)
  setEmail("")
  setPassword("")
  setAuthMessage("Logged out successfully.")
  setAuthMessageType("success")
}

const loadAdminData = async () => {
  if (!token || currentUser?.role !== "admin") {
    return
  }

  try {
    const usersResponse = await fetch("http://localhost:3001/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const usersData = await usersResponse.json()

    if (!usersResponse.ok) {
      setAdminMessage(usersData.message || "Failed to load users")
      setAdminMessageType("error")
      return
    }

    const statsResponse = await fetch("http://localhost:3001/admin/statistics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const statsData = await statsResponse.json()

    if (!statsResponse.ok) {
      setAdminMessage(statsData.message || "Failed to load statistics")
      setAdminMessageType("error")
      return
    }

    setAdminUsers(usersData)
    setAdminStats(statsData)
  } catch (error) {
    console.error(error)
    setAdminMessage("Server connection error")
    setAdminMessageType("error")
  }
}

const loadProgress = async () => {
  if (!token) {
    return
  }

  try {
    const response = await fetch("http://localhost:3001/progress", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(data.message || "Failed to load progress")
      return
    }

    setProgress(data)
  } catch (error) {
    console.error(error)
  }
}

const handleCreateUser = async () => {
  if (!newUserEmail) {
    setAdminMessage("Email is required")
    setAdminMessageType("error")
    return
  }

  try {
    const response = await fetch("http://localhost:3001/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: newUserEmail,
        role: newUserRole,
        study_program: newUserStudyProgram || null,
        course: newUserCourse || null,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setAdminMessage(data.message || "Failed to create user")
      setAdminMessageType("error")
      return
    }

    setAdminMessage(`User ${data.email} added successfully`)
    setAdminMessageType("success")
    setNewUserEmail("")
    setNewUserRole("student")
    setNewUserStudyProgram("")
    setNewUserCourse("")
    loadAdminData()
  } catch (error) {
    console.error(error)
    setAdminMessage("Server connection error")
    setAdminMessageType("error")
  }
}

const handleUpdateUserStatus = async (userId, status) => {
  try {
    const response = await fetch(
      `http://localhost:3001/admin/users/${userId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setAdminMessage(data.message || "Failed to update status")
      setAdminMessageType("error")
      return
    }

    setAdminMessage(`Status updated for ${data.email}`)
    setAdminMessageType("success")
    loadAdminData()
  } catch (error) {
    console.error(error)
    setAdminMessage("Server connection error")
    setAdminMessageType("error")
  }
}


const startModule = (moduleKey, level = 1) => {
  if (!currentUser) {
    setAuthMessage("Please log in first.")
    setAuthMessageType("error")
    return
  }

  const levelProgress = progress.find(
    (item) =>
      item.module === moduleKey &&
      Number(item.level) === Number(level)
  )

  if (levelProgress && !levelProgress.is_unlocked) {
    setAuthMessage("This level is locked. Complete the previous level first.")
    setAuthMessageType("error")
    return
  }

  setSelectedModule(moduleKey)
  setSelectedLevel(level)
  setCurrentScenarioIndex(0)
  setSelectedAnswer(null)
  setSelectedAnswers([])
  setShowExplanation(false)
  setFinished(false)
  setScore(0)
  setShowLevels(false)
  setStarted(true)
}

const openModuleLevels = (moduleName) => {
  if (!currentUser) {
    setAuthMessage("Please log in first.")
    setAuthMessageType("error")
    return
  }

  setSelectedModule(moduleName)
  setSelectedLevel(1)
  setShowLevels(true)
  setStarted(false)
  setShowResults(false)
  setShowAdmin(false)
}

const currentScenarios = selectedModule
  ? scenariosFromServer
      .filter(
        (scenario) =>
          scenario.module === selectedModule &&
          Number(scenario.level || 1) === Number(selectedLevel)
      )
      .map((scenario) => ({
        ...scenario,
        options: [
          {
            key: "option_a",
            text: scenario.option_a,
            feedback: scenario.option_feedback?.option_a,
            isCorrect:
              scenario.correct_option === "option_a" ||
              scenario.correct_options?.includes("option_a"),
          },
          {
            key: "option_b",
            text: scenario.option_b,
            feedback: scenario.option_feedback?.option_b,
            isCorrect:
              scenario.correct_option === "option_b" ||
              scenario.correct_options?.includes("option_b"),
          },
          ...(scenario.option_c
            ? [
                {
                  key: "option_c",
                  text: scenario.option_c,
                  feedback: scenario.option_feedback?.option_c,
                  isCorrect:
                    scenario.correct_option === "option_c" ||
                    scenario.correct_options?.includes("option_c"),
                },
              ]
            : []),
          ...(scenario.option_d
            ? [
                {
                  key: "option_d",
                  text: scenario.option_d,
                  feedback: scenario.option_feedback?.option_d,
                  isCorrect:
                    scenario.correct_option === "option_d" ||
                    scenario.correct_options?.includes("option_d"),
                },
              ]
            : []),
          ...(scenario.option_e
            ? [
                {
                  key: "option_e",
                  text: scenario.option_e,
                  feedback: scenario.option_feedback?.option_e,
                  isCorrect:
                    scenario.correct_option === "option_e" ||
                    scenario.correct_options?.includes("option_e"),
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
      setSelectedAnswers([])
      setShowExplanation(false)
    } else {
      setFinished(true)
    }
  }

  const toggleMultiSelectAnswer = (optionKey) => {
  if (showExplanation) {
    return
  }

  setSelectedAnswers((prev) =>
    prev.includes(optionKey)
      ? prev.filter((item) => item !== optionKey)
      : [...prev, optionKey]
  )
}

const checkMultiSelectAnswer = () => {
  const currentScenario = currentScenarios[currentScenarioIndex]
  const correctOptions = currentScenario.correct_options || []

  const selectedSorted = [...selectedAnswers].sort()
  const correctSorted = [...correctOptions].sort()

  const isCorrect =
    selectedSorted.length === correctSorted.length &&
    selectedSorted.every((item, index) => item === correctSorted[index])

  if (isCorrect) {
    setScore((prevScore) => prevScore + 1)
  }

  setSelectedAnswer(isCorrect)
  setShowExplanation(true)
}

  const filteredAdminUsers = adminUsers.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(userSearch.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter

    const matchesProgram =
      programFilter === "all" || user.study_program === programFilter

    const matchesCourse =
      courseFilter === "all" || String(user.course) === courseFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRole &&
      matchesProgram &&
      matchesCourse
    )
  })

const uniquePrograms = [
  ...new Set(
    adminUsers
      .map((user) => user.study_program)
      .filter((program) => Boolean(program))
  ),
]

const uniqueCourses = [
  ...new Set(
    adminUsers
      .map((user) => user.course)
      .filter((course) => course !== null && course !== undefined)
  ),
]


  if (showAdmin) {
    return (
      <div className="app">
        <div className="admin-page">
          <div className="admin-header">
            <div>
              <p className="scenario-label">Admin area</p>
              <h2>University Management Panel</h2>
              <p>
                Manage student access, account statuses and monitor simulator
                usage.
              </p>
            </div>

            <button
              onClick={() => {
                setShowAdmin(false)
                setAdminMessage("")
              }}
            >
              Back to homepage
            </button>
          </div>

          {adminMessage && (
            <p
              className={`auth-message ${
                adminMessageType === "error" ? "auth-error" : "auth-success"
              }`}
            >
              {adminMessage}
            </p>
          )}

          {adminStats && (
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span>Total users</span>
                <strong>{adminStats.users.total_users}</strong>
              </div>

              <div className="admin-stat-card">
                <span>Active users</span>
                <strong>{adminStats.users.active_users}</strong>
              </div>

              <div className="admin-stat-card">
                <span>Invited users</span>
                <strong>{adminStats.users.invited_users}</strong>
              </div>

              <div className="admin-stat-card">
                <span>Total attempts</span>
                <strong>{adminStats.results.total_attempts || 0}</strong>
              </div>

              <div className="admin-stat-card">
                <span>Average score</span>
                <strong>
                  {adminStats.results.average_percentage || 0}%
                </strong>
              </div>
            </div>
          )}

          <div className="admin-section">
            <h3>Add university user</h3>

            <div className="admin-form admin-form-wide">
              <input
                type="email"
                placeholder="student@edu.hse.ru"
                value={newUserEmail}
                onChange={(event) => setNewUserEmail(event.target.value)}
              />

              <select
                value={newUserRole}
                onChange={(event) => setNewUserRole(event.target.value)}
              >
                <option value="student">student</option>
                <option value="admin">admin</option>
              </select>

              <select
                value={newUserStudyProgram}
                onChange={(event) => setNewUserStudyProgram(event.target.value)}
              >
                <option value="">Study program</option>
                <option value="Applied Informatics">Applied Informatics</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Business Informatics">Business Informatics</option>
                <option value="Data Science">Data Science</option>
              </select>

              <select
                value={newUserCourse}
                onChange={(event) => setNewUserCourse(event.target.value)}
              >
                <option value="">Course</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>

              <button onClick={handleCreateUser}>Add user</button>
            </div>
          </div>

          <div className="admin-section">
            <h3>Users</h3>

            <div className="admin-filters">
              <input
                type="text"
                placeholder="Search by email"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="invited">invited</option>
                <option value="active">active</option>
                <option value="academic_leave">academic_leave</option>
                <option value="graduated">graduated</option>
                <option value="blocked">blocked</option>
              </select>

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="all">All roles</option>
                <option value="student">student</option>
                <option value="admin">admin</option>
              </select>

              <select
                value={programFilter}
                onChange={(event) => setProgramFilter(event.target.value)}
              >
                <option value="all">All programs</option>
                {uniquePrograms.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>

              <select
                value={courseFilter}
                onChange={(event) => setCourseFilter(event.target.value)}
              >
                <option value="all">All courses</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={String(course)}>
                    Course {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Study program</th>
                    <th>Course</th>
                    <th>Change status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAdminUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`status-badge status-${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.study_program || "—"}</td>
                      <td>{user.course || "—"}</td>
                      <td>
                        <select
                          value={user.status}
                          onChange={(event) =>
                            handleUpdateUserStatus(user.id, event.target.value)
                          }
                        >
                          <option value="invited">invited</option>
                          <option value="active">active</option>
                          <option value="academic_leave">academic_leave</option>
                          <option value="graduated">graduated</option>
                          <option value="blocked">blocked</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {adminStats && (
            <div className="admin-section">
              <h3>Module statistics</h3>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th>Attempts</th>
                      <th>Average score</th>
                      <th>Average percentage</th>
                    </tr>
                  </thead>

                  <tbody>
                    {adminStats.modules.map((module) => (
                      <tr key={module.module}>
                        <td>{module.module}</td>
                        <td>{module.attempts}</td>
                        <td>{module.average_score}</td>
                        <td>{module.average_percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
  
  if (showLevels) {
    const moduleProgress = progress.filter(
      (item) => item.module === selectedModule
    )

    return (
      <div className="app">
        <div className="levels-page">
          <div className="levels-header">
            <div>
              <p className="scenario-label">Training levels</p>
              <h2>{moduleTitles[selectedModule]}</h2>
              <p>
                Complete each level with at least 80% to unlock the next one.
              </p>
            </div>

            <button
              onClick={() => {
                setShowLevels(false)
                setSelectedModule(null)
              }}
            >
              Back to homepage
            </button>
          </div>

          <div className="level-list">
            {[1, 2, 3].map((level) => {
              const item = moduleProgress.find(
                (progressItem) => Number(progressItem.level) === level
              )

              const isUnlocked = item?.is_unlocked
              const isCompleted = item?.is_completed

              return (
                <div
                  key={level}
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
                    <strong>
                      {level === 1
                        ? "Basic"
                        : level === 2
                        ? "Intermediate"
                        : "Advanced"}
                    </strong>
                  </div>

                  <p>
                    {isCompleted
                      ? `Completed with best result: ${item.best_percentage}%`
                      : isUnlocked
                      ? "Available for training"
                      : "Locked until the previous level is completed"}
                  </p>

                  <button
                    disabled={!isUnlocked}
                    onClick={() => startModule(selectedModule, level)}
                  >
                    {isCompleted ? "Train again" : isUnlocked ? "Start level" : "Locked"}
                  </button>
                </div>
              )
            })}
          </div>
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
            <button onClick={() => openModuleLevels("info")}>
              Start training
            </button>

            <button className="secondary-button" onClick={() => setShowResults(true)}>
              View Results
            </button>

            {currentUser?.role === "admin" && (
              <button
                className="secondary-button"
                onClick={() => {
                  setShowAdmin(true)
                  setShowResults(false)
                }}
              >
                Admin Panel
              </button>
            )}
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
                <p>Signed in as {currentUser.email}</p>
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
                onClick={() => openModuleLevels("info")}
              >
                Start
              </button>
            </div>

            <div className="module-card">
              <h3>🛡️ Phishing & Threats</h3>
              <p>Recognize phishing emails and online security risks.</p>
              <button
                onClick={() => openModuleLevels("phishing")}
              >
                Start
              </button>
            </div>

            <div className="module-card">
              <h3>🔐 Data Protection</h3>
              <p>Understand how to protect your personal information online.</p>
              <button
                onClick={() => openModuleLevels("data")}
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
          <h2>Level completed</h2>
          <p>
            You have completed Level {selectedLevel} of the{" "}
            {moduleTitles[selectedModule]} module.
          </p>
          <p>
            Your score: {score} / {currentScenarios.length}
          </p>
          <p className="level-note">
            Score of 80% or higher unlocks the next level.
          </p>

          <button
            onClick={() => {
              setStarted(false)
              setCurrentScenarioIndex(0)
              setSelectedAnswer(null)
              setSelectedAnswers([])
              setShowExplanation(false)
              setFinished(false)
              setScore(0)
              setShowLevels(true)
              loadProgress()
            }}
          >
            Back to levels
          </button>
        </div>
      </div>
    )
}

  return (
    <div className="app">
      <div className="scenario">
        <p className="scenario-label">
          Level {selectedLevel} · Scenario {currentScenarioIndex + 1} of{" "}
          {currentScenarios.length}
        </p>

        <h2>{currentScenario.title}</h2>

        <p>{currentScenario.text}</p>

        <h3>What would you do?</h3>

        {currentScenario.task_type === "multi_select" ? (
          <>
            <div className="multi-select-hint">
              Select all correct options, then click “Check answer”.
            </div>
            <div className="answers">
              {currentScenario.options.map((option) => {
                const isSelected = selectedAnswers.includes(option.key)

                return (
                  <button
                    key={option.key}
                    className={`option-button option-with-badge ${
                      isSelected ? "selected-option" : ""
                    } ${
                      showExplanation && option.isCorrect ? "correct-option" : ""
                    } ${
                      showExplanation && isSelected && !option.isCorrect
                        ? "wrong-option"
                        : ""
                    }`}
                    onClick={() => toggleMultiSelectAnswer(option.key)}
                    disabled={showExplanation}
                  >
                    <span>{option.text}</span>

                    <span className="answer-badges">
                      {showExplanation && option.isCorrect && (
                        <span className="answer-badge correct-badge">
                          Correct answer
                        </span>
                      )}

                      {showExplanation && isSelected && (
                        <span className="answer-badge selected-badge">
                          Your choice
                        </span>
                      )}

                      {showExplanation && option.isCorrect && !isSelected && (
                        <span className="answer-badge missed-badge">
                          Missed
                        </span>
                      )}

                      {showExplanation && isSelected && !option.isCorrect && (
                        <span className="answer-badge wrong-badge">
                          Wrong choice
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            {!showExplanation && (
              <button
                className="check-answer-button"
                disabled={selectedAnswers.length === 0}
                onClick={checkMultiSelectAnswer}
              >
                Check answer
              </button>
            )}
          </>
        ) : (
          <div className="answers">
            {currentScenario.options.map((option) => (
              <button
                key={option.key}
                className={`option-button ${
                  showExplanation && option.isCorrect ? "correct-option" : ""
                } ${
                  showExplanation && selectedAnswer === false && option.isCorrect === false
                    ? "wrong-option"
                    : ""
                }`}
                onClick={() => handleAnswerClick(option.isCorrect)}
                disabled={showExplanation}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}

        {showExplanation && (
          <div className="feedback-box">
            <p className={selectedAnswer ? "correct" : "wrong"}>
              {selectedAnswer ? "✅ Correct!" : "❌ Incorrect."}
            </p>

            {currentScenario.task_type === "multi_select" && (
              <div className="correct-answers-box">
                <strong>Answer breakdown:</strong>

                <ul>
                  {currentScenario.options
                    .filter(
                      (option) =>
                        option.isCorrect || selectedAnswers.includes(option.key)
                    )
                    .map((option) => {
                      const isSelected = selectedAnswers.includes(option.key)
                      const isMissed = option.isCorrect && !isSelected
                      const isWrongChoice = isSelected && !option.isCorrect

                      return (
                        <li key={option.key}>
                          <span>
                            {option.isCorrect && isSelected && "✅ Correct choice: "}
                            {isMissed && "⚠️ Missed correct answer: "}
                            {isWrongChoice && "❌ Wrong choice: "}
                            <strong>{option.text}</strong>
                          </span>

                          {option.feedback && (
                            <p className="option-feedback-text">
                              {option.feedback}
                            </p>
                          )}
                        </li>
                      )
                    })}
                </ul>
              </div>
            )}

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