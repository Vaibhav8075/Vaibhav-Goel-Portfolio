import { motion } from "framer-motion"
import { EXPERIENCES } from "./data"
import { useSectionStory } from "./useSectionStory"

export default function ExperienceSection() {
  const { sectionRef, contentY, contentYDelayed, contentYFast, contentOpacity, contentScale, backgroundY, lineScaleY, labelY } = useSectionStory()

  return (
    <section
      ref={sectionRef}
      id="experience"
      style={{
        minHeight: "90vh",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        padding: "clamp(4rem, 9vw, 6.5rem) 0",
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          y: backgroundY,
          background:
            "linear-gradient(180deg, rgba(249,115,22,0.1), transparent 40%), radial-gradient(circle at 16% 84%, rgba(251,146,60,0.13), transparent 36%)",
        }}
      />
      <motion.p
        aria-hidden="true"
        className="story-label"
        style={{
          position: "absolute",
          left: "2.5vw",
          bottom: "12%",
          margin: 0,
          y: labelY,
          fontSize: "clamp(2.3rem, 9vw, 7rem)",
          fontWeight: 900,
          color: "rgba(255,255,255,0.035)",
          letterSpacing: "0.2em",
          userSelect: "none",
        }}
      >
        EXPERIENCE
      </motion.p>
      <motion.div
        aria-hidden="true"
        className="story-line"
        style={{
          position: "absolute",
          left: "max(16px, 2.2vw)",
          top: "16%",
          width: "3px",
          height: "62vh",
          borderRadius: "999px",
          background: "rgba(249,115,22,0.22)",
          transformOrigin: "top",
          scaleY: lineScaleY,
        }}
      />

      <motion.div className="container-shell" style={{ opacity: contentOpacity, scale: contentScale, zIndex: 1 }}>
        <motion.h2
          style={{
            y: contentYFast,
            marginBottom: "24px",
            fontSize: "clamp(1.9rem, 4.2vw, 3rem)",
          }}
        >
          Professional Experience
        </motion.h2>

        <div style={{ display: "grid", gap: "14px" }}>
          {EXPERIENCES.map((experience, index) => {
            const y = index % 2 === 0 ? contentY : contentYDelayed
            return (
              <motion.article key={`${experience.role}-${experience.org}`} className="project-card" style={{ y }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)", color: "#fb923c" }}>{experience.role}</h3>
                  <p style={{ color: "rgba(255,255,255,0.66)", fontSize: "0.88rem" }}>{experience.period}</p>
                </div>
                <p style={{ color: "rgba(255,255,255,0.92)", marginBottom: "8px", fontWeight: 600 }}>{experience.org}</p>
                <p style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.68 }}>{experience.summary}</p>
                <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap" }}>
                  {experience.skills.map((skill) => (
                    <span key={`${experience.role}-${skill}`} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
