"use client";

import React from "react";

interface StatsRowProps {
  stats: {
    ethBalance?: string;
    tasksCreated?: number;
    ethSpent?: string;
    ethEarned?: string;
  };
}

const mono = "JetBrains Mono, monospace";

interface StatCellProps {
  label: string;
  value: string;
  isEth?: boolean;
  borderLeft?: boolean;
}

function StatCell({ label, value, isEth = false, borderLeft = false }: StatCellProps) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderLeft: borderLeft ? "1px solid var(--line)" : "none",
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: "10px",
          color: "var(--text-3)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: "22px",
          color: isEth ? "var(--amber)" : "var(--text-1)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      {/* Desktop: 4 columns in one row | Mobile: 2×2 grid with row divider */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        <StatCell label="ETH Balance" value={`Ξ ${stats.ethBalance ?? "0.000"}`} isEth />
        <StatCell label="Tasks Created" value={String(stats.tasksCreated ?? 0)} borderLeft />
        {/* Row divider — mobile only, sits between the two rows in the 2-col grid */}
        <div
          className="col-span-2 md:hidden"
          style={{ height: "1px", background: "var(--line)" }}
        />
        <StatCell label="ETH Spent" value={`Ξ ${stats.ethSpent ?? "0.000"}`} isEth />
        <StatCell label="ETH Earned" value={`Ξ ${stats.ethEarned ?? "0.000"}`} isEth borderLeft />
      </div>
    </div>
  );
}
