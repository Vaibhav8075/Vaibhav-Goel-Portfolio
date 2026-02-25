import { useRef, useState } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"

const HIGHLIGHTS = [
  "Computer Science undergraduate at VIT Vellore",
  "Frontend-first full-stack engineering approach",
  "Strong focus on performance, maintainability, and UX quality",
]

export default function AboutCassette() {
  const sectionRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: 0.3 })
  const contentY = useTransform(progress, [0, 1], [68, -68])
  const imageY = useTransform(progress, [0, 1], [112, -112])
  const cassetteX = useTransform(progress, [0, 0.7, 1], [-520, -40, 0])
  const cassetteOpacity = useTransform(progress, [0, 0.35, 1], [0, 0.92, 1])
  const cassetteRotate = useTransform(progress, [0, 0.35, 1], [-10, 0, 0])
  const sectionOpacity = useTransform(progress, [0, 0.2, 0.85, 1], [0.15, 1, 1, 0.15])

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(4rem, 10vw, 7rem) 0",
        color: "#fff",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 82% 18%, rgba(249,115,22,0.18), transparent 34%), radial-gradient(circle at 14% 78%, rgba(251,146,60,0.13), transparent 36%)",
          pointerEvents: "none",
        }}
      />

      <motion.div className="container-shell" style={{ opacity: sectionOpacity }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
            alignItems: "center",
            gap: "clamp(1.4rem, 4vw, 3rem)",
          }}
        >
          <motion.div style={{ y: imageY, x: cassetteX, opacity: cassetteOpacity, rotate: cassetteRotate, perspective: "1200px" }}>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "relative",
                maxWidth: "430px",
                borderRadius: "24px",
                transformStyle: "preserve-3d",
                rotateX: isHovered ? -3 : 0,
                rotateY: isHovered ? 3 : 0,
              }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  width: "84%",
                  aspectRatio: "1/1",
                  borderRadius: "999px",
                  border: "1px dashed rgba(249,115,22,0.28)",
                  left: "8%",
                  top: "9%",
                  zIndex: 0,
                }}
              />
              <motion.div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-18px",
                  borderRadius: "26px",
                  background: "radial-gradient(circle at 40% 40%, rgba(249,115,22,0.26), transparent 62%)",
                  filter: "blur(24px)",
                  opacity: isHovered ? 0.92 : 0.7,
                  pointerEvents: "none",
                }}
              />

              <div
                className="glass-card"
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                  padding: "18px",
                  zIndex: 1,
                }}
              >
                <img
                  src="/cassette.png"
                  alt="Cassette visual identity"
                  style={{
                    width: "100%",
                    borderRadius: "16px",
                    display: "block",
                    border: "1px solid rgba(249,115,22,0.26)",
                  }}
                />

                <motion.div
                  aria-hidden="true"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute",
                    width: "26px",
                    height: "26px",
                    left: "32%",
                    top: "53%",
                    borderRadius: "999px",
                    border: "2px solid rgba(255,255,255,0.45)",
                    boxShadow: "0 0 0 4px rgba(249,115,22,0.14)",
                  }}
                />
                <motion.div
                  aria-hidden="true"
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute",
                    width: "26px",
                    height: "26px",
                    right: "32%",
                    top: "53%",
                    borderRadius: "999px",
                    border: "2px solid rgba(255,255,255,0.45)",
                    boxShadow: "0 0 0 4px rgba(249,115,22,0.14)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "rgba(8,8,8,0.78)",
                    border: "1px solid rgba(249,115,22,0.35)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Design + Engineering
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: contentY }}>
            <p style={{ color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, fontSize: "0.78rem", marginBottom: "10px" }}>
              About Me
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.3rem)", marginBottom: "16px", lineHeight: 1.12 }}>
              Product-minded developer with an execution focus
            </h2>
            <p style={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.75, maxWidth: "60ch" }}>
              I design and build end-to-end web experiences with React, motion systems, and backend integrations. I care about clear
              interfaces, reliable architecture, and writing code that teams can scale confidently.
            </p>

            <div style={{ marginTop: "18px", display: "grid", gap: "10px" }}>
              {HIGHLIGHTS.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(249,115,22,0.2)",
                    background: "rgba(249,115,22,0.06)",
                  }}
                >
                  <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#f97316", flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "0.95rem" }}>{highlight}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
