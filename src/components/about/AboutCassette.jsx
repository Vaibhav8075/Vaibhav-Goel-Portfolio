import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

export default function AboutCassette() {
  const sectionRef = useRef()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  })

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  const cassetteX = useTransform(springScroll, [0, 1], [-500, 0])
  const cassetteOp = useTransform(springScroll, [0, 0.4], [0, 1])
  const cassetteRot = useTransform(springScroll, [0, 1], [-18, 0])
  const cassetteScale = useTransform(springScroll, [0, 1], [0.75, 1])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-20 gap-12 relative overflow-hidden py-24"
    >
      <div
        className="absolute inset-0 opacity-[0.02] z-0"
        style={{
          backgroundImage: `linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-[130px] rounded-full top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 z-0"
      />

      <motion.div
        style={{ x: cassetteX, opacity: cassetteOp, scale: cassetteScale, rotate: cassetteRot }}
        className="relative z-10 order-1 flex-shrink-0"
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <img
            src="/cassette.png"
            alt="cassette"
            style={{
              width: "clamp(260px, 32vw, 420px)",
              borderRadius: "24px",
              opacity: 0.82,
              filter: "drop-shadow(0 20px 60px rgba(249,115,22,0.35))",
              display: "block",
            }}
          />
        </motion.div>

        <div className="absolute -bottom-5 -left-5 w-24 h-24 border-l-2 border-b-2 border-orange-500/30 rounded-bl-[1.5rem] pointer-events-none" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-xl z-10 md:w-1/2 order-2"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-7xl font-bold mb-8 leading-tight"
        >
          About <span className="text-orange-500">Me</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-300 leading-relaxed mb-6 text-lg"
        >
          I am a <strong className="text-white font-semibold">Computer Science undergraduate at VIT Vellore</strong> and a
          <strong className="text-orange-400 font-semibold"> full-stack developer</strong> with strong frontend specialization.
          I build production-grade applications using React 18, Tailwind CSS, Three.js, GSAP, and Framer Motion, with backend
          support through FastAPI services.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-gray-400 leading-relaxed text-base mb-4"
        >
          Alongside UI engineering, I work on AI-integrated systems including Whisper-based workflows, Backboard AI
          verification, authentication flows, and rate-limited APIs. My focus is maintainability, performance, and clean user
          experience.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-500 leading-relaxed text-sm"
        >
          I have worked across startup and engineering teams including MossX, Aarvasa, and Team Sammard (VIT Rocket Team),
          contributing to real-time dashboards and production-ready frontend systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-10 w-32 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/50 origin-left"
        />
      </motion.div>
    </section>
  )
}
