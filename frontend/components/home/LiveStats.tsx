"use client";

import { useEffect, useState, useRef } from "react";
import { statsApi } from "@/lib/api";
import type { PlatformStats } from "@/types";

function useCountUp(
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
      setValue(decimals === 0 ? Math.round(eased) : parseFloat(eased.toFixed(decimals)));
      if (t < 1) raf.current = requestAnimationFrame(step);
    }

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, decimals, duration, started]);

  return value;
}

function Divider() {
  return (
    <span className="w-px h-2.5 bg-line mx-5 shrink-0" aria-hidden="true" />
  );
}

export function LiveStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    statsApi
      .get()
      .then((s) => {
        if (active) setStats(s);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animTasks = useCountUp(stats?.totalTasks ?? 0, started);
  const animEth = useCountUp(
    stats ? parseFloat(stats.totalEthDistributed) : 0,
    started,
    3
  );
  const animOpinions = useCountUp(stats?.totalOpinions ?? 0, started);

  return (
    <div
      ref={containerRef}
      className="flex items-center flex-wrap gap-y-2.5 font-mono text-[10px] text-dim tracking-[0.02em] whitespace-nowrap min-h-[15px]"
    >
      {stats && (
        <>
          <span>{animTasks.toLocaleString()} tasks posted</span>
          <Divider />
          <span>{animEth.toFixed(3)} ETH paid out</span>
          <Divider />
          <span>{animOpinions.toLocaleString()} opinions collected</span>
        </>
      )}
    </div>
  );
}
