import { motion } from "framer-motion";
import { experience } from "../../data/content";

export default function Experience() {
  return (
    <section id="experience" className="py-24 border-t border-white/[0.05]">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-1/3">
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 mb-4">03. EXPERIENCE</h2>
          <h3 className="text-3xl font-medium text-white tracking-tight">Timeline</h3>
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent hidden md:block"></div>
          
          <div className="flex flex-col gap-12">
            {experience.map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col gap-4 group relative md:pl-8"
              >
                {/* Timeline node */}
                <div className="absolute left-[3px] top-[6px] w-[9px] h-[9px] rounded-full bg-[#050505] border border-white/20 group-hover:border-white transition-colors duration-300 hidden md:block"></div>
                
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                  <h4 className="text-xl font-medium text-white group-hover:text-white transition-colors duration-300">
                    {exp.role}
                  </h4>
                  <span className="font-mono text-xs text-white/40 tracking-widest">{exp.period}</span>
                </div>
                <div className="font-mono text-sm tracking-widest text-white/50">
                  {exp.company}
                </div>
                <p className="text-white/60 text-sm md:text-base leading-relaxed mt-2 font-light max-w-2xl">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
