import { Canvas, useFrame, useThree } from "@react-three/fiber"   
import { Stars, MeshDistortMaterial,useGLTF, Center } from "@react-three/drei"
import { useRef, useMemo, Suspense, useState, useEffect } from "react"
import { motion } from "framer-motion"
import * as THREE from "three"
import Reachout from "../contact/Reachout"
import { Button } from "../ui/Button"
import { scrollToSection } from "../../theme"

// Loading Screen
function ACMLoadingScreen() {
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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #000000, #0a0a0a)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontFamily: "'Orbitron', monospace",
          fontWeight: '800',
          marginBottom: '40px',
          letterSpacing: '0.2em'
        }}
      >
        <motion.span
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(90deg, #f97316, #fb923c, #ea580c, #f97316)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          PORTFOLIO
        </motion.span>
      </motion.div>

      <motion.div style={{ width: '300px', height: '4px', background: 'rgba(249, 115, 22, 0.2)', borderRadius: '2px', overflow: 'hidden', marginBottom: '20px' }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #f97316, #fb923c)', boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)' }}
        />
      </motion.div>

      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.9rem', letterSpacing: '0.3em', color: 'rgba(255, 255, 255, 0.6)' }}
      >
        LOADING EXPERIENCE
      </motion.div>

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: '#f97316',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(249, 115, 22, 0.8)',
            left: `calc(50% + ${Math.cos(i * Math.PI / 4) * 100}px)`,
            top: `calc(50% + ${Math.sin(i * Math.PI / 4) * 100}px)`
          }}
        />
      ))}
    </motion.div>
  )
}

// Beautiful stars with multiple layers
function BeautifulStars() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <Stars radius={200} depth={120} count={8000} factor={8} fade speed={0.8} />
      <Stars radius={100} depth={50} count={3000} factor={5} saturation={0} fade speed={2} />
      <Stars radius={50} depth={30} count={1000} factor={4} saturation={0} fade speed={2.5} />
    </group>
  )
}

