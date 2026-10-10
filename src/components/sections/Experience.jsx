import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { experience } from "../../data/content";
import { caseStudyPath } from "../../data/meta";
import Link from "../ui/Link";

export default function Experience() {
  const listRef = useRef(null);
  // The timeline fills from the first role to the last as they pass the middle of the screen
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const fill = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <section id="experience" className="py-24 border-t border-white/[0.05]">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-1/3">
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/50 mb-4">03. EXPERIENCE</h2>
          <h3 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Timeline</h3>
        </div>

        <div ref={listRef} className="w-full md:w-2/3 flex flex-col relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06] hidden md:block"></div>
          <motion.div
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-white/60 via-white/30 to-white/10 hidden md:block"
            style={{ scaleY: fill }}
          />

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
                {/* Timeline node lights up while its role crosses the middle of the viewport */}
                <motion.div
                  className="absolute left-[3px] top-[6px] w-[9px] h-[9px] rounded-full border hidden md:block"
                  initial={{ backgroundColor: "#050505", borderColor: "rgba(255,255,255,0.2)" }}
                  whileInView={{ backgroundColor: "#EAEAEA", borderColor: "rgba(255,255,255,1)" }}
                  viewport={{ margin: "-45% 0px -45% 0px" }}
                  transition={{ duration: 0.3 }}
                />

                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                  <h4 className="text-xl font-medium text-white group-hover:text-white transition-colors duration-300">
                    {exp.role}
                  </h4>
                  <span className="font-mono text-xs text-white/50 tracking-widest">{exp.period}</span>
                </div>
                <div className="font-mono text-sm tracking-widest text-white/50">
                  {exp.company}
                </div>
                <p className="text-white/60 text-sm md:text-base leading-relaxed mt-2 font-light max-w-2xl">
                  {exp.description}
                </p>
                {exp.caseStudy && (
                  <Link
                    to={caseStudyPath(exp.caseStudy)}
                    className="self-start flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-white pb-1 border-b border-white/20 hover:border-white/60 transition-colors"
                  >
                    Read the case study <ArrowRight size={12} />
                  </Link>
                )}
                <ul className="flex flex-wrap gap-2" aria-label={`Tools used at ${exp.company}`}>
                  {exp.tech.map((tool) => (
                    <li key={tool} className="font-mono text-[10px] tracking-wider text-white/50 px-2 py-1 border border-white/10 rounded">
                      {tool}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
