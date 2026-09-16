import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const links = [
    { name: "About", href: "#about" },
    { name: "Work", href: "#work" },
    { name: "Experience", href: "#experience" },
    { name: "Stack", href: "#stack" }
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-1 md:gap-2 px-3 py-2 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl relative">
        {links.map((link, index) => (
          <a
            key={link.name}
            href={link.href}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative px-4 py-2 rounded-full text-xs font-mono tracking-widest text-white/60 hover:text-white transition-colors uppercase"
          >
            {hoveredIndex === index && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-white/10 rounded-full -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {link.name}
          </a>
        ))}
        
        <div className="w-px h-4 bg-white/20 mx-2"></div>
        
        <a 
          href="https://github.com/Vaibhav8075" 
          target="_blank" 
          rel="noreferrer"
          className="px-4 py-2 rounded-full text-xs font-mono tracking-widest text-white/90 hover:bg-white hover:text-black transition-all uppercase"
        >
          GitHub
        </a>
      </div>
    </motion.nav>
  );
}
