import { motion } from "framer-motion"
import { Button } from "../../ui/Button"
import { scrollToSection } from "../../../theme"
import { useSectionStory } from "./useSectionStory"

const STATS = [
  { value: "10+", label: "Production Projects" },
  { value: "3+", label: "Teams Collaborated" },
  { value: "End-to-End", label: "Frontend + Backend" },
]

export default function HomeSection() {
  const { sectionRef, contentY, contentOpacity, contentScale, backgroundY, lineScaleY } = useSectionStory()

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{
        minHeight: "100vh",
        color: "white",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        padding: "120px 0 80px",
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          y: backgroundY,
          background:
            "radial-gradient(900px 500px at 12% 10%, rgba(249,115,22,0.19), transparent 58%), radial-gradient(700px 420px at 90% 70%, rgba(251,146,60,0.14), transparent 58%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="story-line"
        style={{
          position: "absolute",
          left: "max(16px, 2.2vw)",
          top: "20%",
          width: "2px",
          height: "55vh",
          background: "rgba(249,115,22,0.24)",
          transformOrigin: "top",
          scaleY: lineScaleY,
          pointerEvents: "none",
        }}
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity, scale: contentScale }} className="container-shell">
        <div
          style={{
            display: "grid",
            gap: "28px",
            alignItems: "center",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          }}
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="kpi-pill"
              style={{ marginBottom: "16px", width: "fit-content" }}
            >
              Open to full-time roles and high-impact internships
            </motion.p>

            <motion.h1
              className="gradient-text"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              style={{
                fontSize: "clamp(2.4rem, 7vw, 4.9rem)",
                lineHeight: 1.06,
                marginBottom: "14px",
                maxWidth: "10ch",
              }}
            >
              I build polished products that ship.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.62 }}
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "clamp(1rem, 2.4vw, 1.2rem)",
                lineHeight: 1.72,
                maxWidth: "56ch",
                marginBottom: "28px",
              }}
            >
              I&apos;m Vaibhav, a full-stack developer focused on modern React experiences, performant frontend systems, and
              reliable backend integrations for real business workflows.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.78 }}
              style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
            >
              <Button onClick={() => scrollToSection("#projects")}>View Projects</Button>
              <Button variant="ghost" onClick={() => scrollToSection("#contact")}>
                Contact Me
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            style={{ padding: "24px", borderRadius: "22px", justifySelf: "end", width: "100%", maxWidth: "380px" }}
          >
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.58)" }}>
              Current Focus
            </p>
            <p style={{ marginTop: "10px", fontSize: "1.1rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", lineHeight: 1.45 }}>
              Building recruiter-ready digital products with clean UX, animations, and solid engineering quality.
            </p>

            <div style={{ marginTop: "18px", display: "grid", gap: "10px" }}>
              {STATS.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#fb923c", fontSize: "1rem" }}>{item.value}</span>
                  <span style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.72)" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
