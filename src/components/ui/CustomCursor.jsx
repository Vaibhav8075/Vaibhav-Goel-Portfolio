import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import useMediaQuery from "../../lib/useMediaQuery";
import usePrefersReducedMotion from "../../lib/usePrefersReducedMotion";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label";

export default function CustomCursor() {
  // Touch screens and stylus-only devices never move a pointer, so the follower would sit in a corner
  const hasFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const [isHovering, setIsHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const opacity = useMotionValue(0);
  const dotX = useSpring(x, { stiffness: 1000, damping: 50, mass: 0.1 });
  const dotY = useSpring(y, { stiffness: 1000, damping: 50, mass: 0.1 });
  const ringX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    const updateMousePosition = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    };

    const handleMouseOver = (e) => {
      setIsHovering(Boolean(e.target.closest(INTERACTIVE)));
    };

    const hide = () => opacity.set(0);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, [enabled, x, y, opacity]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 -ml-2 -mt-2 w-4 h-4 bg-[#00E5FF] rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{ x: dotX, y: dotY, opacity }}
        animate={{ scale: isHovering ? 2.5 : 1 }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 -ml-5 -mt-5 w-10 h-10 border border-[#00E5FF]/40 rounded-full pointer-events-none z-[99]"
        style={{ x: ringX, y: ringY, opacity }}
        animate={{ scale: isHovering ? 1.5 : 1, borderColor: isHovering ? "rgba(0,229,255,0)" : "rgba(0,229,255,0.4)" }}
      />
    </>
  );
}
