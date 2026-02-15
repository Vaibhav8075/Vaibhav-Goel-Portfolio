import { motion } from "framer-motion"

export function Button({ children, variant = "primary", onClick, ...props }) {
  const base = {
    padding: "14px 28px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    transition: "all 0.25s ease",
  }
  const variants = {
    primary: {
      background: "linear-gradient(135deg, #f97316, #ea580c)",
      color: "white",
      boxShadow: "0 4px 20px rgba(249, 115, 22, 0.35)",
    },
    outline: {
      background: "transparent",
      color: "#f97316",
      border: "2px solid #f97316",
    },
    ghost: {
      background: "transparent",
      color: "#f97316",
      border: "1px solid rgba(249, 115, 22, 0.4)",
    },
  }
  return (
    <motion.button
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: variant === "primary" ? "0 6px 28px rgba(249, 115, 22, 0.45)" : "0 4px 12px rgba(249, 115, 22, 0.2)" }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
