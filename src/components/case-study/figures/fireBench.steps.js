// Guided tour of the fire bench. `zones` light those parts (none = the whole bench), `open` lifts the decision
// unit's lid, `scenario` sets the knob. Rules and inputs follow sensor_receiver.py; model facts follow the README.
const CHAIN = ["booth", "mq7", "dht22", "flame", "ldr", "rules", "lamps"];

export const STEPS = [
  {
    title: "What this bench is about",
    zones: [],
    scenario: 0,
    text: "Most fire alarms react to one signal, so cooking smoke, steam or dust can set them off. This project reads several sensors at once and labels the room NORMAL, WARNING or FIRE. The bench shows the whole path, from the test booth on the left to the decision unit on the right.",
  },
  {
    title: "The test booth",
    zones: ["booth"],
    text: "The booth holds whatever the sensors are sensing. The tour tries four scenarios on the burner: clean air, cooking smoke, a smouldering log and an open flame. The clean-air reading is the one logged in the project README; the other three are example readings chosen to meet a rule, not measurements.",
  },
  {
    title: "The board: an ESP32-S3",
    zones: ["board", "esp32"],
    text: "An ESP32-S3 N8R8 reads every sensor. Its analog sensors use ADC1 pins only, because ADC2 clashes with Wi-Fi on this chip. The empty header at the front is where the PMS7003 particulate sensor will go; it is not fitted yet.",
  },
  {
    title: "Five sensors",
    zones: ["mq7", "dht22", "flame", "pir", "ldr"],
    text: "The MQ-7 can measures carbon monoxide, the grilled DHT22 box temperature and humidity, the bar of five LEDs is the infrared flame sensor, the dome is a PIR motion sensor for context, and the small disc is an LDR whose flicker gives a flame away. A sensor's red LED lights when its reading meets a rule threshold.",
  },
  {
    title: "Warming up the MQ-7",
    zones: ["mq7"],
    text: "The MQ-7 needs 90 seconds to warm up and reads unreliably until then, so while it warms the receiver treats carbon monoxide as zero.",
  },
  {
    title: "A reading every 2 seconds",
    zones: ["wifi", "esp32", "mast"],
    text: "Every 2 seconds the board sends one JSON reading over Wi-Fi: temperature, humidity, CO, the LDR level and its flicker, flame, motion, and whether the MQ-7 has warmed up. A Flask receiver on the laptop decides, logs each result to CSV, and a Dash dashboard (not drawn) redraws the readings.",
  },
  {
    title: "Inside the decision unit",
    zones: ["decider", "rules", "lamps", "selector", "mast"],
    open: "lid",
    text: "With the lid off you see the forest: the Random Forest, drawn as 30 trees that each stand for ten of the 300 the README describes, trained with balanced class weights on 367,550 rows from two lab datasets of indoor fire experiments. The receiver reads its vote as fire or no fire.",
  },
  {
    title: "What the forest listens to",
    zones: ["decider"],
    open: "lid",
    text: "Five rails feed the forest, each as wide as that input's importance in the README: PM2.5 smoke 46.6%, H₂ 26.6%, CO 13.8%, temperature 6.8% and humidity 6.2%. This board has no PM2.5 or H₂ sensor, so the receiver feeds the LDR reading in as PM2.5 and the CO reading in again as H₂.",
  },
  {
    title: "Rules before the forest",
    zones: ["rules"],
    text: "Four safety rules from the receiver are checked first, in order, and the first that matches overrides the forest (here 'smoke' is the LDR reading). 1: flame, over 80 °C, smoke over 2500 and CO over 2000 is FIRE. 2: flame plus LDR flicker over 400 is FIRE. 3: smoke over 600, humidity over 55%, CO under 500, no flame and under 70 °C is cooking, kept NORMAL. 4: CO over 1500 and smoke over 1200 above 45 °C with no flame is smouldering, a WARNING.",
  },
  {
    title: "Clean air",
    zones: CHAIN,
    scenario: 0,
    text: "The README's logged reading: 28.5 °C, 54% humidity, CO 420 while the MQ-7 was still warming up, LDR 2954, flicker 2.3 and no flame. No rule matches, so the forest decides, and the receiver answered NORMAL.",
  },
  {
    title: "Cooking smoke",
    zones: CHAIN,
    scenario: 1,
    text: "Steam from the pan pushes humidity to 68% while CO stays at 300 and there is no flame. Rule 3 matches, so the receiver treats it as cooking and keeps the room NORMAL instead of raising a false alarm.",
  },
  {
    title: "Smouldering",
    zones: CHAIN,
    scenario: 2,
    text: "A smouldering log gives CO 1800 and a smoke reading of 1500 at 52 °C, with no flame yet. Rule 4 matches: WARNING, before anything burns openly.",
  },
  {
    title: "Open flame",
    zones: CHAIN,
    scenario: 3,
    text: "A flame trips the infrared sensor and makes the LDR flicker (520). Rule 2 matches: FIRE, whatever the forest says.",
  },
  {
    title: "Results, and what is next",
    zones: [],
    scenario: 3,
    text: "The README reports 94.93% test accuracy, 98% fire recall and 99% no-fire precision, measured on lab data rather than on readings from this board. Next: fit the PMS7003, collect labelled readings from this hardware and retrain on them, and automate the buzzer, a relay-driven fan or pump, and SIM800L SMS alerts.",
  },
];
