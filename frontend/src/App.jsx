import { useEffect } from "react"
import { useState } from "react"
import UserDashboard from "./components/UserDashboard"
import ResultsPage from "./components/ResultsPage"
import AuthBox from "./components/AuthBox"
import ScenarioRenderer from "./components/ScenarioRenderer"
import { examTasks } from "./examTasks"
import ExamTaskInfo from "./components/ExamTaskInfo"
import TopBar from "./components/TopBar"

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
  const [showAuthModal, setShowAuthModal] = useState(false)
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
  const [adminScenarios, setAdminScenarios] = useState([])
  const [selectedAdminScenario, setSelectedAdminScenario] = useState(null)
  const [editingScenario, setEditingScenario] = useState(null)
  const [editScenarioForm, setEditScenarioForm] = useState(null)
  const [scenarioTaskFilter, setScenarioTaskFilter] = useState("all")
  const [scenarioSectionFilter, setScenarioSectionFilter] = useState("all")
  const [scenarioTypeFilter, setScenarioTypeFilter] = useState("all")
  const [scenarioActiveFilter, setScenarioActiveFilter] = useState("all")
  const [adminActiveTab, setAdminActiveTab] = useState("overview")
  const [scenarioForm, setScenarioForm] = useState({
    module: "exam",
    level: "1",
    difficulty: "exam",
    task_type: "single_choice",
    exam_section: "theoretical",
    exam_task_number: "1",
    exam_task_title: "Безопасность. Поиск",
    exam_topic:
      "Антивирусная защита и её границы применимости; Фишинг; SMS-угрозы; Разрешения приложений; Магазины приложений; Спам и критерии спама; Поиск и ключевые слова.",
    course_materials:
      "Компьютерная безопасность: Спам в почте, социальных сетях и прочих платформах; Какой бывает спам; Социальные угрозы; Мошенничество и фишинг; Угрозы для Android и iOS. Академическая грамотность: Введение: как найти нужную статью. Компьютерная грамотность: Установка / Обновление.",
    title: "",
    text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    option_e: "",
    correct_option: "option_a",
    correct_options: [],
    option_feedback: {
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      option_e: "",
    },
    explanation: "",
    image_url: "",
    digcomp_area: "",
    digcomp_competence: "",
    learning_outcome: "",
  })
  const [selectedExamTask, setSelectedExamTask] = useState(null)
  const [showExamTasks, setShowExamTasks] = useState(false)
  const [selectedExamInfoTask, setSelectedExamInfoTask] = useState(null)
  const [examTasksFromServer, setExamTasksFromServer] = useState([])
  const [examTaskInfoForm, setExamTaskInfoForm] = useState(null)
  const [examSectionFilter, setExamSectionFilter] = useState("theoretical")
  const [toast, setToast] = useState({
    message: "",
    type: "",
  })

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  const getReadableErrorMessage = (message) => {
    const errorMessages = {
      "Invalid password": "Неверный пароль.",
      "User not found": "Пользователь не найден.",
      "User already exists": "Пользователь уже существует.",
      "Email is required": "Введите email.",
      "Password is required": "Введите пароль.",
      "Invalid email or password": "Неверный email или пароль.",
      "Access denied": "Недостаточно прав для выполнения действия.",
      "Token missing": "Необходимо войти в систему.",
      "Invalid token": "Сессия истекла. Войдите заново.",
      "Failed to load users": "Не удалось загрузить пользователей.",
      "Failed to load statistics": "Не удалось загрузить статистику.",
      "Failed to load scenarios": "Не удалось загрузить задания.",
      "Failed to load progress": "Не удалось загрузить прогресс.",
      "Failed to load results": "Не удалось загрузить результаты.",
      "Server connection error": "Ошибка соединения с сервером.",
      "Password must be 6-50 characters long and contain at least one letter and one number":
        "Пароль должен быть от 6 до 50 символов и содержать хотя бы одну букву и одну цифру.",
      "This email is not allowed to access the simulator":
        "Этот email не добавлен в список пользователей тренажёра.",
    }

    return errorMessages[message] || message || "Произошла ошибка."
  }

  const displayExamTasks = examTasks.map((localTask) => {
    const serverTask = examTasksFromServer.find(
      (item) => Number(item.task_number) === Number(localTask.number)
    )

    if (!serverTask) {
      return localTask
    }

    return {
      ...localTask,
      number: serverTask.task_number,
      section: serverTask.section,
      title: serverTask.title,
      description: serverTask.description,
      knowledge: serverTask.knowledge || localTask.knowledge,
      materials: serverTask.materials || localTask.materials,
    }
  })

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
        exam_section: selectedExamTask?.section || null,
        exam_task_number: selectedExamTask?.number || null,
        exam_task_title: selectedExamTask?.title || null,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("RESULT SAVED:", data)
        loadProgress()
        loadResults()
      })
      .catch((err) => console.error(err))
  }
}, [finished, token])


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
      setAuthMessage(getReadableErrorMessage(data.message || "Не удалось выполнить вход."))
      setAuthMessageType("error")
      return
    }

    if (authMode === "login") {
      setCurrentUser(data.user)
      setToken(data.token)
      setAuthMessage(`Вы вошли как ${data.user.email}`)
      setAuthMessageType("success")
    } else {
      setAuthMessage("Аккаунт успешно активирован. Теперь войдите в систему.")
      setAuthMessageType("success")
      setAuthMode("login")
    }

    setEmail("")
    setPassword("")
  } catch (error) {
    console.error(error)
    setAuthMessage("Ошибка соединения с сервером.")
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
  setShowAuthModal(false)
  setAuthMessage("")
  setAuthMessageType("")
  showToast("Вы вышли из системы.", "success")
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
      setAdminMessage(getReadableErrorMessage(usersData.message || "Failed to load users"))
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
      setAdminMessage(getReadableErrorMessage(statsData.message || "Failed to load statistics"))
      setAdminMessageType("error")
      return
    }

    const scenariosResponse = await fetch("http://localhost:3001/admin/scenarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const scenariosData = await scenariosResponse.json()

    if (!scenariosResponse.ok) {
      setAdminMessage(getReadableErrorMessage(scenariosData.message || "Failed to load scenarios"))
      setAdminMessageType("error")
      return
    }

    setAdminUsers(usersData)
    setAdminStats(statsData)
    setAdminScenarios(scenariosData)
  } catch (error) {
    console.error(error)
    setAdminMessage(getReadableErrorMessage("Server connection error"))
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
      console.error(getReadableErrorMessage(data.message || "Failed to load progress"))
      return
    }

    setProgress(data)
  } catch (error) {
    console.error(error)
  }
}

const loadExamTasks = async () => {
  try {
    const response = await fetch("http://localhost:3001/exam-tasks")
    const data = await response.json()

    if (!response.ok) {
      console.error(data.message || "Не удалось загрузить информацию о заданиях НЭ.")
      return
    }

    setExamTasksFromServer(data)
  } catch (error) {
    console.error("Ошибка загрузки информации о заданиях НЭ:", error)
  }
}

const loadResults = async () => {
  if (!token) {
    return
  }

  try {
    const response = await fetch("http://localhost:3001/results", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(getReadableErrorMessage(data.message || "Failed to load results"))
      return
    }

    setResults(data)
  } catch (error) {
    console.error(error)
  }
}

  useEffect(() => {
    if (showResults && token) {
      loadResults()
    }
  }, [showResults, token])

  useEffect(() => {
    if (showAdmin && currentUser?.role === "admin") {
      loadAdminData()
    }
  }, [showAdmin, token])

  useEffect(() => {
    loadExamTasks()
  }, [])

  useEffect(() => {
    const selectedTask = displayExamTasks.find(
      (task) => Number(task.number) === Number(scenarioForm.exam_task_number)
    )

    if (!selectedTask) {
      return
    }

    setScenarioForm((prev) => ({
      ...prev,
      exam_section: selectedTask.section,
      exam_task_title: selectedTask.title,
      exam_topic: getExamTaskKnowledgeText(selectedTask),
      course_materials: getExamTaskMaterialsText(selectedTask),
    }))
  }, [examTasksFromServer])

  useEffect(() => {
    if (token && currentUser) {
      loadProgress()
      loadResults()
    }
  }, [token, currentUser])

  useEffect(() => {
    if (!adminMessage) {
      return
    }

    const timer = setTimeout(() => {
      setAdminMessage("")
      setAdminMessageType("")
    }, 4000)

    return () => clearTimeout(timer)
  }, [adminMessage])

  useEffect(() => {
    if (currentUser) {
      setShowAuthModal(false)
    }
  }, [currentUser])

  useEffect(() => {
  if (!toast.message) {
    return
  }

  const timer = setTimeout(() => {
      setToast({ message: "", type: "" })
    }, 4000)

    return () => clearTimeout(timer)
  }, [toast])

