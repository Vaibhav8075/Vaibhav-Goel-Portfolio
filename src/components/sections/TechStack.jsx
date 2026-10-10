import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { experience, projects, skills } from "../../data/content";
import { useProjectFilter } from "../../lib/projectFilter";
import { scrollToSection } from "../../lib/scroll";

function getUsage(skill) {
  return {
    projects: projects.filter((project) => project.tech.includes(skill)),
    roles: experience.filter((role) => role.tech.includes(skill)),
  };
}

function UsagePanel({ skill, onShowProjects }) {
  const usage = skill ? getUsage(skill) : null;

  return (
    <div aria-live="polite" className="min-h-[200px]">
      <AnimatePresence mode="wait" initial={false}>
        {skill ? (
          <motion.div
            key={skill}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            <div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Where I've used</div>
              <div className="text-2xl font-medium text-white tracking-tight">{skill}</div>
            </div>

            {usage.projects.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {usage.projects.map((project) => (
                  <li key={project.id} className="font-mono text-xs tracking-wide text-white/70">{project.title}</li>
                ))}
              </ul>
            )}

            {usage.roles.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {usage.roles.map((role) => (
                  <li key={role.id} className="font-mono text-xs tracking-wide text-white/50">
                    {role.role} · {role.company}
                  </li>
                ))}
              </ul>
            )}

            {usage.projects.length > 0 && (
              <button
                type="button"
                onClick={() => onShowProjects(skill)}
                className="self-start flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-white pb-1 border-b border-white/20 hover:border-white/60 transition-colors"
              >
                View {usage.projects.length === 1 ? "project" : `${usage.projects.length} projects`} <ArrowRight size={12} />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-white/50 font-light leading-relaxed max-w-xs"
          >
            Hover or tap a highlighted technology to see the projects and roles where I&apos;ve used it.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TechStack() {
  const [selected, setSelected] = useState(null);
  const { setFilter } = useProjectFilter();

  const showProjects = (skill) => {
    setFilter({ type: "tech", value: skill });
    scrollToSection("work");
  };

  return (
    <section id="stack" className="py-24 border-t border-[#1A1A1A]">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-1/3">
          <div className="md:sticky md:top-32">
            <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 mb-4">04. STACK</h2>
            <h3 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Technologies</h3>
            <div className="hidden md:block mt-10">
              <UsagePanel skill={selected} onShowProjects={showProjects} />
            </div>
          </div>
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
                {items.map(item => {
                  const { projects: usedIn, roles } = getUsage(item);
                  const uses = usedIn.length + roles.length;

                  if (uses === 0) {
                    return (
                      <li key={item} className="font-mono text-sm text-[#A0A0A0] cursor-default">
                        {item}
                      </li>
                    );
                  }

                  return (
                    <li key={item}>
                      <button
                        type="button"
                        aria-pressed={selected === item}
                        onMouseEnter={() => setSelected(item)}
                        onFocus={() => setSelected(item)}
                        onClick={() => setSelected(item)}
                        className={`group flex items-center gap-2 font-mono text-sm text-left transition-colors duration-300 ${selected === item ? "text-[#00E5FF]" : "text-[#C8C8C8] hover:text-[#00E5FF]"}`}
                      >
                        <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                        {item}
                        <span className="text-[10px] text-white/40 group-hover:text-white/60">{uses}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden">
          <UsagePanel skill={selected} onShowProjects={showProjects} />
        </div>
      </div>
    </section>
  );
}
