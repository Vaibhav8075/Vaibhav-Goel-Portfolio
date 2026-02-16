import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { useRef, Suspense } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import * as THREE from "three"

function CassetteImagePlane({ imageUrl }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl)
  const meshRef = useRef()

  // Create rounded corners using a canvas
  const roundedTexture = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    if (meshRef.current) {
      // Very subtle floating
      meshRef.current.position.y = Math.sin(t * 0.4) * 0.05
    }
  })

  // Apply texture with rounded effect
  if (texture && !roundedTexture.current) {
    // Create canvas for rounded corners
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = texture.image.width
    canvas.height = texture.image.height
    
    const radius = 40 // Corner radius
    
    // Draw rounded rectangle
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(canvas.width - radius, 0)
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius)
    ctx.lineTo(canvas.width, canvas.height - radius)
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height)
    ctx.lineTo(radius, canvas.height)
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()
    ctx.clip()
    
    // Draw image
    ctx.drawImage(texture.image, 0, 0)
    
    roundedTexture.current = new THREE.CanvasTexture(canvas)
  }

  return (
    <mesh ref={meshRef}>
      {/* Smaller cassette - more reasonable size */}
      <planeGeometry args={[4.5, 2.9]} />
      <meshBasicMaterial 
        map={roundedTexture.current || texture} 
        transparent 
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function AboutCassette() {
  const sectionRef = useRef()
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  })
  
  // SMOOTH SPRING PHYSICS
  const springScroll = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  })

  // CASSETTE ANIMATION - Slides from LEFT and hangs on left
  const cassetteX = useTransform(springScroll, [0, 1], [-600, 0])
  const cassetteOpacity = useTransform(springScroll, [0, 0.4], [0, 1])
  const cassetteRotate = useTransform(springScroll, [0, 1], [-20, 0])
  const cassetteScale = useTransform(springScroll, [0, 1], [0.7, 1])

  return (
    <section 
      ref={sectionRef}
      id="about-cassette"
      className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-16 gap-12 md:gap-20 relative overflow-hidden py-20"
    >
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.02] z-0"
        style={{
          backgroundImage: `linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated orange glow - on left side */}
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] h-[600px] bg-orange-500/15 blur-[140px] rounded-full top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 z-0" 
      />

      {/* CASSETTE - LEFT SIDE - Slides from left */}
      <motion.div 
        style={{ 
          x: cassetteX,
          opacity: cassetteOpacity,
          scale: cassetteScale,
          rotateZ: cassetteRotate 
        }}
        className="w-full md:w-5/12 h-[350px] md:h-[450px] relative z-20 flex items-center justify-center order-1"
      >
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={1.2} />
            <pointLight position={[5, 5, 5]} intensity={0.5} />
            <pointLight position={[-3, -3, 3]} intensity={0.3} color="#f97316" />
            
            <CassetteImagePlane imageUrl="/cassette.png" />
          </Canvas>
        </Suspense>

        {/* Decorative accent */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute -bottom-6 -left-6 w-28 h-28 border-l-2 border-b-2 border-orange-500/30 rounded-bl-[2rem] pointer-events-none"
        />
      </motion.div>

      {/* TEXT - RIGHT SIDE - Your existing animation */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-xl z-10 md:w-6/12 order-2"
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
          I'm a <strong className="text-white font-semibold">Full Stack Developer</strong> focused on creating 
          <strong className="text-orange-400 font-semibold"> immersive digital experiences</strong>.
          I combine React, Three.js and AI systems to build cinematic,
          high-performance web interfaces.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-gray-400 leading-relaxed text-base mb-4"
        >
          My work blends <strong className="text-gray-300 font-medium">design, motion and engineering</strong> — creating
          interactive stories instead of static websites.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-500 leading-relaxed text-sm"
        >
          Every project is a chance to push the boundaries of what's possible on the web,
          combining cutting-edge technology with thoughtful user experience.
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