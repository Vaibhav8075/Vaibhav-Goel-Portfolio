import { useState, useEffect } from 'react';

export default function Typewriter({ text, delay = 0, speed = 50 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, started]);

  return (
    <span className="inline-block relative">
      {displayText}
      <span className="animate-pulse ml-0.5 inline-block w-[0.6em] h-[1em] bg-white/70 align-middle -translate-y-[0.1em]" />
    </span>
  );
}
