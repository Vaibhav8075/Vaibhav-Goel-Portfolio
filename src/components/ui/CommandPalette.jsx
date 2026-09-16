import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileCode2, Terminal, Briefcase, GitBranch, Mail, Command, X } from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commands = [
    { id: 1, name: "View Projects", icon: <FileCode2 size={16} />, action: () => { window.location.href = "#work"; setOpen(false); } },
    { id: 2, name: "View Experience", icon: <Briefcase size={16} />, action: () => { window.location.href = "#experience"; setOpen(false); } },
    { id: 3, name: "View Tech Stack", icon: <Terminal size={16} />, action: () => { window.location.href = "#stack"; setOpen(false); } },
    { id: 4, name: "Open GitHub", icon: <GitBranch size={16} />, action: () => { window.open("https://github.com/Vaibhav8075", "_blank"); setOpen(false); } },
    { id: 5, name: "Send Email", icon: <Mail size={16} />, action: () => { window.location.href = "mailto:vaibhav.goel0531@gmail.com"; setOpen(false); } },
  ];

  const filteredCommands = search === "" 
    ? commands 
    : commands.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <button 
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-xs text-white/50 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Command size={14} /> 
          <span className="font-mono">CMD + K</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-[#0C0C0C] border border-white/10 shadow-2xl rounded-xl overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center px-4 py-3 border-b border-white/5">
                  <Search size={16} className="text-white/40 mr-3" />
                  <input 
                    autoFocus
                    placeholder="Type a command or search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-mono"
                  />
                  <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                
                <div className="max-h-72 overflow-y-auto p-2">
                  {filteredCommands.length === 0 ? (
                    <div className="p-4 text-center text-sm text-white/40 font-mono">No results found.</div>
                  ) : (
                    filteredCommands.map(cmd => (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left font-mono"
                      >
                        <span className="text-white/40">{cmd.icon}</span>
                        {cmd.name}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
