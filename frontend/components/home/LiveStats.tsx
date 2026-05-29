"use client";

import React, { useEffect, useState } from "react";
import { statsApi } from "@/lib/api";
import { PlatformStats } from "@/types";

const INITIAL_STATS: PlatformStats = {
  totalTasks: 0,
  totalEthDistributed: "0.000",
  totalWorkers: 0,
};

export function LiveStats() {
  const [stats, setStats] = useState<PlatformStats>(INITIAL_STATS);

  useEffect(() => {
    let active = true;

    statsApi
      .get()
      .then((nextStats) => {
        if (active) {
          setStats(nextStats);
        }
      })
      .catch(console.error);

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full max-w-3xl border border-zinc-800/80 bg-[#111118]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 grid grid-cols-3 gap-6 shadow-2xl relative">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="flex flex-col items-center">
        <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono mb-1">
          {stats.totalTasks}
        </span>
        <span className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">
          Tasks Run
        </span>
      </div>
      <div className="flex flex-col items-center border-x border-zinc-900">
        <span className="text-2xl sm:text-4xl font-extrabold text-purple-400 tracking-tight font-mono mb-1">
          Ξ {stats.totalEthDistributed}
        </span>
        <span className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">
          ETH Earned
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono mb-1">
          {stats.totalWorkers}
        </span>
        <span className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">
          Active Workers
        </span>
      </div>
    </div>
  );
}
