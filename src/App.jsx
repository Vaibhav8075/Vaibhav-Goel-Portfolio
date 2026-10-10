import { useEffect, useMemo, useRef, useState } from "react"
import { MotionConfig } from "framer-motion"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { scrollToSection, scrollToY, setLenis } from "./lib/scroll"
import { usePathname } from "./lib/router"
import usePrefersReducedMotion from "./lib/usePrefersReducedMotion"
import { ProjectFilterContext } from "./lib/projectFilter"
import Navbar from "./components/layout/Navbar"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Footer from "./components/sections/Footer"
import GridBackground from "./components/layout/GridBackground"
import ScrollProgress from "./components/layout/ScrollProgress"
import CustomCursor from "./components/ui/CustomCursor"
import CommandPalette from "./components/ui/CommandPalette"

function App() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const pathname = usePathname()
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

  // After a route change, jump to the requested section or back to where this page was left
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      if (history.state?.scrollY) requestAnimationFrame(() => scrollToY(history.state.scrollY))
      return
    }
    const hash = window.location.hash.slice(1)
    requestAnimationFrame(() => {
      if (hash) scrollToSection(hash)
      else scrollToY(history.state?.scrollY ?? 0)
    })
  }, [pathname])

  const page = pathname === "/" ? <Home /> : <NotFound />

  return (
    <MotionConfig reducedMotion="user">
      <ProjectFilterContext value={projectFilterValue}>
        <div className="bg-[#050505] min-h-screen text-[#EAEAEA] font-sans selection:bg-white/20 selection:text-white overflow-x-clip relative">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-full focus:bg-white focus:text-black font-mono text-xs tracking-widest uppercase"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <CustomCursor />
          <GridBackground />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <Navbar />
            <main id="main" tabIndex={-1} className="focus:outline-none pb-32 pt-24">
              {page}
            </main>
            <Footer />
          </div>

          {/* Last in DOM so its floating trigger comes last in the tab order */}
          <CommandPalette />
        </div>
      </ProjectFilterContext>
    </MotionConfig>
  )
}

export default App
