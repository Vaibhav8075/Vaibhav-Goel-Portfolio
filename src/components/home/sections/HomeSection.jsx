import { motion } from "framer-motion"
import { Button } from "../../ui/Button"
import { scrollToSection } from "../../../theme"
import { useSectionStory } from "./useSectionStory"

export default function HomeSection() {
  const { sectionRef, contentY, contentOpacity, contentScale, backgroundY, lineScaleY } = useSectionStory()

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        padding: "0 20px",
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
            "linear-gradient(160deg, rgba(249, 115, 22, 0.14), transparent 38%), linear-gradient(340deg, rgba(251, 146, 60, 0.12), transparent 45%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="story-line"
        style={{
          position: "absolute",
          left: "max(20px, 2vw)",
          top: "22%",
          width: "2px",
          height: "52vh",
          background: "rgba(249, 115, 22, 0.22)",
          transformOrigin: "top",
          scaleY: lineScaleY,
          pointerEvents: "none",
        }}
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity, scale: contentScale, position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 3 }}
          style={{
            position: "absolute",
            top: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(92vw, 980px)",
            height: "260px",
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.22) 0%, rgba(249, 115, 22, 0) 70%)",
            filter: "blur(48px)",
            pointerEvents: "none",
          }}
        />

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 3.2 }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 3.1 }}
          style={{
            marginBottom: "18px",
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "999px",
            border: "1px solid rgba(249, 115, 22, 0.45)",
            background: "rgba(20, 20, 20, 0.62)",
            color: "rgba(255,255,255,0.9)",
            fontSize: "0.82rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: "700",
          }}
        >
          Available for freelance projects
        </motion.p>

        <motion.h1
          className="gradient-text"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            fontWeight: "800",
            marginBottom: "20px",
            lineHeight: "1.1",
            letterSpacing: "-0.03em",
          }}
        >
          Hi, I am Vaibhav
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.6 }}
          style={{
            fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "40px",
            maxWidth: "700px",
            lineHeight: "1.6",
            fontWeight: "500",
          }}
        >
          Full-Stack Developer | Frontend and Backend Engineer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 4 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Button onClick={() => scrollToSection("#about")}>Explore More</Button>
          <Button variant="ghost" onClick={() => scrollToSection("#contact")}>Get in Touch</Button>
        </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
