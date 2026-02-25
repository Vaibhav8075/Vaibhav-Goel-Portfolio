import { motion } from "framer-motion"

export function Button({ children, variant = "primary", onClick, ...props }) {
  const base = {
    padding: "13px 24px",
    borderRadius: "999px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "all 0.25s ease",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  }
  const variants = {
    primary: {
      background: "linear-gradient(135deg, #f97316, #ea580c 72%)",
      color: "white",
      boxShadow: "0 8px 28px rgba(249, 115, 22, 0.34)",
    },
    outline: {
      background: "transparent",
      color: "#f97316",
      border: "1px solid rgba(249, 115, 22, 0.65)",
    },
    ghost: {
      background: "rgba(249, 115, 22, 0.08)",
      color: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(249, 115, 22, 0.35)",
    },
  }
  return (
    <motion.button
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      whileHover={{
        y: -2,
        boxShadow: variant === "primary" ? "0 10px 34px rgba(249, 115, 22, 0.44)" : "0 6px 22px rgba(249, 115, 22, 0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
