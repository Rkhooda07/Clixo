"use client";

import React from "react";
import { LayoutGrid, ClipboardList } from "lucide-react";

interface ActivityTabsProps {
  activeTab: "my-tasks" | "my-work";
  onTabChange: (tab: "my-tasks" | "my-work") => void;
  myTasksCount: number;
  myWorkCount: number;
}

export function ActivityTabs({ activeTab, onTabChange, myTasksCount, myWorkCount }: ActivityTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-px">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onTabChange("my-tasks")}
          className={`relative px-4 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "my-tasks"
              ? "text-purple-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          My Tasks
          <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            activeTab === "my-tasks"
              ? "bg-purple-500/20 text-purple-400"
              : "bg-zinc-800 text-zinc-500"
          }`}>
            {myTasksCount}
          </span>
          {activeTab === "my-tasks" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => onTabChange("my-work")}
          className={`relative px-4 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "my-work"
              ? "text-cyan-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          My Work
          <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            activeTab === "my-work"
              ? "bg-cyan-500/20 text-cyan-400"
              : "bg-zinc-800 text-zinc-500"
          }`}>
            {myWorkCount}
          </span>
          {activeTab === "my-work" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
}
