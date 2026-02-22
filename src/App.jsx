import { useEffect } from "react"
import Lenis from "lenis"
import Hero from "./components/home/Hero.jsx"
import Navbar from "./components/navbar/Navbar.jsx"

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
    })

    window.__lenis = lenis

    let rafId = 0
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (window.__lenis === lenis) {
        delete window.__lenis
      }
    }
  }, [])

  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      <Navbar />
      <Hero />
    </div>
  )
}

export default App
