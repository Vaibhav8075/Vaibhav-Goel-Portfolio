import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 mix-blend-difference"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 h-24 flex items-center justify-between">
        <div className="font-mono text-sm tracking-widest text-[#EAEAEA]">
          Vaibhav Goel
        </div>
        
        <nav className="hidden md:flex gap-8 font-mono text-xs tracking-widest text-[#888888]">
          <a href="#profile" className="hover:text-[#00E5FF] transition-colors duration-300">PROFILE</a>
          <a href="#WORK" className="hover:text-[#00E5FF] transition-colors duration-300">WORK</a>
          <a href="#experience" className="hover:text-[#00E5FF] transition-colors duration-300">EXPERIENCE</a>
          <a href="#stack" className="hover:text-[#00E5FF] transition-colors duration-300">STACK</a>
        </nav>
        
        <a 
          href="https://github.com/Vaibhav8075" 
          target="_blank" 
          rel="noreferrer"
          className="font-mono text-xs tracking-widest text-[#EAEAEA] border border-[#333333] px-4 py-2 hover:bg-[#EAEAEA] hover:text-black transition-all duration-300"
        >
          GITHUB &gt;
        </a>
      </div>
    </motion.header>
  );
}
