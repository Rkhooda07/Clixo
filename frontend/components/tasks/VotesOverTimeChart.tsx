"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VotesOverTimeChartProps {
  data: { date: string; votes: number }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; color?: string }>;
  label?: string;
}

const mono = "JetBrains Mono, monospace";

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const date = (() => {
    if (!label) return "";
    try {
      return new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return label;
    }
  })();

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--line)",
        borderRadius: "5px",
        padding: "8px 12px",
        fontFamily: mono,
        fontSize: "12px",
      }}
    >
      <div style={{ color: "var(--text-3)", marginBottom: "4px", fontSize: "10px", letterSpacing: "0.06em" }}>
        {date}
      </div>
      {payload.map((entry: { value: number; color?: string }, i: number) => (
        <div key={i} style={{ color: entry.color, lineHeight: 1.6 }}>
          {entry.value} opinions
        </div>
      ))}
    </div>
  );
}

export function VotesOverTimeChart({ data }: VotesOverTimeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          padding: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--text-3)",
            letterSpacing: "0.06em",
          }}
        >
          No activity recorded yet.
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        padding: "24px",
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: "10px",
          color: "var(--text-3)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        Opinions Over Time
      </div>

      <div style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--line-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontFamily: mono, fontSize: 10, fill: "var(--text-3)" }}
              tickFormatter={(str) => {
                try {
                  return new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                } catch {
                  return str;
                }
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontFamily: mono, fontSize: 10, fill: "var(--text-3)" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="votes"
              stroke="var(--text-1)"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: "var(--text-1)", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