// Shooting stars
function ShootingStars() {
  const starsRef = useRef([])
  const [shootingStars, setShootingStars] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newStar = {
        id: Math.random(),
        startX: (Math.random() - 0.5) * 100,
        startY: Math.random() * 50 + 20,
        startZ: -Math.random() * 50 - 20,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 5 + 3,
        angle: Math.random() * 0.5 - 0.25
      }
      setShootingStars(prev => [...prev.slice(-5), newStar])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useFrame(() => {
    starsRef.current.forEach((star, index) => {
      if (star && shootingStars[index]) {
        const data = shootingStars[index]
        star.position.x -= data.speed * 0.1
        star.position.y -= data.speed * 0.05 * Math.sin(data.angle)
        star.rotation.z = data.angle
        if (star.position.x < -60) {
          star.position.x = data.startX
          star.position.y = data.startY
        }
      }
    })
  })

  return (
    <group>
      {shootingStars.map((star, index) => (
        <mesh key={star.id} ref={el => starsRef.current[index] = el} position={[star.startX, star.startY, star.startZ]}>
          <planeGeometry args={[star.length, 0.1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

// Glowing particles
function GlowingParticles() {
  const count = 400
  const particlesRef = useRef()
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#f97316" transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

// Dynamic lights
function DynamicLights() {
  const light1Ref = useRef()
  const light2Ref = useRef()
  const light3Ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.3) * 15
      light1Ref.current.position.z = Math.cos(t * 0.3) * 15
      light1Ref.current.intensity = Math.sin(t) * 0.5 + 1.5
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(t * 0.4) * 12
      light2Ref.current.position.z = Math.sin(t * 0.4) * 12
      light2Ref.current.intensity = Math.cos(t * 1.2) * 0.3 + 1
    }
    if (light3Ref.current) {
      light3Ref.current.position.x = Math.sin(t * 0.2) * 18
      light3Ref.current.position.y = Math.cos(t * 0.2) * 5 + 8
      light3Ref.current.intensity = Math.sin(t * 0.8) * 0.4 + 0.8
    }
  })

  return (
    <>
      <pointLight ref={light1Ref} position={[15, 10, 15]} color="#f97316" intensity={1.5} distance={40} />
      <pointLight ref={light2Ref} position={[12, 8, 12]} color="#fb923c" intensity={1} distance={35} />
      <pointLight ref={light3Ref} position={[18, 8, -15]} color="#00ffff" intensity={0.8} distance={30} />
    </>
  )
}

// Animated 3D shape (NO model file needed!)
// function AnimatedShape() {
//   const meshRef = useRef()
//   const groupRef = useRef()

//   useFrame((state) => {
//     const t = state.clock.elapsedTime
//     if (groupRef.current) {
//       groupRef.current.rotation.y = t * 0.15
//       groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.1
//     }
//     if (meshRef.current) {
//       meshRef.current.position.y = Math.sin(t * 0.8) * 0.5

//       const breathe = 1 + Math.sin(t * 0.7) * 0.05
//       meshRef.current.scale.setScalar(breathe)
//       const pulse = 1 + Math.sin(t * 2) * 0.5
// meshRef.current.material.emissiveIntensity = pulse

//     }
//   })

//   return (
//     <group ref={groupRef}>
//       {/* Main glowing sphere */}
//       <mesh ref={meshRef} position={[0, 0, 0]}>
//         <icosahedronGeometry args={[2.5, 5]} />

// <MeshDistortMaterial
//   color="#f97316"
//   emissive="#f97316"
//   emissiveIntensity={1.5}
//   distort={0.5}
//   speed={2}
//   roughness={0.2}
//   metalness={1}
// />

//       </mesh>
      
//       {/* Wireframe overlay */}
//       <mesh position={[0, 0, 0]} scale={2.05}>
//         <icosahedronGeometry args={[2, 2]} />
//         <meshBasicMaterial color="#fb923c" wireframe transparent opacity={0.15} />

//       </mesh>

//       {/* Rings around it */}
//       {[0, 1, 2].map((i) => (
//         <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, 0, 0]}>
//           <torusGeometry args={[2.5 + i * 0.3, 0.02, 16, 100]} />
//           <meshBasicMaterial color="#f97316" transparent opacity={0.4 - i * 0.1} />
//         </mesh>
//       ))}
//     </group>
//   )
// }

// Scene component
function CameraMotion() {
  const { camera, mouse } = useThree()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    camera.position.x += (Math.sin(t * 0.1) * 1.5 - camera.position.x) * 0.02
    camera.position.y += (Math.cos(t * 0.12) * 0.8 - camera.position.y) * 0.02

    // mouse parallax
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.05

    camera.lookAt(0, 0, 0)
  })

  return null
}
// import { useGLTF, Center } from "@react-three/drei"

function GLBModel() {
  const { scene } = useGLTF("/model2.glb")
  const modelRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (modelRef.current) {
      modelRef.current.rotation.y = t * 0.3
      modelRef.current.position.y = Math.sin(t * 0.8) * 0.4
    }
  })

return (
  <Center>
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.03}
    />
  </Center>
)

}


function Scene() {
  return (
    <>
      
      <fog attach="fog" args={['#000000', 15, 60]} />

      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <DynamicLights />
      <spotLight position={[0, 15, 0]} angle={0.5} penumbra={1} intensity={1.5} color="#ffffff" />
      <pointLight position={[-20, 5, -20]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[20, 5, -20]} intensity={0.5} color="#ec4899" />
      
      <Suspense fallback={null}>
        <BeautifulStars />
        <ShootingStars />
        <GlowingParticles />
        <GLBModel />

      </Suspense>
      <CameraMotion />

    </>
  )
}

