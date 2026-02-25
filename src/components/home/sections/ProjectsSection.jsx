import { motion } from "framer-motion"
import { PROJECTS } from "./data"
import { useSectionStory } from "./useSectionStory"

export default function ProjectsSection() {
  const { sectionRef, contentY, contentYDelayed, contentYFast, contentOpacity, contentScale, backgroundY, lineScaleY, labelY } = useSectionStory()

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        minHeight: "95vh",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        padding: "clamp(4rem, 8vw, 6rem) 0",
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          y: backgroundY,
          background:
            "radial-gradient(circle at 85% 12%, rgba(249,115,22,0.2), transparent 38%), radial-gradient(circle at 14% 82%, rgba(251,146,60,0.12), transparent 34%)",
        }}
      />
      <motion.p
        aria-hidden="true"
        className="story-label"
        style={{
          position: "absolute",
          right: "2vw",
          bottom: "9%",
          margin: 0,
          y: labelY,
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
          top: "17%",
          width: "3px",
          height: "60vh",
          borderRadius: "999px",
          background: "rgba(249,115,22,0.22)",
          transformOrigin: "top",
          scaleY: lineScaleY,
        }}
      />

      <motion.div className="container-shell" style={{ opacity: contentOpacity, scale: contentScale, zIndex: 1 }}>
        <motion.h2 style={{ y: contentYFast, fontSize: "clamp(1.9rem, 4.2vw, 3rem)", marginBottom: "10px" }}>Selected Work</motion.h2>
        <motion.p style={{ y: contentY, color: "rgba(255,255,255,0.74)", maxWidth: "54ch", marginBottom: "20px", lineHeight: 1.7 }}>
          Projects that combine product thinking, clean UI architecture, and reliable integration patterns.
        </motion.p>

        <div style={{ display: "grid", gap: "14px" }}>
          {PROJECTS.map((project, index) => {
            const y = index % 3 === 0 ? contentYFast : index % 3 === 1 ? contentY : contentYDelayed
            return (
              <motion.article key={project.title} className="project-card" style={{ y }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "clamp(1.16rem, 2.4vw, 1.52rem)", color: project.color }}>{project.title}</h3>
                  <span
                    style={{
                      borderRadius: "999px",
                      border: "1px solid rgba(249,115,22,0.35)",
                      color: "rgba(255,255,255,0.78)",
                      fontSize: "0.75rem",
                      padding: "6px 10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {project.kind}
                  </span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.68 }}>{project.desc}</p>
                <p style={{ color: "rgba(255,255,255,0.62)", marginTop: "8px", fontSize: "0.92rem" }}>{project.impact}</p>
                <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
                  {project.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
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