const handleCreateUser = async () => {
  if (!newUserEmail) {
    setAdminMessage("Введите email пользователя.")
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
      setAdminMessage(data.message || "Не удалось добавить пользователя.")
      setAdminMessageType("error")
      return
    }

    setAdminMessage(`Пользователь ${data.email} успешно добавлен.`)
    setAdminMessageType("success")
    setNewUserEmail("")
    setNewUserRole("student")
    setNewUserStudyProgram("")
    setNewUserCourse("")
    loadAdminData()
  } catch (error) {
    console.error(error)
    setAdminMessage("Ошибка соединения с сервером.")
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
      setAdminMessage(data.message || "Не удалось изменить статус пользователя.")
      setAdminMessageType("error")
      return
    }

    setAdminMessage(`Статус пользователя ${data.email} обновлён.`)
    setAdminMessageType("success")
    loadAdminData()
  } catch (error) {
    console.error(error)
    setAdminMessage("Ошибка соединения с сервером.")
    setAdminMessageType("error")
  }
}

const openExamTaskInfoEditor = (task) => {
  setExamTaskInfoForm({
    task_number: task.number,
    section: task.section,
    title: task.title,
    description: task.description || "",
    knowledgeText: task.knowledge?.join("\n") || "",
    materials: task.materials?.length
      ? task.materials
      : [
          {
            category: "",
            links: [{ title: "", url: "" }],
          },
        ],
  })
}

const updateExamTaskInfoForm = (field, value) => {
  setExamTaskInfoForm((prev) => ({
    ...prev,
    [field]: value,
  }))
}

const updateMaterialCategory = (groupIndex, value) => {
  setExamTaskInfoForm((prev) => ({
    ...prev,
    materials: prev.materials.map((group, index) =>
      index === groupIndex ? { ...group, category: value } : group
    ),
  }))
}

const updateMaterialLink = (groupIndex, linkIndex, field, value) => {
  setExamTaskInfoForm((prev) => ({
    ...prev,
    materials: prev.materials.map((group, currentGroupIndex) => {
      if (currentGroupIndex !== groupIndex) {
        return group
      }

      return {
        ...group,
        links: group.links.map((link, currentLinkIndex) =>
          currentLinkIndex === linkIndex ? { ...link, [field]: value } : link
        ),
      }
    }),
  }))
}

const addMaterialGroup = () => {
  setExamTaskInfoForm((prev) => ({
    ...prev,
    materials: [
      ...prev.materials,
      {
        category: "",
        links: [{ title: "", url: "" }],
      },
    ],
  }))
}

const removeMaterialGroup = (groupIndex) => {
  setExamTaskInfoForm((prev) => ({
    ...prev,
    materials: prev.materials.filter((_, index) => index !== groupIndex),
  }))
}

const addMaterialLink = (groupIndex) => {
  setExamTaskInfoForm((prev) => ({
    ...prev,
    materials: prev.materials.map((group, index) =>
      index === groupIndex
        ? {
            ...group,
            links: [...group.links, { title: "", url: "" }],
          }
        : group
    ),
  }))
}

const removeMaterialLink = (groupIndex, linkIndex) => {
  setExamTaskInfoForm((prev) => ({
    ...prev,
    materials: prev.materials.map((group, index) =>
      index === groupIndex
        ? {
            ...group,
            links: group.links.filter((_, currentLinkIndex) => currentLinkIndex !== linkIndex),
          }
        : group
    ),
  }))
}

