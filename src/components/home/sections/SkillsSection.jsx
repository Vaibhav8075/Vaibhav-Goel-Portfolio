import { motion } from "framer-motion"
import { SKILLS } from "./data"
import { useSectionStory } from "./useSectionStory"

export default function SkillsSection() {
  const { sectionRef, contentY, contentOpacity, contentScale, backgroundY, lineScaleY } = useSectionStory()

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10vw",
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
            "radial-gradient(circle at 12% 18%, rgba(249, 115, 22, 0.18), transparent 35%), radial-gradient(circle at 84% 70%, rgba(251, 146, 60, 0.14), transparent 34%)",
        }}
      />
      <motion.p
        aria-hidden="true"
        className="story-label"
        style={{
          position: "absolute",
          right: "3vw",
          top: "14%",
          margin: 0,
          fontSize: "clamp(2.5rem, 10vw, 9rem)",
          fontWeight: 900,
          color: "rgba(255,255,255,0.04)",
          letterSpacing: "0.2em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        SKILLS
      </motion.p>
      <motion.div
        aria-hidden="true"
        className="story-line"
        style={{
          position: "absolute",
          right: "max(18px, 2.2vw)",
          top: "18%",
          width: "3px",
          height: "62vh",
          borderRadius: "999px",
          background: "rgba(249, 115, 22, 0.2)",
          transformOrigin: "top",
          scaleY: lineScaleY,
        }}
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity, scale: contentScale, width: "100%", position: "relative", zIndex: 2 }}>
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
      </motion.div>
    </section>
  )
}
