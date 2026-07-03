"use client";

import React from "react";
import Image from "next/image";
import { Thumbnail } from "@/types";

interface WinnerBannerProps {
  winningOption: Thumbnail;
  totalVotes: number;
}

const mono = "JetBrains Mono, monospace";

export function WinnerBanner({ winningOption, totalVotes }: WinnerBannerProps) {
  const votes = winningOption.votes || 0;
  const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  const src = winningOption.gateway_url || winningOption.image_url || "";

  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: "10px",
          color: "var(--text-3)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        Winner
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          position: "relative",
          aspectRatio: "16 / 9",
          border: "1px solid var(--text-1)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        {src ? (
          <Image
            src={src}
            alt="Winning thumbnail"
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "var(--surface-2)" }} />
        )}
      </div>

      <div
        style={{
          fontFamily: mono,
          fontSize: "13px",
          color: "var(--amber)",
          letterSpacing: "0.02em",
        }}
      >
        Ξ {votes} votes — {pct}%
      </div>
    </div>
  );
}
