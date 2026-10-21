import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import useMediaQuery from "../../lib/useMediaQuery";
import usePrefersReducedMotion from "../../lib/usePrefersReducedMotion";
import { smoothScrollTo } from "../../lib/scroll";
import "../../lib/iso/iso.css";
import "./figures/tour.css";
import { kit } from "./figures/kit.js";
import { mountTour } from "./figures/tour.js";

// Scroll distance each tour step gets while the figure is pinned
const STEP_VH = 40;

function Swatch({ mark }) {
  return (
    <svg className="iso-swatch" data-mark={mark} viewBox="0 0 16 10" aria-hidden="true">
      <path d="M1.5 5h13" />
    </svg>
  );
}

// An interactive isometric figure (drawn with the Anatomy kit) with a guided tour.
// On desktop the figure pins beside the step text and scrolling plays the tour, one step per slice of the
// pinned range, so the last step shows before it unpins. On phones and with reduced motion the figure stays
// interactive and a button starts the tour under it.
// `mount(figure, kit)` starts the figure's live motion and returns { stop, hooks } for the tour.
// The drawing is inserted in a layout effect rather than with dangerouslySetInnerHTML: a re-render made React
// write it again, which left the live code holding a detached copy.
export default function TourFigure({ svg, geometry, steps, mount, title, hint, readout, label, keys, caption }) {
  const isWide = useMediaQuery("(min-width: 768px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollytelling = isWide && !prefersReducedMotion;

  const container = useRef(null);
  const figure = useRef(null);
  const stage = useRef(null);
  const panel = useRef(null);
  const tour = useRef(null);
  const [touring, setTouring] = useState(false);
  const { scrollY } = useScroll();

  const scrollToStep = (index) => {
    const el = container.current;
    const scrollable = el.offsetHeight - window.innerHeight;
    smoothScrollTo(el.getBoundingClientRect().top + window.scrollY + ((index + 0.5) / steps.length) * scrollable);
  };

  useLayoutEffect(() => {
    stage.current.innerHTML = svg;
    const { stop, hooks } = mount(figure.current, kit);
    tour.current = mountTour({
      figure: figure.current,
      panel: panel.current,
      geometry,
      steps,
      kit,
      hooks,
      onDot: scrollytelling ? scrollToStep : undefined,
    });
    const observer = new IntersectionObserver(([entry]) => tour.current.setRunning(entry.isIntersecting), { rootMargin: "100px 0px" });
    if (scrollytelling) {
      tour.current.start(0, false);
      observer.observe(figure.current);
    }
    return () => {
      observer.disconnect();
      tour.current.destroy();
      stop();
    };
    // scrollToStep only reads refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svg, geometry, steps, mount, scrollytelling]);

  // Progress comes from the container's on-screen box at each scroll (useScroll's target offsets go stale)
  useMotionValueEvent(scrollY, "change", () => {
    if (!scrollytelling || !container.current || !tour.current) return;
    const rect = container.current.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
    const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    if (index !== tour.current.current()) tour.current.show(index);
  });

  const begin = () => {
    setTouring(true);
    tour.current.start(0);
  };
  const end = () => {
    setTouring(false);
    tour.current.stop();
  };

  const plate = (
    <div className="iso-plate" style={{ boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)" }}>
      <div className="iso-plate-corners" aria-hidden="true">
        <span className="iso-plate-corner" data-corner="fig">Fig 1</span>
        <span className="iso-plate-corner" data-corner="title">{title}</span>
        <span className="iso-plate-corner" data-corner="hint">{scrollytelling ? "Scroll to explore" : touring ? "Guided tour" : hint}</span>
        <span className="iso-plate-corner" data-corner="readout" data-readout="">{readout}</span>
      </div>
      <div ref={stage} className="iso-stage" tabIndex={0} role="slider" aria-label={label} aria-valuemin={1} aria-valuemax={4} aria-valuenow={1} />
    </div>
  );
  const legend = (
    <>
      <span className="iso-keys">
        {keys.map((key) => (
          <span key={key.label} className="iso-key"><Swatch mark={key.mark} />{key.label}</span>
        ))}
      </span>
      <span className="iso-caption">{caption}</span>
    </>
  );
  const theme = { "--anatomy-mono": "var(--font-mono)" };

  if (scrollytelling) {
    return (
      <div>
        <div ref={container} className="relative" style={{ height: `calc(${steps.length * STEP_VH}vh + 100vh)` }}>
          <div className="sticky top-24 h-[calc(100vh-8rem)] grid grid-cols-[minmax(0,5fr)_minmax(0,2fr)] gap-6 items-center">
            <figure ref={figure} className="iso iso-figure tour-figure tour-scrolly" data-theme="dark" style={theme}>
              {plate}
            </figure>
            <div ref={panel} className="iso tour-panel" data-theme="dark" aria-live="polite" style={theme}>
              <span className="tour-count" />
              <h4 className="tour-title" />
              <p className="tour-text" />
              <div className="tour-dots" />
              <p className="tour-note">Keep scrolling to move through the tour, or pick a step.</p>
            </div>
          </div>
        </div>
        <div className="iso iso-legend" data-theme="dark" style={theme}>{legend}</div>
      </div>
    );
  }

  return (
    <figure ref={figure} className="iso iso-figure tour-figure" data-theme="dark" style={theme}>
      {plate}
      <div ref={panel} className="tour-panel" hidden={!touring} aria-live="polite" style={{ marginTop: 12 }}>
        <span className="tour-count" />
        <h4 className="tour-title" />
        <p className="tour-text" />
        <div className="tour-bar"><span /></div>
        <div className="tour-controls">
          <button type="button" data-back>Back</button>
          <button type="button" data-play>Pause</button>
          <button type="button" data-next>Next</button>
          <button type="button" data-close onClick={end}>Close tour</button>
        </div>
        <div className="tour-dots" />
      </div>
      <figcaption className="iso-legend">
        {!touring && (
          <button type="button" className="tour-start" onClick={begin}>
            Take the guided tour · {steps.length} steps
          </button>
        )}
        {legend}
      </figcaption>
    </figure>
  );
}
