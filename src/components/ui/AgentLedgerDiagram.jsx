import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

// Mirrors the agent flow described in the Agentic Ledger README
const NODES = [
  { id: "soundbox", label: "SOUNDBOX", sub: "MQTT telemetry", x: 8, y: 40, info: "Every payment the merchant's Soundbox announces arrives as an MQTT telemetry ping." },
  { id: "whatsapp", label: "WHATSAPP", sub: "vendor bills", x: 8, y: 200, info: "Distributors send unstructured bills over WhatsApp, and a webhook forwards them into the system." },
  { id: "supervisor", label: "SUPERVISOR", sub: "event router", x: 152, y: 120, info: "The Master Supervisor agent sends security events to Spoof Guard and financial events to the Supplier Ledger." },
  { id: "spoof", label: "SPOOF GUARD", sub: "hash check <200ms", x: 296, y: 40, info: "Verifies the gateway hash in under 200ms. A missing hash raises a fraud alert; a real payment delayed by 4G congestion gets a \"payment safe, audio delayed\" notice." },
  { id: "ledger", label: "SUPPLIER LEDGER", sub: "PII mask · parse", x: 296, y: 200, info: "Parses the bill, masks PII such as bank account numbers with Phinite guardrails, and extracts the amount owed." },
  { id: "liquidity", label: "LIQUIDITY ENGINE", sub: "PyTorch LSTM", x: 440, y: 200, info: "A PyTorch LSTM trained on ~400k rows of retail data forecasts the evening's revenue from transaction velocity, and auto-approves a micro-loan when it covers the bill." },
  { id: "backend", label: "FASTAPI", sub: "bank rails", x: 440, y: 310, info: "Simulated bank calls with idempotency, 504-timeout handling and double-debit protection." },
];
const NODE_W = 112;
const NODE_H = 56;

const EDGES = [
  { id: "soundbox-supervisor", d: "M120 68 C136 68 136 148 152 148" },
  { id: "whatsapp-supervisor", d: "M120 228 C136 228 136 148 152 148" },
  { id: "supervisor-spoof", d: "M264 148 C280 148 280 68 296 68" },
  { id: "supervisor-ledger", d: "M264 148 C280 148 280 228 296 228" },
  { id: "ledger-liquidity", d: "M408 228 L440 228" },
  { id: "liquidity-backend", d: "M496 256 L496 310" },
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
  const prefersReducedMotion = useReducedMotion();
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
        viewBox="0 0 560 380"
        className="w-full h-auto"
        role="group"
        aria-label="Agentic Ledger architecture: Soundbox and WhatsApp events flow through a Supervisor agent to Spoof Guard, or through the Supplier Ledger and Liquidity Engine to the FastAPI bank rails"
        onMouseLeave={() => setActiveId(null)}
      >
        {/* Phinite OS hosts the agents */}
        <rect x="140" y="14" width="416" height="262" rx="10" fill="none" stroke="#fff" strokeOpacity="0.12" strokeDasharray="3 5" />
        <text x="152" y="32" fill="#fff" fillOpacity="0.4" fontFamily="monospace" fontSize="9" letterSpacing="2">PHINITE OS</text>

        {/* Faint wiring draws in once; the traced route is overlaid on top */}
        {EDGES.map((edge, i) => (
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
        {EDGES.map((edge) => (
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
            <Packets edges={scenario.edges.map((id) => EDGES.find((edge) => edge.id === id))} />
          </g>
        )}

        {NODES.map((node, i) => {
          const onRoute = scenario.nodes.includes(node.id);
          const isActive = node.id === activeId;
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
                  x={node.x}
                  y={node.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx="6"
                  fill={isActive ? "#181818" : "#0E0E0E"}
                  stroke={isActive ? "#fff" : onRoute ? "#666" : "#333"}
                  strokeWidth={isActive ? 1.5 : 1}
                  style={{ transition: "stroke 0.3s, fill 0.3s" }}
                />
                <text x={node.x + NODE_W / 2} y={node.y + 25} textAnchor="middle" fill="#EEE" fontFamily="monospace" fontSize="10.5">
                  {node.label}
                </text>
                <text x={node.x + NODE_W / 2} y={node.y + 41} textAnchor="middle" fill="#888" fontFamily="monospace" fontSize="9">
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
