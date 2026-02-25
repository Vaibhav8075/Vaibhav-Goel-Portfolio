import { motion } from "framer-motion"
import { SKILLS } from "./data"
import { useSectionStory } from "./useSectionStory"

export default function SkillsSection() {
  const { sectionRef, contentY, contentOpacity, contentScale, backgroundY, lineScaleY, labelY } = useSectionStory()

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{
        minHeight: "90vh",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        padding: "clamp(3.8rem, 8vw, 6rem) 0",
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          y: backgroundY,
          background:
            "radial-gradient(circle at 18% 20%, rgba(249,115,22,0.15), transparent 35%), radial-gradient(circle at 86% 70%, rgba(251,146,60,0.12), transparent 32%)",
        }}
      />
      <motion.p
        aria-hidden="true"
        className="story-label"
        style={{
          position: "absolute",
          right: "3vw",
          top: "10%",
          margin: 0,
          y: labelY,
          fontSize: "clamp(2.4rem, 9vw, 7rem)",
          fontWeight: 900,
          color: "rgba(255,255,255,0.04)",
          letterSpacing: "0.2em",
          userSelect: "none",
        }}
      >
        SKILLS
      </motion.p>
      <motion.div
        aria-hidden="true"
        className="story-line"
        style={{
          position: "absolute",
          right: "max(16px, 2.2vw)",
          top: "20%",
          width: "3px",
          height: "58vh",
          borderRadius: "999px",
          background: "rgba(249,115,22,0.2)",
          transformOrigin: "top",
          scaleY: lineScaleY,
        }}
      />

      <motion.div className="container-shell" style={{ y: contentY, opacity: contentOpacity, scale: contentScale, zIndex: 1 }}>
        <div className="glass-card" style={{ borderRadius: "24px", padding: "clamp(22px, 4vw, 36px)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "clamp(1.8rem, 4.4vw, 3rem)" }}>Technical Toolkit</h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: "44ch", lineHeight: 1.6 }}>
              The stack I use to build performant, scalable, and visually strong web products.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
            {SKILLS.map((skill, index) => (
              <motion.span
                key={skill}
                className="skill-tag"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
