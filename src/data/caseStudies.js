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
};
