import TourFigure from "./TourFigure";
import "./figures/ledgerBench.css";
import { svg, geometry } from "./figures/ledgerBench.generated.js";
import { SCENARIOS } from "./figures/ledgerBench.data.js";
import { STEPS } from "./figures/ledgerBench.steps.js";
import { mountLedgerBench } from "./figures/ledgerBench.live.js";

const KEYS = [
  { mark: "raised", label: "Gates: Spoof Guard's four checks, in order" },
  { mark: "lit", label: "Notes: ₹500 a stack; the EMI reserve stays locked" },
  { mark: "dashed", label: "Event lines: claims to the gates, bills to the drawer" },
];

const mount = (figure, kit) => {
  const bench = mountLedgerBench(figure, { geometry, scenarios: SCENARIOS, kit });
  return {
    stop: bench,
    hooks: {
      start: () => bench.setMode({ tour: false, hover: false }),
      stop: () => bench.setMode({ tour: true, hover: true }),
      step: (step) => step.scenario !== undefined && bench.choose(step.scenario),
    },
  };
};

// The Agentic Ledger study's figure: a merchant's counter, the supervisor that routes each event, Spoof
// Guard's four gates and the EMI-safe cash drawer. Art: scripts/figures/ledger-bench.mjs
export default function LedgerBench() {
  return (
    <TourFigure
      svg={svg}
      geometry={geometry}
      steps={STEPS}
      mount={mount}
      title="Trust at the counter"
      hint="Hover, tap or use arrow keys"
      readout={SCENARIOS[0].readout}
      label="Event: arrow keys step through four payment claims and three supplier bills"
      keys={KEYS}
      caption="Every verdict and payment plan is computed with the project's own rules: the sandbox's four spoof checks and the guardrail that never touches the EMI reserve. Claim amounts and the ₹2,500 and ₹12,000 bills are examples; the ₹4,500 bill is the project's demo."
    />
  );
}