const handleUpdateExamTaskInfo = async () => {
  if (!examTaskInfoForm) {
    return
  }

  if (!examTaskInfoForm.title.trim() || !examTaskInfoForm.section) {
    setAdminMessage("Заполните название задания и часть экзамена.")
    setAdminMessageType("error")
    return
  }

  const payload = {
    section: examTaskInfoForm.section,
    title: examTaskInfoForm.title,
    description: examTaskInfoForm.description,
    knowledge: examTaskInfoForm.knowledgeText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    materials: examTaskInfoForm.materials
      .map((group) => ({
        category: group.category.trim(),
        links: group.links
          .map((link) => ({
            title: link.title.trim(),
            url: link.url.trim(),
          }))
          .filter((link) => link.title && link.url),
      }))
      .filter((group) => group.category && group.links.length > 0),
  }

  try {
    const response = await fetch(
      `http://localhost:3001/exam-tasks/${examTaskInfoForm.task_number}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setAdminMessage(data.message || "Не удалось обновить информацию о задании.")
      setAdminMessageType("error")
      return
    }

    setAdminMessage(`Информация о задании ${data.task_number} обновлена.`)
    setAdminMessageType("success")
    await loadExamTasks()

    setExamTaskInfoForm({
      task_number: data.task_number,
      section: data.section,
      title: data.title,
      description: data.description || "",
      knowledgeText: data.knowledge?.join("\n") || "",
      materials: data.materials?.length
        ? data.materials
        : [
            {
              category: "",
              links: [{ title: "", url: "" }],
            },
          ],
    })
  } catch (error) {
    console.error(error)
    setAdminMessage("Ошибка соединения с сервером.")
    setAdminMessageType("error")
  }
}

const updateScenarioForm = (field, value) => {
  if (field === "exam_task_number") {
    const selectedTask = displayExamTasks.find(
      (task) => Number(task.number) === Number(value)
    )

    setScenarioForm((prev) => ({
      ...prev,
      exam_task_number: value,
      exam_section: selectedTask?.section || prev.exam_section,
      exam_task_title: selectedTask?.title || prev.exam_task_title,
      exam_topic: getExamTaskKnowledgeText(selectedTask),
      course_materials: getExamTaskMaterialsText(selectedTask),
    }))

    return
  }

  setScenarioForm((prev) => ({
    ...prev,
    [field]: value,
  }))
}

const updateScenarioFeedback = (optionKey, value) => {
  setScenarioForm((prev) => ({
    ...prev,
    option_feedback: {
      ...prev.option_feedback,
      [optionKey]: value,
    },
  }))
}

const toggleCorrectOption = (optionKey) => {
  setScenarioForm((prev) => {
    const alreadySelected = prev.correct_options.includes(optionKey)

    return {
      ...prev,
      correct_options: alreadySelected
        ? prev.correct_options.filter((item) => item !== optionKey)
        : [...prev.correct_options, optionKey],
    }
  })
}

const handleCreateScenario = async () => {
  const isMultiAnswer =
    scenarioForm.task_type === "multi_select" ||
    scenarioForm.task_type === "sequence"

  const payload = {
    ...scenarioForm,
    module: "exam",
    level: 1,
    exam_task_number: Number(scenarioForm.exam_task_number),
    correct_option: isMultiAnswer
      ? scenarioForm.correct_options[0]
      : scenarioForm.correct_option,
    correct_options: isMultiAnswer
      ? scenarioForm.correct_options
      : [scenarioForm.correct_option],
  }

  if (
    !payload.exam_task_number ||
    !payload.exam_section ||
    !payload.exam_task_title.trim() ||
    !payload.title.trim() ||
    !payload.text.trim() ||
    !payload.option_a.trim() ||
    !payload.option_b.trim()
  ) {
    setAdminMessage(
      "Заполните номер задания НЭ, название задания НЭ, название вопроса, текст вопроса и варианты A/B."
    )
    setAdminMessageType("error")
    return
  }

  if (scenarioForm.task_type === "multi_select" && scenarioForm.correct_options.length === 0) {
    setAdminMessage("Выберите хотя бы один правильный вариант ответа.")
    setAdminMessageType("error")
    return
  }

  if (scenarioForm.task_type === "sequence" && scenarioForm.correct_options.length < 2) {
    setAdminMessage("Для последовательности выберите минимум два шага в правильном порядке.")
    setAdminMessageType("error")
    return
  }

  try {
    const response = await fetch("http://localhost:3001/admin/scenarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      setAdminMessage(data.message || "Не удалось создать задание.")
      setAdminMessageType("error")
      return
    }

    setAdminMessage(`Задание "${data.title}" успешно создано.`)
    setAdminMessageType("success")

    setScenarioForm({
      module: "exam",
      level: "1",
      difficulty: "exam",
      task_type: "single_choice",
      exam_section: "theoretical",
      exam_task_number: "1",
      exam_task_title: "Безопасность. Поиск",
      exam_topic:
        "Антивирусная защита и её границы применимости; Фишинг; SMS-угрозы; Разрешения приложений; Магазины приложений; Спам и критерии спама; Поиск и ключевые слова.",
      course_materials:
        "Компьютерная безопасность: Спам в почте, социальных сетях и прочих платформах; Какой бывает спам; Социальные угрозы; Мошенничество и фишинг; Угрозы для Android и iOS. Академическая грамотность: Введение: как найти нужную статью. Компьютерная грамотность: Установка / Обновление.",
      title: "",
      text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      option_e: "",
      correct_option: "option_a",
      correct_options: [],
      option_feedback: {
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        option_e: "",
      },
      explanation: "",
      image_url: "",
      digcomp_area: "",
      digcomp_competence: "",
      learning_outcome: "",
    })

    loadAdminData()

    fetch("http://localhost:3001/scenarios")
      .then((res) => res.json())
      .then((data) => setScenariosFromServer(data))
      .catch((err) => console.error(err))
  } catch (error) {
    console.error(error)
    setAdminMessage("Ошибка соединения с сервером.")
    setAdminMessageType("error")
  }
}

const openScenarioEditor = (scenario) => {
  setEditingScenario(scenario)

  setEditScenarioForm({
    module: "exam",
    level: scenario.level || 1,
    difficulty: scenario.difficulty || "exam",
    task_type: scenario.task_type || "single_choice",
    exam_section: scenario.exam_section || "theoretical",
    exam_task_number: String(scenario.exam_task_number || "1"),
    exam_task_title: scenario.exam_task_title || "",
    exam_topic: scenario.exam_topic || "",
    course_materials: scenario.course_materials || "",
    title: scenario.title || "",
    text: scenario.text || "",
    option_a: scenario.option_a || "",
    option_b: scenario.option_b || "",
    option_c: scenario.option_c || "",
    option_d: scenario.option_d || "",
    option_e: scenario.option_e || "",
    correct_option: scenario.correct_option || "option_a",
    correct_options: scenario.correct_options || [],
    option_feedback: {
      option_a: scenario.option_feedback?.option_a || "",
      option_b: scenario.option_feedback?.option_b || "",
      option_c: scenario.option_feedback?.option_c || "",
      option_d: scenario.option_feedback?.option_d || "",
      option_e: scenario.option_feedback?.option_e || "",
    },
    explanation: scenario.explanation || "",
    image_url: scenario.image_url || "",
    digcomp_area: scenario.digcomp_area || "",
    digcomp_competence: scenario.digcomp_competence || "",
    learning_outcome: scenario.learning_outcome || "",
    is_active: scenario.is_active,
  })
}

const updateEditScenarioForm = (field, value) => {
  if (field === "exam_task_number") {
    const selectedTask = displayExamTasks.find(
      (task) => Number(task.number) === Number(value)
    )

    setEditScenarioForm((prev) => ({
      ...prev,
      exam_task_number: value,
      exam_section: selectedTask?.section || prev.exam_section,
      exam_task_title: selectedTask?.title || prev.exam_task_title,
      exam_topic: getExamTaskKnowledgeText(selectedTask),
      course_materials: getExamTaskMaterialsText(selectedTask),
    }))

    return
  }

  setEditScenarioForm((prev) => ({
    ...prev,
    [field]: value,
  }))
}

const updateEditScenarioFeedback = (optionKey, value) => {
  setEditScenarioForm((prev) => ({
    ...prev,
    option_feedback: {
      ...prev.option_feedback,
      [optionKey]: value,
    },
  }))
}

const toggleEditCorrectOption = (optionKey) => {
  setEditScenarioForm((prev) => {
    const alreadySelected = prev.correct_options.includes(optionKey)

    return {
      ...prev,
      correct_options: alreadySelected
        ? prev.correct_options.filter((item) => item !== optionKey)
        : [...prev.correct_options, optionKey],
    }
  })
}

const handleUpdateScenario = async () => {
  if (!editingScenario || !editScenarioForm) {
    return
  }

  const isMultiAnswer =
    editScenarioForm.task_type === "multi_select" ||
    editScenarioForm.task_type === "sequence"

  const payload = {
    ...editScenarioForm,
    module: "exam",
    level: 1,
    exam_task_number: Number(editScenarioForm.exam_task_number),
    correct_option: isMultiAnswer
      ? editScenarioForm.correct_options[0]
      : editScenarioForm.correct_option,
    correct_options: isMultiAnswer
      ? editScenarioForm.correct_options
      : [editScenarioForm.correct_option],
  }

  if (
    !payload.exam_task_number ||
    !payload.exam_section ||
    !payload.exam_task_title.trim() ||
    !payload.title.trim() ||
    !payload.text.trim() ||
    !payload.option_a.trim() ||
    !payload.option_b.trim()
  ) {
    setAdminMessage(
      "Заполните номер задания НЭ, название вопроса, текст вопроса и варианты A/B."
    )
    setAdminMessageType("error")
    return
  }

  if (
    editScenarioForm.task_type === "multi_select" &&
    editScenarioForm.correct_options.length === 0
  ) {
    setAdminMessage("Выберите хотя бы один правильный вариант ответа.")
    setAdminMessageType("error")
    return
  }

  if (
    editScenarioForm.task_type === "sequence" &&
    editScenarioForm.correct_options.length < 2
  ) {
    setAdminMessage("Для последовательности выберите минимум два шага в правильном порядке.")
    setAdminMessageType("error")
    return
  }

  try {
    const response = await fetch(
      `http://localhost:3001/admin/scenarios/${editingScenario.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setAdminMessage(
        getReadableErrorMessage(data.message || "Не удалось обновить задание.")
      )
      setAdminMessageType("error")
      return
    }

    setAdminMessage(`Задание "${data.title}" обновлено.`)
    setAdminMessageType("success")

    setEditingScenario(null)
    setEditScenarioForm(null)

    loadAdminData()

    fetch("http://localhost:3001/scenarios")
      .then((res) => res.json())
      .then((data) => setScenariosFromServer(data))
      .catch((err) => console.error(err))
  } catch (error) {
    console.error(error)
    setAdminMessage("Ошибка соединения с сервером.")
    setAdminMessageType("error")
  }
}

const handleToggleScenarioActive = async (scenario) => {
  try {
    const response = await fetch(
      `http://localhost:3001/admin/scenarios/${scenario.id}/active`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !scenario.is_active,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setAdminMessage(
        getReadableErrorMessage(data.message || "Не удалось изменить активность задания.")
      )
      setAdminMessageType("error")
      return
    }

    setAdminMessage(
      data.is_active
        ? `Задание "${data.title}" включено.`
        : `Задание "${data.title}" отключено.`
    )
    setAdminMessageType("success")

    loadAdminData()

    fetch("http://localhost:3001/scenarios")
      .then((res) => res.json())
      .then((data) => setScenariosFromServer(data))
      .catch((err) => console.error(err))
  } catch (error) {
    console.error(error)
    setAdminMessage("Ошибка соединения с сервером.")
    setAdminMessageType("error")
  }
}

const openExamTask = async (taskNumber) => {
  if (!currentUser) {
    showToast("Сначала войдите в систему, чтобы начать тренировку.", "error")
    setAuthMessage("")
    setAuthMessageType("")
    setShowAuthModal(true)
    return
  }

  const task = displayExamTasks.find(
    (item) => Number(item.number) === Number(taskNumber)
  )

  try {
    const response = await fetch(
      `http://localhost:3001/scenarios?exam_task_number=${taskNumber}`
    )

    const data = await response.json()

    if (!response.ok) {
      showToast(
        getReadableErrorMessage(data.message || "Не удалось загрузить задания."),
        "error"
      )
      return
    }

    if (data.length === 0) {
      showToast(
        "Для этого задания пока нет активных тренировочных вопросов.",
        "error"
      )
      return
    }

    setScenariosFromServer(data)
    setSelectedExamTask(task)
    setSelectedModule("exam")
    setSelectedLevel(1)
    setCurrentScenarioIndex(0)
    setSelectedAnswer(null)
    setSelectedAnswers([])
    setShowExplanation(false)
    setFinished(false)
    setScore(0)
    setStarted(true)
  } catch (error) {
    console.error(error)
    showToast("Ошибка соединения с сервером.", "error")
  }
}

