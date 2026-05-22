function TopBar({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenResults,
  onOpenAdmin,
  onScrollToTasks,
}) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <img
          src="/images/hse-logo.png"
          alt="ВШЭ"
          className="topbar-logo-image"
        />

        <div>
          <strong>Тренажёр НЭ ВШЭ</strong>
          <span>Цифровая грамотность</span>
        </div>
      </div>

      <nav className="topbar-actions">
        {currentUser ? (
          <>
            {currentUser.role === "student" && (
              <>
                <button type="button" className="topbar-link" onClick={onScrollToTasks}>
                  Задания НЭ
                </button>

                <button type="button" className="topbar-link" onClick={onOpenResults}>
                  Мои результаты
                </button>
              </>
            )}

            {currentUser.role === "admin" && (
              <button type="button" className="topbar-link" onClick={onOpenAdmin}>
                Админ-панель
              </button>
            )}

            <div className="topbar-user">
              <span>{currentUser.role === "admin" ? "Администратор" : "Студент"}</span>
              <strong>{currentUser.email}</strong>
            </div>

            <button type="button" className="topbar-primary" onClick={onLogout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <button type="button" className="topbar-link" onClick={onScrollToTasks}>
              Задания НЭ
            </button>

            <button type="button" className="topbar-primary" onClick={onOpenAuth}>
              Войти
            </button>
          </>
        )}
      </nav>
    </header>
  )
}

export default TopBar