import { motion } from "framer-motion";

export default function SystemProfile() {
  return (
    <section id="profile" className="py-24 border-t border-[#1A1A1A]">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-1/3">
          <h2 className="font-mono text-xs tracking-[0.2em] text-[#555555] mb-4">01. ABOUT</h2>
          <h3 className="text-3xl font-medium text-[#EAEAEA]">Background</h3>
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-[#1A1A1A] pb-12">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-widest text-[#555555]">NAME</span>
              <span className="font-mono text-sm text-[#EAEAEA]">VAIBHAV GOEL</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-widest text-[#555555]">LOCATION</span>
              <span className="font-mono text-sm text-[#EAEAEA]">VELLORE, INDIA</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-widest text-[#555555]">UNIVERSITY</span>
              <span className="font-mono text-sm text-[#EAEAEA]">VELLORE INSTITUTE OF TECHNOLOGY</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-widest text-[#555555]">STATUS</span>
              <span className="font-mono text-sm text-[#00E5FF]">B.TECH COMPUTER SCIENCE</span>
            </div>
          </div>
          
          <div className="text-[#A0A0A0] leading-relaxed font-light space-y-6">
            <p>
              I build production-grade systems at the intersection of machine learning and distributed engineering. My work focuses on constructing autonomous multi-agent architectures (Agentic AI), implementing the Model Context Protocol (MCP), and optimizing AI inference on constrained edge devices.
            </p>
            <p>
              Currently expanding the boundaries of autonomous financial engines and real-time edge telemetry networks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
