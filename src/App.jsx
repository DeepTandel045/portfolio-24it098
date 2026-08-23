import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import NavBar from './components/navbar.jsx'
import Home from './components/home.jsx'
import Projects from './components/projects.jsx'
import Contact from './components/contact.jsx'
import Tasks from './components/tasks.jsx'
import NotFound from './components/notfound.jsx'
import Footer from './components/footer.jsx'

const skills = ['React', 'Java', 'Python', 'SQL']

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', darkMode)

    return () => {
      document.documentElement.classList.remove('theme-dark')
    }
  }, [darkMode])

  return (
    <div className="app-shell">
      <NavBar
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((current) => !current)}
      />

      <main className="page-frame">
        <Routes>
          <Route path="/" element={<Home skills={skills} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />   
<Route
    path="/tasks"
    element={
        <ProtectedRoute>
            <Tasks />
        </ProtectedRoute>
    }
/>          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App