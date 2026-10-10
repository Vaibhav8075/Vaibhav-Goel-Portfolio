import { useEffect, useMemo, useState } from "react"
import { MotionConfig, useReducedMotion } from "framer-motion"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { setLenis } from "./lib/scroll"
import { ProjectFilterContext } from "./lib/projectFilter"
import Navbar from "./components/layout/Navbar"
import Hero from "./components/sections/Hero"
import SystemProfile from "./components/sections/SystemProfile"
import EngineeringModules from "./components/sections/EngineeringModules"
import TechStack from "./components/sections/TechStack"
import Experience from "./components/sections/Experience"
import Footer from "./components/sections/Footer"
import GridBackground from "./components/layout/GridBackground"
import ScrollProgress from "./components/layout/ScrollProgress"
import CustomCursor from "./components/ui/CustomCursor"
import CommandPalette from "./components/ui/CommandPalette"

function App() {
  const prefersReducedMotion = useReducedMotion()
  const [projectFilter, setProjectFilter] = useState(null)
  const projectFilterValue = useMemo(
    () => ({ filter: projectFilter, setFilter: setProjectFilter }),
    [projectFilter],
  )

  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    })

    setLenis(lenis)

    let rafId = 0
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      setLenis(null)
    }
  }, [prefersReducedMotion])

  return (
    <MotionConfig reducedMotion="user">
      <ProjectFilterContext value={projectFilterValue}>
        <div className="bg-[#050505] min-h-screen text-[#EAEAEA] font-sans selection:bg-white/20 selection:text-white overflow-x-clip relative">
          <ScrollProgress />
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
      </ProjectFilterContext>
    </MotionConfig>
  )
}

export default App
