"use client";

import React from "react";
import { Wallet, Briefcase, CreditCard, Landmark } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  color: "cyan" | "emerald" | "amber";
}

function StatCard({ label, value, subValue, icon: Icon, color }: StatCardProps) {
  const colorMap = {
    cyan: "from-cyan-500/10 to-cyan-600/5 text-cyan-400 border-cyan-500/20",
    emerald: "from-emerald-500/10 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
    amber: "from-amber-500/10 to-amber-600/5 text-amber-400 border-amber-500/20",
  };

  const iconBgMap = {
    cyan: "bg-cyan-950/40 border-cyan-500/20 text-cyan-400",
    emerald: "bg-emerald-950/40 border-emerald-500/20 text-emerald-400",
    amber: "bg-amber-950/40 border-amber-500/20 text-amber-400",
  };

  return (
    <div className={`relative overflow-hidden group border rounded-xl bg-gradient-to-br p-5 transition-all duration-300 hover:scale-[1.01] ${colorMap[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-zinc-400 mb-1">{label}</p>
          <h3 className="text-xl font-bold tracking-tight text-white">{value}</h3>
          {subValue && <p className="text-[10px] text-zinc-500 mt-1">{subValue}</p>}
        </div>
        <div className={`p-2 rounded-lg border ${iconBgMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      {/* Decorative corner glow */}
      <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-current opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-opacity" />
    </div>
  );
}

interface StatsRowProps {
  stats: {
    ethBalance?: string;
    tasksCreated?: number;
    ethSpent?: string;
    ethEarned?: string;
  };
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Tasks Created"
        value={stats.tasksCreated?.toString() || "0"}
        icon={Briefcase}
        color="cyan"
      />
      <StatCard
        label="Total Spent"
        value={`${stats.ethSpent || "0.000"} ETH`}
        icon={CreditCard}
        color="emerald"
      />
      <StatCard
        label="Total Earned"
        value={`${stats.ethEarned || "0.000"} ETH`}
        icon={Landmark}
        color="amber"
      />
      <StatCard
        label="Wallet Balance"
        value={`${stats.ethBalance || "0.000"} ETH`}
        icon={Wallet}
        color="cyan"
      />
    </div>
  );
}
