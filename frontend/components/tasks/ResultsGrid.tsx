"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Thumbnail } from "@/types";

interface ResultsGridProps {
  options: Thumbnail[];
  totalVotes: number;
}

const mono = "JetBrains Mono, monospace";

const TH_STYLE: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "10px",
  color: "var(--text-3)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  fontWeight: 400,
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid var(--line)",
};

function ResultRow({
  option,
  rank,
  totalVotes,
  isWinner,
}: {
  option: Thumbnail;
  rank: number;
  totalVotes: number;
  isWinner: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const votes = option.votes || 0;
  const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  const src = option.gateway_url || option.image_url || "";

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--surface-2)" : "transparent",
        borderBottom: "1px solid var(--line-subtle)",
        transition: "background 0.1s",
      }}
    >
      <td style={{ padding: "0 12px", height: "64px", verticalAlign: "middle", width: "48px" }}>
        <span style={{ fontFamily: mono, fontSize: "11px", color: "var(--text-3)" }}>
          #{rank}
        </span>
      </td>

      <td style={{ padding: "0 12px", height: "64px", verticalAlign: "middle", width: "104px" }}>
        <div
          style={{
            width: "80px",
            height: "45px",
            borderRadius: "2px",
            overflow: "hidden",
            position: "relative",
            background: "var(--surface-2)",
            flexShrink: 0,
          }}
        >
          {src ? (
            <Image
              src={src}
              alt={`Option ${rank}`}
              width={80}
              height={45}
              style={{ objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "var(--surface-2)" }} />
          )}
        </div>
      </td>

      <td style={{ padding: "0 12px", height: "64px", verticalAlign: "middle" }}>
        <span style={{ fontFamily: mono, fontSize: "13px", color: "var(--text-1)" }}>
          {votes}
        </span>
      </td>

      <td style={{ padding: "0 12px", height: "64px", verticalAlign: "middle", width: "64px" }}>
        <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--text-2)" }}>
          {pct}%
        </span>
      </td>

      <td style={{ padding: "0 12px 0 0", height: "64px", verticalAlign: "middle" }}>
        <div
          style={{
            width: "200px",
            height: "3px",
            background: "var(--line)",
            borderRadius: "1px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: isWinner ? "var(--text-1)" : "var(--line)",
              borderRadius: "1px",
              transition: "width 0.4s ease-out",
            }}
          />
        </div>
      </td>
    </tr>
  );
}

export function ResultsGrid({ options, totalVotes }: ResultsGridProps) {
  const sorted = [...options].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const winnerId = sorted[0]?.id;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["Rank", "Thumbnail", "Votes", "%", "Distribution"].map((h) => (
            <th key={h} style={TH_STYLE}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((option, i) => (
          <ResultRow
            key={option.id}
            option={option}
            rank={i + 1}
            totalVotes={totalVotes}
            isWinner={option.id === winnerId}
          />
        ))}
      </tbody>
    </table>
  );
}
