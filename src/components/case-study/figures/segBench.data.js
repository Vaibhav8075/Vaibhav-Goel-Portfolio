// Test results from the README of Vaibhav8075/Semantic-Segmentation-for-Autonomous-Driving-: both models trained on
// 2,554 Cityscapes images, selected on 421 held-out-city images and tested once on the 500 official val images at
// full 1024x2048 resolution. Times are the model forward pass at 512x1024, FP16, on the RTX 5050 laptop GPU.

// The six classes and their colours, from CLASS_COLORS in config.py
export const CLASSES = [
  { id: "road", name: "Road", colour: "rgb(128, 64, 128)" },
  { id: "vehicle", name: "Vehicle", colour: "rgb(0, 0, 142)" },
  { id: "pedestrian", name: "Pedestrian", colour: "rgb(220, 20, 60)" },
  { id: "sidewalk", name: "Sidewalk", colour: "rgb(244, 35, 232)" },
  { id: "sign", name: "Traffic sign", colour: "rgb(220, 220, 0)" },
  { id: "background", name: "Background", colour: "rgb(70, 70, 70)" },
];

export const SCENARIOS = [
  { id: "deeplab", name: "DeepLabV3+", params: 40.3, miou: 0.825, pixelAcc: 95.5, ms: 21, fps: 48, iou: [94.1, 90.9, 77.2, 73.0, 67.2, 92.7] },
  { id: "segformer", name: "SegFormer-B2", params: 27.4, miou: 0.833, pixelAcc: 95.9, ms: 35, fps: 28, iou: [94.6, 91.0, 78.0, 75.2, 68.0, 93.2] },
].map((scenario) => ({ ...scenario, readout: `${scenario.name} · ${scenario.miou.toFixed(3)} mIoU · ${scenario.ms} ms` }));
