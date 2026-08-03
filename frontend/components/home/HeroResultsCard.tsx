"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

const OPTIONS = [
  { label: "Option A", pct: 64, votes: 8, winner: true },
  { label: "Option B", pct: 36, votes: 5, winner: false },
] as const;

export function HeroResultsCard() {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 700);
    return () => clearTimeout(t);
  }, []);

  const votesA = useCountUp(OPTIONS[0].votes, started, 0, 900);
  const votesB = useCountUp(OPTIONS[1].votes, started, 0, 900);
  const reward = useCountUp(0.013, started, 3, 1100);
  const counts = [votesA, votesB];

  const cardClass =
    "group relative w-full max-w-[320px] bg-surface border border-line rounded-lg p-5 " +
    "transition-[border-color,transform,box-shadow] duration-200 " +
    "hover:border-dim hover:-translate-y-1 hover:shadow-[0_0_48px_rgba(232,160,32,0.07),0_12px_32px_rgba(0,0,0,0.4)]";

  const content = (
    <>
      <div className="eyebrow tracking-[0.1em] mb-1">Task #42 · Closed</div>
      <div className="font-display text-[13px] font-medium text-hi tracking-[-0.01em] leading-snug mb-5">
        What does the crowd think?
      </div>

      <div className="flex flex-col gap-4 mb-5">
        {OPTIONS.map((opt, i) => (
          <div key={opt.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-[22px] shrink-0 rounded-xs bg-raised border ${
                    opt.winner ? "border-hi" : "border-line"
                  }`}
                />
                <span
                  className={`font-mono text-[11px] ${
                    opt.winner ? "text-hi" : "text-lo"
                  }`}
                >
                  {opt.label}
                </span>
              </div>
              {opt.winner ? (
                reduce ? (
                  <span className="font-mono text-[10px] text-green tracking-[0.06em]">
                    TOP PICK
                  </span>
                ) : (
                  <m.span
                    className="font-mono text-[10px] text-green tracking-[0.06em]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={started ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    TOP PICK
                  </m.span>
                )
              ) : (
                <span className="font-mono text-[10px] text-dim">{opt.pct}%</span>
              )}
            </div>

            <div className="h-[3px] bg-line rounded-[1px] overflow-hidden">
              {reduce ? (
                <div
                  className={`h-full ${opt.winner ? "bg-hi" : "bg-dim"}`}
                  style={{ width: `${opt.pct}%` }}
                />
              ) : (
                <m.div
                  className={`h-full ${opt.winner ? "bg-hi" : "bg-dim"}`}
                  initial={{ width: 0 }}
                  animate={started ? { width: `${opt.pct}%` } : {}}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
              )}
            </div>

            <div className="font-mono text-[10px] text-dim mt-1">
              {reduce ? opt.votes : counts[i]} opinions
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-line mb-3" />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-dim">Reward distributed</span>
        <span className="font-mono text-[11px] text-amber">
          Ξ {reduce ? "0.013" : reward.toFixed(3)} ETH
        </span>
      </div>
    </>
  );

  if (reduce) {
    return <div className={cardClass}>{content}</div>;
  }

  return (
    <m.div
      className={cardClass}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
    >
      {content}
    </m.div>
  );
}
