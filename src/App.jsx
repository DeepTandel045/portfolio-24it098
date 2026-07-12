import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";
import Projects from "./components/Projects";


function App() {
  const skills = [
    "React",
    "Java",
    "Python",
    "SQL"
];
     return (
    <>
      <Header
        name="Deep Tandel"
        color="blue"
      />

      <About />

      <Skills skillList={skills} />
       <Projects />
      <Footer />
    </>
  );



}

export default App;