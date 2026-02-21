import Hero from "./components/home/Hero.jsx"
import Navbar from "./components/navbar/Navbar.jsx"


function App() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      <Navbar />
      <Hero />
    </div>
  )
}

export default App
