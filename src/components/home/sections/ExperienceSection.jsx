import { motion } from "framer-motion"
import { EXPERIENCES } from "./data"
import { useSectionStory } from "./useSectionStory"

export default function ExperienceSection() {
  const { sectionRef, contentY, contentOpacity, contentScale, backgroundY, lineScaleY } = useSectionStory()

  return (
    <section
      ref={sectionRef}
      id="experience"
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8vw 10vw",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          y: backgroundY,
          background:
            "linear-gradient(180deg, rgba(249, 115, 22, 0.12), rgba(249, 115, 22, 0.03) 45%, transparent), radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.14), transparent 35%)",
          pointerEvents: "none",
        }}
      />
      <motion.p
        aria-hidden="true"
        className="story-label"
        style={{
          position: "absolute",
          left: "2vw",
          bottom: "10%",
          margin: 0,
          fontSize: "clamp(2.4rem, 8vw, 7rem)",
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
          top: "14%",
          width: "3px",
          height: "66vh",
          borderRadius: "999px",
          background: "rgba(249, 115, 22, 0.24)",
          transformOrigin: "top",
          scaleY: lineScaleY,
        }}
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity, scale: contentScale, width: "100%", maxWidth: "980px", zIndex: 2 }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            marginBottom: "36px",
            background: "linear-gradient(135deg, #f97316, #fb923c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "800",
          }}
        >
          Professional Experience
        </motion.h2>

        <div style={{ display: "grid", gap: "16px" }}>
          {EXPERIENCES.map((experience, index) => (
            <motion.article
              key={`${experience.role}-${experience.org}`}
              className="project-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "8px",
                }}
              >
                <h3 style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.45rem)", fontWeight: "700", color: "#fb923c" }}>
                  {experience.role}
                </h3>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>{experience.period}</span>
              </div>

              <p style={{ color: "rgba(255,255,255,0.92)", fontWeight: "600", marginBottom: "8px" }}>{experience.org}</p>
              <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.7", marginBottom: "10px" }}>{experience.summary}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {experience.skills.map((skill) => (
                  <span key={`${experience.role}-${skill}`} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
