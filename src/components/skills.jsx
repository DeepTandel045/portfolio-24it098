import { useState, useMemo } from 'react'

const SKILL_DATA = [
  // Frontend
  { name: 'React 19', category: 'Frontend', role: 'Component UI' },
  { name: 'JavaScript (ES6+)', category: 'Frontend', role: 'Language' },
  { name: 'HTML5 & CSS3', category: 'Frontend', role: 'Markup & Layout' },
  { name: 'Tailwind CSS', category: 'Frontend', role: 'Styling' },
  { name: 'Vite', category: 'Frontend', role: 'Build Tooling' },

  // Backend
  { name: 'Node.js', category: 'Backend', role: 'Server Runtime' },
  { name: 'Express.js', category: 'Backend', role: 'Web Framework' },
  { name: 'RESTful APIs', category: 'Backend', role: 'API Architecture' },
  { name: 'JWT & Auth', category: 'Backend', role: 'Security & Tokens' },

  // Database
  { name: 'MongoDB', category: 'Databases', role: 'Document Store' },
  { name: 'Mongoose', category: 'Databases', role: 'Schema Modeling' },
  { name: 'MySQL', category: 'Databases', role: 'Relational DB' },

  // Languages & Tools
  { name: 'Java', category: 'Tools & Languages', role: 'OOP / Coursework' },
  { name: 'Python', category: 'Tools & Languages', role: 'Scripting / DSA' },
  { name: 'Git & GitHub', category: 'Tools & Languages', role: 'Version Control' },
  { name: 'Postman', category: 'Tools & Languages', role: 'API Testing' },
]

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Databases', 'Tools & Languages']

function Skills({ skillList }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const displayedSkills = useMemo(() => {
    let list = SKILL_DATA

    if (Array.isArray(skillList) && skillList.length > 0) {
      const known = new Set(list.map((s) => s.name.toLowerCase()))
      const extras = skillList
        .filter((s) => !known.has(s.toLowerCase()))
        .map((s) => ({
          name: s,
          category: 'Tools & Languages',
          role: 'Technology',
        }))
      list = [...list, ...extras]
    }

    if (activeCategory === 'All') return list
    return list.filter((s) => s.category === activeCategory)
  }, [activeCategory, skillList])

  return (
    <div className="skills-container">
      <div className="section-header-compact">
        <span className="section-tag">Skills</span>
        <h2 className="section-title">Technical Competencies</h2>
      </div>

      <p className="skills-subtitle">
        Languages, frameworks, and developer tools used across my academic lab practicals and projects.
      </p>

      {/* Category Filter Tabs */}
      <div className="skills-filter-tabs" role="tablist" aria-label="Skill Categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`skills-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="skills-pill-grid">
        {displayedSkills.map((skill) => (
          <div className="skill-item-card" key={skill.name}>
            <div className="skill-header">
              <strong className="skill-name">{skill.name}</strong>
              <span className="skill-role-badge">{skill.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills
