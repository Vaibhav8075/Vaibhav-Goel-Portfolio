import { motion } from "framer-motion"
import { scrollToSection } from "../../../theme"
import { PROJECTS } from "./data"
import { useSectionStory } from "./useSectionStory"

export default function ProjectsSection() {
  const { sectionRef, contentY, contentOpacity, contentScale, backgroundY, lineScaleY } = useSectionStory()

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "10vw", color: "white", position: "relative", overflow: "hidden" }}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          y: backgroundY,
          background:
            "radial-gradient(circle at 86% 18%, rgba(249, 115, 22, 0.2), transparent 36%), radial-gradient(circle at 14% 82%, rgba(251, 146, 60, 0.13), transparent 32%)",
        }}
      />
      <motion.p
        aria-hidden="true"
        className="story-label"
        style={{
          position: "absolute",
          right: "2vw",
          bottom: "12%",
          margin: 0,
          fontSize: "clamp(2.4rem, 10vw, 8rem)",
          fontWeight: 900,
          color: "rgba(255,255,255,0.04)",
          letterSpacing: "0.18em",
          userSelect: "none",
        }}
      >
        PROJECTS
      </motion.p>
      <motion.div
        aria-hidden="true"
        className="story-line"
        style={{
          position: "absolute",
          right: "max(16px, 2.2vw)",
          top: "18%",
          width: "3px",
          height: "60vh",
          borderRadius: "999px",
          background: "rgba(249, 115, 22, 0.22)",
          transformOrigin: "top",
          scaleY: lineScaleY,
        }}
      />

      <motion.div style={{ maxWidth: "900px", width: "100%", y: contentY, opacity: contentOpacity, scale: contentScale, zIndex: 2 }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            marginBottom: "50px",
            background: "linear-gradient(135deg, #fb923c, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "800",
          }}
        >
          Featured Projects
        </motion.h2>

        {PROJECTS.map((project, index) => (
          <motion.div
            key={project.title}
            className="project-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            whileHover={{ x: 12 }}
            onClick={() => scrollToSection("#contact")}
          >
            <h3 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", color: project.color, marginBottom: "12px", fontWeight: "700" }}>
              {project.title}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: "1.7", fontSize: "clamp(1rem, 2vw, 1.1rem)", marginBottom: "15px" }}>
              {project.desc}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {project.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
