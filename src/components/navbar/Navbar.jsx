import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { HiMenuAlt3, HiX } from "react-icons/hi"
import { scrollToSection } from "../../theme"

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
]

function getInitialsLabel() {
  return "VG"
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.href.replace("#", ""))).filter(Boolean)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target?.id) {
          setActiveSection(`#${visible.target.id}`)
        }
      },
      { rootMargin: "-22% 0px -60% 0px", threshold: [0.1, 0.5, 0.8] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => {
      sections.forEach((section) => observer.unobserve(section))
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navigate = (event, href) => {
    event.preventDefault()
    setOpen(false)
    setActiveSection(href)
    scrollToSection(href)
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: scrolled ? "1px solid rgba(249, 115, 22, 0.28)" : "1px solid rgba(255,255,255,0.07)",
        background: scrolled ? "rgba(8, 8, 8, 0.86)" : "rgba(8, 8, 8, 0.66)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="container-shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
        <a href="#home" onClick={(e) => navigate(e, "#home")} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "11px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff",
                fontFamily: "Sora, sans-serif",
                fontWeight: 700,
                fontSize: "0.82rem",
              }}
            >
              {getInitialsLabel()}
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "rgba(255,255,255,0.95)" }}>Vaibhav Goel</p>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>
                Full-Stack Developer
              </p>
            </div>
          </div>
        </a>

        <nav className="hidden md:flex" style={{ gap: "22px", alignItems: "center" }}>
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href

            return (
              <div key={link.href} style={{ position: "relative" }}>
                <a
                  href={link.href}
                  onClick={(e) => navigate(e, link.href)}
                  style={{
                    display: "block",
                    position: "relative",
                    zIndex: 1,
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    padding: "6px 14px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {link.label}
                </a>
                
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-indicator"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(249, 115, 22, 0.15)",
                      border: "1px solid rgba(249, 115, 22, 0.3)",
                      borderRadius: "999px",
                      zIndex: 0
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </div>
            )
          })}
        </nav>



        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden grid place-items-center"
          aria-label="Open menu"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            border: "1px solid rgba(249,115,22,0.45)",
            background: "rgba(249,115,22,0.09)",
            color: "#f97316",
          }}
        >
          {open ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(7,7,7,0.95)" }}
          >
            <div className="container-shell" style={{ display: "grid", gap: "8px", padding: "14px 0 16px" }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => navigate(e, link.href)}
                  style={{
                    textDecoration: "none",
                    color: activeSection === link.href ? "#fb923c" : "rgba(255,255,255,0.82)",
                    fontWeight: 600,
                    padding: "10px 8px",
                    borderRadius: "10px",
                    background: activeSection === link.href ? "rgba(249,115,22,0.12)" : "transparent",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
