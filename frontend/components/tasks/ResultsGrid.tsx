"use client";

import React from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { Thumbnail } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ResultsGridProps {
  options: Thumbnail[];
  totalVotes: number;
}

function DistributionBar({ pct, isWinner }: { pct: number; isWinner: boolean }) {
  const shouldReduce = useReducedMotion();
  const fillClass = cn(
    "h-full rounded-[1px]",
    isWinner ? "bg-hi" : "bg-dim"
  );

  return (
    <div className="h-[3px] w-full overflow-hidden rounded-[1px] bg-line">
      {shouldReduce ? (
        <div className={fillClass} style={{ width: `${pct}%` }} />
      ) : (
        <m.div
          className={fillClass}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </div>
  );
}

function optionThumb(src: string, rank: string) {
  return src ? (
    <Image
      src={src}
      alt={`Option ${rank}`}
      width={80}
      height={45}
      className="block h-full w-full object-cover"
    />
  ) : null;
}

export function ResultsGrid({ options, totalVotes }: ResultsGridProps) {
  const sorted = [...options].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const winnerId = sorted[0]?.id;

  const rows = sorted.map((option, i) => {
    const votes = option.votes || 0;
    return {
      option,
      rank: String(i + 1).padStart(2, "0"),
      votes,
      pct: totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0,
      isWinner: option.id === winnerId,
      src: option.gateway_url || option.image_url || "",
    };
  });

  return (
    <>
      {/* Desktop: table */}
      <table className="hidden w-full border-collapse md:table">
        <thead>
          <tr>
            {["Rank", "Option", "Opinions", "%", "Distribution"].map((h) => (
              <th
                key={h}
                className="border-b border-line px-3 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-dim"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ option, rank, votes, pct, isWinner, src }) => (
            <tr
              key={option.id}
              className="border-b border-subtle transition-colors duration-100 hover:bg-raised"
            >
              <td className="h-16 w-12 px-3 align-middle">
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    isWinner ? "text-hi" : "text-dim"
                  )}
                >
                  {rank}
                </span>
              </td>

              <td className="h-16 px-3 align-middle">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-[45px] w-20 shrink-0 overflow-hidden rounded-xs bg-raised">
                    {optionThumb(src, rank)}
                  </div>
                  {isWinner && <Badge variant="green">Top Pick</Badge>}
                </div>
              </td>

              <td className="h-16 px-3 align-middle">
                <span
                  className={cn(
                    "font-mono text-[13px]",
                    isWinner ? "text-hi" : "text-lo"
                  )}
                >
                  {votes}
                </span>
              </td>

              <td className="h-16 w-16 px-3 align-middle">
                <span
                  className={cn(
                    "font-mono text-xs",
                    isWinner ? "text-hi" : "text-lo"
                  )}
                >
                  {pct}%
                </span>
              </td>

              <td className="h-16 pr-3 align-middle">
                <div className="w-[200px]">
                  <DistributionBar pct={pct} isWinner={isWinner} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked rows */}
      <div className="flex flex-col md:hidden">
        {rows.map(({ option, rank, votes, pct, isWinner, src }) => (
          <div
            key={option.id}
            className="flex flex-col gap-2.5 border-b border-subtle p-4 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-16 shrink-0 overflow-hidden rounded-xs bg-raised">
                {optionThumb(src, rank)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-mono text-[11px]",
                      isWinner ? "text-hi" : "text-lo"
                    )}
                  >
                    Option {rank}
                  </span>
                  {isWinner && <Badge variant="green">Top Pick</Badge>}
                </div>
                <span className="font-mono text-[10px] text-dim">
                  {votes} opinions
                </span>
              </div>
              <span
                className={cn(
                  "font-mono text-xs",
                  isWinner ? "text-hi" : "text-lo"
                )}
              >
                {pct}%
              </span>
            </div>
            <DistributionBar pct={pct} isWinner={isWinner} />
          </div>
        ))}
      </div>
    </>
  );
}
