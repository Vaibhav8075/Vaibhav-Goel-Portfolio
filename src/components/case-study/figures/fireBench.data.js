// The receiver's safety rules, ported from rule_override() in "ML IOT/Code part/sensor_receiver.py"
// (Vaibhav8075/IOT-ML-Project). They run in this order and the first match overrides the Random Forest.
// "smoke" is the LDR reading: the board has no PM2.5 sensor, so the receiver feeds ldr_adc in its place.
export const RULES = [
  {
    label: "FIRE",
    reason: "Confirmed fire: flame, temperature, smoke and CO",
    test: (r) => r.flame === 1 && r.temp > 80 && r.smoke > 2500 && r.co > 2000,
  },
  {
    label: "FIRE",
    reason: "Flame plus LDR flicker",
    test: (r) => r.flame === 1 && r.flicker > 400,
  },
  {
    label: "NORMAL",
    reason: "Cooking heuristic: suppressed",
    test: (r) => r.smoke > 600 && r.hum > 55 && r.co < 500 && r.flame === 0 && r.temp < 70,
  },
  {
    label: "WARNING",
    reason: "Smouldering: CO and smoke, no flame yet",
    test: (r) => r.co > 1500 && r.smoke > 1200 && r.flame === 0 && r.temp > 45,
  },
];

// The index of the first rule that fires, or -1 when the forest decides
export const firstRule = (reading) => RULES.findIndex((rule) => rule.test(reading));

// Clean air is the reading logged in the project README (the receiver answered NORMAL, reason "ML").
// The other three are example readings chosen to meet a rule; they were not measured.
export const SCENARIOS = [
  { id: "air", name: "Clean air", reading: { temp: 28.5, hum: 54, co: 420, smoke: 2954, flicker: 2.3, flame: 0 }, forest: "NORMAL" },
  { id: "cooking", name: "Cooking smoke", reading: { temp: 32, hum: 68, co: 300, smoke: 900, flicker: 3, flame: 0 } },
  { id: "smoulder", name: "Smouldering", reading: { temp: 52, hum: 40, co: 1800, smoke: 1500, flicker: 4, flame: 0 } },
  { id: "flame", name: "Open flame", reading: { temp: 40, hum: 35, co: 600, smoke: 1800, flicker: 520, flame: 1 } },
].map((scenario) => {
  const rule = firstRule(scenario.reading);
  const label = rule >= 0 ? RULES[rule].label : scenario.forest;
  const by = rule >= 0 ? `rule ${rule + 1}` : "forest";
  return { ...scenario, rule, label, readout: `${scenario.name} · ${by} · ${label}` };
});

// Which sensor's LED lights for a reading: the conditions the rules look at
export const LEDS = {
  dht22: (r) => r.temp > 45 || r.hum > 55,
  mq7: (r) => r.co > 1500,
  flame: (r) => r.flame === 1,
  ldr: (r) => r.flicker > 400,
};
