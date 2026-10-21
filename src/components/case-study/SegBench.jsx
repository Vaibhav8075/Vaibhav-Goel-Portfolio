import TourFigure from "./TourFigure";
import "./figures/segBench.css";
import { svg, geometry } from "./figures/segBench.generated.js";
import { CLASSES, SCENARIOS } from "./figures/segBench.data.js";
import { STEPS } from "./figures/segBench.steps.js";
import { mountSegBench } from "./figures/segBench.live.js";

const KEYS = [
  { mark: "raised", label: "Cylinders: one per class, filled to its test IoU" },
  { mark: "lit", label: "Dial: forward pass per image, 0 to 40 ms" },
  { mark: "dotted", label: "Pixels: sorted from the chute into their class" },
];

const mount = (figure, kit) => {
  const bench = mountSegBench(figure, { geometry, scenarios: SCENARIOS, classes: CLASSES, kit });
  return {
    stop: bench,
    hooks: {
      start: () => bench.setMode({ tour: false, hover: false }),
      stop: () => bench.setMode({ tour: true, hover: true }),
      step: (step) => step.scenario !== undefined && bench.choose(step.scenario),
    },
  };
};

// The Road Scene Segmentation study's figure: a road diorama and camera, the segmentation unit with its two model
// cartridges, and six class cylinders filled to each class's measured test IoU. Art: scripts/figures/seg-bench.mjs
export default function SegBench() {
  return (
    <TourFigure
      svg={svg}
      geometry={geometry}
      steps={STEPS}
      mount={mount}
      title="Every pixel sorted"
      hint="Hover, tap or use arrow keys"
      readout={SCENARIOS[0].readout}
      label="Model: arrow keys switch between DeepLabV3+ and SegFormer-B2"
      keys={KEYS}
      caption="Every level is a measured result on the 500 held-out Cityscapes images, scored at full 1024×2048 resolution; times are the forward pass per 512×1024 image on the laptop GPU. The colours are the project's class colours."
    />
  );
}
