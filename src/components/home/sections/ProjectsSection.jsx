import { motion } from "framer-motion"
import { scrollToSection } from "../../../theme"
import { PROJECTS } from "./data"

export default function ProjectsSection() {
  return (
    <section id="projects" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "10vw", color: "white" }}>
      <div style={{ maxWidth: "900px", width: "100%" }}>
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
      </div>
    </section>
  )
}
