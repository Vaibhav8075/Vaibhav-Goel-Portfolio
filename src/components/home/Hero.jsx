import { Canvas, useFrame } from "@react-three/fiber"
import {
  ScrollControls,
  Scroll,
  useScroll,
  useGLTF,
  Environment,
  Sparkles,
  Stars,
  Loader,
  Center
} from "@react-three/drei"
import { useRef, useMemo, Suspense, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import Reachout from "../contact/Reachout"
import { Button } from "../ui/Button"
import { scrollToSection } from "../../theme"

const MODEL_SCALE = 0.05

// Loading Screen (cached to prevent re-renders)
function ACMLoadingScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)
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
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            background: 'linear-gradient(90deg, #f97316, #fb923c, #ea580c, #f97316)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          TECHNOLOGY
        </motion.span>
      </motion.div>

      <motion.div
        style={{
          width: '300px',
          height: '4px',
          background: 'rgba(249, 115, 22, 0.2)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #f97316, #fb923c)',
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)'
          }}
        />
      </motion.div>

      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: '0.9rem',
          letterSpacing: '0.3em',
          color: 'rgba(255, 255, 255, 0.6)'
        }}
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

// Optimized stars - REDUCED COUNT
function AnimatedStars() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      <Stars
        radius={100}
        depth={50}
        count={2000} // REDUCED from 5000
        factor={4}
        saturation={0}
        fade
        speed={2}
      />
    </group>
  )
}

// Optimized particles - REDUCED COUNT AND SIMPLER ANIMATION
function ParticleField() {
  const count = 300 // REDUCED from 1000
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return positions
  }, [])

  const pointsRef = useRef()

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03 // SLOWER rotation
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#f97316"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Optimized model with SINGLE animation loop
function PremiumModel() {
  const { scene } = useGLTF("/model2.glb")
  const modelRef = useRef()
  const groupRef = useRef()
  const scroll = useScroll()
  const clonedScene = useMemo(() => scene.clone(), [scene])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const offset = scroll.offset

    if (groupRef.current) {
      // Single smooth rotation
      groupRef.current.rotation.y = t * 0.15 + offset * Math.PI
    }
    if (modelRef.current) {
      // Unified animation
      modelRef.current.position.y = Math.sin(t * 0.8) * 0.15
      modelRef.current.position.x = Math.cos(t * 0.6) * 0.08
      modelRef.current.rotation.x = Math.sin(offset * Math.PI) * 0.15
      const breathe = 1 + Math.sin(t * 0.7) * 0.04
      const scrollScale = 0.92 + offset * 0.35
      modelRef.current.scale.setScalar(MODEL_SCALE * scrollScale * breathe)
    }
  })

  return (
    <Center>
      <group ref={groupRef}>
        <primitive ref={modelRef} object={clonedScene} scale={MODEL_SCALE} position={[0, 0, 0]} />
      </group>
      <Sparkles count={30} scale={6} size={1} speed={0.3} color="#f97316" /> {/* REDUCED count */}
    </Center>
  )
}

// Optimized Scene - REDUCED POST-PROCESSING
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#f97316" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
      <spotLight position={[0, 5, 0]} angle={0.6} penumbra={1} intensity={1} castShadow color="#ffffff" />
      
      <Suspense fallback={null}>
        <AnimatedStars />
        <ParticleField />
        <PremiumModel />
        <Environment preset="night" />
      </Suspense>

      {/* SIMPLIFIED BLOOM - Less intensive */}
      <EffectComposer multisampling={0}> {/* Disable multisampling for performance */}
        <Bloom
          intensity={1.2} // REDUCED from 1.5
          luminanceThreshold={0.3} // INCREASED threshold
          luminanceSmoothing={0.8}
          height={200} // REDUCED from 300
        />
      </EffectComposer>
    </>
  )
}

