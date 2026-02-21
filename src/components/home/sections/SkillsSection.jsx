import { motion } from "framer-motion"
import { SKILLS } from "./data"

export default function SkillsSection() {
  return (
    <section
      id="skills"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "10vw", color: "white" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1 }}
        className="glass-card"
        style={{ padding: "clamp(40px, 5vw, 60px)", borderRadius: "24px", maxWidth: "1000px", width: "100%" }}
      >
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            marginBottom: "40px",
            background: "linear-gradient(135deg, #fb923c, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          Core Skills
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
          {SKILLS.map((skill, i) => (
            <motion.span
              key={skill}
              className="skill-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
