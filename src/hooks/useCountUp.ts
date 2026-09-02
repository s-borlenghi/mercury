import { useState, useEffect, useRef } from "react";

// Animates a number from its previous value to the new one. Respects
// prefers-reduced-motion: if enabled, it jumps straight to the target.
export function useCountUp(target: number, duration = 850): number {
  const [val, setVal] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const from = prev.current;
    if (reduce || from === target) {
      setVal(target);
      prev.current = target;
      return;
    }

    let start: number | undefined;
    let raf = 0;
    const tick = (t: number) => {
      if (start === undefined) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return val;
}
