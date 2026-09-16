import { motion } from "framer-motion";
import { projects } from "../../data/content";

export default function EngineeringModules() {
  return (
    <section id="work" className="py-24 border-t border-[#1A1A1A]">
      <div className="flex flex-col gap-16">
        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] text-[#555555] mb-4">02. WORK</h2>
          <h3 className="text-3xl font-medium text-[#EAEAEA]">Selected Projects</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group flex flex-col justify-between p-8 border border-[#1A1A1A] hover:border-[#333333] bg-[#0A0D14]/50 hover:bg-[#11141A]/50 transition-colors duration-500 min-h-[320px] relative overflow-hidden ${
                index === 0 ? "lg:col-span-2" : ""
              }`}
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/0 to-[#00E5FF]/0 group-hover:from-[#00E5FF]/5 transition-all duration-700 pointer-events-none"></div>
              
              <div className="flex flex-col gap-4 z-10">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] tracking-widest text-[#00E5FF] px-2 py-1 border border-[#00E5FF]/30 bg-[#00E5FF]/10">
                    {project.type}
                  </span>
                  <span className="font-mono text-lg text-[#555555] group-hover:text-[#EAEAEA] transition-colors duration-300">↗</span>
                </div>
                
                <div>
                  <h4 className="text-2xl md:text-3xl font-medium text-[#EAEAEA] mt-4 mb-2">{project.title}</h4>
                  <p className="font-mono text-xs tracking-wide text-[#888888]">{project.tagline}</p>
                </div>
                
                <p className="text-[#A0A0A0] text-sm leading-relaxed mt-4">
                  {project.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 z-10">
                {project.tech.map((tech) => (
                  <span key={tech} className="font-mono text-[11px] text-[#555555] group-hover:text-[#888888] transition-colors duration-300">
                    // {tech}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
