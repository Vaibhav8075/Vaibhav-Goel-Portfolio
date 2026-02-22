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

  const contentY = useTransform(progress, [0, 0.5, 1], prefersReducedMotion ? [0, 0, 0] : [42, 0, -22])
  const contentOpacity = useTransform(progress, [0.02, 0.2, 0.82, 0.98], [0.28, 1, 1, 0.78])
  const contentScale = useTransform(progress, [0, 0.5, 1], prefersReducedMotion ? [1, 1, 1] : [0.98, 1, 0.985])
  const backgroundY = useTransform(progress, [0, 1], prefersReducedMotion ? [0, 0] : ["-2%", "2%"])
  const lineScaleY = useTransform(progress, [0, 1], [0, 1])

  return {
    sectionRef,
    contentY,
    contentOpacity,
    contentScale,
    backgroundY,
    lineScaleY,
  }
}
