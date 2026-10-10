import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import usePrefersReducedMotion from "../../lib/usePrefersReducedMotion";
import useMediaQuery from "../../lib/useMediaQuery";
import { boxFor, edgePath } from "../../lib/diagram";

// Mirrors the agent flow described in the Agentic Ledger README
const NODES = [
  { id: "soundbox", label: "SOUNDBOX", sub: "MQTT telemetry", info: "Every payment the merchant's Soundbox announces arrives as an MQTT telemetry ping." },
  { id: "whatsapp", label: "WHATSAPP", sub: "vendor bills", info: "Distributors send unstructured bills over WhatsApp, and a webhook forwards them into the system." },
  { id: "supervisor", label: "SUPERVISOR", sub: "event router", info: "The Master Supervisor agent sends security events to Spoof Guard and financial events to the Supplier Ledger." },
  { id: "spoof", label: "SPOOF GUARD", sub: "hash check <200ms", info: "Verifies the gateway hash in under 200ms. A missing hash raises a fraud alert; a real payment delayed by 4G congestion gets a \"payment safe, audio delayed\" notice." },
  { id: "ledger", label: "SUPPLIER LEDGER", sub: "PII mask · parse", info: "Parses the bill, masks PII such as bank account numbers with Phinite guardrails, and extracts the amount owed." },
  { id: "liquidity", label: "LIQUIDITY ENGINE", sub: "PyTorch LSTM", info: "A PyTorch LSTM trained on ~400k rows of retail data forecasts the evening's revenue from transaction velocity, and auto-approves a micro-loan when it covers the bill." },
  { id: "backend", label: "FASTAPI", sub: "bank rails", info: "Simulated bank calls with idempotency, 504-timeout handling and double-debit protection." },
];
// Left-to-right on wide screens; stacked top-to-bottom on phones so labels stay legible
const LAYOUTS = {
  wide: {
    width: 560,
    height: 380,
    node: { w: 112, h: 56 },
    frame: { x: 140, y: 14, w: 416, h: 262 },
    nodes: { soundbox: [8, 40], whatsapp: [8, 200], supervisor: [152, 120], spoof: [296, 40], ledger: [296, 200], liquidity: [440, 200], backend: [440, 310] },
  },
  tall: {
    width: 300,
    height: 470,
    node: { w: 134, h: 52 },
    frame: { x: 2, y: 84, w: 296, h: 282 },
    nodes: { soundbox: [8, 8], whatsapp: [158, 8], supervisor: [83, 106], spoof: [8, 206], ledger: [158, 206], liquidity: [158, 306], backend: [158, 410] },
  },
};

const EDGES = [
  { id: "soundbox-supervisor", from: "soundbox", to: "supervisor" },
  { id: "whatsapp-supervisor", from: "whatsapp", to: "supervisor" },
  { id: "supervisor-spoof", from: "supervisor", to: "spoof" },
  { id: "supervisor-ledger", from: "supervisor", to: "ledger" },
  { id: "ledger-liquidity", from: "ledger", to: "liquidity" },
  { id: "liquidity-backend", from: "liquidity", to: "backend" },
];

const SCENARIOS = {
  bill: {
    label: "Vendor bill",
    summary: "A supplier's WhatsApp bill is parsed and masked, the LSTM forecasts tonight's revenue, and the payment is auto-approved through the bank rails.",
    nodes: ["whatsapp", "supervisor", "ledger", "liquidity", "backend"],
    edges: ["whatsapp-supervisor", "supervisor-ledger", "ledger-liquidity", "liquidity-backend"],
  },
  payment: {
    label: "Payment ping",
    summary: "A Soundbox ping is routed to Spoof Guard, which confirms the payment is genuine in under 200ms.",
    nodes: ["soundbox", "supervisor", "spoof"],
    edges: ["soundbox-supervisor", "supervisor-spoof"],
  },
};

const STEP = 0.9; // seconds a packet spends on each edge

// One packet per edge, each moving only during its slice of the cycle so they read as a single request
function Packets({ edges }) {
  const cycle = edges.length * STEP + 0.8;

  return edges.map((edge, i) => {
    const start = (i * STEP) / cycle;
    const end = ((i + 1) * STEP) / cycle;
    return (
      <circle key={edge.id} r="3" fill="#fff" opacity="0">
        <animateMotion
          dur={`${cycle}s`}
          repeatCount="indefinite"
          path={edge.d}
          keyPoints="0;0;1;1"
          keyTimes={`0;${start};${end};1`}
          calcMode="linear"
        />
        <animate
          attributeName="opacity"
          dur={`${cycle}s`}
          repeatCount="indefinite"
          values="0;1;1;0"
          keyTimes={`0;${start};${end};1`}
          calcMode="discrete"
        />
      </circle>
    );
  });
}

