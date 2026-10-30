import { Link } from 'react-router-dom'
import Header from './header.jsx'
import About from './about.jsx'
import Skills from './skills.jsx'
import Projects from './projects.jsx'

function Home({ skills }) {
  const stats = [
    { value: '5th', label: 'Semester IT' },
    { value: '24IT098', label: 'Student Roll No' },
    { value: 'MERN', label: 'Primary Stack' },
  ]

  return (
    <section className="page home-page">
      {/* Hero Card */}
      <div className="hero-card modern-hero">
        <div className="hero-badge-row">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span>Available for projects &amp; internships</span>
          </div>
          <span className="hero-tag">Academic Year 2025–26</span>
        </div>

        <div className="hero-title-group">
          <p className="hero-greeting">Student Portfolio</p>
          <Header name="Deep Tandel" color="var(--text)" />
          <p className="hero-subtitle">
            Information Technology student focusing on full-stack web development and REST APIs.
          </p>
        </div>

        <p className="hero-copy">
          Undergraduate IT engineering student building full-stack applications with React, Node.js,
          Express, and MongoDB. Current practical focus includes authentication, database modeling,
          and component architecture in Advanced Web Development.
        </p>

        {/* Hero Quick Actions */}
        <div className="hero-actions">
          <a href="#projects-showcase" className="primary-button hero-btn">
            View Projects
          </a>
          <Link to="/tasks" className="secondary-button hero-btn">
            Task Manager App
          </Link>
          <Link to="/contact" className="secondary-button hero-btn">
            Contact
          </Link>
          <a
            href="https://github.com/DeepTandel045"
            target="_blank"
            rel="noreferrer"
            className="secondary-button hero-btn"
          >
            GitHub
          </a>
        </div>

        {/* Hero Stats Ribbon */}
        <div className="hero-stats-grid">
          {stats.map((s, index) => (
            <div className="hero-stat-card" key={index}>
              <strong className="stat-number">{s.value}</strong>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About and Skills Grid */}
      <div className="home-grid">
        <article className="panel home-panel">
          <About />
        </article>

        <article className="panel home-panel">
          <Skills skillList={skills} />
        </article>
      </div>

      {/* Projects Showcase Section */}
      <div id="projects-showcase" className="home-projects-row">
        <Projects />
      </div>
    </section>
  )
}

export default Home
