function AuthBox({
  currentUser,
  authMode,
  email,
  password,
  authMessage,
  authMessageType,
  setEmail,
  setPassword,
  setAuthMode,
  setAuthMessage,
  setAuthMessageType,
  handleAuth,
  handleLogout,
}) {
  if (currentUser) {
    return (
      <div className="auth-box">
        <div className="auth-current-user">
          <span>
            {currentUser.role === "admin" ? "Администратор" : "Студент"}
          </span>
          <strong>{currentUser.email}</strong>
        </div>

        <button type="button" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </div>
    )
  }

  return (
    <div className="auth-box">
      <div className="auth-mode-tabs">
        <button
          type="button"
          className={authMode === "login" ? "active-auth-tab" : ""}
          onClick={() => {
            setAuthMode("login")
            setAuthMessage("")
            setAuthMessageType("")
          }}
        >
          Вход
        </button>

        <button
          type="button"
          className={authMode === "activate" ? "active-auth-tab" : ""}
          onClick={() => {
            setAuthMode("activate")
            setAuthMessage("")
            setAuthMessageType("")
          }}
        >
          Активация
        </button>
      </div>

      <div>
        <h3>{authMode === "login" ? "Вход в систему" : "Активация аккаунта"}</h3>
        <p className="auth-box-description">
          {authMode === "login"
            ? "Введите университетский email и пароль, чтобы продолжить подготовку."
            : "Если вам выдали доступ, активируйте аккаунт через университетский email."}
        </p>
      </div>

      <label className="auth-field">
        Email
        <input
          type="email"
          placeholder="student@edu.hse.ru"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="auth-field">
        Пароль
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {authMessage && (
        <p
          className={`auth-message ${
            authMessageType === "error" ? "auth-error" : "auth-success"
          }`}
        >
          {authMessage}
        </p>
      )}

      <button type="button" onClick={handleAuth}>
        {authMode === "login" ? "Войти" : "Активировать аккаунт"}
      </button>
    </div>
  )
}

export default AuthBox