import { useEffect, useRef, useState } from "react";
import { dotsSvg, iso, lineOnTop, lineSvg, pathOf, ring, screenRise, translateAlong, wireSvg } from "../../lib/iso/iso-kit.mjs";
import "../../lib/iso/iso.css";
import "./figures/protocolBench.tour.css";
import { svg, geometry, running } from "./figures/protocolBench.generated.js";
import { PROTOCOLS } from "./figures/protocolBench.data.js";
import { STEPS } from "./figures/protocolBench.steps.js";
import { mountProtocolBench } from "./figures/protocolBench.live.js";
import { mountTour } from "./figures/protocolBench.tour.js";

const first = PROTOCOLS[0];
const kit = { iso, pathOf, wireSvg, lineSvg, dotsSvg, ring, translateAlong, screenRise };

function Swatch({ mark }) {
  return (
    <svg className="iso-swatch" data-mark={mark} viewBox="0 0 16 10" aria-hidden="true">
      <path d="M1.5 5h13" />
    </svg>
  );
}

// Interactive isometric figure (drawn with the Anatomy kit): a motor test bench wired to a classifier
// whose macro-F1 needle falls as the evaluation protocol gets stricter. The art is pre-built by
// scripts/figures/protocol-bench.mjs; this component mounts the live motion and the guided tour on it.
export default function ProtocolBench() {
  const figure = useRef(null);
  const panel = useRef(null);
  const tour = useRef(null);
  const [touring, setTouring] = useState(false);

  useEffect(() => {
    const bench = mountProtocolBench(figure.current, { geometry, protocols: PROTOCOLS, lineOnTop });
    tour.current = mountTour({ figure: figure.current, panel: panel.current, geometry, running, steps: STEPS, bench, kit });
    return () => {
      tour.current.destroy();
      bench();
    };
  }, []);

  const begin = () => {
    setTouring(true);
    tour.current.start(0);
  };
  const end = () => {
    setTouring(false);
    tour.current.stop();
  };

  return (
    <figure ref={figure} className="iso iso-figure pb-figure" data-theme="dark" style={{ "--anatomy-mono": "var(--font-mono)" }}>
      <div className="iso-plate" style={{ boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)" }}>
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">Fig 1</span>
          <span className="iso-plate-corner" data-corner="title">Same model, stricter test</span>
          <span className="iso-plate-corner" data-corner="hint">{touring ? "Guided tour" : "Hover, tap or use arrow keys"}</span>
          <span className="iso-plate-corner" data-corner="readout" data-readout="">{first.readout}</span>
        </div>
        <div
          className="iso-stage"
          tabIndex={0}
          role="slider"
          aria-label="Test protocol: arrow keys move the selector from the most lenient to the strictest test"
          aria-valuemin={1}
          aria-valuemax={PROTOCOLS.length}
          aria-valuenow={1}
          aria-valuetext={`${first.name}, ${first.data}: macro-F1 ${first.f1}%`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      <div ref={panel} className="pb-tour" hidden={!touring} aria-live="polite" style={{ marginTop: 12 }}>
        <span className="pb-count" />
        <h4 className="pb-title" />
        <p className="pb-text" />
        <div className="pb-bar"><span /></div>
        <div className="pb-controls">
          <button type="button" data-back>Back</button>
          <button type="button" data-play>Pause</button>
          <button type="button" data-next>Next</button>
          <button type="button" data-close onClick={end}>Close tour</button>
        </div>
        <div className="pb-dots" />
      </div>
      <figcaption className="iso-legend">
        {!touring && (
          <button type="button" className="pb-start" onClick={begin}>
            Take the guided tour · {STEPS.length} steps
          </button>
        )}
        <span className="iso-keys">
          <span className="iso-key"><Swatch mark="lit" />Needle: PAC-1DCNN&apos;s clean macro-F1</span>
          <span className="iso-key"><Swatch mark="raised" />Selector: four test protocols, each stricter than the last</span>
          <span className="iso-key"><Swatch mark="dashed" />Cables: drive-end and fan-end vibration channels</span>
          <span className="iso-key"><Swatch mark="red" />Tray: healthy, inner-race, ball and outer-race bearings; red marks the damage</span>
        </span>
        <span className="iso-caption">
          Every needle position is a saved result. Holding out one motor load still tests on bearings the model has
          already seen, so it scores 99.9. Holding out a whole defect size, or testing on new Paderborn bearings, drops
          it to 44.8, 39.9 and 35.1, close to random guessing (33.3% on P4, 30.4% on P3). The tour opens the motor and
          the classifier to show what is inside.
        </span>
      </figcaption>
    </figure>
  );
}
