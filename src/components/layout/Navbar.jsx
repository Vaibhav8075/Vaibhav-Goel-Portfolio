import { motion } from "framer-motion";
import { useState } from "react";
import useActiveSection from "../../lib/useActiveSection";
import { profile } from "../../data/content";

const links = [
  { name: "About", id: "about" },
  { name: "Work", id: "work" },
  { name: "Experience", id: "experience" },
  { name: "Stack", id: "stack" }
];
const sectionIds = links.map((link) => link.id);

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const activeId = useActiveSection(sectionIds);
  const activeIndex = links.findIndex((link) => link.id === activeId);
  // The pill follows the hovered link and settles back on the section in view
  const pillIndex = hoveredIndex ?? (activeIndex === -1 ? null : activeIndex);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 px-2 sm:px-3 py-2 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl relative">
        {links.map((link, index) => (
          <a
            key={link.name}
            href={`#${link.id}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative px-2.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-mono tracking-wider sm:tracking-widest ${index === activeIndex ? "text-white" : "text-white/60"} hover:text-white transition-colors uppercase`}
          >
            {pillIndex === index && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-white/10 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {link.name}
          </a>
        ))}
        
        <div className="hidden sm:block w-px h-4 bg-white/20 mx-2"></div>
        
        <a 
          href={profile.github} 
          target="_blank" 
          rel="noreferrer"
          className="hidden sm:block px-4 py-2 rounded-full text-xs font-mono tracking-widest text-white/90 hover:bg-white hover:text-black transition-all uppercase"
        >
          GitHub
        </a>
      </div>
    </motion.nav>
  );
}
