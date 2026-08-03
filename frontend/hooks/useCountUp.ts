"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(
  target: number,
  started: boolean,
  decimals = 0,
  duration = 1200
) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!started || target === 0) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(target);
      return;
    }

    cancelAnimationFrame(raf.current);
    let start: number | null = null;

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(ts: number) {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = target * easeOut(t);
      setValue(
        decimals === 0 ? Math.round(eased) : parseFloat(eased.toFixed(decimals))
      );
      if (t < 1) raf.current = requestAnimationFrame(step);
    }

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, decimals, duration, started]);

  return value;
}
