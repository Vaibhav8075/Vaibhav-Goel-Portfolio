import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LaunchLoadingScreen() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 2800
    const intervalTime = 30
    const steps = duration / intervalTime
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const newProgress = Math.min(100, Math.floor((currentStep / steps) * 100))
      
      if (newProgress > 90 && Math.random() > 0.5) {
        return
      }
      
      setProgress(newProgress)

      if (currentStep >= steps) {
        clearInterval(timer)
        setTimeout(() => setLoading(false), 200)
      }
    }, intervalTime)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#050505",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Space Grotesk', sans-serif"
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "400px",
              padding: "0 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  marginBottom: "0.25rem"
                }}
              >
                Vaibhav Goel
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(249, 115, 22, 0.9)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: "600"
                }}
              >
                Portfolio 2026
              </motion.div>
            </div>

            <div style={{ width: "100%", position: "relative" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-end",
                marginBottom: "12px"
              }}>
                <span style={{ 
                  fontSize: "0.75rem", 
                  color: "rgba(255,255,255,0.4)", 
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}>
                  System Initialization
                </span>
                <span style={{ 
                  fontFamily: "'Sora', sans-serif", 
                  fontSize: "1.2rem", 
                  fontWeight: "700", 
                  color: "#fff" 
                }}>
                  {progress}%
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "2px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #ea580c, #f97316)",
                    boxShadow: "0 0 10px rgba(249, 115, 22, 0.4)",
                    width: `${progress}%`,
                    transition: "width 0.1s linear"
                  }}
                />
              </div>
            </div>
            
            <motion.div
              animate={{ opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                paddingBottom: "100%",
                background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 60%)",
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: -1
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
