import TourFigure from "./TourFigure";
import { svg, geometry, running } from "./figures/protocolBench.generated.js";
import { PROTOCOLS } from "./figures/protocolBench.data.js";
import { STEPS } from "./figures/protocolBench.steps.js";
import { mountProtocolBench } from "./figures/protocolBench.live.js";
import { protocolBenchHooks } from "./figures/protocolBench.tour.js";

const KEYS = [
  { mark: "lit", label: "Needle: PAC-1DCNN's clean macro-F1" },
  { mark: "raised", label: "Selector: four test protocols, each stricter than the last" },
  { mark: "dashed", label: "Cables: drive-end and fan-end vibration channels" },
  { mark: "red", label: "Tray: healthy, inner-race, ball and outer-race bearings; red marks the damage" },
];

const mount = (figure, kit) => {
  const bench = mountProtocolBench(figure, { geometry, protocols: PROTOCOLS, lineOnTop: kit.lineOnTop });
  return { stop: bench, hooks: protocolBenchHooks({ figure, geometry, running, bench, kit }) };
};

// The 1D-CNN study's figure: a motor test bench wired to a classifier whose macro-F1 needle falls as the
// evaluation protocol gets stricter. Art: scripts/figures/protocol-bench.mjs
export default function ProtocolBench() {
  return (
    <TourFigure
      svg={svg}
      geometry={geometry}
      steps={STEPS}
      mount={mount}
      title="Same model, stricter test"
      hint="Hover, tap or use arrow keys"
      readout={PROTOCOLS[0].readout}
      label="Test protocol: arrow keys move the selector from the most lenient to the strictest test"
      keys={KEYS}
      caption="Every needle position is a saved result. Holding out one motor load still tests on bearings the model has already seen, so it scores 99.9. Holding out a whole defect size, or testing on new Paderborn bearings, drops it to 44.8, 39.9 and 35.1, close to random guessing (33.3% on P4, 30.4% on P3). The tour opens the motor and the classifier to show what is inside."
    />
  );
}
