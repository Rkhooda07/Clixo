"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Thumbnail } from "@/types";

interface ResultsChartProps {
  thumbnails: Thumbnail[];
}

export function ResultsChart({ thumbnails }: ResultsChartProps) {
  // Map thumbnails to data format for Recharts
  const totalVotes = thumbnails.reduce((acc, t) => acc + (t.votes || 0), 0);
  
  const data = thumbnails
    .map((item, idx) => {
      const votes = item.votes || 0;
      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
      return {
        name: `Option #${idx + 1}`,
        votes: votes,
        percentage: Number(percentage.toFixed(1)),
        gateway_url: item.gateway_url,
      };
    })
    .sort((a, b) => b.votes - a.votes); // sort descending

  const maxVotes = data.length > 0 ? data[0].votes : 0;

  if (totalVotes === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/20 border border-zinc-800 rounded-xl">
        <span className="text-zinc-500 text-sm font-mono">No votes recorded yet</span>
      </div>
    );
  }

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#111118] border border-zinc-800 px-3 py-2 rounded-lg text-xs shadow-2xl">
          <div className="font-semibold text-white mb-1">{data.name}</div>
          <div className="text-purple-400 font-mono">Votes: {data.votes}</div>
          <div className="text-cyan-400 font-mono">Ratio: {data.percentage}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px] bg-[#111118]/40 border border-zinc-800/80 rounded-2xl p-5 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#71717a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => {
              const isWinner = entry.votes === maxVotes && maxVotes > 0;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isWinner ? "#7c3aed" : "#27272a"}
                  style={{
                    filter: isWinner ? "drop-shadow(0 0 8px rgba(124, 58, 237, 0.4))" : "none",
                  }}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export default ResultsChart;
