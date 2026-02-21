import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function LaunchLoadingScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #000000, #0a0a0a)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: "clamp(2rem, 6vw, 4rem)",
          fontFamily: "'Orbitron', monospace",
          fontWeight: "800",
          marginBottom: "40px",
          letterSpacing: "0.2em",
        }}
      >
        <motion.span
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            background: "linear-gradient(90deg, #f97316, #fb923c, #ea580c, #f97316)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PORTFOLIO
        </motion.span>
      </motion.div>

      <motion.div
        style={{
          width: "300px",
          height: "4px",
          background: "rgba(249, 115, 22, 0.2)",
          borderRadius: "2px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #f97316, #fb923c)",
            boxShadow: "0 0 20px rgba(249, 115, 22, 0.6)",
          }}
        />
      </motion.div>

      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "0.9rem",
          letterSpacing: "0.3em",
          color: "rgba(255, 255, 255, 0.6)",
        }}
      >
        LOADING EXPERIENCE
      </motion.div>

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            background: "#f97316",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(249, 115, 22, 0.8)",
            left: `calc(50% + ${Math.cos((i * Math.PI) / 4) * 100}px)`,
            top: `calc(50% + ${Math.sin((i * Math.PI) / 4) * 100}px)`,
          }}
        />
      ))}
    </motion.div>
  )
}
