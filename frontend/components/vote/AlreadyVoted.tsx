"use client";

import React from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Thumbnail } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface AlreadyVotedProps {
  votedOption: Thumbnail | undefined;
  options: Thumbnail[];
  totalVotes: number;
}

function StandingBar({ pct, isMyVote }: { pct: number; isMyVote: boolean }) {
  const shouldReduce = useReducedMotion();
  const fillClass = cn("h-full", isMyVote ? "bg-hi" : "bg-dim");

  return (
    <div className="h-0.5 overflow-hidden rounded-[1px] bg-line">
      {shouldReduce ? (
        <div className={fillClass} style={{ width: `${pct}%` }} />
      ) : (
        <m.div
          className={fillClass}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </div>
  );
}

export function AlreadyVoted({
  votedOption,
  options,
  totalVotes,
}: AlreadyVotedProps) {
  const votedSrc = votedOption?.gateway_url || votedOption?.image_url || "";

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 px-6 py-12">
      {/* Header */}
      <div>
        <div className="eyebrow mb-2.5">Opinion Recorded</div>
        <h2 className="m-0 text-2xl">
          You&apos;ve already answered this task.
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-lo">
          You&apos;ll earn ETH once this task closes and opinions are settled.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-line" />

      {/* Content: voted image + standings */}
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        {/* Your selection */}
        <div>
          <div className="eyebrow mb-3">Your Selection</div>
          <div className="relative aspect-video overflow-hidden rounded-sm border border-hi">
            {votedSrc ? (
              <Image
                src={votedSrc}
                alt="Your selected option"
                fill
                sizes="50vw"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center bg-raised font-mono text-[10px] text-dim">
                no image
              </span>
            )}
            {/* Voted badge */}
            <span
              className="absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink"
              aria-hidden="true"
            >
              <Check size={9} strokeWidth={3} className="text-hi" />
            </span>
          </div>
        </div>

        {/* Current standings */}
        <div>
          <div className="eyebrow mb-4">Current Standings</div>
          <Card className="flex flex-col gap-4 p-4">
            {options.map((opt, i) => {
              const pct =
                totalVotes > 0
                  ? Math.round(((opt.votes || 0) / totalVotes) * 100)
                  : 0;
              const isMyVote = opt.id === votedOption?.id;

              return (
                <div key={opt.id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-mono text-[10px] tracking-[0.04em]",
                          isMyVote ? "text-hi" : "text-dim"
                        )}
                      >
                        Option {String.fromCharCode(65 + i)}
                      </span>
                      {isMyVote && <Badge>Your pick</Badge>}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[11px]",
                        isMyVote ? "text-hi" : "text-dim"
                      )}
                    >
                      {pct}%
                    </span>
                  </div>
                  <StandingBar pct={pct} isMyVote={isMyVote} />
                </div>
              );
            })}

            {/* Totals */}
            <div className="flex justify-between border-t border-line pt-3">
              <span className="eyebrow tracking-[0.08em]">Total opinions</span>
              <span className="font-mono text-[11px] text-lo">{totalVotes}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
