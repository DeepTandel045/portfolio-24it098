import { useEffect, useMemo, useState } from 'react'

const GITHUB_USERNAME = 'DeepTandel045'

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
      <h2>Unable to load repositories</h2>
      <p>{message}</p>
      <button className="primary-button" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadRepos() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`GitHub request failed with status ${response.status}`)
        }

        const data = await response.json()
        setRepos(Array.isArray(data) ? data : [])
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
          setRepos([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadRepos()

    return () => {
      controller.abort()
    }
  }, [retryCount])

  const filteredRepos = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return repos
    }

    return repos.filter((repo) => repo.name.toLowerCase().includes(normalizedSearch))
  }, [repos, searchTerm])

  if (loading) {
    return (
      <section className="projects-page">
        <div className="projects-hero">
          <p className="eyebrow">Projects</p>
          <h1>Live GitHub repositories</h1>
          <p className="hero-copy">
            This page fetches public repositories dynamically and shows their names, links,
            and star counts.
          </p>
        </div>
        <Spinner />
      </section>
    )
  }

  if (error) {
    return (
      <section className="projects-page">
        <div className="projects-hero">
          <p className="eyebrow">Projects</p>
          <h1>Live GitHub repositories</h1>
          <p className="hero-copy">
            This page fetches public repositories dynamically and shows their names, links,
            and star counts.
          </p>
        </div>
        <ErrorMessage message={error} onRetry={() => setRetryCount((count) => count + 1)} />
      </section>
    )
  }

  return (
    <section className="projects-page">
      <div className="projects-hero">
        <p className="eyebrow">Projects</p>
        <h1>Live GitHub repositories</h1>
        <p className="hero-copy">
          This page fetches public repositories dynamically and shows their names, links,
          and star counts.
        </p>
      </div>

      <div className="projects-toolbar">
        <label className="search-field">
          <span>Search repositories</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Filter by repository name"
          />
        </label>
        <button
          className="secondary-button"
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Refresh
        </button>
      </div>

      {filteredRepos.length === 0 ? (
        <div className="status-card">
          <p>No repositories match your search.</p>
        </div>
      ) : (
        <div className="repo-grid">
          {filteredRepos.map((repo) => (
            <article className="repo-card" key={repo.id}>
              <div className="repo-card-header">
                <h2>{repo.name}</h2>
                <span className="repo-stars">{repo.stargazers_count} stars</span>
              </div>
              <p>{repo.description || 'No description provided for this repository.'}</p>
              <a className="repo-link" href={repo.html_url} target="_blank" rel="noreferrer">
                View repository
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Projects