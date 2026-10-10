import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "../../data/content";
import useCopyToClipboard from "../../lib/useCopyToClipboard";

export default function Contact() {
  const [copied, copy] = useCopyToClipboard();

  return (
    <section id="contact" className="py-24 border-t border-white/[0.05]">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-1/3">
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 mb-4">05. CONTACT</h2>
          <h3 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Get in touch</h3>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-2/3 flex flex-col gap-10"
        >
          <p className="text-lg md:text-2xl text-white/70 font-light leading-relaxed max-w-2xl">
            Hiring for a software, ML or full-stack role, or building something interesting? I&apos;d like to hear about it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs tracking-widest uppercase hover:bg-white/85 transition-colors"
            >
              Email me <ArrowUpRight size={14} />
            </a>
            <button
              type="button"
              onClick={() => copy(profile.email)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white/80 font-mono text-xs tracking-wider hover:border-white/40 hover:text-white transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span aria-live="polite">{copied ? "Copied to clipboard" : profile.email}</span>
            </button>
          </div>

          <div className="flex gap-8 font-mono text-xs tracking-widest">
            <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
              GITHUB <ArrowUpRight size={12} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
              LINKEDIN <ArrowUpRight size={12} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
