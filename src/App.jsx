import Hero from "./components/home/Hero.jsx"
import Navbar from "./components/Navbar"
import About from "./components/about/About"


function App() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      <Navbar />
      <Hero />
      <About />
    </div>
  )
}

export default App
