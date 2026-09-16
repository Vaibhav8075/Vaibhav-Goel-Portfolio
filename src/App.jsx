import { useEffect } from "react"
import Lenis from "lenis"
import Navbar from "./components/layout/Navbar"
import Hero from "./components/sections/Hero"
import SystemProfile from "./components/sections/SystemProfile"
import EngineeringModules from "./components/sections/EngineeringModules"
import TechStack from "./components/sections/TechStack"
import Experience from "./components/sections/Experience"
import Footer from "./components/sections/Footer"
import GridBackground from "./components/layout/GridBackground"
import CustomCursor from "./components/ui/CustomCursor"
import CommandPalette from "./components/ui/CommandPalette"

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
    <div className="bg-[#050505] min-h-screen text-[#EAEAEA] font-sans selection:bg-white/20 selection:text-white overflow-hidden relative">
      <CustomCursor />
      <GridBackground />
      <CommandPalette />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <Navbar />
        <main className="flex flex-col gap-32 md:gap-48 pb-32 pt-24">
          <Hero />
          <SystemProfile />
          <EngineeringModules />
          <Experience />
          <TechStack />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
