import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileCode2, Terminal, Briefcase, GitBranch, Mail, Command, X, User, FolderGit2, Copy, Check, UserRound, CornerDownLeft, Download } from "lucide-react";
import { profile, projects } from "../../data/content";
import { setScrollLocked } from "../../lib/scroll";
import { goToSection } from "../../lib/router";
import useCopyToClipboard from "../../lib/useCopyToClipboard";

const subscribeToNothing = () => () => {};
const detectMac = () => /mac|iphone|ipad/i.test(navigator.userAgentData?.platform ?? navigator.platform);

const sections = [
  { id: "about", name: "About", icon: User },
  { id: "work", name: "Projects", icon: FileCode2 },
  { id: "experience", name: "Experience", icon: Briefcase },
  { id: "stack", name: "Tech Stack", icon: Terminal },
  { id: "contact", name: "Contact", icon: Mail },
];

function buildCommands({ copied, copy }) {
  return [
    ...sections.map((section) => ({
      id: `go-${section.id}`,
      group: "Navigate",
      name: section.name,
      icon: section.icon,
      keywords: `go section ${section.id}`,
      run: () => goToSection(section.id),
    })),
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      group: "Projects",
      name: project.title,
      hint: project.tagline,
      icon: FolderGit2,
      keywords: `${project.type} ${project.tech.join(" ")} repo github`,
      run: () => window.open(project.github, "_blank", "noopener"),
    })),
    {
      id: "copy-email",
      group: "Contact",
      name: copied ? "Copied!" : "Copy email address",
      hint: profile.email,
      icon: copied ? Check : Copy,
      keywords: "email mail clipboard contact",
      keepOpen: true,
      run: () => copy(profile.email),
    },
    {
      id: "resume",
      group: "Contact",
      name: "Download résumé",
      hint: "PDF",
      icon: Download,
      keywords: "resume cv pdf download hire",
      run: () => {
        const link = Object.assign(document.createElement("a"), { href: profile.resume, download: "" });
        link.click();
      },
    },
    { id: "send-email", group: "Contact", name: "Send an email", icon: Mail, keywords: "mail contact hire", run: () => window.location.assign(`mailto:${profile.email}`) },
    { id: "github", group: "Contact", name: "Open GitHub", icon: GitBranch, keywords: "code repos", run: () => window.open(profile.github, "_blank", "noopener") },
    { id: "linkedin", group: "Contact", name: "Open LinkedIn", icon: UserRound, keywords: "profile cv resume", run: () => window.open(profile.linkedin, "_blank", "noopener") },
  ];
}

function matches(command, query) {
  const haystack = `${command.name} ${command.hint ?? ""} ${command.keywords}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((term) => haystack.includes(term));
}

const isTypingTarget = (el) => el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, copy] = useCopyToClipboard();
  // Read the platform after hydration so pre-rendered markup always matches the first client render
  const isMac = useSyncExternalStore(subscribeToNothing, detectMac, () => false);

  const openPalette = () => {
    setSearch("");
    setActiveIndex(0);
    setOpen(true);
  };

  useEffect(() => {
    const down = (e) => {
      const toggle = e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey);
      const slash = e.key === "/" && !open && !isTypingTarget(e.target);
      if (toggle || slash) {
        e.preventDefault();
        setSearch("");
        setActiveIndex(0);
        setOpen((wasOpen) => (toggle ? !wasOpen : true));
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  // Lock the page behind the dialog and hand focus back to wherever it was on close
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    setScrollLocked(true);
    return () => {
      setScrollLocked(false);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open]);

  const commands = buildCommands({ copied, copy });
  const filteredCommands = search.trim() === "" ? commands : commands.filter((command) => matches(command, search.trim()));
  const active = filteredCommands[Math.min(activeIndex, filteredCommands.length - 1)];

  useEffect(() => {
    if (open && active) document.getElementById(`palette-${active.id}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const runCommand = (command) => {
    if (!command) return;
    if (!command.keepOpen) {
      // Unlock before running: restarting Lenis in the effect cleanup would cancel a scroll already under way
      setScrollLocked(false);
      setOpen(false);
    }
    command.run();
  };

  const handleInputKeyDown = (e) => {
    const count = filteredCommands.length;
    if (e.key === "ArrowDown" && count) {
      e.preventDefault();
      setActiveIndex((i) => (Math.min(i, count - 1) + 1) % count);
    } else if (e.key === "ArrowUp" && count) {
      e.preventDefault();
      setActiveIndex((i) => (Math.min(i, count - 1) - 1 + count) % count);
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(active);
    } else if (e.key === "Tab") {
      // Focus stays in the search box; arrows move through results
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={openPalette}
          aria-label="Open command palette"
          aria-haspopup="dialog"
          className="flex items-center gap-2 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 p-3 md:px-3 md:py-2 rounded-full md:rounded-lg text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Search size={14} className="md:hidden" />
          <span className="hidden md:flex items-center gap-1.5 font-mono">
            {isMac ? <><Command size={12} /> K</> : "CTRL + K"}
          </span>
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
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-[#0C0C0C] border border-white/10 shadow-2xl rounded-xl overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center px-4 py-3 border-b border-white/5">
                  <Search size={16} className="text-white/50 mr-3 shrink-0" />
                  <input
                    autoFocus
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="palette-results"
                    aria-autocomplete="list"
                    aria-activedescendant={active ? `palette-${active.id}` : undefined}
                    aria-label="Search sections, projects and links"
                    placeholder="Search projects, tech, or jump to…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setActiveIndex(0); }}
                    onKeyDown={handleInputKeyDown}
                    className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-mono"
                  />
                  <button type="button" tabIndex={-1} aria-label="Close" onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <ul id="palette-results" role="listbox" aria-label="Results" data-lenis-prevent className="max-h-80 overflow-y-auto p-2 overscroll-contain">
                  {filteredCommands.length === 0 ? (
                    <li role="presentation" className="p-4 text-center text-sm text-white/50 font-mono">No results found.</li>
                  ) : (
                    filteredCommands.map((cmd, index) => {
                      const Icon = cmd.icon;
                      const isActive = cmd === active;
                      const startsGroup = index === 0 || filteredCommands[index - 1].group !== cmd.group;
                      return (
                        <li key={cmd.id} role="presentation">
                          {startsGroup && (
                            <div className="px-3 pt-3 pb-1 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">{cmd.group}</div>
                          )}
                          <div
                            id={`palette-${cmd.id}`}
                            role="option"
                            aria-selected={isActive}
                            onMouseMove={() => setActiveIndex(index)}
                            onClick={() => runCommand(cmd)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors font-mono ${isActive ? "bg-white/[0.06] text-white" : "text-white/70"}`}
                          >
                            <span className="text-white/50 shrink-0"><Icon size={16} /></span>
                            <span className="truncate">{cmd.name}</span>
                            {cmd.hint && <span className="ml-auto pl-3 text-[11px] text-white/50 truncate">{cmd.hint}</span>}
                            {isActive && !cmd.hint && <CornerDownLeft size={14} className="ml-auto text-white/50 shrink-0" />}
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>

                <div className="hidden sm:flex items-center gap-4 px-4 py-2 border-t border-white/5 font-mono text-[10px] tracking-widest text-white/50">
                  <span>↑↓ MOVE</span>
                  <span>↵ OPEN</span>
                  <span>ESC CLOSE</span>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
