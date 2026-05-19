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
  return (
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
  )
}

export default AuthBox