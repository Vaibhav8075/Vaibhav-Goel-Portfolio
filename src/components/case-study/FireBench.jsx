import TourFigure from "./TourFigure";
import "./figures/fireBench.css";
import { svg, geometry } from "./figures/fireBench.generated.js";
import { LEDS, SCENARIOS } from "./figures/fireBench.data.js";
import { STEPS } from "./figures/fireBench.steps.js";
import { mountFireBench } from "./figures/fireBench.live.js";

const KEYS = [
  { mark: "raised", label: "Levers: the four safety rules, checked before the forest" },
  { mark: "red", label: "Lamps: normal, warning, fire" },
  { mark: "dotted", label: "Wi-Fi: one reading every 2 seconds" },
];

const mount = (figure, kit) => {
  const bench = mountFireBench(figure, { geometry, scenarios: SCENARIOS, leds: LEDS, kit });
  return {
    stop: bench,
    hooks: {
      start: () => bench.setMode({ tour: false, hover: false }),
      stop: () => bench.setMode({ tour: true, hover: true }),
      step: (step) => step.scenario !== undefined && bench.choose(step.scenario),
    },
  };
};

// The IoT Fire Detection study's figure: a test booth, the ESP32-S3 sensor board and a decision unit whose
// four rule levers can override the Random Forest. Art: scripts/figures/fire-bench.mjs
export default function FireBench() {
  return (
    <TourFigure
      svg={svg}
      geometry={geometry}
      steps={STEPS}
      mount={mount}
      title="Rules before the forest"
      hint="Hover, tap or use arrow keys"
      readout={SCENARIOS[0].readout}
      label="Scenario: arrow keys step through clean air, cooking smoke, smouldering and an open flame"
      keys={KEYS}
      caption="The four rules are the ones in the receiver code, checked in order before the Random Forest; when none fires, the forest's fire / no-fire vote decides. Clean air is the reading logged in the project README; the other scenarios use example readings chosen to meet a rule. The tour lifts the lid off the forest."
    />
  );
}
