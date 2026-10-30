import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <p className="footer-name">Deep Tandel</p>
          <p className="footer-meta">
            B.Tech Information Technology (5th Sem) • Roll: 24IT098
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/contact">Contact</Link>
          <a
            href="https://github.com/DeepTandel045"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Deep Tandel. AWD Practical Portfolio.</p>
      </div>
    </footer>
  )
}

export default Footer
