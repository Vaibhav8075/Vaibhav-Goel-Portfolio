import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function Typewriter({ text, delay = 0, speed = 50 }) {
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started || prefersReducedMotion || count >= text.length) return;

    const timeout = setTimeout(() => setCount(prev => prev + 1), speed);
    return () => clearTimeout(timeout);
  }, [count, text, speed, started, prefersReducedMotion]);

  const shown = prefersReducedMotion ? text : text.slice(0, count);

  return (
    <span className="block relative">
      {/* Screen readers get the whole sentence once instead of letter by letter */}
      <span className="sr-only">{text}</span>
      {/* Invisible copy reserves the final height so the page doesn't shift while typing */}
      <span aria-hidden="true" className="invisible">{text}</span>
      <span aria-hidden="true" className="absolute inset-0">
        {shown}
        <span className="motion-safe:animate-pulse ml-0.5 inline-block w-[0.6em] h-[1em] bg-white/70 align-middle -translate-y-[0.1em]" />
      </span>
    </span>
  );
}
