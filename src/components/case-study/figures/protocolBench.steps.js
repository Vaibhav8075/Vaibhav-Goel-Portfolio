// Guided walkthrough for the protocol bench explainer page. `zones` light up those parts of the figure
// (none = the whole bench); `protocol` moves the selector. Facts follow the project README and case study.
export const STEPS = [
  {
    title: "What this bench is about",
    zones: [],
    protocol: 0,
    text: "The project asks one question: can a 1D-CNN tell what is wrong with a ball bearing from its vibration alone, and does it still work on a bearing it has never seen? This bench is a drawing of that experiment. Each step lights up one part of it.",
  },
  {
    title: "The motor and the load",
    zones: ["motor", "load"],
    text: "The motor is running (watch the bolts on the coupling turn). It spins a shaft that runs in ball bearings, and through the coupling it drives the load unit, which brakes the shaft to set how hard the motor works. The CWRU dataset was recorded at four motor loads: 0, 1, 2 and 3 horsepower.",
  },
  {
    title: "Inside the motor",
    zones: ["motor", "sensors"],
    open: "motor",
    text: "With the top half lifted off you can watch it run, slowed right down. The rotor spins inside the stator (the striped bands), the fan turns on the far end, and at each end of the shaft a ring of balls rolls round between two races. The bright bearing is the drive end: the CWRU recordings this project uses are its drive-end fault data. Each time a ball rolls over the damaged spot (red) it knocks, and the red ring is that knock spreading out. The knocks repeat at a rate set by the bearing's geometry and the shaft speed, and the sensors on the casing pick them up.",
  },
  {
    title: "Four kinds of bearing",
    zones: ["tray"],
    text: "Every recording comes from one of four bearing conditions, and these are the classes the model must tell apart: healthy, inner-race fault, ball fault and outer-race fault (the tray, left to right; red marks the damage). Each time a ball rolls over damage it knocks, and the knocks repeat at a rate that depends on where the damage is.",
  },
  {
    title: "Two vibration sensors",
    zones: ["sensors", "cables"],
    text: "Two accelerometers measure the shaking: one at the drive end of the motor and one at the fan end. So the model receives two signals at the same time, like the two channels of a stereo recording.",
  },
  {
    title: "Cutting the signal into windows",
    zones: ["conditioner", "cables"],
    text: "The signal box stands for the preprocessing. Each signal is cut into windows of 1024 samples at 12 kHz, about 85 milliseconds each, and every recording is low-passed to 3.6 kHz. That removes two hidden shortcuts that gave the healthy class away: leftovers from resampling its 48 kHz recordings, and an electrical interference line near 4.2 kHz.",
  },
  {
    title: "The classifier: PAC-1DCNN",
    zones: ["instrument", "selector", "dial"],
    text: "The instrument stands for the model. It takes the windows from the signal box, decides which class each one belongs to, and its score over the test windows shows on the dial. Next, the lid comes off.",
  },
  {
    title: "Inside the classifier",
    zones: ["instrument", "selector", "dial"],
    open: "lid",
    text: "The board is the model, laid out in the order the signal travels, right to left. The input takes the 2 channels. The back path goes through the fixed filter (its 11 dots are the 11-sample moving average it subtracts, a high-pass at about 660 Hz) into stream 1, whose 5 fins stand for a kernel of 5. The front path skips the filter into stream 2, whose 15 fins stand for a kernel of 15. The fusion block merges both into 128 channels, the attention block weights the most useful features and time steps, and the head ends in 4 lamps, one per class. A temperature fitted after training calibrates how confident it is.",
  },
  {
    title: "What the dial reads",
    zones: ["dial"],
    text: "The dial shows macro-F1 from 0 to 100. F1 for one class combines how many of that class's windows the model finds and how many of its guesses for that class are right. Macro-F1 averages it over the classes, so every class counts equally. Each needle position is a saved result on clean test data, with no added noise.",
  },
  {
    title: "The selector changes the exam, not the model",
    zones: ["selector"],
    text: "The knob never touches the model. It picks how the data is split into training and test windows, and that decides how hard the exam is. Its four positions are marked with one to four dots, and each one is stricter than the one before.",
  },
  {
    title: "Position 1: leave one load out",
    zones: ["selector", "dial"],
    protocol: 0,
    text: "Train on three motor loads and test on the fourth. It sounds fair, but CWRU recorded every faulty bearing at all four loads, so the test windows come from bearings the model already saw in training. The needle reads 99.9: near perfect, and misleading.",
  },
  {
    title: "Position 2: defect size held out",
    zones: ["selector", "dial", "tray"],
    protocol: 1,
    text: "Now a whole defect size (0.007, 0.014 or 0.021 inch) is kept out of training, so the faulty test bearings are ones the model has never seen. The needle falls to 44.8. Inner-race and outer-race faults of an unseen size are mostly given the wrong fault type.",
  },
  {
    title: "Position 3: new bearings (Paderborn P4)",
    zones: ["selector", "dial"],
    protocol: 2,
    text: "A second dataset, from Paderborn University, has five separate bearings per class, with three classes: healthy, inner ring and outer ring. Three bearings per class train the model and the other two test it, so every test bearing is a different physical part. The needle reads 39.9; random guessing scores 33.3.",
  },
  {
    title: "Position 4: artificial to real damage (P3)",
    zones: ["selector", "dial"],
    protocol: 3,
    text: "The hardest exam: train only on bearings with artificially made damage, then test on bearings with real damage. The needle reads 35.1, against 30.4 for random guessing.",
  },
  {
    title: "What it all means",
    zones: [],
    protocol: 3,
    text: "Under the lenient exam every model scores at least 99.8%. Once the test bearings are truly new, the networks fall close to chance: they learned to recognise individual bearings, not fault patterns that carry over. Simpler methods, such as a Random Forest on envelope-spectrum features, did as well or better. The honest finding is that the test design decides the score.",
  },
];