export default function Hero() {
  return (
    <>
      <ACMLoadingScreen />

      <div style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #0a0a0a, #141414)"
      }}>
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
            background: rgba(20, 20, 20, 0.75);
            border: 1px solid rgba(249, 115, 22, 0.2);
            box-shadow: 0 8px 32px 0 rgba(249, 115, 22, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .glass-card:hover {
            transform: translateY(-8px);
            border-color: rgba(249, 115, 22, 0.4);
            box-shadow: 0 16px 48px 0 rgba(249, 115, 22, 0.2);
          }

          .project-card {
            backdrop-filter: blur(10px);
            background: rgba(20, 20, 20, 0.6);
            border: 1px solid rgba(249, 115, 22, 0.15);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }

          .project-card:hover {
            transform: translateX(10px);
            border-color: rgba(249, 115, 22, 0.4);
            background: rgba(30, 30, 30, 0.9);
          }

          .skill-tag {
            display: inline-block;
            padding: 8px 16px;
            margin: 5px;
            background: rgba(249, 115, 22, 0.15);
            border: 1px solid rgba(249, 115, 22, 0.35);
            border-radius: 20px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }

          .skill-tag:hover {
            background: rgba(249, 115, 22, 0.25);
            border-color: rgba(249, 115, 22, 0.5);
            transform: translateY(-2px);
          }
        `}</style>

        <Canvas 
          shadows 
          dpr={[1, 1.5]} // LIMIT pixel ratio for performance
          performance={{ min: 0.5 }} // Allow performance degradation if needed
        >
          <ScrollControls pages={5} damping={0.5}>
            <Scene />

            <Scroll html style={{ width: "100%" }}>
              {/* HOME SECTION */}
              <section id="home" style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                textAlign: "center",
                padding: "0 20px",
                pointerEvents: "none"
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 3.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.h1
                    className="gradient-text"
                    style={{
                      fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
                      fontWeight: "800",
                      marginBottom: "20px",
                      lineHeight: "1.1",
                      letterSpacing: "-0.03em"
                    }}
                  >
                    Hi, I'm Vaibhav
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 3.6 }}
                    style={{
                      fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                      color: "rgba(255,255,255,0.8)",
                      marginBottom: "40px",
                      maxWidth: "700px",
                      lineHeight: "1.6",
                      fontWeight: "500"
                    }}
                  >
                    BTech CSE Student & Full Stack Developer
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 4 }}
                    style={{
                      display: "flex",
                      gap: "16px",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      pointerEvents: "auto"
                    }}
                  >
                    <Button onClick={() => scrollToSection("#about")}>Explore More</Button>
                    <Button variant="ghost" onClick={() => scrollToSection("#contact")}>Get in Touch</Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.5, duration: 1 }}
                  style={{
                    position: "absolute",
                    bottom: "40px",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.9rem",
                    textAlign: "center"
                  }}
                >
                  <div style={{ marginBottom: "10px" }}>Scroll to explore</div>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ fontSize: "1.5rem" }}
                  >
                    ↓
                  </motion.div>
                </motion.div>
              </section>

              {/* ABOUT SECTION */}
              <section id="about" style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                padding: "10vw",
                color: "white",
                pointerEvents: "auto"
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card"
                  style={{
                    padding: "clamp(30px, 5vw, 60px)",
                    borderRadius: "24px",
                    maxWidth: "900px"
                  }}
                >
                  <h2 style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    marginBottom: "30px",
                    background: "linear-gradient(135deg, #f97316, #fb923c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "800"
                  }}>
                    About Me
                  </h2>
                  
                  <p style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                    lineHeight: "1.9",
                    color: "rgba(255,255,255,0.9)",
                    marginBottom: "28px"
                  }}>
                    BTech CSE student passionate about pushing the boundaries of technology.
                    Specializing in <strong style={{ color: "#f97316" }}>AI systems</strong>, 
                    <strong style={{ color: "#fb923c" }}> agentic architectures</strong>, and creating
                    <strong style={{ color: "#ea580c" }}> immersive frontend experiences</strong> that 
                    blend creativity with cutting-edge technology.
                  </p>
                  <Button variant="ghost" onClick={() => scrollToSection("#skills")}>
                    Explore my skills →
                  </Button>
                </motion.div>
              </section>

              {/* SKILLS SECTION */}
              <section id="skills" style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10vw",
                color: "white",
                pointerEvents: "auto"
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card"
                  style={{
                    padding: "clamp(40px, 5vw, 60px)",
                    borderRadius: "24px",
                    maxWidth: "1000px",
                    width: "100%"
                  }}
                >
                  <h2 style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    marginBottom: "40px",
                    background: "linear-gradient(135deg, #fb923c, #f97316)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "800",
                    textAlign: "center"
                  }}>
                    Core Skills
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
                    {["React & Three.js", "AI/ML", "Python", "WebGL", "TypeScript", "Node.js", "LLM Integration", "3D Web Design", "LangChain", "OpenAI", "Canvas API", "GLSL", "p5.js"].map((skill, i) => (
                      <motion.span
                        key={skill}
                        className="skill-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* PROJECTS SECTION */}
              <section id="projects" style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                padding: "10vw",
                color: "white",
                pointerEvents: "auto"
              }}>
                <div style={{ maxWidth: "900px", width: "100%" }}>
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                      marginBottom: "50px",
                      background: "linear-gradient(135deg, #fb923c, #f97316)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "800"
                    }}
                  >
                    Featured Projects
                  </motion.h2>

                  {[
                    { 
                      title: "🤖 AI Agent Platform", 
                      desc: "Built autonomous agents with LLM integration, multi-step reasoning, and real-time decision making capabilities.",
                      skills: ["Python", "LangChain", "OpenAI"],
                      color: "#f97316"
                    },
                    { 
                      title: "🌐 3D Portfolio Experience", 
                      desc: "Immersive scroll-driven 3D web experiences using React Three Fiber, with physics-based animations.",
                      skills: ["React", "Three.js", "WebGL"],
                      color: "#fb923c"
                    },
                    { 
                      title: "🎨 Creative Coding Lab", 
                      desc: "Experimental space for generative art, particle systems, and interactive visual experiences.",
                      skills: ["Canvas API", "GLSL", "p5.js"],
                      color: "#ea580c"
                    }
                  ].map((project, index) => (
                    <motion.div
                      key={index}
                      className="project-card"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.8, delay: index * 0.15 }}
                      whileHover={{ x: 12 }}
                      onClick={() => scrollToSection("#contact")}
                    >
                      <h3 style={{
                        fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                        color: project.color,
                        marginBottom: "12px",
                        fontWeight: "700"
                      }}>
                        {project.title}
                      </h3>
                      <p style={{
                        color: "rgba(255,255,255,0.85)",
                        lineHeight: "1.7",
                        fontSize: "clamp(1rem, 2vw, 1.1rem)",
                        marginBottom: "15px"
                      }}>
                        {project.desc}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {project.skills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* CONTACT SECTION - Using your existing Reachout component */}
              <Reachout />

            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>
      
      <Loader />
    </>
  )
}
