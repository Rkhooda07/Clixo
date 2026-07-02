"use client";

import { useEffect, useState, useRef } from "react";
import { statsApi } from "@/lib/api";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (target === 0) return;
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
  }, [target, duration]);

  return value;
}

function useCountUpFloat(target: number, decimals = 1, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (target === 0) return;
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
  }, [target, decimals, duration]);

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
    return () => { active = false; };
  }, []);

  const animTasks = useCountUp(tasks);
  const animEth = useCountUpFloat(eth);
  const animWorkers = useCountUp(workers);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={statStyle}>{animTasks.toLocaleString()} tasks created</span>
      <span style={divider} aria-hidden="true" />
      <span style={statStyle}>{animEth.toFixed(1)} ETH distributed</span>
      <span style={divider} aria-hidden="true" />
      <span style={statStyle}>{animWorkers.toLocaleString()} workers</span>
    </div>
  );
}
