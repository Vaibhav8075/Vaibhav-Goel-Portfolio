import { motion } from "framer-motion"
import { Button } from "../../ui/Button"
import { scrollToSection } from "../../../theme"

export default function HomeSection() {
  return (
    <section
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
      }}
    >
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 3.2 }}>
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "40px",
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.9rem",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "10px" }}>Scroll to explore</div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>
          v
        </motion.div>
      </motion.div>
    </section>
  )
}
