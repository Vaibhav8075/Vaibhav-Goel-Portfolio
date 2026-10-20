import { useLayoutEffect, useRef, useState } from "react";
import "../../lib/iso/iso.css";
import "./figures/tour.css";
import { kit } from "./figures/kit.js";
import { mountTour } from "./figures/tour.js";

function Swatch({ mark }) {
  return (
    <svg className="iso-swatch" data-mark={mark} viewBox="0 0 16 10" aria-hidden="true">
      <path d="M1.5 5h13" />
    </svg>
  );
}

// An interactive isometric figure (drawn with the Anatomy kit) in its card, with a guided tour under it.
// `mount(figure, kit)` starts the figure's live motion and returns { stop, hooks } for the tour.
// The drawing is inserted in a layout effect rather than with dangerouslySetInnerHTML: a re-render (starting
// the tour) made React write it again, which left the live code holding a detached copy.
export default function TourFigure({ svg, geometry, steps, mount, title, hint, readout, label, keys, caption }) {
  const figure = useRef(null);
  const stage = useRef(null);
  const panel = useRef(null);
  const tour = useRef(null);
  const [touring, setTouring] = useState(false);

  useLayoutEffect(() => {
    stage.current.innerHTML = svg;
    const { stop, hooks } = mount(figure.current, kit);
    tour.current = mountTour({ figure: figure.current, panel: panel.current, geometry, steps, kit, hooks });
    return () => {
      tour.current.destroy();
      stop();
    };
  }, [svg, geometry, steps, mount]);

  const begin = () => {
    setTouring(true);
    tour.current.start(0);
  };
  const end = () => {
    setTouring(false);
    tour.current.stop();
  };

  return (
    <figure ref={figure} className="iso iso-figure tour-figure" data-theme="dark" style={{ "--anatomy-mono": "var(--font-mono)" }}>
      <div className="iso-plate" style={{ boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)" }}>
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">Fig 1</span>
          <span className="iso-plate-corner" data-corner="title">{title}</span>
          <span className="iso-plate-corner" data-corner="hint">{touring ? "Guided tour" : hint}</span>
          <span className="iso-plate-corner" data-corner="readout" data-readout="">{readout}</span>
        </div>
        <div ref={stage} className="iso-stage" tabIndex={0} role="slider" aria-label={label} aria-valuemin={1} aria-valuemax={4} aria-valuenow={1} />
      </div>
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
        <span className="iso-keys">
          {keys.map((key) => (
            <span key={key.label} className="iso-key"><Swatch mark={key.mark} />{key.label}</span>
          ))}
        </span>
        <span className="iso-caption">{caption}</span>
      </figcaption>
    </figure>
  );
}
