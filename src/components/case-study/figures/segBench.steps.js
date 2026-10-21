// Guided tour of the segmentation bench. `zones` light those parts (none = the whole bench), `open` lifts the
// unit's lid, `scenario` picks the model. Every number follows the project README and config.py.
export const STEPS = [
  {
    title: "What this bench is about",
    zones: [],
    scenario: 1,
    text: "A self-driving stack has to know what every pixel in front of it is. This project labels each pixel of a road scene as one of six classes, compares segmentation models fairly in one pipeline, and reports honest numbers on images the models never saw.",
  },
  {
    title: "The road scene",
    zones: ["scene", "camera"],
    text: "The camera stands for the Cityscapes street images. Thirty-odd Cityscapes labels are merged into six classes: road (lane markings included), vehicle (car, truck, bus, caravan, trailer, train, motorcycle, bicycle), pedestrian (person, rider), sidewalk, traffic sign (signs and lights) and background (buildings, vegetation, sky, poles and the rest). Cityscapes has no lane-marking labels, so there is no lane class.",
  },
  {
    title: "Fix the data before the model",
    zones: ["scene"],
    text: "An audit found that the masks were being remapped twice, which silently scrambled two classes, so an earlier 0.89 mIoU was meaningless and was withdrawn. Now the label mapping lives in one place and runs once, void pixels are ignored by the loss and every metric, and 17 tests keep it that way.",
  },
  {
    title: "Honest splits",
    zones: ["scene", "unit"],
    text: "Cityscapes' test labels are not public, so 2,554 training images (the official train set minus four cities) train the models, 421 images from those four held-out cities pick the best epoch, and the 500 official validation images are the test set, used once and scored at full 1024×2048 resolution.",
  },
  {
    title: "Inside the unit",
    zones: ["unit", "models"],
    open: "unit",
    text: "Every model takes an image's three colour channels (red, green, blue) and returns six class maps of the same size, one score per class per pixel; each pixel takes the highest. Training uses cross-entropy plus Dice plus Focal loss (γ = 2), so the rare classes count, with AdamW, mixed precision, a warmup then cosine schedule, early stopping and 512×512 crops.",
  },
  {
    title: "Two models on Cityscapes",
    zones: ["models", "unit"],
    text: "Two cartridges fit the unit. DeepLabV3+ is a dilated ResNet50 with ASPP, which looks at each spot at three dilation rates, 6, 12 and 18 (the rings); 40.3 million parameters. SegFormer-B2 is an ImageNet-pretrained Mix Transformer with an all-MLP decoder, built in four stages (the steps); 27.4 million. U-Net and ResNet50-UNet are in the pipeline too, tested on synthetic scenes only.",
  },
  {
    title: "DeepLabV3+",
    zones: ["models", "unit", "bins"],
    scenario: 0,
    text: "On the 500 test images DeepLabV3+ reaches 0.825 mIoU and 95.5% pixel accuracy, at 21 ms per 512×1024 image on the laptop GPU (about 48 frames a second). Each cylinder is filled to its class's IoU: how much the predicted and true pixels of that class overlap.",
  },
  {
    title: "SegFormer-B2",
    zones: ["models", "unit", "bins"],
    scenario: 1,
    text: "SegFormer-B2 reaches 0.833 mIoU and 95.9% pixel accuracy, and is better on every class with fewer parameters, at about 1.7 times the cost: 35 ms per image, about 28 frames a second.",
  },
  {
    title: "The hard classes",
    zones: ["bins"],
    scenario: 1,
    text: "Road (0.946), background (0.932) and vehicles (0.910) fill nearly to the top. Pedestrians (0.780) and traffic signs (0.680) are far lower because they cover few pixels and are often far away, and sidewalk (0.752) is the main confusion with road, since their edge is often only a kerb.",
  },
  {
    title: "Explain and deploy",
    zones: ["unit", "camera"],
    scenario: 1,
    text: "Grad-CAM shows which parts of the image each class's prediction rests on. Both models export to ONNX and match PyTorch on 100% of pixels; on the CPU build of ONNX Runtime a 512×1024 image takes about 0.4 s with DeepLabV3+ and 1.0 s with SegFormer-B2. A Streamlit app runs it on images, video and a live webcam.",
  },
  {
    title: "What the numbers are not",
    zones: [],
    scenario: 1,
    text: "These are six-class scores. The public Cityscapes leaderboard uses 19 classes, and merging classes such as all vehicles into one makes the task easier, so the two cannot be compared.",
  },
];
