// Long-form write-ups behind each project card, sourced from the project READMEs and the résumé.
// Flow layouts: `wide` is drawn left-to-right for desktop, `tall` top-to-bottom for phones.

export const caseStudies = {
  "agentic-ledger": {
    name: "Agentic Ledger",
    context: "Agent Labs Buildathon · Phinite × Paytm · AI for Small Businesses",
    started: "Sep 2026",
    problem: {
      lead: "Paytm's Soundbox and merchant tools work on the happy path. Two everyday edge cases still cost small merchants money and trust.",
      points: [
        "The silent Soundbox: a real payment lags on a congested 4G network, the speaker stays quiet, and the merchant can't tell it apart from a customer flashing a fake \"spoof\" payment app.",
        "The 4 PM liquidity crunch: a distributor wants ₹4,500 for today's stock, the balance is ₹0 and tomorrow's EMI locks the rest. A rule-based bank check declines, even though the evening rush would cover it.",
      ],
    },
    approach: [
      { title: "A supervisor that routes, not decides", text: "The Master Supervisor agent ingests Soundbox MQTT pings and WhatsApp webhooks and only classifies them: security events go to Spoof Guard, financial ones to the Supplier Ledger." },
      { title: "Spoof Guard in under 200 ms", text: "It checks the gateway hash on every payment. A missing hash pushes a fraud alert; a valid payment delayed by the network pushes \"payment safe, audio delayed\" instead." },
      { title: "Bills in, PII out", text: "The Supplier Ledger agent reads unstructured WhatsApp bills, masks bank account numbers and other PII with Phinite guardrails, and extracts the amount owed." },
      { title: "Underwrite on tonight's revenue, not today's balance", text: "The Liquidity Engine asks a PyTorch LSTM, trained on 400,000 MinMax-scaled rows of retail data, to forecast the evening's takings from transaction velocity. If the forecast covers the bill, the micro-loan is approved automatically." },
      { title: "Bank rails that fail safely", text: "A FastAPI service simulates the bank with idempotency keys, 504-timeout handling and double-debit protection, a Streamlit app stands in for the merchant's phone, and Docker Compose runs it all." },
    ],
    architecture: {
      caption: "Follow a vendor bill and a payment ping through the agents.",
      flow: {
        label: "Agentic Ledger architecture",
        wide: {
          width: 640,
          height: 400,
          node: { w: 120, h: 56 },
          nodes: { soundbox: [10, 50], whatsapp: [10, 250], supervisor: [170, 150], spoof: [330, 50], ledger: [330, 250], liquidity: [490, 250], backend: [490, 336] },
          groups: { phinite: { x: 160, y: 24, w: 470, h: 296 } },
        },
        tall: {
          width: 300,
          height: 470,
          node: { w: 134, h: 52 },
          nodes: { soundbox: [8, 8], whatsapp: [158, 8], supervisor: [83, 106], spoof: [8, 206], ledger: [158, 206], liquidity: [158, 306], backend: [158, 410] },
          groups: { phinite: { x: 2, y: 84, w: 296, h: 282 } },
        },
        groups: [{ id: "phinite", label: "PHINITE OS", step: 1 }],
        nodes: [
          { id: "soundbox", label: "SOUNDBOX", sub: "MQTT telemetry", kind: "input", step: 0 },
          { id: "whatsapp", label: "WHATSAPP", sub: "vendor bills", kind: "input", step: 0 },
          { id: "supervisor", label: "SUPERVISOR", sub: "event router", step: 1 },
          { id: "spoof", label: "SPOOF GUARD", sub: "hash check <200ms", step: 2 },
          { id: "ledger", label: "SUPPLIER LEDGER", sub: "PII mask · parse", step: 3 },
          { id: "liquidity", label: "LIQUIDITY ENGINE", sub: "PyTorch LSTM", step: 4 },
          { id: "backend", label: "FASTAPI", sub: "bank rails", kind: "store", step: 5 },
        ],
        edges: [
          { from: "soundbox", to: "supervisor", step: 1 },
          { from: "whatsapp", to: "supervisor", step: 1 },
          { from: "supervisor", to: "spoof", step: 2 },
          { from: "supervisor", to: "ledger", step: 3 },
          { from: "ledger", to: "liquidity", step: 4 },
          { from: "liquidity", to: "backend", step: 5 },
        ],
        steps: [
          { title: "Events arrive", text: "Soundbox payment pings over MQTT and supplier bills through a WhatsApp webhook." },
          { title: "The supervisor routes them", text: "Security events and financial events go down different paths inside Phinite OS." },
          { title: "Spoof Guard checks the payment", text: "Gateway hash verified in under 200 ms: fraud alert, or \"payment safe, audio delayed\"." },
          { title: "The ledger reads the bill", text: "PII is masked and the amount owed (₹4,500 in the demo) is extracted." },
          { title: "The LSTM forecasts tonight", text: "Predicted evening revenue (₹8,450 in the demo) covers the bill, so the loan is approved." },
          { title: "Bank rails settle it", text: "Idempotent, timeout-aware calls make sure the supplier is paid exactly once." },
        ],
      },
    },
    results: {
      stats: [
        { value: 4, label: "cooperating Phinite agents" },
        { value: 400000, label: "retail rows used to train the LSTM" },
        { value: 94, suffix: "%", label: "revenue-forecast accuracy" },
        { value: 200, prefix: "<", suffix: " ms", label: "to flag a spoofed payment" },
      ],
      notes: [
        "In the demo, a ₹4,500 milk bill arrives with ₹0 in the bank. The LSTM forecasts ₹8,450 for the evening rush, so the supplier is paid instead of the merchant losing the stock.",
      ],
    },
  },
  "physics-1d-cnn": {
    name: "Physics-Augmented 1D-CNN",
    context: "Independent research · manuscript in preparation",
    started: "Aug 2026",
    problem: {
      lead: "Bearing-fault papers routinely report around 99% accuracy on the CWRU dataset. My own first version reported 87.58% cross-load accuracy and zero false alarms, and neither held up when I re-checked it.",
      points: [
        "On CWRU every faulty bearing is recorded at all four motor loads, so splitting by load still tests on bearings the model has already seen.",
        "The healthy recordings exist only at 48 kHz while the faults are at 12 kHz. Decimating just the healthy class left artefacts that identify it almost perfectly (separability 0.99–1.00).",
        "So the real question became: does adding physics to a 1D-CNN help when the test bearing is genuinely new?",
      ],
    },
    approach: [
      { title: "Build the model", text: "PAC-1DCNN: a fixed residual high-pass filter, two convolution streams, channel and temporal attention, and post-hoc temperature scaling, with a switch to ablate each part." },
      { title: "Build fair baselines", text: "A standard CNN with a fixed or learnable copy of the same filter, a WDCNN-style wide-kernel CNN, and two Random Forests on envelope-spectrum and bearing-kinematic features." },
      { title: "Remove the shortcuts", text: "Decimate the 48 kHz healthy recordings and band-limit every recording to 4 kHz. Both artefacts drop to chance (at most 0.59 and 0.50)." },
      { title: "Make the test harder, step by step", text: "Leave-one-load-out, then holding out whole defect sizes, then Paderborn's bearing-disjoint protocols, each with low-pass, white and high-pass noise from 10 to −10 dB." },
      { title: "Test it like a paper", text: "Folds × seeds, paired Wilcoxon tests with Holm correction, a fold-level corrected resampled t-test, and an IEEE-format manuscript generated straight from the results." },
      { title: "Ship to the edge", text: "ONNX FP32 and INT8 export, benchmarked on a desktop CPU with ONNX Runtime." },
    ],
    architecture: {
      caption: "PAC-1DCNN, from raw vibration to a calibrated fault class.",
      flow: {
        label: "PAC-1DCNN model architecture",
        wide: {
          width: 740,
          height: 300,
          node: { w: 120, h: 52 },
          nodes: { input: [10, 124], filter: [160, 44], raw: [160, 204], s1: [310, 44], s2: [310, 204], fusion: [460, 124], attention: [610, 44], head: [610, 204] },
        },
        tall: {
          width: 300,
          height: 470,
          node: { w: 134, h: 48 },
          nodes: { input: [83, 8], filter: [8, 88], raw: [158, 88], s1: [8, 168], s2: [158, 168], fusion: [83, 248], attention: [83, 328], head: [83, 408] },
        },
        nodes: [
          { id: "input", label: "VIBRATION", sub: "2 ch · 1024 @ 12 kHz", kind: "input", step: 0 },
          { id: "filter", label: "RESIDUAL FILTER", sub: "x − MovingAvg11", step: 1 },
          { id: "raw", label: "RAW SIGNAL", sub: "bypasses filter", step: 1 },
          { id: "s1", label: "STREAM 1", sub: "Conv1D k=5", step: 2 },
          { id: "s2", label: "STREAM 2", sub: "Conv1D k=15", step: 2 },
          { id: "fusion", label: "FUSION", sub: "Conv1D · 128 ch", step: 3 },
          { id: "attention", label: "ATTENTION", sub: "channel + temporal", step: 4 },
          { id: "head", label: "4-CLASS HEAD", sub: "logits / T", kind: "store", step: 5 },
        ],
        edges: [
          { from: "input", to: "filter", step: 1 },
          { from: "input", to: "raw", step: 1 },
          { from: "filter", to: "s1", step: 2 },
          { from: "raw", to: "s2", step: 2 },
          { from: "s1", to: "fusion", step: 3 },
          { from: "s2", to: "fusion", step: 3 },
          { from: "fusion", to: "attention", step: 4 },
          { from: "attention", to: "head", step: 5 },
        ],
        steps: [
          { title: "Two vibration channels in", text: "Drive-end and fan-end accelerometers, 1024-sample windows at 12 kHz, every recording band-limited to 4 kHz." },
          { title: "Split into physics and raw", text: "The residual filter (signal minus its 11-tap moving average) is a high-pass at about 660 Hz; the raw signal bypasses it." },
          { title: "Two convolution streams", text: "A short kernel on the filtered signal, a long kernel on the raw one." },
          { title: "Fuse", text: "A 128-channel convolution merges both views." },
          { title: "Attend", text: "Channel attention weights learned feature maps; temporal attention weights time steps." },
          { title: "Classify and calibrate", text: "Normal, inner race, ball or outer race, with logits divided by a temperature fitted after training." },
        ],
      },
    },
    results: {
      title: "What the numbers say",
      stats: [
        { value: 9, label: "models compared under identical protocols" },
        { value: "0 / 28", label: "fault-size comparisons where PAC-1DCNN significantly beat a standard CNN" },
        { value: 132.5, decimals: 1, suffix: " KB", label: "INT8 model, down from 401.1 KB" },
        { value: 0.3, decimals: 2, suffix: " ms", label: "INT8 inference per window on one CPU thread" },
      ],
      charts: [
        {
          title: "Accuracy collapses as the test gets stricter",
          caption: "PAC-1DCNN, clean macro-F1 (%). The dashed line is random guessing on Paderborn P4.",
          max: 100,
          unit: "%",
          reference: { value: 33.3, label: "random guessing (33.3%)" },
          bars: [
            { label: "Leave-one-load-out · CWRU", value: 99.9 },
            { label: "Defect size held out · CWRU", value: 45.4 },
            { label: "New bearings · Paderborn P4", value: 39.9 },
            { label: "Artificial → real · Paderborn P3", value: 35.1 },
          ],
        },
        {
          title: "Simpler baselines do as well or better",
          caption: "Defect size held out on CWRU, clean macro-F1 (%), trained with mixed noise.",
          max: 100,
          unit: "%",
          bars: [
            { label: "Envelope spectrum + Random Forest", value: 63.5, highlight: true },
            { label: "Kinematic features + Random Forest", value: 48.4 },
            { label: "WDCNN-style wide-kernel CNN", value: 46.1 },
            { label: "Standard 1D-CNN", value: 45.9 },
            { label: "PAC-1DCNN", value: 45.4 },
          ],
        },
        {
          title: "Edge inference",
          caption: "Mean latency per window on a desktop CPU, ONNX Runtime, batch 1 (lower is better).",
          max: 5.31,
          unit: " ms",
          bars: [
            { label: "PyTorch FP32", value: 2.43 },
            { label: "ONNX Runtime FP32", value: 0.42 },
            { label: "ONNX Runtime INT8 (static)", value: 0.3, display: "0.30 ms", highlight: true },
            { label: "ONNX Runtime INT8 (dynamic)", value: 5.31 },
          ],
        },
      ],
    },
    closing: {
      label: "Findings",
      title: "What I learned",
      points: [
        "The evaluation protocol decides the result: every model scores at least 99.4% under leave-one-load-out, and 44–48% once whole defect sizes are held out.",
        "On Paderborn, where every test bearing is a new physical specimen, the networks sit close to chance. They learn bearing identity, not transferable fault features.",
        "Physics helped as a feature prior, not as a filter: the kinematic Random Forest is the best model in every 0 and −5 dB Paderborn condition.",
        "The fixed filter only helps when the noise lies below its cut-off, exactly as its frequency response predicts.",
        "Temperature scaling doesn't fix calibration under noise; it makes the models more confident and their calibration error worse.",
      ],
    },
  },
};
