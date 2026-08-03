"use client";

import React from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { Thumbnail } from "@/types";
import { Card } from "@/components/ui/Card";
import { useCountUp } from "@/hooks/useCountUp";

interface WinnerBannerProps {
  winningOption: Thumbnail;
  totalVotes: number;
}

export function WinnerBanner({ winningOption, totalVotes }: WinnerBannerProps) {
  const votes = winningOption.votes || 0;
  const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  const src = winningOption.gateway_url || winningOption.image_url || "";

  // Counts up on mount; static under prefers-reduced-motion (handled by the hook).
  const displayPct = useCountUp(pct, true);

  return (
    <Card className="flex flex-col items-center gap-5 border-amber/30 p-10 shadow-[0_0_40px_rgba(232,160,32,0.08)]">
      <div className="flex items-center gap-2">
        <Trophy size={14} className="text-amber" aria-hidden="true" />
        <span className="eyebrow tracking-[0.15em]">Top Pick</span>
      </div>

      <div className="relative aspect-video w-full max-w-[480px] overflow-hidden rounded-sm border border-line">
        {src ? (
          <Image
            src={src}
            alt="Winning option"
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-raised" />
        )}
      </div>

      <div className="font-mono text-[13px] tracking-[0.02em] text-amber">
        {votes} opinions — {displayPct}%
      </div>
    </Card>
  );
}
