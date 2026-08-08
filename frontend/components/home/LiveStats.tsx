"use client";

import { useEffect, useState, useRef } from "react";
import { statsApi } from "@/lib/api";
import { useCountUp } from "@/hooks/useCountUp";
import type { PlatformStats } from "@/types";

function Divider() {
  return (
    <span className="w-px h-2.5 bg-line mx-5 shrink-0" aria-hidden="true" />
  );
}

export function LiveStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    statsApi
      .get()
      .then((s) => {
        if (active) setStats(s);
      })
      // Swallowing this left a blank strip under the hero headline, which reads
      // as a layout bug. Dashes read as "not loaded", which is the truth.
      .catch(() => {
        if (active) setFailed(true);
      });
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
      {stats ? (
        <>
          <span>{animTasks.toLocaleString()} tasks posted</span>
          <Divider />
          <span>{animEth.toFixed(3)} ETH paid out</span>
          <Divider />
          <span>{animOpinions.toLocaleString()} opinions collected</span>
        </>
      ) : failed ? (
        <>
          <span>— tasks posted</span>
          <Divider />
          <span>— ETH paid out</span>
          <Divider />
          <span>— opinions collected</span>
        </>
      ) : null}
    </div>
  );
}