const currentScenarios = selectedModule
  ? scenariosFromServer
      .filter((scenario) => {
        if (selectedModule === "exam") {
          return Number(scenario.exam_task_number) === selectedExamTask?.number
        }

        return scenario.module === selectedModule
      })
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
          <p>Для выбранного задания пока нет доступного сценария.</p>
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

  const handleExitTraining = () => {
    const shouldExit = window.confirm(
      "Вы уверены, что хотите выйти из тренировки? Текущий результат не будет сохранён."
    )

    if (!shouldExit) {
      return
    }

    setStarted(false)
    setFinished(false)
    setSelectedModule(null)
    setSelectedExamTask(null)
    setSelectedLevel(1)
    setCurrentScenarioIndex(0)
    setSelectedAnswer(null)
    setSelectedAnswers([])
    setShowExplanation(false)
    setScore(0)
  }

  const isMultiAnswerTask = (taskType) => {
    return taskType === "multi_select" || taskType === "sequence"
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

  const isSequenceTask = currentScenario.task_type === "sequence"

  const isCorrect = isSequenceTask
    ? selectedAnswers.length === correctOptions.length &&
      selectedAnswers.every((item, index) => item === correctOptions[index])
    : (() => {
        const selectedSorted = [...selectedAnswers].sort()
        const correctSorted = [...correctOptions].sort()

        return (
          selectedSorted.length === correctSorted.length &&
          selectedSorted.every((item, index) => item === correctSorted[index])
        )
      })()

  if (isCorrect) {
    setScore((prevScore) => prevScore + 1)
  }

  setSelectedAnswer(isCorrect)
  setShowExplanation(true)
}

  const optionLabels = {
    option_a: "Вариант A",
    option_b: "Вариант B",
    option_c: "Вариант C",
    option_d: "Вариант D",
    option_e: "Вариант E",
  }

  const taskTypeLabels = {
    single_choice: "Один правильный ответ",
    multi_select: "Несколько правильных ответов",
    sequence: "Последовательность",
  }

  const getScenarioOptions = (scenario) =>
    [
      { key: "option_a", label: "Вариант A", text: scenario.option_a },
      { key: "option_b", label: "Вариант B", text: scenario.option_b },
      { key: "option_c", label: "Вариант C", text: scenario.option_c },
      { key: "option_d", label: "Вариант D", text: scenario.option_d },
      { key: "option_e", label: "Вариант E", text: scenario.option_e },
    ].filter((option) => option.text)

  const getCorrectAnswerText = (scenario) => {
    const options = getScenarioOptions(scenario)

    if (scenario.task_type === "single_choice") {
      const correctOption = options.find(
        (option) => option.key === scenario.correct_option
      )

      return correctOption ? correctOption.text : "—"
    }

    if (scenario.task_type === "multi_select") {
      return options
        .filter((option) => scenario.correct_options?.includes(option.key))
        .map((option) => option.text)
        .join("; ")
    }

    if (scenario.task_type === "sequence") {
      return (scenario.correct_options || [])
        .map((optionKey, index) => {
          const option = options.find((item) => item.key === optionKey)
          return option ? `${index + 1}. ${option.text}` : null
        })
        .filter(Boolean)
        .join("\n")
    }

    return "—"
  }

  const shouldShowOptionFeedback = scenarioForm.task_type === "multi_select"

  const getExamTaskKnowledgeText = (task) =>
    task?.knowledge?.join("; ") || ""

  const getExamTaskMaterialsText = (task) =>
    task?.materials
      ?.map(
        (group) =>
          `${group.category}: ${group.links.map((link) => link.title).join("; ")}`
      )
      .join(". ") || ""

  const examTaskScenarioStats = displayExamTasks.map((task) => {
    const taskScenarios = adminScenarios.filter(
      (scenario) => Number(scenario.exam_task_number) === Number(task.number)
    )

    const activeScenarios = taskScenarios.filter(
      (scenario) => scenario.is_active
    )

    const singleChoiceCount = taskScenarios.filter(
      (scenario) => scenario.task_type === "single_choice"
    ).length

    const multiSelectCount = taskScenarios.filter(
      (scenario) => scenario.task_type === "multi_select"
    ).length

    const sequenceCount = taskScenarios.filter(
      (scenario) => scenario.task_type === "sequence"
    ).length

    return {
      number: task.number,
      title: task.title,
      section: task.section,
      total: taskScenarios.length,
      active: activeScenarios.length,
      singleChoiceCount,
      multiSelectCount,
      sequenceCount,
    }
  })

  const filteredAdminScenarios = adminScenarios
    .filter((scenario) => scenario.module === "exam")
    .filter((scenario) => {
      const matchesTask =
        scenarioTaskFilter === "all" ||
        Number(scenario.exam_task_number) === Number(scenarioTaskFilter)

      const matchesSection =
        scenarioSectionFilter === "all" ||
        scenario.exam_section === scenarioSectionFilter

      const matchesType =
        scenarioTypeFilter === "all" ||
        scenario.task_type === scenarioTypeFilter

      const matchesActive =
        scenarioActiveFilter === "all" ||
        String(scenario.is_active) === scenarioActiveFilter

      return matchesTask && matchesSection && matchesType && matchesActive
    })

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
          <button
            className="page-back-button"
            onClick={() => {
              setShowAdmin(false)
              setShowResults(false)
            }}
          >
            Назад
          </button>
          <div className="admin-header">
            <div>
              <p className="scenario-label">Администрирование</p>
              <h2>Панель администратора</h2>
              <p>
                Управление студентами, заданиями НЭ и статистикой прохождения тренажёра.
              </p>
            </div>
          </div>

          <div className="admin-tabs">
            <button
              className={adminActiveTab === "overview" ? "active-tab" : ""}
              onClick={() => setAdminActiveTab("overview")}
            >
              Обзор
            </button>

            <button
              className={adminActiveTab === "students" ? "active-tab" : ""}
              onClick={() => setAdminActiveTab("students")}
            >
              Студенты
            </button>

            <button
              className={adminActiveTab === "taskInfo" ? "active-tab" : ""}
              onClick={() => setAdminActiveTab("taskInfo")}
            >
              Информация о заданиях
            </button>

            <button
              className={adminActiveTab === "tasks" ? "active-tab" : ""}
              onClick={() => setAdminActiveTab("tasks")}
            >
              Банк заданий
            </button>

            <button
              className={adminActiveTab === "create" ? "active-tab" : ""}
              onClick={() => setAdminActiveTab("create")}
            >
              Создать задание
            </button>
          </div>

          {adminMessage && (
            <div
              className={`admin-toast ${
                adminMessageType === "error" ? "admin-toast-error" : "admin-toast-success"
              }`}
            >
              <span>{adminMessage}</span>

              <button
                type="button"
                onClick={() => {
                  setAdminMessage("")
                  setAdminMessageType("")
                }}
              >
                ×
              </button>
            </div>
          )}

          {selectedAdminScenario && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedAdminScenario(null)}
            >
              <div
                className="scenario-view-modal"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="scenario-view-header">
                  <div>
                    <p className="scenario-label">
                      № {selectedAdminScenario.exam_task_number || "—"} ·{" "}
                      {selectedAdminScenario.exam_section === "theoretical"
                        ? "Теоретическая часть"
                        : selectedAdminScenario.exam_section === "practical"
                        ? "Практическая часть"
                        : "Задание НЭ"}
                    </p>

                    <h2>{selectedAdminScenario.title}</h2>

                    <p>
                      {selectedAdminScenario.exam_task_title || "Без привязки к заданию НЭ"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="modal-close-button"
                    onClick={() => setSelectedAdminScenario(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="scenario-view-meta">
                  <div>
                    <span>Тип вопроса</span>
                    <strong>
                      {taskTypeLabels[selectedAdminScenario.task_type] ||
                        selectedAdminScenario.task_type}
                    </strong>
                  </div>

                  <div>
                    <span>Часть экзамена</span>
                    <strong>
                      {selectedAdminScenario.exam_section === "theoretical"
                        ? "Теоретическая"
                        : selectedAdminScenario.exam_section === "practical"
                        ? "Практическая"
                        : "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Статус</span>
                    <strong>{selectedAdminScenario.is_active ? "Активно" : "Отключено"}</strong>
                  </div>
                </div>

                <div className="scenario-view-section">
                  <h3>Текст вопроса</h3>
                  <p>{selectedAdminScenario.text}</p>

                  {selectedAdminScenario.image_url && (
                    <div className="scenario-view-image-wrapper">
                      <img
                        src={selectedAdminScenario.image_url}
                        alt="Иллюстрация к заданию"
                        className="scenario-view-image"
                      />
                    </div>
                  )}
                </div>

                <div className="scenario-view-section">
                  <h3>
                    {selectedAdminScenario.task_type === "sequence"
                      ? "Шаги"
                      : "Варианты ответа"}
                  </h3>

                  <div className="scenario-view-options">
                    {getScenarioOptions(selectedAdminScenario).map((option) => (
                      <div key={option.key} className="scenario-view-option">
                        <strong>{option.label}</strong>
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="scenario-view-section">
                  <h3>
                    {selectedAdminScenario.task_type === "sequence"
                      ? "Правильная последовательность"
                      : "Правильный ответ"}
                  </h3>

                  <pre className="scenario-view-answer">
                    {getCorrectAnswerText(selectedAdminScenario)}
                  </pre>
                </div>

                {selectedAdminScenario.explanation?.trim() && (
                  <div className="scenario-view-section">
                    <h3>Пояснение</h3>
                    <p>{selectedAdminScenario.explanation}</p>
                  </div>
                )}

                <div className="scenario-view-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setSelectedAdminScenario(null)}
                  >
                    Закрыть
                  </button>

                  <button
                      type="button"
                      onClick={() => {
                      openScenarioEditor(selectedAdminScenario)
                      setSelectedAdminScenario(null)
                    }}
                  >
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
          )}

          {editingScenario && editScenarioForm && (
            <div
              className="modal-overlay"
              onClick={() => {
                setEditingScenario(null)
                setEditScenarioForm(null)
              }}
            >
              <div
                className="scenario-edit-modal"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="scenario-view-header">
                  <div>
                    <p className="scenario-label">Редактирование задания</p>
                    <h2>{editingScenario.title}</h2>
                    <p>Измените данные тренировочного вопроса и сохраните результат.</p>
                  </div>

                  <button
                    type="button"
                    className="modal-close-button"
                    onClick={() => {
                      setEditingScenario(null)
                      setEditScenarioForm(null)
                    }}
                  >
                    ×
                  </button>
                </div>

                <div className="scenario-admin-form">
                  <div className="scenario-form-block">
                    <h4>Привязка к экзамену</h4>

                    <label className="admin-field-label">
                      Номер задания НЭ
                      <select
                        value={editScenarioForm.exam_task_number}
                        onChange={(event) =>
                          updateEditScenarioForm("exam_task_number", event.target.value)
                        }
                      >
                        {displayExamTasks.map((task) => (
                          <option key={task.number} value={String(task.number)}>
                            Задание {task.number}. {task.title}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="admin-field-label">
                      Часть экзамена
                      <input
                        type="text"
                        value={
                          editScenarioForm.exam_section === "theoretical"
                            ? "Теоретическая часть"
                            : "Практическая часть"
                        }
                        readOnly
                      />
                    </label>

                    <label className="admin-field-label">
                      Название задания НЭ
                      <input type="text" value={editScenarioForm.exam_task_title} readOnly />
                    </label>
                  </div>

                  <div className="scenario-form-block">
                    <h4>Содержание вопроса</h4>

                    <label className="admin-field-label">
                      Тип вопроса
                      <select
                        value={editScenarioForm.task_type}
                        onChange={(event) =>
                          updateEditScenarioForm("task_type", event.target.value)
                        }
                      >
                        <option value="single_choice">Один правильный ответ</option>
                        <option value="multi_select">Несколько правильных ответов</option>
                        <option value="sequence">Последовательность действий</option>
                      </select>
                    </label>

                    <input
                      type="text"
                      placeholder="Название вопроса"
                      value={editScenarioForm.title}
                      onChange={(event) =>
                        updateEditScenarioForm("title", event.target.value)
                      }
                    />

                    <textarea
                      placeholder="Текст вопроса"
                      value={editScenarioForm.text}
                      onChange={(event) =>
                        updateEditScenarioForm("text", event.target.value)
                      }
                    />
                  </div>

                  <div className="scenario-form-block">
                    <h4>
                      {editScenarioForm.task_type === "sequence"
                        ? "Шаги последовательности"
                        : "Варианты ответа"}
                    </h4>

                    <div className="scenario-options-grid">
                      {["option_a", "option_b", "option_c", "option_d", "option_e"].map(
                        (optionKey) => (
                          <div key={optionKey} className="scenario-option-editor">
                            <label>
                              {editScenarioForm.task_type === "sequence"
                                ? `Шаг ${optionLabels[optionKey].replace("Вариант ", "")}`
                                : optionLabels[optionKey]}
                            </label>

                            <input
                              type="text"
                              placeholder={
                                editScenarioForm.task_type === "sequence"
                                  ? "Описание шага"
                                  : `Текст для ${optionLabels[optionKey]}`
                              }
                              value={editScenarioForm[optionKey]}
                              onChange={(event) =>
                                updateEditScenarioForm(optionKey, event.target.value)
                              }
                            />

                            {editScenarioForm.task_type === "multi_select" && (
                              <textarea
                                placeholder={`Пояснение для ${optionLabels[optionKey]}`}
                                value={editScenarioForm.option_feedback[optionKey]}
                                onChange={(event) =>
                                  updateEditScenarioFeedback(optionKey, event.target.value)
                                }
                              />
                            )}

                            {editScenarioForm.task_type === "multi_select" ? (
                              <label className="correct-option-control">
                                <input
                                  type="checkbox"
                                  checked={editScenarioForm.correct_options.includes(optionKey)}
                                  onChange={() => toggleEditCorrectOption(optionKey)}
                                />
                                Правильный вариант
                              </label>
                            ) : editScenarioForm.task_type === "sequence" ? (
                              <label className="correct-option-control">
                                <input
                                  type="checkbox"
                                  checked={editScenarioForm.correct_options.includes(optionKey)}
                                  onChange={() => toggleEditCorrectOption(optionKey)}
                                />
                                Включить в последовательность
                              </label>
                            ) : (
                              <label className="correct-option-control">
                                <input
                                  type="radio"
                                  name="edit_correct_option"
                                  checked={editScenarioForm.correct_option === optionKey}
                                  onChange={() =>
                                    updateEditScenarioForm("correct_option", optionKey)
                                  }
                                />
                                Правильный вариант
                              </label>
                            )}
                          </div>
                        )
                      )}
                    </div>

                    {editScenarioForm.task_type === "sequence" && (
                      <p className="field-hint">
                        Отмечайте шаги в правильном порядке. Если ошиблись, снимите выбор
                        и отметьте шаги заново.
                      </p>
                    )}
                  </div>

                  <div className="scenario-form-block">
                    <h4>Пояснение <span className="optional-label">(необязательно)</span></h4>

                    <textarea
                      placeholder="Общее пояснение к заданию, если оно есть"
                      value={editScenarioForm.explanation}
                      onChange={(event) =>
                        updateEditScenarioForm("explanation", event.target.value)
                      }
                    />
                    <label className="admin-field-label">
                      Ссылка на изображение
                      <input
                        type="text"
                        placeholder="/images/tasks/task-1-question-1.png"
                        value={editScenarioForm.image_url}
                        onChange={(event) =>
                          updateEditScenarioForm("image_url", event.target.value)
                        }
                      />
                    </label>

                    <p className="field-hint">
                      Поле необязательное. Используйте путь к изображению из папки public, например:
                      /images/tasks/task-1-question-1.png
                    </p>
                  </div>

                  <div className="scenario-edit-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setEditingScenario(null)
                        setEditScenarioForm(null)
                      }}
                    >
                      Отмена
                    </button>

                    <button type="button" onClick={handleUpdateScenario}>
                      Сохранить изменения
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminActiveTab === "overview" && (
            <div className="admin-section">
              {adminStats && (
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <span>Всего пользователей</span>
                    <strong>{adminStats.users.total_users}</strong>
                  </div>

                  <div className="admin-stat-card">
                    <span>Активные пользователи</span>
                    <strong>{adminStats.users.active_users}</strong>
                  </div>

                  <div className="admin-stat-card">
                    <span>Приглашённые пользователи</span>
                    <strong>{adminStats.users.invited_users}</strong>
                  </div>

                  <div className="admin-stat-card">
                    <span>Всего попыток</span>
                    <strong>{adminStats.results.total_attempts || 0}</strong>
                  </div>

                  <div className="admin-stat-card">
                    <span>Средний результат</span>
                    <strong>{adminStats.results.average_percentage || 0}%</strong>
                  </div>
                </div>
              )}

              {!adminStats && (
                <p className="muted-text">Статистика пока не загружена.</p>
              )}
            </div>
          )}

          {adminActiveTab === "students" && (
            <div className="admin-section">
              <h3>Добавить пользователя</h3>

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
                  <option value="student">Студент</option>
                  <option value="admin">Администратор</option>
                </select>

                <select
                  value={newUserStudyProgram}
                  onChange={(event) => setNewUserStudyProgram(event.target.value)}
                >
                  <option value="">Направление подготовки</option>
                  <option value="Applied Informatics">Прикладная информатика</option>
                  <option value="Software Engineering">Программная инженерия</option>
                  <option value="Business Informatics">Бизнес-информатика</option>
                  <option value="Data Science">Data Science</option>
                </select>

                <select
                  value={newUserCourse}
                  onChange={(event) => setNewUserCourse(event.target.value)}
                >
                  <option value="">Курс</option>
                  <option value="1">1 курс</option>
                  <option value="2">2 курс</option>
                  <option value="3">3 курс</option>
                  <option value="4">4 курс</option>
                </select>

                <button onClick={handleCreateUser}>Добавить пользователя</button>
              </div>
            </div>
          )}

          {adminActiveTab === "students" && (
            <div className="admin-section">
              <h3>Студенты</h3>

              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Поиск по email"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="all">Все статусы</option>
                  <option value="invited">Приглашён</option>
                  <option value="active">Активен</option>
                  <option value="academic_leave">Академический отпуск</option>
                  <option value="graduated">Выпускник</option>
                  <option value="blocked">Заблокирован</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                >
                  <option value="all">Все роли</option>
                  <option value="student">Студент</option>
                  <option value="admin">Администратор</option>
                </select>

                <select
                  value={programFilter}
                  onChange={(event) => setProgramFilter(event.target.value)}
                >
                  <option value="all">Все направления</option>
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
                  <option value="all">Все курсы</option>
                  {uniqueCourses.map((course) => (
                    <option key={course} value={String(course)}>
                      {course} курс
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
                      <th>Роль</th>
                      <th>Статус</th>
                      <th>Направление</th>
                      <th>Курс</th>
                      <th>Изменить статус</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAdminUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.role === "admin" ? "Администратор" : "Студент"}</td>
                        <td>
                          <span className={`status-badge status-${user.status}`}>
                            {user.status === "invited"
                              ? "Приглашён"
                              : user.status === "active"
                              ? "Активен"
                              : user.status === "academic_leave"
                              ? "Академический отпуск"
                              : user.status === "graduated"
                              ? "Выпускник"
                              : user.status === "blocked"
                              ? "Заблокирован"
                              : user.status}
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
                            <option value="invited">Приглашён</option>
                            <option value="active">Активен</option>
                            <option value="academic_leave">Академический отпуск</option>
                            <option value="graduated">Выпускник</option>
                            <option value="blocked">Заблокирован</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminActiveTab === "create" && (
            <div className="admin-section">
              <h3>Создать задание НЭ</h3>

              <div className="scenario-admin-form">
                <div className="scenario-form-block">
                  <h4>Привязка к экзамену</h4>

                  <label className="admin-field-label">
                    Номер задания НЭ
                    <select
                      value={scenarioForm.exam_task_number}
                      onChange={(event) =>
                        updateScenarioForm("exam_task_number", event.target.value)
                      }
                    >
                      {displayExamTasks.map((task) => (
                        <option key={task.number} value={String(task.number)}>
                          Задание {task.number}. {task.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="admin-field-label">
                    Часть экзамена
                    <input
                      type="text"
                      value={
                        scenarioForm.exam_section === "theoretical"
                          ? "Теоретическая часть"
                          : "Практическая часть"
                      }
                      readOnly
                    />
                  </label>

                  <label className="admin-field-label">
                    Название задания НЭ
                    <input type="text" value={scenarioForm.exam_task_title} readOnly />
                  </label>

                  <label className="admin-field-label">
                    Проверяемые темы
                    <textarea value={scenarioForm.exam_topic} readOnly />
                  </label>

                  <label className="admin-field-label">
                    Материалы онлайн-курса
                    <textarea value={scenarioForm.course_materials} readOnly />
                  </label>
                </div>

                <div className="scenario-form-block">
                  <h4>Содержание вопроса</h4>

                  <label className="admin-field-label">
                    Тип вопроса
                    <select
                      value={scenarioForm.task_type}
                      onChange={(event) =>
                        updateScenarioForm("task_type", event.target.value)
                      }
                    >
                      <option value="single_choice">Один правильный ответ</option>
                      <option value="multi_select">Несколько правильных ответов</option>
                      <option value="sequence">Последовательность действий</option>
                    </select>
                  </label>

                  <input
                    type="text"
                    placeholder="Название вопроса"
                    value={scenarioForm.title}
                    onChange={(event) => updateScenarioForm("title", event.target.value)}
                  />

                  <textarea
                    placeholder="Текст вопроса"
                    value={scenarioForm.text}
                    onChange={(event) => updateScenarioForm("text", event.target.value)}
                  />
                </div>

                <div className="scenario-form-block">
                  <h4>
                    {scenarioForm.task_type === "sequence"
                      ? "Шаги последовательности"
                      : "Варианты ответа"}
                  </h4>

                  <div className="scenario-options-grid">
                    {["option_a", "option_b", "option_c", "option_d", "option_e"].map(
                      (optionKey) => (
                        <div key={optionKey} className="scenario-option-editor">
                          <label>
                            {scenarioForm.task_type === "sequence"
                              ? `Шаг ${optionLabels[optionKey].replace("Вариант ", "")}`
                              : optionLabels[optionKey]}
                          </label>

                          <input
                            type="text"
                            placeholder={
                              scenarioForm.task_type === "sequence"
                                ? "Описание шага"
                                : `Текст для ${optionLabels[optionKey]}`
                            }
                            value={scenarioForm[optionKey]}
                            onChange={(event) =>
                              updateScenarioForm(optionKey, event.target.value)
                            }
                          />

                          {shouldShowOptionFeedback && (
                            <textarea
                              placeholder={`Пояснение для ${optionLabels[optionKey]}`}
                              value={scenarioForm.option_feedback[optionKey]}
                              onChange={(event) =>
                                updateScenarioFeedback(optionKey, event.target.value)
                              }
                            />
                          )}

                          {scenarioForm.task_type === "multi_select" ? (
                            <label className="correct-option-control">
                              <input
                                type="checkbox"
                                checked={scenarioForm.correct_options.includes(optionKey)}
                                onChange={() => toggleCorrectOption(optionKey)}
                              />
                              Правильный вариант
                            </label>
                          ) : scenarioForm.task_type === "sequence" ? (
                            <label className="correct-option-control">
                              <input
                                type="checkbox"
                                checked={scenarioForm.correct_options.includes(optionKey)}
                                onChange={() => toggleCorrectOption(optionKey)}
                              />
                              Включить в последовательность
                            </label>
                          ) : (
                            <label className="correct-option-control">
                              <input
                                type="radio"
                                name="correct_option"
                                checked={scenarioForm.correct_option === optionKey}
                                onChange={() =>
                                  updateScenarioForm("correct_option", optionKey)
                                }
                              />
                              Правильный вариант
                            </label>
                          )}
                        </div>
                      )
                    )}
                  </div>
                  {scenarioForm.task_type === "sequence" && (
                    <p className="field-hint">
                      Отмечайте шаги в том порядке, в котором они должны идти в правильном ответе.
                      Если ошиблись с порядком, снимите выбор и отметьте шаги заново.
                    </p>
                  )}
                </div>

                <div className="scenario-form-block">
                  <h4>Пояснение <span className="optional-label">(необязательно)</span></h4>

                  <textarea
                    placeholder="Общее пояснение к заданию, если оно есть"
                    value={scenarioForm.explanation}
                    onChange={(event) =>
                      updateScenarioForm("explanation", event.target.value)
                    }
                  />
                  <label className="admin-field-label">
                    Ссылка на изображение
                    <input
                      type="text"
                      placeholder="/images/tasks/task-1-question-1.png"
                      value={scenarioForm.image_url}
                      onChange={(event) =>
                        updateScenarioForm("image_url", event.target.value)
                      }
                    />
                  </label>

                  <p className="field-hint">
                    Поле необязательное. Используйте путь к изображению из папки public, например:
                    /images/tasks/task-1-question-1.png
                  </p>
                </div>

                <button onClick={handleCreateScenario}>Добавить задание</button>
              </div>
            </div>
          )}

          {adminActiveTab === "tasks" && (
            <div className="admin-section">
              <h3>Банк заданий</h3>
              <div className="admin-filters scenario-filters">
                <select
                  value={scenarioTaskFilter}
                  onChange={(event) => setScenarioTaskFilter(event.target.value)}
                >
                  <option value="all">Все задания НЭ</option>
                  {displayExamTasks.map((task) => (
                    <option key={task.number} value={String(task.number)}>
                      Задание {task.number}. {task.title}
                    </option>
                  ))}
                </select>

                <select
                  value={scenarioSectionFilter}
                  onChange={(event) => setScenarioSectionFilter(event.target.value)}
                >
                  <option value="all">Все части экзамена</option>
                  <option value="theoretical">Теоретическая часть</option>
                  <option value="practical">Практическая часть</option>
                </select>

                <select
                  value={scenarioTypeFilter}
                  onChange={(event) => setScenarioTypeFilter(event.target.value)}
                >
                  <option value="all">Все типы</option>
                  <option value="single_choice">Один правильный ответ</option>
                  <option value="multi_select">Несколько правильных ответов</option>
                  <option value="sequence">Последовательность</option>
                </select>

                <select
                  value={scenarioActiveFilter}
                  onChange={(event) => setScenarioActiveFilter(event.target.value)}
                >
                  <option value="all">Все статусы</option>
                  <option value="true">Активные</option>
                  <option value="false">Отключённые</option>
                </select>
              </div>

              <div className="admin-table-wrapper scenario-list">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>№ НЭ</th>
                      <th>Раздел</th>
                      <th>Тип</th>
                      <th>Название</th>
                      <th>Активно</th>
                      <th>Действия</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAdminScenarios.map((scenario) => (
                        <tr key={scenario.id}>
                          <td>{scenario.id}</td>
                          <td>{scenario.exam_task_number || "—"}</td>
                          <td>
                            {scenario.exam_section === "theoretical"
                              ? "Теория"
                              : scenario.exam_section === "practical"
                              ? "Практика"
                              : "—"}
                          </td>
                          <td>{taskTypeLabels[scenario.task_type] || scenario.task_type}</td>
                          <td>{scenario.title}</td>
                          <td>{scenario.is_active ? "Да" : "Нет"}</td>
                          <td>
                           <div className="table-actions">
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => setSelectedAdminScenario(scenario)}
                            >
                              Просмотр
                            </button>
                            
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => openScenarioEditor(scenario)}
                            >
                              Редактировать
                            </button>

                            <button
                              type="button"
                              className={scenario.is_active ? "danger-button" : "secondary-button"}
                              onClick={() => handleToggleScenarioActive(scenario)}
                            >
                              {scenario.is_active ? "Отключить" : "Включить"}
                            </button>
                          </div>
                        </td>
                        </tr>
                      ))}
                      {filteredAdminScenarios.length === 0 && (
                        <tr>
                          <td colSpan="7">По выбранным фильтрам задания не найдены.</td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminActiveTab === "taskInfo" && (
            <div className="admin-section">
              <h3>Информация о заданиях НЭ</h3>

              <p className="muted-text">
                Здесь можно изменить описание задания, проверяемые темы и ссылки на материалы Smart LMS.
              </p>

              <div className="admin-task-info-layout">
                <div className="admin-task-info-list">
                  {displayExamTasks.map((task) => (
                    <button
                      key={task.number}
                      className={
                        examTaskInfoForm?.task_number === task.number
                          ? "task-info-list-item active-task-info"
                          : "task-info-list-item"
                      }
                      onClick={() => openExamTaskInfoEditor(task)}
                    >
                      <span>
                        Задание {task.number} ·{" "}
                        {task.section === "theoretical" ? "теория" : "практика"}
                      </span>
                      <strong>{task.title}</strong>
                    </button>
                  ))}
                </div>

                {examTaskInfoForm ? (
                  <div className="task-info-editor">
                    <label className="admin-field-label">
                      Часть экзамена
                      <select
                        value={examTaskInfoForm.section}
                        onChange={(event) =>
                          updateExamTaskInfoForm("section", event.target.value)
                        }
                      >
                        <option value="theoretical">Теоретическая часть</option>
                        <option value="practical">Практическая часть</option>
                      </select>
                    </label>

                    <label className="admin-field-label">
                      Название задания
                      <input
                        type="text"
                        value={examTaskInfoForm.title}
                        onChange={(event) =>
                          updateExamTaskInfoForm("title", event.target.value)
                        }
                      />
                    </label>

                    <label className="admin-field-label">
                      Краткое описание
                      <textarea
                        value={examTaskInfoForm.description}
                        onChange={(event) =>
                          updateExamTaskInfoForm("description", event.target.value)
                        }
                      />
                    </label>

                    <label className="admin-field-label">
                      Проверяемые темы
                      <textarea
                        value={examTaskInfoForm.knowledgeText}
                        onChange={(event) =>
                          updateExamTaskInfoForm("knowledgeText", event.target.value)
                        }
                      />
                      <span className="field-hint">
                        Каждую тему лучше писать с новой строки.
                      </span>
                    </label>

                    <div className="materials-editor">
                      <h4>Материалы онлайн-курса</h4>

                      {examTaskInfoForm.materials.map((group, groupIndex) => (
                        <div key={groupIndex} className="material-editor-group">
                          <label className="admin-field-label">
                            Категория
                            <input
                              type="text"
                              value={group.category}
                              onChange={(event) =>
                                updateMaterialCategory(groupIndex, event.target.value)
                              }
                            />
                          </label>

                          {group.links.map((link, linkIndex) => (
                            <div key={linkIndex} className="material-link-row">
                              <input
                                type="text"
                                placeholder="Название материала"
                                value={link.title}
                                onChange={(event) =>
                                  updateMaterialLink(
                                    groupIndex,
                                    linkIndex,
                                    "title",
                                    event.target.value
                                  )
                                }
                              />

                              <input
                                type="url"
                                placeholder="Ссылка"
                                value={link.url}
                                onChange={(event) =>
                                  updateMaterialLink(
                                    groupIndex,
                                    linkIndex,
                                    "url",
                                    event.target.value
                                  )
                                }
                              />

                              <button
                                type="button"
                                className="danger-button"
                                onClick={() => removeMaterialLink(groupIndex, linkIndex)}
                              >
                                Удалить
                              </button>
                            </div>
                          ))}

                          <div className="materials-editor-actions">
                            <button type="button" onClick={() => addMaterialLink(groupIndex)}>
                              Добавить ссылку
                            </button>

                            <button
                              type="button"
                              className="danger-button"
                              onClick={() => removeMaterialGroup(groupIndex)}
                            >
                              Удалить категорию
                            </button>
                          </div>
                        </div>
                      ))}

                      <button type="button" onClick={addMaterialGroup}>
                        Добавить категорию материалов
                      </button>
                    </div>

                    <button onClick={handleUpdateExamTaskInfo}>
                      Сохранить изменения
                    </button>
                  </div>
                ) : (
                  <div className="empty-state">
                    <h3>Выберите задание</h3>
                    <p>
                      Выберите номер задания слева, чтобы отредактировать темы и материалы.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {adminActiveTab === "overview" && (
            <div className="admin-section">
              <h3>Наполнение заданий НЭ</h3>

              <p className="muted-text">
                Сводка показывает, сколько тренировочных вопросов создано для каждого
                номера независимого экзамена.
              </p>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Задание НЭ</th>
                      <th>Часть</th>
                      <th>Всего вопросов</th>
                      <th>Активных</th>
                      <th>Один ответ</th>
                      <th>Несколько ответов</th>
                      <th>Последовательность</th>
                    </tr>
                  </thead>

                  <tbody>
                    {examTaskScenarioStats.map((task) => (
                      <tr key={task.number}>
                        <td>
                          <strong>
                            {task.number}. {task.title}
                          </strong>
                        </td>
                        <td>
                          {task.section === "theoretical"
                            ? "Теоретическая"
                            : "Практическая"}
                        </td>
                        <td>{task.total}</td>
                        <td>{task.active}</td>
                        <td>{task.singleChoiceCount}</td>
                        <td>{task.multiSelectCount}</td>
                        <td>{task.sequenceCount}</td>
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

if (selectedExamInfoTask) {
  return (
    <ExamTaskInfo
      task={selectedExamInfoTask}
      onBack={() => setSelectedExamInfoTask(null)}
      onStartTraining={(taskNumber) => {
        setSelectedExamInfoTask(null)
        openExamTask(taskNumber)
      }}
    />
  )
}

if (showResults) {
  return (
    <ResultsPage
      currentUser={currentUser}
      results={results}
      examTasks={displayExamTasks}
      onBack={() => setShowResults(false)}
      openExamTask={openExamTask}
    />
  )
}

  if (!started) {
    return (
      <div className="app">
        <TopBar
          currentUser={currentUser}
          onOpenAuth={() => {
            setAuthMessage("")
            setAuthMessageType("")
            setShowAuthModal(true)
          }}
          onLogout={handleLogout}
          onOpenResults={() => setShowResults(true)}
          onOpenAdmin={() => {
            setShowAdmin(true)
            setShowResults(false)
          }}
          onScrollToTasks={() => {
            document
              .getElementById("exam-tasks-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }}
        />

        {toast.message && (
          <div
            className={`app-toast ${
              toast.type === "error" ? "app-toast-error" : "app-toast-success"
            }`}
          >
            <span>{toast.message}</span>

            <button
              type="button"
              onClick={() => setToast({ message: "", type: "" })}
            >
              ×
            </button>
          </div>
        )}

        {showAuthModal && !currentUser && (
          <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
            <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
              <div className="auth-modal-header">
                <div>
                  <p className="scenario-label">Вход в систему</p>
                  <h2>Войдите в аккаунт</h2>
                  <p>
                    Используйте университетский email, чтобы сохранять результаты
                    подготовки.
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close-button"
                  onClick={() => setShowAuthModal(false)}
                >
                  ×
                </button>
              </div>

              <AuthBox
                currentUser={currentUser}
                authMode={authMode}
                email={email}
                password={password}
                authMessage={authMessage}
                authMessageType={authMessageType}
                setEmail={setEmail}
                setPassword={setPassword}
                setAuthMode={setAuthMode}
                setAuthMessage={setAuthMessage}
                setAuthMessageType={setAuthMessageType}
                handleAuth={handleAuth}
                handleLogout={handleLogout}
              />
            </div>
          </div>
        )}

                <div className={currentUser ? "hero hero-compact" : "hero"}>
                  <span className="hero-badge">
                    Подготовка к независимому экзамену ВШЭ
                  </span>

                  <h1>Тренажёр по цифровой грамотности</h1>

                  <p>
                    Повторяйте проверяемые темы, переходите к материалам Smart LMS,
                    проходите тренировочные задания и отслеживайте прогресс подготовки.
                  </p>

                  <div className="hero-actions">
                    {!currentUser ? (
                      <button
                        onClick={() => {
                          setAuthMessage("")
                          setAuthMessageType("")
                          setShowAuthModal(true)
                        }}
                      >
                        Войти и начать подготовку
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          document
                            .getElementById("exam-tasks-section")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        Перейти к заданиям НЭ
                      </button>
                    )}

                    {currentUser?.role === "student" && (
                      <button
                        className="secondary-button"
                        onClick={() => setShowResults(true)}
                      >
                        Мои результаты
                      </button>
                    )}
                  </div>
                </div>

                {currentUser?.role === "student" && (
                  <UserDashboard
                    currentUser={currentUser}
                    results={results}
                    examTasks={displayExamTasks}
                    openExamTask={openExamTask}
                  />
                )}

                {currentUser?.role === "admin" && (
                  <div className="admin-home-note">
                    <h2>Панель администратора</h2>
                    <p>
                      Вы вошли как администратор. Перейдите в админ-панель, чтобы
                      управлять студентами, тренировочными заданиями и информацией по
                      заданиям НЭ.
                    </p>

                    <button
                      onClick={() => {
                        setShowAdmin(true)
                        setShowResults(false)
                      }}
                    >
                      Открыть админ-панель
                    </button>
                  </div>
                )}

                <div className="modules" id="exam-tasks-section">
          <h2>Подготовка к НЭ по цифровой грамотности</h2>
          <p className="modules-subtitle">
            Выберите раздел экзамена и начните тренировку по конкретному заданию.
          </p>

          <div className="exam-section-tabs">
            <button
              className={examSectionFilter === "theoretical" ? "active-tab" : ""}
              onClick={() => setExamSectionFilter("theoretical")}
            >
              Теоретическая часть
            </button>

            <button
              className={examSectionFilter === "practical" ? "active-tab" : ""}
              onClick={() => setExamSectionFilter("practical")}
            >
              Практическая часть
            </button>
          </div>

          <div className="exam-task-grid">
            {displayExamTasks
              .filter((task) => task.section === examSectionFilter)
              .map((task) => (
                <div key={task.number} className="exam-task-card">
                  <span>
                    Задание {task.number} ·{" "}
                    {task.section === "theoretical" ? "теория" : "практика"}
                  </span>

                  <h3>{task.title}</h3>
                  <p>{task.description}</p>

                  <div className="exam-task-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setSelectedExamInfoTask(task)}
                    >
                      О задании
                    </button>

                    <button onClick={() => openExamTask(task.number)}>
                      Начать тренировку
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  if (finished) {
    const totalQuestions = currentScenarios.length
    const percentage =
      totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

    const resultTitle =
      percentage >= 80
        ? "Отличный результат"
        : percentage >= 50
        ? "Хорошая попытка"
        : "Тренировка завершена"

    const resultText =
      percentage >= 80
        ? "Раздел можно считать подготовленным. Можно переходить к следующему заданию НЭ."
        : percentage >= 50
        ? "Часть тем уже понятна, но стоит разобрать ошибки и пройти тренировку ещё раз."
        : "Рекомендуем повторить материалы по этому заданию и попробовать ещё раз."

    const resetTraining = () => {
      setStarted(false)
      setCurrentScenarioIndex(0)
      setSelectedAnswer(null)
      setSelectedAnswers([])
      setShowExplanation(false)
      setFinished(false)
      setScore(0)
    }

    const returnToExamTasks = () => {
      resetTraining()
      setSelectedExamTask(null)

      loadProgress()
      loadResults()

      setTimeout(() => {
        document
          .getElementById("exam-tasks-section")
          ?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }

    const retryTraining = () => {
      setCurrentScenarioIndex(0)
      setSelectedAnswer(null)
      setSelectedAnswers([])
      setShowExplanation(false)
      setFinished(false)
      setScore(0)
    }

    return (
      <div className="app">
        <div className="scenario">
          <div className="result-card">
            <p className="scenario-label">
              {selectedExamTask
                ? `Задание ${selectedExamTask.number}. ${selectedExamTask.title}`
                : `Уровень ${selectedLevel}`}
            </p>

            <div className="result-layout">
              <div className="result-progress">
                <div
                  className="result-progress-ring"
                  style={{
                    background: `conic-gradient(var(--hse-orange) ${percentage * 3.6}deg, var(--border-color) 0deg)`,
                  }}
                >
                  <div className="result-progress-inner">
                    <strong>{percentage}%</strong>
                    <span>результат</span>
                  </div>
                </div>
              </div>

              <div className="result-content">
                <h2>{resultTitle}</h2>

                <p className="result-summary">
                  Вы ответили правильно на <strong>{score}</strong> из{" "}
                  <strong>{totalQuestions}</strong> вопросов.
                </p>

                <p className="result-recommendation">{resultText}</p>

                <div className="result-details">
                  <div>
                    <span>Правильных ответов</span>
                    <strong>{score}</strong>
                  </div>

                  <div>
                    <span>Всего вопросов</span>
                    <strong>{totalQuestions}</strong>
                  </div>

                  <div>
                    <span>Лучший ориентир</span>
                    <strong>80%</strong>
                  </div>
                </div>

                <div className="result-actions">
                  <button type="button" onClick={retryTraining}>
                    Пройти ещё раз
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={returnToExamTasks}
                  >
                    Вернуться к заданиям НЭ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ScenarioRenderer
      currentScenario={currentScenario}
      currentScenarioIndex={currentScenarioIndex}
      currentScenariosLength={currentScenarios.length}
      selectedLevel={selectedLevel}
      selectedExamTask={selectedExamTask}
      selectedAnswer={selectedAnswer}
      selectedAnswers={selectedAnswers}
      showExplanation={showExplanation}
      isMultiAnswerTask={isMultiAnswerTask}
      toggleMultiSelectAnswer={toggleMultiSelectAnswer}
      checkMultiSelectAnswer={checkMultiSelectAnswer}
      handleAnswerClick={handleAnswerClick}
      handleNextScenario={handleNextScenario}
      handleExitTraining={handleExitTraining}
    />
  )
}

export default App