import { motion } from "framer-motion";
import { experience } from "../../data/content";

export default function Experience() {
  return (
    <section id="experience" className="py-24 border-t border-[#1A1A1A]">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-1/3">
          <h2 className="font-mono text-xs tracking-[0.2em] text-[#555555] mb-4">03 // OPERATIONAL_HISTORY</h2>
          <h3 className="text-3xl font-medium text-[#EAEAEA]">Experience</h3>
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col gap-12">
          {experience.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col gap-4 group"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                <h4 className="text-xl font-medium text-[#EAEAEA] group-hover:text-[#00E5FF] transition-colors duration-300">
                  {exp.role}
                </h4>
                <span className="font-mono text-xs text-[#555555] tracking-widest">{exp.period}</span>
              </div>
              <div className="font-mono text-sm tracking-widest text-[#888888]">
                // {exp.company}
              </div>
              <p className="text-[#A0A0A0] text-sm leading-relaxed mt-2 font-light max-w-2xl">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
