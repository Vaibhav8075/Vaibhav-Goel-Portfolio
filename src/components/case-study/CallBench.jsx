import TourFigure from "./TourFigure";
import "./figures/callBench.css";
import { svg, geometry } from "./figures/callBench.generated.js";
import { SCENARIOS } from "./figures/callBench.data.js";
import { STEPS } from "./figures/callBench.steps.js";
import { mountCallBench } from "./figures/callBench.live.js";

const KEYS = [
  { mark: "raised", label: "Combs: the four intent rules, checked in order" },
  { mark: "lit", label: "Gauge: the sentiment the keywords give" },
  { mark: "dashed", label: "Gate: AI verdict, or the rules if the AI fails" },
];

const mount = (figure, kit) => {
  const bench = mountCallBench(figure, { geometry, scenarios: SCENARIOS, kit });
  return {
    stop: bench,
    hooks: {
      start: () => bench.setMode({ tour: false, hover: false }),
      stop: () => bench.setMode({ tour: true, hover: true }),
      step: (step) => step.scenario !== undefined && bench.choose(step.scenario),
    },
  };
};

// The Banking Call Intelligence study's figure: a call-analysis line from the API intake and Whisper, under the
// keyword combs, to the AI reviewer and the fallback gate. Art: scripts/figures/call-bench.mjs
export default function CallBench() {
  return (
    <TourFigure
      svg={svg}
      geometry={geometry}
      steps={STEPS}
      mount={mount}
      title="Rules first, AI review"
      hint="Hover, tap or use arrow keys"
      readout={SCENARIOS[0].readout}
      label="Call: arrow keys step through five example calls"
      keys={KEYS}
      caption="Intent, sentiment, priority, risk and masking are computed with the project's own keyword rules on example calls. What the AI reviewer would answer cannot be known in advance, so the figure only shows where its verdict goes, and what happens when it is unavailable."
    />
  );
}
