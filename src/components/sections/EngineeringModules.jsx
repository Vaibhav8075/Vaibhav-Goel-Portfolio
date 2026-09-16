import { motion } from "framer-motion";
import { projects } from "../../data/content";
import SpotlightCard from "../ui/SpotlightCard";
import { ArrowUpRight } from "lucide-react";

export default function EngineeringModules() {
  return (
    <section id="work" className="py-24 border-t border-white/[0.05]">
      <div className="flex flex-col gap-16">
        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 mb-4">02. WORK</h2>
          <h3 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Selected Projects</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={index === 0 ? "lg:col-span-2" : ""}
            >
              <a href={project.link} target="_blank" rel="noreferrer" className="block h-full group outline-none">
                <SpotlightCard className="h-full p-8 md:p-10 flex flex-col justify-between min-h-[320px]">
                  
                  <div className="flex flex-col gap-4 z-10 relative">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] tracking-widest text-white/60 px-2 py-1 border border-white/10 bg-white/[0.03] rounded uppercase">
                        {project.type}
                      </span>
                      <ArrowUpRight size={20} className="text-white/30 group-hover:text-white transition-colors duration-300" />
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-2xl md:text-3xl font-medium text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                        {project.title}
                      </h4>
                      <p className="font-mono text-xs tracking-wide text-white/50">{project.tagline}</p>
                    </div>
                    
                    <p className="text-white/60 text-sm md:text-base leading-relaxed mt-4 max-w-2xl font-light">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-12 z-10 relative">
                    {project.tech.map((tech) => (
                      <span key={tech} className="font-mono text-[11px] text-white/40 group-hover:text-white/70 transition-colors duration-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
