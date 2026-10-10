import { useRef } from "react";

export default function SpotlightCard({ children, className = "" }) {
  const divRef = useRef(null);

  // Write the pointer position straight to CSS variables so moving the mouse doesn't re-render the card
  const handleMouseMove = (e) => {
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    div.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    div.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`group/spotlight relative overflow-hidden border border-white/[0.05] bg-white/[0.02] rounded-2xl ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/spotlight:opacity-100 group-focus-within/spotlight:opacity-100"
        style={{
          background: "radial-gradient(600px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(226,232,240,0.08), transparent 40%)",
        }}
      />
      {children}
    </div>
  );
}
