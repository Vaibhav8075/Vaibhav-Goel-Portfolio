import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { HiMenu, HiX } from "react-icons/hi"
import { theme, scrollToSection } from "../../theme"

const NAV_LINKS = [
  { href: "#home", label: "HOME" },
  { href: "#about", label: "ABOUT" },
  { href: "#skills", label: "SKILLS" },
  { href: "#experience", label: "EXPERIENCE" },
  { href: "#projects", label: "PROJECTS" },
  { href: "#contact", label: "CONTACT" },
]

function NavLink({ href, label, isActive, onClick }) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      className="relative py-2 px-1 text-sm font-semibold transition-colors tracking-wide"
      style={{ 
        color: isActive ? theme.colors.primary : theme.colors.text,
        letterSpacing: '0.05em'
      }}
      whileHover={{ 
        color: theme.colors.primary,
        scale: 1.05
      }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="navIndicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5"
          style={{ 
            background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
            boxShadow: `0 0 8px ${theme.colors.primary}`
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.a>
  )
}

function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '40px',
          height: '40px',
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 20px rgba(249, 115, 22, 0.4)`,
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color: 'white'
        }}
      >
        V
      </motion.div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.2'
      }}>
        <span style={{
          fontSize: '1.1rem',
          fontWeight: '800',
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em'
        }}>
          VAIBHAV
        </span>
        <span style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.15em',
          fontWeight: '600'
        }}>
          DEVELOPER
        </span>
      </div>
    </motion.div>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => {
      const id = link.href.replace('#', '')
      return document.getElementById(id)
    }).filter(Boolean)

    if (sections.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Better detection range
      threshold: [0, 0.25, 0.5, 0.75, 1] // Multiple thresholds for accuracy
    }

    const observer = new IntersectionObserver((entries) => {
      let mostVisible = null
      let maxRatio = 0

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio
          mostVisible = entry.target
        }
      })

      if (mostVisible) {
        setActiveSection(`#${mostVisible.id}`)
      }
    }, observerOptions)

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    handleScroll() // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault()
    setActiveSection(href)
    setIsOpen(false)
    scrollToSection(href)
  }, [])

  return (
    <>
      <style>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(249, 115, 22, 0.6);
          }
        }

        .nav-glow {
          animation: glow 3s infinite;
        }

        
        @media (max-width: 768px) {
          .nav-logo-text {
            display: none;
          }
        }

        
        nav a {
          transition: color 0.3s ease;
        }
      `}</style>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled 
            ? "rgba(5, 5, 5, 0.95)" 
            : "rgba(10, 10, 10, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? 'rgba(249, 115, 22, 0.4)' : theme.colors.border}`,
          boxShadow: scrolled 
            ? "0 8px 32px rgba(249, 115, 22, 0.2)" 
            : "0 4px 30px rgba(0,0,0,0.1)",
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <motion.a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Logo />
          </motion.a>

          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <NavLink
                  href={link.href}
                  label={link.label}
                  isActive={activeSection === link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                />
              </motion.div>
            ))}
          </div>

          <motion.a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="hidden md:block px-6 py-2.5 rounded-full text-sm font-bold tracking-wide"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              color: "white",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 24px rgba(0,0,0,0.25)",
              border: "1px solid rgba(249, 115, 22, 0.6)",
              letterSpacing: "0.07em",
              backdropFilter: "blur(8px)",
            }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 28px rgba(249, 115, 22, 0.3)",
              y: -1,
              backgroundColor: "rgba(249, 115, 22, 0.12)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            HIRE ME
          </motion.a>

          <motion.button
            className="md:hidden p-2.5 rounded-lg"
            style={{ 
              color: theme.colors.primary,
              background: 'rgba(249, 115, 22, 0.1)',
              border: '1px solid rgba(249, 115, 22, 0.3)'
            }}
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ 
              background: 'rgba(249, 115, 22, 0.2)',
              border: '1px solid rgba(249, 115, 22, 0.5)'
            }}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <HiX size={26} /> : <HiMenu size={26} />}
            </motion.div>
          </motion.button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
              style={{
                background: "rgba(5, 5, 5, 0.98)",
                borderTop: `1px solid ${theme.colors.border}`,
                borderBottom: `1px solid ${theme.colors.border}`,
              }}
            >
              <div className="px-6 py-6 flex flex-col gap-2">
                {NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="py-4 px-4 text-base font-bold rounded-xl tracking-wide"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{
                      color: activeSection === link.href ? theme.colors.primary : theme.colors.text,
                      background: activeSection === link.href 
                        ? "rgba(249, 115, 22, 0.15)" 
                        : "transparent",
                      border: `1px solid ${activeSection === link.href 
                        ? 'rgba(249, 115, 22, 0.3)' 
                        : 'transparent'}`,
                      letterSpacing: '0.1em'
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      backgroundColor: "rgba(249, 115, 22, 0.2)" 
                    }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                
                <motion.a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="mt-4 py-4 px-4 text-center rounded-full font-bold tracking-wide"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "white",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.24)",
                    border: "1px solid rgba(249, 115, 22, 0.58)",
                    letterSpacing: "0.07em",
                    backdropFilter: "blur(8px)",
                  }}
                  whileHover={{
                    backgroundColor: "rgba(249, 115, 22, 0.14)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 28px rgba(249, 115, 22, 0.28)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  HIRE ME
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
