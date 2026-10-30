function About() {
  const details = [
    { label: 'Program', value: 'B.Tech in Information Technology' },
    { label: 'Current Term', value: '5th Semester' },
    { label: 'Student Roll No', value: '24IT098' },
    { label: 'Location', value: 'Gujarat, India' },
  ]

  const coursework = [
    'Advanced Web Development (React, Node, Express, MongoDB)',
    'Database Management Systems (MySQL, Relational Design)',
    'Data Structures & Object-Oriented Programming (Java, Python)',
    'RESTful API Development & Secure Authentication',
  ]

  return (
    <div className="about-container">
      <div className="section-header-compact">
        <span className="section-tag">About</span>
        <h2 className="section-title">Background &amp; Studies</h2>
      </div>

      <p className="about-lead">
        I am <strong>Deep Tandel</strong>, an Information Technology student in my 5th semester (Roll No: 24IT098).
      </p>

      <p className="about-bio">
        My primary academic and practical work centers on full-stack web applications. I work with
        React on the frontend and Node.js/Express with MongoDB on the backend to build end-to-end
        coursework projects, authentication flows, and database-backed services.
      </p>

      <div className="about-grid">
        {details.map((item) => (
          <div className="about-fact-card" key={item.label}>
            <span className="fact-label">{item.label}</span>
            <p className="fact-value">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="about-pillars">
        <h3 className="pillars-title">Relevant Academic Focus</h3>
        <ul className="pillars-list">
          {coursework.map((topic, idx) => (
            <li key={idx} className="pillar-item">
              <span className="pillar-bullet">—</span>
              <span>{topic}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default About
