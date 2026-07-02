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
  noBorder?: boolean;
}

function StatCell({ label, value, isEth = false, noBorder = false }: StatCellProps) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderLeft: noBorder ? "none" : "1px solid var(--line)",
        flex: 1,
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
        display: "flex",
        background: "var(--surface-1)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <StatCell
        label="ETH Balance"
        value={`Ξ ${stats.ethBalance ?? "0.000"}`}
        isEth
        noBorder
      />
      <StatCell
        label="Tasks Created"
        value={String(stats.tasksCreated ?? 0)}
      />
      <StatCell
        label="ETH Spent"
        value={`Ξ ${stats.ethSpent ?? "0.000"}`}
        isEth
      />
      <StatCell
        label="ETH Earned"
        value={`Ξ ${stats.ethEarned ?? "0.000"}`}
        isEth
      />
    </div>
  );
}
