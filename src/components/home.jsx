import Header from './header.jsx'
import About from './about.jsx'
import Skills from './skills.jsx'
import Projects from './projects.jsx'

function Home({ skills }) {
  return (
    <section className="page home-page">
      <div className="hero-card">
        <p className="eyebrow">Home</p>
        <Header name="Deep Tandel" color="var(--primary)" />
        <p className="hero-copy">
          A small React portfolio built with reusable components, client-side
          routing, and controlled state.
        </p>
      </div>

      <div className="content-grid">
        <article className="panel">
          <About />
        </article>

        <article className="panel">
          <Skills skillList={skills} />
        </article>

        <article className="panel">
          <Projects />
        </article>
      </div>
    </section>
  )
}

export default Home