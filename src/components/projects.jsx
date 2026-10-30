import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const GITHUB_USERNAME = 'DeepTandel045'

const CURATED_PROJECTS = [
  {
    id: 'taskflow',
    title: 'TaskFlow - Full-Stack Task Manager',
    category: 'Full Stack',
    type: 'Coursework Project',
    featured: true,
    description:
      'A full-stack workflow application featuring user registration, JWT-authenticated sessions, CRUD task operations, status filtering, and MongoDB persistence.',
    highlights: [
      'Protected REST API endpoints with token verification middleware',
      'Status categorization: Pending, In Progress, Completed',
      'Real-time UI feedback with alert banners and responsive layout',
    ],
    tech: ['React 19', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST API'],
    githubUrl: 'https://github.com/DeepTandel045',
    demoUrl: '/tasks',
    isInternalDemo: true,
  },
  {
    id: 'devfolio',
    title: 'Student Portfolio & GitHub Showcase',
    category: 'Frontend',
    type: 'Academic Practical',
    featured: true,
    description:
      'Responsive developer portfolio built with React and Vite. Features client-side routing, controlled contact form with live mirroring, dark theme toggle, and GitHub API integration.',
    highlights: [
      'Light and dark theme switching via CSS root variables',
      'Dynamic GitHub API integration with fallback state',
      'Clean modular component structure and semantic layout',
    ],
    tech: ['React 19', 'Vite', 'React Router 7', 'CSS Variables', 'GitHub API'],
    githubUrl: 'https://github.com/DeepTandel045',
    demoUrl: '/',
    isInternalDemo: true,
  },
  {
    id: 'cloudcart',
    title: 'E-Commerce Catalog & Cart REST API',
    category: 'Backend & API',
    type: 'Backend Practical',
    featured: true,
    description:
      'Backend REST service designed using the MVC architecture. Implements product catalog indexing, cart operations, input validation, and Mongoose schemas.',
    highlights: [
      'Structured RESTful routes with modular error handling middleware',
      'MongoDB aggregation pipelines for category and price queries',
      'Endpoint verification using Postman test collections',
    ],
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Postman'],
    githubUrl: 'https://github.com/DeepTandel045',
    demoUrl: null,
  },
  {
    id: 'weatherpulse',
    title: 'Weather Information Dashboard',
    category: 'Frontend',
    type: 'API Practical',
    featured: false,
    description:
      'Client-side weather application that queries OpenWeather endpoints. Displays current temperature, 5-day forecasts, humidity levels, and wind metrics by city or geolocation.',
    highlights: [
      'Asynchronous data fetching with graceful error states',
      'City search with local storage caching for recent queries',
      'Responsive CSS Grid layout adapted for mobile and desktop screens',
    ],
    tech: ['JavaScript (ES6+)', 'OpenWeather API', 'CSS Grid', 'Async/Await'],
    githubUrl: 'https://github.com/DeepTandel045',
    demoUrl: null,
  },
  {
    id: 'campusmate',
    title: 'Academic Assignment & Lab Submission Portal',
    category: 'Full Stack',
    type: 'Semester Utility',
    featured: false,
    description:
      'Student utility created to track practical laboratory submissions, semester deadlines, subject syllabus progress, and course schedules.',
    highlights: [
      'Semester-wise subject categorization and lab status tracking',
      'Submission status tracking with deadline alerts',
      'Minimalist interface optimized for quick daily reference',
    ],
    tech: ['React', 'Express.js', 'MySQL', 'Node.js'],
    githubUrl: 'https://github.com/DeepTandel045',
    demoUrl: null,
  },
  {
    id: 'algovision',
    title: 'Algorithm Visualizer (Sorting & Search)',
    category: 'Frontend',
    type: 'Coursework Tool',
    featured: false,
    description:
      'Educational tool demonstrating classic sorting algorithms (Bubble Sort, Selection Sort, Merge Sort) step-by-step with real-time speed adjustments.',
    highlights: [
      'Interactive array generation with variable size and speed controls',
      'Color-coded comparison and swap state transitions',
      'Time and space complexity references for each algorithm',
    ],
    tech: ['React', 'JavaScript ES6', 'Web Animations', 'Algorithms'],
    githubUrl: 'https://github.com/DeepTandel045',
    demoUrl: null,
  },
]

const PROJECT_CATEGORIES = ['All', 'Full Stack', 'Frontend', 'Backend & API']

function Spinner() {
  return (
    <div className="status-card" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>Loading repositories from GitHub...</p>
    </div>
  )
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-card error-state" role="alert">
      <h2>Unable to connect to GitHub</h2>
      <p>{message}</p>
      <button className="primary-button" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

function Projects() {
  const [activeTab, setActiveTab] = useState('curated') // 'curated' | 'github'
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // GitHub fetch state
  const [repos, setRepos] = useState([])
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [repoError, setRepoError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (activeTab !== 'github') return

    const controller = new AbortController()

    async function loadRepos() {
      try {
        setLoadingRepos(true)
        setRepoError(null)

        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`GitHub responded with status ${response.status}`)
        }

        const data = await response.json()
        setRepos(Array.isArray(data) ? data : [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setRepoError(err.message)
          setRepos([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingRepos(false)
        }
      }
    }

    loadRepos()

    return () => {
      controller.abort()
    }
  }, [activeTab, retryCount])

  const filteredCurated = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()

    return CURATED_PROJECTS.filter((proj) => {
      const matchesCategory =
        selectedCategory === 'All' || proj.category === selectedCategory

      const matchesSearch =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.tech.some((t) => t.toLowerCase().includes(q))

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  const filteredRepos = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return repos

    return repos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.language && r.language.toLowerCase().includes(q)),
    )
  }, [repos, searchTerm])

  return (
    <section className="projects-page">
      {/* Hero Header */}
      <div className="projects-hero">
        <div className="section-header-compact">
          <span className="section-tag">Portfolio</span>
          <p className="eyebrow">Projects &amp; Practicals</p>
        </div>
        <h1 className="projects-title">Work &amp; Academic Projects</h1>
        <p className="hero-copy">
          Selected full-stack applications, academic lab practicals, and public repositories.
        </p>

        {/* View Mode Toggle */}
        <div className="projects-view-toggle">
          <button
            type="button"
            className={`toggle-btn ${activeTab === 'curated' ? 'active' : ''}`}
            onClick={() => setActiveTab('curated')}
          >
            Featured Projects ({CURATED_PROJECTS.length})
          </button>
          <button
            type="button"
            className={`toggle-btn ${activeTab === 'github' ? 'active' : ''}`}
            onClick={() => setActiveTab('github')}
          >
            GitHub Repositories
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="projects-toolbar">
        {activeTab === 'curated' && (
          <div className="category-filter-bar">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="projects-search-wrap">
          <label className="search-field" htmlFor="project-search">
            <span>Filter</span>
            <input
              id="project-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'curated'
                  ? 'Filter by title or technology...'
                  : 'Filter repositories...'
              }
            />
          </label>

          {activeTab === 'github' && (
            <button
              className="secondary-button refresh-btn"
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* CURATED PROJECTS VIEW */}
      {activeTab === 'curated' && (
        <>
          {filteredCurated.length === 0 ? (
            <div className="status-card">
              <h3>No projects found</h3>
              <p>No project matched "{searchTerm}".</p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="curated-grid">
              {filteredCurated.map((project) => (
                <article
                  className={`curated-card ${project.featured ? 'is-featured' : ''}`}
                  key={project.id}
                >
                  <div className="card-top-meta">
                    <span className="card-category-badge">{project.category}</span>
                    <span className="card-type-label">{project.type}</span>
                  </div>

                  <h2 className="project-title">{project.title}</h2>
                  <p className="project-description">{project.description}</p>

                  <ul className="project-highlights">
                    {project.highlights.map((h, i) => (
                      <li key={i}>
                        <span className="highlight-bullet">—</span> {h}
                      </li>
                    ))}
                  </ul>

                  <div className="project-tech-stack">
                    {project.tech.map((t) => (
                      <span className="tech-badge" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="project-card-actions">
                    {project.demoUrl && (
                      project.isInternalDemo ? (
                        <Link to={project.demoUrl} className="primary-button project-action-btn">
                          Live Demo ↗
                        </Link>
                      ) : (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="primary-button project-action-btn"
                        >
                          Live Demo ↗
                        </a>
                      )
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-button project-action-btn"
                      >
                        Source Code ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {/* GITHUB REPOSITORIES VIEW */}
      {activeTab === 'github' && (
        <>
          {loadingRepos && <Spinner />}

          {repoError && (
            <ErrorMessage
              message={repoError}
              onRetry={() => setRetryCount((c) => c + 1)}
            />
          )}

          {!loadingRepos && !repoError && filteredRepos.length === 0 && (
            <div className="status-card">
              <p>No GitHub repositories found matching your filter.</p>
            </div>
          )}

          {!loadingRepos && !repoError && filteredRepos.length > 0 && (
            <div className="repo-grid">
              {filteredRepos.map((repo) => (
                <article className="repo-card" key={repo.id}>
                  <div className="repo-card-header">
                    <h2>{repo.name}</h2>
                    <span className="repo-stars">{repo.stargazers_count} stars</span>
                  </div>

                  <p>{repo.description || 'No description provided for this repository.'}</p>

                  <div className="repo-meta-row">
                    {repo.language && (
                      <span className="repo-language">
                        <span className="lang-dot"></span> {repo.language}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="repo-forks">{repo.forks_count} forks</span>
                    )}
                  </div>

                  <a
                    className="repo-link"
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on GitHub ↗
                  </a>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Projects
