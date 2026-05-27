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
  AreaChart,
  Area
} from "recharts";

interface VotesOverTimeChartProps {
  data: { date: string; votes: number }[];
}

export function VotesOverTimeChart({ data }: VotesOverTimeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
        <p className="text-zinc-500 text-sm">No voting activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-white tracking-tight">
        Voting Velocity
      </h3>
      
      <div className="h-64 w-full bg-[#111118]/60 border border-zinc-800/50 rounded-2xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(str) => {
                const date = new Date(str);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#09090b', 
                borderColor: '#27272a', 
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#a78bfa' }}
            />
            <Area 
              type="monotone" 
              dataKey="votes" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorVotes)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
