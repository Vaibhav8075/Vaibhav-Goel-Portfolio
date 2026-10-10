import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import Typewriter from "../ui/Typewriter";

export default function Hero() {
  const sectionRef = useRef(null);
  // Start off-canvas so the glow stays hidden until the pointer enters
  const glowX = useMotionValue(-1000);
  const glowY = useMotionValue(-1000);
  const glow = useMotionTemplate`radial-gradient(800px circle at ${glowX}px ${glowY}px, rgba(255,255,255,0.03), transparent 40%)`;

  const handlePointerMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden"
    >
      
      {/* Magnetic Subtle Glow */}
      <motion.div 
        className="pointer-events-none absolute inset-0"
        style={{ background: glow }}
      />

      <div className="flex flex-col gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-white/40 motion-safe:animate-pulse"></div>
          <span className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase">
            third-year CS · VIT Vellore · Software Engineering
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-7xl lg:text-[8rem] font-medium tracking-tighter leading-[0.95]"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-500">Vaibhav</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">Goel.</span>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-400 font-light tracking-wide mt-2"
        >
          Software Engineer & Intelligent Systems
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-white/40 max-w-2xl font-light leading-relaxed min-h-[80px] mt-4"
        >
          <Typewriter 
            text="I build high-performance data pipelines, multi-agent frameworks, and distributed architectures. Bridging the gap between complex ML models and production-ready applications." 
            delay={1000} 
            speed={25}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 flex gap-6 items-center"
        >
          <a href="#work" className="font-mono text-xs tracking-widest text-white hover:text-white/70 transition-colors uppercase flex items-center gap-2 pb-1 border-b border-white/20 hover:border-white/50">
            View Work <ArrowDown size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
