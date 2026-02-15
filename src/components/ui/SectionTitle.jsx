import { motion } from "framer-motion"

export function SectionTitle({ children, style = {} }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        fontSize: "clamp(2rem, 5vw, 3rem)",
        marginBottom: "2rem",
        background: "linear-gradient(135deg, #fb923c, #f97316)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "700",
        ...style,
      }}
    >
      {children}
    </motion.h2>
  )
}
