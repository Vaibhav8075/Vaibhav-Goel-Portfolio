import TourFigure from "./TourFigure";
import "./figures/auditBench.css";
import { svg, geometry } from "./figures/auditBench.generated.js";
import { SCENARIOS } from "./figures/auditBench.data.js";
import { STEPS } from "./figures/auditBench.steps.js";
import { mountAuditBench } from "./figures/auditBench.live.js";

const KEYS = [
  { mark: "lit", label: "Key: the role trying to play the call" },
  { mark: "red", label: "Dial: days since upload; red is the retention limit" },
  { mark: "raised", label: "Drawer: records kept permanently" },
];

const mount = (figure, kit) => {
  const bench = mountAuditBench(figure, { geometry, scenarios: SCENARIOS, kit });
  return {
    stop: bench,
    hooks: {
      start: () => bench.setMode({ tour: false, hover: false }),
      stop: () => bench.setMode({ tour: true, hover: true }),
      step: (step) => step.scenario !== undefined && bench.choose(step.scenario),
    },
  };
};

// The Call Audit Platform study's figure: the Groq unit, a records cabinet with a locked audio bay and a permanent
// file, the role keys, the access log, the HOD's stamp and the server rack. Art: scripts/figures/audit-bench.mjs
export default function AuditBench() {
  return (
    <TourFigure
      svg={svg}
      geometry={geometry}
      steps={STEPS}
      mount={mount}
      title="Locked audio, permanent records"
      hint="Hover, tap or use arrow keys"
      readout={SCENARIOS[0].readout}
      label="Scenario: arrow keys step through who is trying to play a call, and what happens after the retention period"
      keys={KEYS}
      caption="Each result follows the platform's own streaming checks, in their order: an agent may only play their own calls (403 otherwise), expired audio is gone for everyone (410), and every successful play is logged. The 7-day retention is the example setting; admins can change it."
    />
  );
}
