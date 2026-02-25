import { useRef } from "react"
import { useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"

export function useSectionStory() {
  const sectionRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    mass: 0.25,
  })

  const contentY = useTransform(progress, [0, 0.5, 1], prefersReducedMotion ? [0, 0, 0] : [120, 0, -120])
  const contentYDelayed = useTransform(progress, [0, 0.5, 1], prefersReducedMotion ? [0, 0, 0] : [180, 0, -180])
  const contentYFast = useTransform(progress, [0, 0.5, 1], prefersReducedMotion ? [0, 0, 0] : [60, 0, -60])
  const contentOpacity = useTransform(progress, [0.02, 0.2, 0.82, 0.98], [0.1, 1, 1, 0.1])
  const contentScale = useTransform(progress, [0, 0.5, 1], prefersReducedMotion ? [1, 1, 1] : [0.95, 1, 0.95])
  const backgroundY = useTransform(progress, [0, 1], prefersReducedMotion ? [0, 0] : ["-5%", "5%"])
  const lineScaleY = useTransform(progress, [0, 1], [0, 1])
  const labelY = useTransform(progress, [0, 1], [150, -150]) // deep parallax for absolute background labels

  return {
    sectionRef,
    contentY,
    contentYDelayed,
    contentYFast,
    contentOpacity,
    contentScale,
    backgroundY,
    lineScaleY,
    labelY
  }
}
