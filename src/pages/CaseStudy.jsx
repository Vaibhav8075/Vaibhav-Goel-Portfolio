import { lazy, Suspense, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "../data/content";
import { caseStudies } from "../data/caseStudies";
import { caseStudyPath } from "../data/meta";
import Link from "../components/ui/Link";
import ScrollFlow from "../components/case-study/ScrollFlow";
import StatGrid from "../components/case-study/StatGrid";
import BarChart from "../components/case-study/BarChart";

// Interactive figures are split into their own chunks so other pages never download their artwork
const FIGURES = {
  "protocol-bench": lazy(() => import("../components/case-study/ProtocolBench")),
  "fire-bench": lazy(() => import("../components/case-study/FireBench")),
  "ledger-bench": lazy(() => import("../components/case-study/LedgerBench")),
  "call-bench": lazy(() => import("../components/case-study/CallBench")),
};

const studied = projects.filter((project) => caseStudies[project.id]);

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Section({ index, label, title, caption, wide = false, children }) {
  return (
    <section className="py-16 md:py-24 border-t border-white/[0.05]">
      <div className={wide ? "flex flex-col gap-12" : "flex flex-col md:flex-row gap-10 md:gap-24"}>
        <div className={wide ? "max-w-2xl" : "md:w-1/3 shrink-0"}>
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/50 mb-4 uppercase">{index} · {label}</h2>
          <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">{title}</h3>
          {caption && <p className="mt-4 text-white/60 font-light leading-relaxed">{caption}</p>}
        </div>
        <div className={wide ? "" : "md:w-2/3 min-w-0"}>{children}</div>
      </div>
    </section>
  );
}

const subscribeNever = () => () => {};

// The pre-render and hydration show the placeholder; the figure's chunk loads only in the browser,
// so the server never meets an unfinished lazy component (React error 419)
function Figure({ name }) {
  const Art = FIGURES[name];
  const inBrowser = useSyncExternalStore(subscribeNever, () => true, () => false);
  const placeholder = <div className="aspect-[4/3] md:aspect-[16/11] border border-white/[0.06]" aria-hidden="true" />;
  return (
    <Reveal>
      {inBrowser ? (
        <Suspense fallback={placeholder}>
          <Art />
        </Suspense>
      ) : (
        placeholder
      )}
    </Reveal>
  );
}

export default function CaseStudy({ id }) {
  const project = projects.find((p) => p.id === id);
  const study = caseStudies[id];
  const next = studied[(studied.indexOf(project) + 1) % studied.length];
  let sectionIndex = 0;
  const nextIndex = () => String(++sectionIndex).padStart(2, "0");

  return (
    <article>
      <header className="pt-8 md:pt-16 pb-16 md:pb-24 flex flex-col gap-8">
        <Link to="/#work" className="self-start flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={14} /> All projects
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] tracking-widest text-white px-2 py-1 bg-white/10 rounded uppercase">{project.type}</span>
            <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">{study.context}</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-500 pb-2">
            {study.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-3xl">{project.tagline}</p>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 pt-8 border-t border-white/[0.06]"
        >
          <div>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Started</dt>
            <dd className="text-white/80">{study.started}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Stack</dt>
            <dd className="text-white/80">{project.tech.join(" · ")}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Links</dt>
            <dd className="flex flex-wrap gap-x-5 gap-y-2">
              <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                Source on GitHub <ArrowUpRight size={14} />
              </a>
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                  Live site <ArrowUpRight size={14} />
                </a>
              )}
            </dd>
          </div>
        </motion.dl>
      </header>

      <Section index={nextIndex()} label="Problem" title="The problem">
        <Reveal>
          <p className="text-lg md:text-2xl text-white/80 font-light leading-relaxed">{study.problem.lead}</p>
        </Reveal>
        <ul className="mt-10 flex flex-col gap-6">
          {study.problem.points.map((point, index) => (
            <Reveal key={point} delay={index * 0.1}>
              <li className="flex gap-4 text-white/60 font-light leading-relaxed">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                {point}
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section index={nextIndex()} label="Approach" title="How it works">
        <ol className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {study.approach.map((step, index) => (
            <Reveal key={step.title} delay={(index % 2) * 0.1} className={study.approach.length % 2 === 1 && index === study.approach.length - 1 ? "lg:col-span-2" : ""}>
              <li className="h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 flex flex-col gap-3">
                <span className="font-mono text-xs text-white/40">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-white font-medium tracking-tight">{step.title}</span>
                <span className="text-sm text-white/60 font-light leading-relaxed">{step.text}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section index={nextIndex()} label="Architecture" title="Architecture" caption={study.architecture.caption} wide>
        <ScrollFlow flow={study.architecture.flow} />
      </Section>

      <Section index={nextIndex()} label="Results" title={study.results.title ?? "Results"} caption={study.results.caption} wide>
        <div className="flex flex-col gap-16">
          {study.results.stats && <StatGrid stats={study.results.stats} />}
          {study.results.figure && <Figure name={study.results.figure} />}
          {study.results.charts?.map((chart) => (
            <Reveal key={chart.title}>
              <BarChart chart={chart} />
            </Reveal>
          ))}
          {study.results.notes?.map((note) => (
            <Reveal key={note}>
              <p className="max-w-3xl text-white/60 font-light leading-relaxed border-l border-white/15 pl-6">{note}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {study.closing && (
        <Section index={nextIndex()} label={study.closing.label} title={study.closing.title}>
          <ul className="flex flex-col gap-5">
            {study.closing.points.map((point, index) => (
              <Reveal key={point} delay={index * 0.06}>
                <li className="flex gap-4 text-white/70 font-light leading-relaxed">
                  <span className="font-mono text-xs text-white/40 pt-1 shrink-0">{String(index + 1).padStart(2, "0")}</span>
                  {point}
                </li>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {next !== project && (
        <Link
          to={caseStudyPath(next.id)}
          className="group mt-8 flex flex-col gap-4 py-16 border-t border-white/[0.05]"
        >
          <span className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase">Next case study</span>
          <span className="flex items-center gap-4 text-4xl md:text-6xl font-medium tracking-tighter text-white/80 group-hover:text-white transition-colors">
            {caseStudies[next.id].name}
            <ArrowRight className="w-8 h-8 md:w-12 md:h-12 group-hover:translate-x-2 transition-transform" />
          </span>
          <span className="text-white/50 font-light">{next.tagline}</span>
        </Link>
      )}
    </article>
  );
}
