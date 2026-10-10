import { motion } from "framer-motion";

export default function AgentLedgerDiagram() {
  return (
    <svg viewBox="0 0 500 400" className="w-full h-auto relative z-10" aria-label="Multi-Agent Orchestration Architecture">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Connections */}
      <motion.path 
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        viewport={{ once: true }}
        d="M120 200 L250 120 M120 200 L250 200 M120 200 L250 280" 
        stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" 
        className="group-hover:stroke-white/40 transition-all duration-700" 
      />
      <motion.path 
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        viewport={{ once: true }}
        d="M350 120 L450 200 M350 200 L450 200 M350 280 L450 200" 
        stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" 
        className="group-hover:stroke-white/40 transition-all duration-700" 
      />
      
      {/* Nodes */}
      <motion.rect initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} viewport={{ once: true }} x="40" y="170" width="80" height="60" rx="6" fill="#0C0C0C" stroke="#333" strokeWidth="1" />
      <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }} x="80" y="204" textAnchor="middle" fill="#888" fontFamily="monospace" fontSize="10">API GATEWAY</motion.text>

      <motion.rect initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }} x="250" y="90" width="100" height="60" rx="6" fill="#111" stroke="#444" strokeWidth="1.5" className="group-hover:stroke-gray-300 transition-colors duration-500" />
      <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} x="300" y="120" textAnchor="middle" fill="#EEE" fontFamily="monospace" fontSize="11">RISK AGENT</motion.text>
      <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} x="300" y="136" textAnchor="middle" fill="#555" fontFamily="monospace" fontSize="8">PyTorch LSTM</motion.text>

      <motion.rect initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }} x="250" y="170" width="100" height="60" rx="6" fill="#111" stroke="#444" strokeWidth="1.5" className="group-hover:stroke-gray-300 transition-colors duration-500" />
      <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} x="300" y="200" textAnchor="middle" fill="#EEE" fontFamily="monospace" fontSize="11">FRAUD AGENT</motion.text>
      <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} x="300" y="216" textAnchor="middle" fill="#555" fontFamily="monospace" fontSize="8">Heuristic Net</motion.text>

      <motion.rect initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} x="250" y="250" width="100" height="60" rx="6" fill="#111" stroke="#444" strokeWidth="1.5" className="group-hover:stroke-gray-300 transition-colors duration-500" />
      <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }} viewport={{ once: true }} x="300" y="280" textAnchor="middle" fill="#EEE" fontFamily="monospace" fontSize="11">CREDIT AGENT</motion.text>
      <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }} viewport={{ once: true }} x="300" y="296" textAnchor="middle" fill="#555" fontFamily="monospace" fontSize="8">FastAPI Stream</motion.text>

      <motion.rect initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} x="420" y="170" width="60" height="60" rx="30" fill="#050505" stroke="#666" strokeWidth="1" />
      <motion.text initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.8 }} viewport={{ once: true }} x="450" y="204" textAnchor="middle" fill="#FFF" fontFamily="monospace" fontSize="10">OS</motion.text>
    </svg>
  );
}
