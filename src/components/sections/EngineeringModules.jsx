import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { domains, projects } from "../../data/content";
import { matchesFilter, useProjectFilter } from "../../lib/projectFilter";
import SpotlightCard from "../ui/SpotlightCard";
import AgentLedgerDiagram from "../ui/AgentLedgerDiagram";
import { ArrowUpRight, X } from "lucide-react";

// The centerpiece card carries the Agentic Ledger architecture diagram
const CENTERPIECE_ID = "agentic-ledger";
const featuredProject = projects.find((project) => project.id === CENTERPIECE_ID);

function Metrics({ items, className = "" }) {
  return (
    <ul className={`flex flex-col gap-1.5 ${className}`}>
      {items.map((metric) => (
        <li key={metric} className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-white/60">
          <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
          {metric}
        </li>
      ))}
    </ul>
  );
}

function FilterChip({ active, onClick, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] tracking-widest uppercase transition-colors ${active ? "text-white" : "text-white/50 hover:text-white"}`}
      {...props}
    >
      {active && (
        <motion.span
          layoutId="project-filter-pill"
          className="absolute inset-0 rounded-full bg-white/10 border border-white/15 -z-10"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
      {children}
    </button>
  );
}

function FeaturedProject({ project }) {
  return (
    <SpotlightCard className="flex flex-col lg:flex-row overflow-hidden border border-white/10 group">
      <div className="p-8 md:p-12 lg:w-1/2 flex flex-col justify-between relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-widest text-white px-2 py-1 bg-white/10 rounded uppercase">
              {project.type}
            </span>
            <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
              CENTERPIECE
            </span>
          </div>
          <a href={project.github} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-colors duration-300">
            <ArrowUpRight size={24} />
          </a>
        </div>

        <div className="mt-12">
          <h4 className="text-3xl md:text-4xl font-medium text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
            {project.title}
          </h4>
          <p className="font-mono text-sm tracking-wide text-white/50">{project.tagline}</p>
          <p className="text-white/60 text-base leading-relaxed mt-6 max-w-lg font-light">
            {project.description}
          </p>
          <Metrics items={project.metrics} className="mt-6" />
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-12">
          {project.tech.map((tech) => (
            <span key={tech} className="font-mono text-xs text-white/40 group-hover:text-white/80 transition-colors duration-300">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Premium Technical Diagram */}
      <div className="lg:w-1/2 bg-[#080808] border-l border-white/5 p-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        <AgentLedgerDiagram />
      </div>
    </SpotlightCard>
  );
}

function ProjectCard({ project }) {
  return (
    <a href={project.github} target="_blank" rel="noreferrer" className="block h-full group outline-none">
      <SpotlightCard className="h-full p-8 flex flex-col justify-between min-h-[300px]">
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
          <Metrics items={project.metrics} />
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
  );
}

export default function EngineeringModules() {
  const { filter, setFilter } = useProjectFilter();
  const visibleProjects = projects.filter((project) => matchesFilter(project, filter));
  const showFeatured = matchesFilter(featuredProject, filter);
  const regularProjects = visibleProjects.filter((project) => project.id !== CENTERPIECE_ID);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section id="work" className="py-24 border-t border-white/[0.05]" ref={containerRef}>
      <div className="flex flex-col gap-16">
        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 mb-4">02. WORK</h2>
          <h3 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Selected Projects</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 -mt-8">
          <div role="group" aria-label="Filter projects" className="isolate flex flex-wrap items-center gap-1">
            <FilterChip active={!filter} onClick={() => setFilter(null)}>All</FilterChip>
            {domains.map((domain) => (
              <FilterChip
                key={domain.id}
                active={filter?.type === "domain" && filter.value === domain.id}
                onClick={() => setFilter({ type: "domain", value: domain.id })}
              >
                {domain.label}
              </FilterChip>
            ))}
            {filter?.type === "tech" && (
              <FilterChip active onClick={() => setFilter(null)} aria-label={`Clear ${filter.value} filter`}>
                {filter.value} <X size={12} />
              </FilterChip>
            )}
          </div>
          <span aria-live="polite" className="ml-auto font-mono text-[11px] tracking-widest text-white/50">
            {visibleProjects.length} / {projects.length} PROJECTS
          </span>
        </div>

        {/* Featured Project with Inline Architecture Diagram */}
        <AnimatePresence initial={false}>
          {showFeatured && (
            <motion.div
              key={featuredProject.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <FeaturedProject project={featuredProject} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secondary Projects Grid with Parallax */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {regularProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  style={{ y: index % 2 === 0 ? y1 : y2 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