export default function Hero() {
  return (
    <>
      <ACMLoadingScreen />

      {/* Fixed Canvas background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 9], fov: 45 }}

        gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Scene  />
        </Canvas>
      </div>

      {/* Scrollable content */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <style>{`
          .gradient-text {
            background: linear-gradient(90deg, #f97316, #fb923c, #ea580c, #f97316);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s linear infinite;
          }
          @keyframes shimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 200% 0; }
          }
          .glass-card {
            backdrop-filter: blur(20px) saturate(180%);
            background: rgba(20, 20, 20, 0.85);
            border: 1px solid rgba(249, 115, 22, 0.3);
            box-shadow: 0 8px 32px 0 rgba(249, 115, 22, 0.15);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .glass-card:hover {
            transform: translateY(-8px);
            border-color: rgba(249, 115, 22, 0.5);
            box-shadow: 0 16px 48px 0 rgba(249, 115, 22, 0.25);
          }
          .project-card {
            backdrop-filter: blur(12px);
            background: rgba(20, 20, 20, 0.7);
            border: 1px solid rgba(249, 115, 22, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }
          .project-card:hover {
            transform: translateX(10px);
            border-color: rgba(249, 115, 22, 0.5);
            background: rgba(30, 30, 30, 0.9);
          }
          .skill-tag {
            display: inline-block;
            padding: 8px 16px;
            margin: 5px;
            background: rgba(249, 115, 22, 0.15);
            border: 1px solid rgba(249, 115, 22, 0.4);
            border-radius: 20px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }
          .skill-tag:hover {
            background: rgba(249, 115, 22, 0.3);
            border-color: rgba(249, 115, 22, 0.6);
            transform: translateY(-2px);
          }
        `}</style>

        {/* HOME */}
        <section id="home" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white", textAlign: "center", padding: "0 20px" }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 3.2 }}>
            <motion.h1 className="gradient-text" style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)", fontWeight: "800", marginBottom: "20px", lineHeight: "1.1", letterSpacing: "-0.03em" }}>
              Hi, I'm Vaibhav
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 3.6 }} style={{ fontSize: "clamp(1.1rem, 3vw, 1.6rem)", color: "rgba(255,255,255,0.8)", marginBottom: "40px", maxWidth: "700px", lineHeight: "1.6", fontWeight: "500" }}>
              BTech CSE Student & Full Stack Developer
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 4 }} style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Button onClick={() => scrollToSection("#about")}>Explore More</Button>
              <Button variant="ghost" onClick={() => scrollToSection("#contact")}>Get in Touch</Button>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5, duration: 1 }} style={{ position: "absolute", bottom: "40px", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", textAlign: "center" }}>
            <div style={{ marginBottom: "10px" }}>Scroll to explore</div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>↓</motion.div>
          </motion.div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "10vw", color: "white" }}>
          <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1 }} className="glass-card" style={{ padding: "clamp(30px, 5vw, 60px)", borderRadius: "24px", maxWidth: "900px" }}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "30px", background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "800" }}>About Me</h2>
            <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", lineHeight: "1.9", color: "rgba(255,255,255,0.9)", marginBottom: "28px" }}>
              BTech CSE student passionate about pushing the boundaries of technology. Specializing in <strong style={{ color: "#f97316" }}>AI systems</strong>, <strong style={{ color: "#fb923c" }}> agentic architectures</strong>, and creating <strong style={{ color: "#ea580c" }}> immersive frontend experiences</strong> that blend creativity with cutting-edge technology.
            </p>
            <Button variant="ghost" onClick={() => scrollToSection("#skills")}>Explore my skills →</Button>
          </motion.div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "10vw", color: "white" }}>
          <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1 }} className="glass-card" style={{ padding: "clamp(40px, 5vw, 60px)", borderRadius: "24px", maxWidth: "1000px", width: "100%" }}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "40px", background: "linear-gradient(135deg, #fb923c, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "800", textAlign: "center" }}>Core Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
              {["React & Three.js", "AI/ML", "Python", "WebGL", "TypeScript", "Node.js", "LLM Integration", "3D Web Design", "LangChain", "OpenAI", "Canvas API", "GLSL", "p5.js"].map((skill, i) => (
                <motion.span key={skill} className="skill-tag" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} whileHover={{ scale: 1.05 }}>{skill}</motion.span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "10vw", color: "white" }}>
          <div style={{ maxWidth: "900px", width: "100%" }}>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }} style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "50px", background: "linear-gradient(135deg, #fb923c, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "800" }}>Featured Projects</motion.h2>
            {[
              { title: "🤖 AI Agent Platform", desc: "Built autonomous agents with LLM integration, multi-step reasoning, and real-time decision making capabilities.", skills: ["Python", "LangChain", "OpenAI"], color: "#f97316" },
              { title: "🌐 3D Portfolio Experience", desc: "Immersive scroll-driven 3D web experiences using React Three Fiber, with physics-based animations.", skills: ["React", "Three.js", "WebGL"], color: "#fb923c" },
              { title: "🎨 Creative Coding Lab", desc: "Experimental space for generative art, particle systems, and interactive visual experiences.", skills: ["Canvas API", "GLSL", "p5.js"], color: "#ea580c" }
            ].map((project, index) => (
              <motion.div key={index} className="project-card" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: index * 0.15 }} whileHover={{ x: 12 }} onClick={() => scrollToSection("#contact")}>
                <h3 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", color: project.color, marginBottom: "12px", fontWeight: "700" }}>{project.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: "1.7", fontSize: "clamp(1rem, 2vw, 1.1rem)", marginBottom: "15px" }}>{project.desc}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {project.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Reachout />
      </div>
    </>
  )
}