import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import useMediaQuery from "../../lib/useMediaQuery";
import usePrefersReducedMotion from "../../lib/usePrefersReducedMotion";
import { boxFor, edgePath } from "../../lib/diagram";
import { smoothScrollTo } from "../../lib/scroll";

const NODE_STYLES = {
  core: { fill: "#121212", stroke: "#6b6b6b", dash: undefined },
  input: { fill: "#0B0B0B", stroke: "#4a4a4a", dash: "4 3" },
  store: { fill: "#0E0E0E", stroke: "#555", dash: undefined },
  // Marks the part of a larger system that I built
  focus: { fill: "#1C1C1C", stroke: "#d4d4d4", dash: undefined },
};

function FlowSvg({ flow, layout, activeStep, revealAll }) {
  // A layout can override the default (sensors fanning in from the side read better horizontally)
  const direction = layout.direction ?? (layout === flow.tall ? "vertical" : "horizontal");
  const isVisible = (step) => revealAll || step <= activeStep;
  const isCurrent = (step) => !revealAll && step === activeStep;

  return (
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="w-full h-auto max-h-full" role="img" aria-label={flow.label}>
      {flow.groups?.map((group) => {
        const g = layout.groups[group.id];
        return (
          <g key={group.id} style={{ opacity: isVisible(group.step) ? 1 : 0, transition: "opacity 0.5s" }}>
            <rect x={g.x} y={g.y} width={g.w} height={g.h} rx="10" fill="none" stroke="#fff" strokeOpacity="0.14" strokeDasharray="3 5" />
            <text x={g.x + 12} y={g.y + 18} fill="#fff" fillOpacity="0.45" fontFamily="monospace" fontSize="9" letterSpacing="2">{group.label}</text>
          </g>
        );
      })}

      {flow.edges.map((edge) => {
        const a = boxFor(layout, edge.from);
        const b = boxFor(layout, edge.to);
        const visible = isVisible(edge.step);
        const current = isCurrent(edge.step);
        return (
          <g key={`${edge.from}-${edge.to}`}>
            {edge.dashed ? (
              // pathLength animates stroke-dasharray, so dashed edges fade in instead of drawing
              <motion.path
                d={edgePath(a, b, direction)}
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={revealAll ? { opacity: 0 } : false}
                whileInView={revealAll ? { opacity: 1 } : undefined}
                viewport={{ once: true }}
                animate={revealAll ? undefined : { opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.7 }}
                style={{ strokeOpacity: current ? 0.8 : 0.35 }}
              />
            ) : (
              <motion.path
                d={edgePath(a, b, direction)}
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
                initial={revealAll ? { pathLength: 0 } : false}
                whileInView={revealAll ? { pathLength: 1 } : undefined}
                viewport={{ once: true }}
                animate={revealAll ? undefined : { pathLength: visible ? 1 : 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                style={{ strokeOpacity: current ? 0.8 : 0.35, transition: "stroke-opacity 0.4s" }}
              />
            )}
            {edge.label && visible && (
              <text
                x={(a.x + a.w / 2 + b.x + b.w / 2) / 2}
                y={(a.y + a.h / 2 + b.y + b.h / 2) / 2 - 6}
                textAnchor="middle"
                fill="#fff"
                fillOpacity="0.5"
                fontFamily="monospace"
                fontSize="8.5"
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {flow.nodes.map((node) => {
        const box = boxFor(layout, node.id);
        const style = NODE_STYLES[node.kind ?? "core"];
        const visible = isVisible(node.step);
        const current = isCurrent(node.step);
        return (
          <g key={node.id} style={{ opacity: visible ? 1 : 0.12, transition: "opacity 0.5s" }}>
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              rx="6"
              fill={current ? "#1A1A1A" : style.fill}
              stroke={current ? "#fff" : style.stroke}
              strokeWidth={current ? 1.5 : 1}
              strokeDasharray={style.dash}
              style={{ transition: "stroke 0.4s, fill 0.4s" }}
            />
            <text x={box.x + box.w / 2} y={box.y + box.h / 2 - (node.sub ? 3 : -4)} textAnchor="middle" fill="#EEE" fontFamily="monospace" fontSize="11.5" fontWeight="500">
              {node.label}
            </text>
            {node.sub && (
              <text x={box.x + box.w / 2} y={box.y + box.h / 2 + 12} textAnchor="middle" fill="#8a8a8a" fontFamily="monospace" fontSize="9.5">
                {node.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// On desktop the diagram pins in place and builds up one step per scroll segment;
// on phones, with reduced motion and in pre-rendered HTML it shows complete with the steps listed below
export default function ScrollFlow({ flow }) {
  const isWide = useMediaQuery("(min-width: 768px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollytelling = isWide && !prefersReducedMotion;

  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const steps = flow.steps.length;

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActiveStep(Math.min(steps - 1, Math.floor(progress * steps)));
  });

  const goToStep = (index) => {
    const el = containerRef.current;
    const scrollable = el.offsetHeight - window.innerHeight;
    smoothScrollTo(el.getBoundingClientRect().top + window.scrollY + ((index + 0.5) / steps) * scrollable);
  };

  if (!scrollytelling) {
    return (
      <div className="flex flex-col gap-10">
        <div className="rounded-2xl border border-white/[0.06] bg-[#080808] p-4 sm:p-8">
          <FlowSvg flow={flow} layout={isWide ? flow.wide : flow.tall} activeStep={steps - 1} revealAll />
        </div>
        <ol className="flex flex-col gap-6">
          {flow.steps.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-2">
              <span className="font-mono text-xs text-white/50 pt-0.5">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="text-white font-medium mb-1">{step.title}</div>
                <p className="text-sm text-white/60 font-light leading-relaxed">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `calc(${steps * 55}vh + 100vh)` }}>
      <div className="sticky top-24 h-[calc(100vh-8rem)] grid grid-cols-[minmax(0,5fr)_minmax(0,2fr)] gap-8 items-center">
        <div className="max-h-full flex items-center rounded-2xl border border-white/[0.06] bg-[#080808] p-6">
          <FlowSvg flow={flow} layout={flow.wide} activeStep={activeStep} />
        </div>
        <ol className="flex flex-col gap-2">
          {flow.steps.map((step, index) => {
            const isActive = index === activeStep;
            return (
              <li key={step.title}>
                <button
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => goToStep(index)}
                  className={`w-full text-left grid grid-cols-[2rem_1fr] gap-2 rounded-xl px-3 py-3 transition-colors ${isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
                >
                  <span className={`font-mono text-xs pt-0.5 transition-colors ${isActive ? "text-white" : "text-white/40"}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span className={`block font-medium transition-colors ${isActive ? "text-white" : "text-white/50"}`}>{step.title}</span>
                    <motion.span
                      initial={false}
                      animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="block overflow-hidden"
                    >
                      <span className="block pt-1 text-sm text-white/60 font-light leading-relaxed">{step.text}</span>
                    </motion.span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
