import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page not-found-page">
      <div className="hero-card error-card">
        <p className="eyebrow">404</p>
        <h2>Page not found</h2>
        <p>The route you requested does not exist.</p>
        <Link className="primary-button" to="/">
          Back to Home
        </Link>
      </div>
    </section>
  )
}

export default NotFound