import { motion } from "framer-motion";
import SpotlightCard from "../ui/SpotlightCard";
import { MapPin, Globe, Cpu, Zap } from "lucide-react";

export default function SystemProfile() {
  return (
    <section id="about" className="py-24 border-t border-white/[0.05]">
      <div className="flex flex-col gap-16">
        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 mb-4">01. ABOUT</h2>
          <h3 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Background</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <SpotlightCard className="h-full p-8 md:p-10">
              <h4 className="font-mono text-[10px] tracking-widest text-white/50 uppercase mb-6">Profile</h4>
              <div className="text-white/70 leading-relaxed font-light space-y-6 text-sm md:text-base">
                <p>
                  I build production-grade systems at the intersection of machine learning and distributed engineering. My work focuses on constructing autonomous multi-agent architectures, implementing real-time data pipelines, and optimizing inference on constrained edge devices.
                </p>
                <p>
                  I'm currently expanding the boundaries of autonomous financial engines and real-time edge telemetry networks, driven by a deep interest in performance and scalability.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <SpotlightCard className="p-6 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-white/70">
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
                  <MapPin size={20} className="text-white/50" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-white/40 mb-1">LOCATION</div>
                  <div className="text-sm font-medium">Vellore, India</div>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-white/70">
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
                  <Globe size={20} className="text-white/50" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-white/40 mb-1">EDUCATION</div>
                  <div className="text-sm font-medium">Vellore Inst. of Technology</div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
