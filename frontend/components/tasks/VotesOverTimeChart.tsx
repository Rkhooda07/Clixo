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
import { Card } from "@/components/ui/Card";

interface VotesOverTimeChartProps {
  data: { date: string; votes: number }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; color?: string }>;
  label?: string;
}

// Recharts tick props are SVG attributes, not classes — CSS var keeps the font tokenized.
const TICK_STYLE = {
  fontFamily: "var(--font-jetbrains), monospace",
  fontSize: 10,
  fill: "var(--text-3)",
};

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
    <div className="rounded-md border border-line bg-raised px-3 py-2 font-mono text-xs">
      <div className="mb-1 text-[10px] tracking-[0.06em] text-dim">{date}</div>
      {payload.map((entry, i) => (
        <div key={i} className="leading-relaxed text-hi">
          {entry.value} opinions
        </div>
      ))}
    </div>
  );
}

export function VotesOverTimeChart({ data }: VotesOverTimeChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex items-center justify-center p-10">
        <span className="font-mono text-[11px] tracking-[0.06em] text-dim">
          No activity recorded yet.
        </span>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="eyebrow mb-5">Opinions Over Time</div>

      <div className="h-[200px]">
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
              tick={TICK_STYLE}
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
              tick={TICK_STYLE}
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
    </Card>
  );
}
