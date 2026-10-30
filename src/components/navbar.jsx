import { Link, useLocation } from 'react-router-dom'

function NavBar({ darkMode, onToggleTheme }) {
  const location = useLocation()

  const getLinkClassName = (path) =>
    location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <header className="site-header">
      <div className="brand-block">
        <p className="eyebrow">Portfolio</p>
        <h1 className="brand-title">Deep Tandel</h1>
      </div>

      <nav className="site-nav" aria-label="Primary navigation">
        <Link className={getLinkClassName('/')} to="/">
          Home
        </Link>

        <Link className={getLinkClassName('/projects')} to="/projects">
          Projects
        </Link>

        <Link className={getLinkClassName('/tasks')} to="/tasks">
          Tasks
        </Link>

        <Link className={getLinkClassName('/contact')} to="/contact">
          Contact
        </Link>
      </nav>

      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
      >
        {darkMode ? 'Light mode' : 'Dark mode'}
      </button>
    </header>
  )
}

export default NavBar
