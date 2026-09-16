import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-start pt-20">
      <div className="flex flex-col gap-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-mono text-[#00E5FF] text-sm tracking-[0.3em] uppercase"
        >
          System Initialized
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#EAEAEA] leading-[1.1]"
        >
          Architecting <br />
          <span className="text-[#888888]">Intelligent Systems.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-[#A0A0A0] max-w-2xl leading-relaxed mt-4 font-light"
        >
          Software engineer specializing in machine learning pipelines, distributed backend architectures, and high-performance frontend interfaces.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap gap-4 mt-8"
        >
          <a href="#modules" className="group flex items-center gap-3 bg-[#EAEAEA] text-[#050505] px-8 py-4 font-mono text-sm tracking-wider hover:bg-[#00E5FF] transition-colors duration-300">
            EXPLORE MODULES
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
          <a href="mailto:vaibhav.goel0531@gmail.com" className="flex items-center gap-3 border border-[#333333] text-[#EAEAEA] px-8 py-4 font-mono text-sm tracking-wider hover:bg-[#111111] transition-colors duration-300">
            CONTACT
          </a>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 left-6 md:left-12 lg:left-24 font-mono text-xs text-[#555555] tracking-widest flex items-center gap-4"
      >
        <span className="w-8 h-[1px] bg-[#555555]"></span>
        SCROLL TO INSPECT
      </motion.div>
    </section>
  );
}
