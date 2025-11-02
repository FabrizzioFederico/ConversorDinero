function Header({ isDarkMode, toggleTheme }) {
  return (
    <>
      {/* Botón de modo noche */}
      <div className="theme-toggle" id="themeToggle" onClick={toggleTheme}>
        <span className="theme-icon">{isDarkMode ? '☀️' : '🌙'}</span>
      </div>
    </>
  );
}

export default Header;