export default function AgentLedgerDiagram() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isNarrow = useMediaQuery("(max-width: 639px)");
  const layout = LAYOUTS[isNarrow ? "tall" : "wide"];
  const edges = EDGES.map((edge) => ({ ...edge, d: edgePath(boxFor(layout, edge.from), boxFor(layout, edge.to), isNarrow ? "vertical" : "horizontal") }));
  const [scenarioId, setScenarioId] = useState("bill");
  const [activeId, setActiveId] = useState(null);
  const scenario = SCENARIOS[scenarioId];
  const activeNode = NODES.find((node) => node.id === activeId);

  const selectNode = (id) => {
    setActiveId(id);
    // Jump to the flow that passes through the clicked node
    if (!scenario.nodes.includes(id)) {
      setScenarioId(Object.keys(SCENARIOS).find((key) => SCENARIOS[key].nodes.includes(id)));
    }
  };

  return (
    <div className="relative z-10 w-full flex flex-col gap-6">
      <div role="group" aria-label="Choose a request to trace" className="flex gap-2">
        {Object.entries(SCENARIOS).map(([id, { label }]) => (
          <button
            key={id}
            type="button"
            aria-pressed={scenarioId === id}
            onClick={() => { setScenarioId(id); setActiveId(null); }}
            className={`px-3 py-1.5 rounded-full border font-mono text-[10px] tracking-widest uppercase transition-colors ${scenarioId === id ? "border-white/30 bg-white/10 text-white" : "border-white/10 text-white/50 hover:text-white"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="w-full h-auto"
        role="group"
        aria-label="Agentic Ledger architecture: Soundbox and WhatsApp events flow through a Supervisor agent to Spoof Guard, or through the Supplier Ledger and Liquidity Engine to the FastAPI bank rails"
        onMouseLeave={() => setActiveId(null)}
      >
        {/* Phinite OS hosts the agents */}
        <rect x={layout.frame.x} y={layout.frame.y} width={layout.frame.w} height={layout.frame.h} rx="10" fill="none" stroke="#fff" strokeOpacity="0.12" strokeDasharray="3 5" />
        <text x={layout.frame.x + 12} y={layout.frame.y + 18} fill="#fff" fillOpacity="0.4" fontFamily="monospace" fontSize="9" letterSpacing="2">PHINITE OS</text>

        {/* Faint wiring draws in once; the traced route is overlaid on top */}
        {edges.map((edge, i) => (
          <motion.path
            key={edge.id}
            d={edge.d}
            fill="none"
            stroke="#fff"
            strokeOpacity="0.12"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.2 + i * 0.1 }}
          />
        ))}
        {edges.map((edge) => (
          <path
            key={edge.id}
            d={edge.d}
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
            strokeOpacity={scenario.edges.includes(edge.id) ? 0.55 : 0}
            style={{ transition: "stroke-opacity 0.4s" }}
          />
        ))}

        {!prefersReducedMotion && (
          <g key={scenarioId}>
            <Packets edges={scenario.edges.map((id) => edges.find((edge) => edge.id === id))} />
          </g>
        )}

        {NODES.map((node, i) => {
          const onRoute = scenario.nodes.includes(node.id);
          const isActive = node.id === activeId;
          const box = boxFor(layout, node.id);
          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <g
                role="button"
                tabIndex={0}
                aria-label={`${node.label.toLowerCase()}: ${node.info}`}
                aria-pressed={isActive}
                onMouseEnter={() => selectNode(node.id)}
                onFocus={() => selectNode(node.id)}
                onClick={() => selectNode(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectNode(node.id);
                  }
                }}
                className="cursor-pointer outline-none"
                style={{ opacity: onRoute ? 1 : 0.4, transition: "opacity 0.4s" }}
              >
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  rx="6"
                  fill={isActive ? "#181818" : "#0E0E0E"}
                  stroke={isActive ? "#fff" : onRoute ? "#666" : "#333"}
                  strokeWidth={isActive ? 1.5 : 1}
                  style={{ transition: "stroke 0.3s, fill 0.3s" }}
                />
                <text x={box.x + box.w / 2} y={box.y + box.h / 2 - 3} textAnchor="middle" fill="#EEE" fontFamily="monospace" fontSize="10.5">
                  {node.label}
                </text>
                <text x={box.x + box.w / 2} y={box.y + box.h / 2 + 12} textAnchor="middle" fill="#888" fontFamily="monospace" fontSize="9">
                  {node.sub}
                </text>
              </g>
            </motion.g>
          );
        })}
      </svg>

      <div aria-live="polite" className="min-h-[88px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeNode?.id ?? scenarioId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">
              {activeNode ? activeNode.label : `Trace · ${scenario.label}`}
            </div>
            <p className="text-sm text-white/70 font-light leading-relaxed">
              {activeNode ? activeNode.info : scenario.summary}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
