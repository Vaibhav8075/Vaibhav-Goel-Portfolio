// PAC-1DCNN clean macro-F1 (%) under each evaluation protocol, mixed-noise training where the protocol has it.
// Source: the project README tables, regenerated from results/ in Vaibhav8075/-Physics-Augmented-1D-CNN.
export const PROTOCOLS = [
  { id: "load", name: "Leave-one-load-out", data: "CWRU", f1: 99.9, readout: "Load held out · 99.9%" },
  { id: "size", name: "Defect size held out", data: "CWRU", f1: 44.8, readout: "Defect size held out · 44.8%" },
  { id: "p4", name: "New bearings", data: "Paderborn P4", f1: 39.9, chance: 33.3, readout: "New bearings (P4) · 39.9%" },
  { id: "p3", name: "Artificial → real damage", data: "Paderborn P3", f1: 35.1, chance: 30.4, readout: "Artificial → real (P3) · 35.1%" },
];
