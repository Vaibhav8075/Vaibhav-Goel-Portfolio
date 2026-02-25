import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const ringX = useSpring(mouseX, { stiffness: 800, damping: 28, mass: 0.1 })
  const ringY = useSpring(mouseY, { stiffness: 800, damping: 28, mass: 0.1 })
  const dotX = useSpring(mouseX, { stiffness: 2000, damping: 40, mass: 0.1 })
  const dotY = useSpring(mouseY, { stiffness: 2000, damping: 40, mass: 0.1 })

  useEffect(() => {
    const updateMousePosition = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const checkHoverTarget = (e) => {
      if (!e.target) return
      const target = e.target
      
      try {
        const isClickable = 
          target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest?.('a') !== null || 
          target.closest?.('button') !== null ||
          window.getComputedStyle(target).cursor === 'pointer'

        setIsHovering(isClickable)
      } catch (err) {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mouseover", checkHoverTarget)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseover", checkHoverTarget)
    }
  }, [mouseX, mouseY])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 0 : 1,
        }}
        transition={{ scale: { type: "tween", ease: "backOut", duration: 0.15 } }}
      />
      <motion.div
        className="custom-cursor-ring"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(249, 115, 22, 0.1)" : "transparent",
          borderColor: isHovering ? "rgba(249, 115, 22, 0.8)" : "rgba(249, 115, 22, 0.5)"
        }}
        transition={{ scale: { type: "tween", ease: "backOut", duration: 0.2 }, backgroundColor: { duration: 0.2 } }}
      />
    </>
  )
}
