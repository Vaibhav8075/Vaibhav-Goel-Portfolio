import { motion } from "framer-motion";
import { projects } from "../../data/content";
import SpotlightCard from "../ui/SpotlightCard";
import { ArrowUpRight } from "lucide-react";

export default function EngineeringModules() {
  const featuredProject = projects[0];
  const regularProjects = projects.slice(1);

  return (
    <section id="work" className="py-24 border-t border-white/[0.05]">
      <div className="flex flex-col gap-16">
        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 mb-4">02. WORK</h2>
          <h3 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Selected Projects</h3>
        </div>
        
        {/* Featured Project with Inline Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SpotlightCard className="flex flex-col lg:flex-row overflow-hidden border border-white/10 group">
            <div className="p-8 md:p-12 lg:w-1/2 flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-widest text-white px-2 py-1 bg-white/10 rounded uppercase">
                    {featuredProject.type}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                    CENTERPIECE
                  </span>
                </div>
                <a href={featuredProject.link} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-colors duration-300">
                  <ArrowUpRight size={24} />
                </a>
              </div>
              
              <div className="mt-12">
                <h4 className="text-3xl md:text-4xl font-medium text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {featuredProject.title}
                </h4>
                <p className="font-mono text-sm tracking-wide text-white/50">{featuredProject.tagline}</p>
                <p className="text-white/60 text-base leading-relaxed mt-6 max-w-lg font-light">
                  {featuredProject.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-12">
                {featuredProject.tech.map((tech) => (
                  <span key={tech} className="font-mono text-xs text-white/40 group-hover:text-white/80 transition-colors duration-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Premium Technical Diagram */}
            <div className="lg:w-1/2 bg-[#080808] border-l border-white/5 p-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
              <svg viewBox="0 0 500 400" className="w-full h-auto relative z-10" aria-label="Multi-Agent Orchestration Architecture">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {/* Connections */}
                <motion.path 
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                  viewport={{ once: true }}
                  d="M120 200 L250 120 M120 200 L250 200 M120 200 L250 280" 
                  stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" 
                  className="group-hover:stroke-white/40 transition-all duration-700" 
                />
                <motion.path 
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                  viewport={{ once: true }}
                  d="M350 120 L450 200 M350 200 L450 200 M350 280 L450 200" 
                  stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" 
                  className="group-hover:stroke-white/40 transition-all duration-700" 
                />
                
                {/* Nodes */}
                <motion.rect initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} viewport={{ once: true }} x="40" y="170" width="80" height="60" rx="6" fill="#0C0C0C" stroke="#333" strokeWidth="1" />
                <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }} x="80" y="204" textAnchor="middle" fill="#888" fontFamily="monospace" fontSize="10">API GATEWAY</motion.text>

                <motion.rect initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }} x="250" y="90" width="100" height="60" rx="6" fill="#111" stroke="#444" strokeWidth="1.5" className="group-hover:stroke-gray-300 transition-colors duration-500" />
                <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} x="300" y="120" textAnchor="middle" fill="#EEE" fontFamily="monospace" fontSize="11">RISK AGENT</motion.text>
                <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} x="300" y="136" textAnchor="middle" fill="#555" fontFamily="monospace" fontSize="8">PyTorch LSTM</motion.text>

                <motion.rect initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }} x="250" y="170" width="100" height="60" rx="6" fill="#111" stroke="#444" strokeWidth="1.5" className="group-hover:stroke-gray-300 transition-colors duration-500" />
                <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} x="300" y="200" textAnchor="middle" fill="#EEE" fontFamily="monospace" fontSize="11">FRAUD AGENT</motion.text>
                <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} x="300" y="216" textAnchor="middle" fill="#555" fontFamily="monospace" fontSize="8">Heuristic Net</motion.text>

                <motion.rect initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} x="250" y="250" width="100" height="60" rx="6" fill="#111" stroke="#444" strokeWidth="1.5" className="group-hover:stroke-gray-300 transition-colors duration-500" />
                <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }} viewport={{ once: true }} x="300" y="280" textAnchor="middle" fill="#EEE" fontFamily="monospace" fontSize="11">CREDIT AGENT</motion.text>
                <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }} viewport={{ once: true }} x="300" y="296" textAnchor="middle" fill="#555" fontFamily="monospace" fontSize="8">FastAPI Stream</motion.text>

                <motion.rect initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} x="420" y="170" width="60" height="60" rx="30" fill="#050505" stroke="#666" strokeWidth="1" />
                <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.8 }} viewport={{ once: true }} x="450" y="204" textAnchor="middle" fill="#FFF" fontFamily="monospace" fontSize="10">OS</motion.text>
              </svg>
            </div>
          </SpotlightCard>
        </motion.div>
        
        {/* Secondary Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <a href={project.link} target="_blank" rel="noreferrer" className="block h-full group outline-none">
                <SpotlightCard className="h-full p-8 flex flex-col justify-between min-h-[280px]">
                  
                  <div className="flex flex-col gap-4 z-10 relative">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[9px] tracking-widest text-white/50 px-2 py-1 border border-white/10 bg-white/[0.03] rounded uppercase">
                        {project.type}
                      </span>
                      <ArrowUpRight size={18} className="text-white/20 group-hover:text-white transition-colors duration-300" />
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-xl font-medium text-white mb-2 tracking-tight group-hover:text-gray-300 transition-colors">
                        {project.title}
                      </h4>
                    </div>
                    
                    <p className="text-white/50 text-sm leading-relaxed font-light">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-8 z-10 relative">
                    {project.tech.map((tech) => (
                      <span key={tech} className="font-mono text-[10px] text-white/30 group-hover:text-white/60 transition-colors duration-300">
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
