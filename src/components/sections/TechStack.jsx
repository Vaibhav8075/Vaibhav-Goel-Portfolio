import { motion } from "framer-motion";
import { skills } from "../../data/content";

export default function TechStack() {
  return (
    <section id="stack" className="py-24 border-t border-[#1A1A1A]">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-1/3">
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 mb-4">04. STACK</h2>
          <h3 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Technologies</h3>
        </div>
        
        <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-8">
          {Object.entries(skills).map(([category, items], index) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col gap-6"
            >
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-[#555555] uppercase border-b border-[#1A1A1A] pb-3">
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {items.map(item => (
                  <li key={item} className="font-mono text-sm text-[#A0A0A0] hover:text-[#00E5FF] transition-colors duration-300 cursor-default">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
