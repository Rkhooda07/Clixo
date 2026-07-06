"use client";

import { useEffect, useState, useRef } from "react";
import { statsApi } from "@/lib/api";

function useCountUp(target: number, started: boolean, duration = 1200) {
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
      setValue(Math.round(target * easeOut(t)));
      if (t < 1) raf.current = requestAnimationFrame(step);
    }

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, started]);

  return value;
}

function useCountUpFloat(
  target: number,
  started: boolean,
  decimals = 1,
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
      setValue(parseFloat((target * easeOut(t)).toFixed(decimals)));
      if (t < 1) raf.current = requestAnimationFrame(step);
    }

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, decimals, duration, started]);

  return value;
}

const divider: React.CSSProperties = {
  width: "1px",
  height: "10px",
  background: "var(--line)",
  margin: "0 20px",
  flexShrink: 0,
};

const statStyle: React.CSSProperties = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "10px",
  color: "var(--text-3)",
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
};

export function LiveStats() {
  const [tasks, setTasks] = useState(0);
  const [eth, setEth] = useState(0);
  const [workers, setWorkers] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    statsApi
      .get()
      .then((s) => {
        if (!active) return;
        setTasks(s.totalTasks);
        setEth(parseFloat(s.totalEthDistributed));
        setWorkers(s.totalWorkers);
      })
      .catch(console.error);
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

  const animTasks = useCountUp(tasks, started);
  const animEth = useCountUpFloat(eth, started);
  const animWorkers = useCountUp(workers, started);

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px 0" }}
    >
      <span style={statStyle}>{animTasks.toLocaleString()} tasks created</span>
      <span style={divider} aria-hidden="true" />
      <span style={statStyle}>{animEth.toFixed(1)} ETH distributed</span>
      <span style={divider} aria-hidden="true" />
      <span style={statStyle}>{animWorkers.toLocaleString()} workers</span>
    </div>
  );
}
