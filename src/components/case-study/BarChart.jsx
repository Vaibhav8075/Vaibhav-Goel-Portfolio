import { motion } from "framer-motion";

// Horizontal bars that grow in when scrolled into view, with an optional reference line (e.g. chance level)
export default function BarChart({ chart }) {
  const { title, caption, max, unit = "", reference, bars } = chart;
  const pct = (value) => `${(value / max) * 100}%`;

  return (
    <figure className="flex flex-col gap-5">
      <figcaption className="flex flex-col gap-1">
        <span className="text-white font-medium">{title}</span>
        {caption && <span className="text-sm text-white/50 font-light">{caption}</span>}
      </figcaption>

      <ul className="flex flex-col gap-3">
        {bars.map((bar, index) => (
          <li key={bar.label} className="grid grid-cols-[1fr_auto] md:grid-cols-[13rem_1fr_4.5rem] items-center gap-x-4 gap-y-1.5">
            <span className={`col-span-2 md:col-span-1 font-mono text-[11px] tracking-wide ${bar.highlight ? "text-white" : "text-white/55"}`}>{bar.label}</span>
            <span className="relative h-2.5 rounded-full bg-white/[0.05]">
              <motion.span
                className={`absolute inset-y-0 left-0 rounded-full origin-left ${bar.highlight ? "bg-white" : "bg-white/35"}`}
                style={{ width: pct(bar.value) }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
              {reference && (
                <span aria-hidden="true" className="absolute -inset-y-1.5 border-l border-dashed border-white/40" style={{ left: pct(reference.value) }} />
              )}
            </span>
            <span className={`text-right font-mono text-xs tabular-nums ${bar.highlight ? "text-white" : "text-white/60"}`}>
              {bar.display ?? `${bar.value}${unit}`}
            </span>
          </li>
        ))}
      </ul>

      {reference && (
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-wide text-white/50">
          <span className="inline-block h-3 border-l border-dashed border-white/50" /> {reference.label}
        </div>
      )}
    </figure>
  );
}
