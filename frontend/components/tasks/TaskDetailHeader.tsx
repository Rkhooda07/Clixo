"use client";

import React from "react";
import { Task } from "@/types";
import { Share2, Clock, Coins, CheckCircle2 } from "lucide-react";

interface TaskDetailHeaderProps {
  task: Task;
  isOwner: boolean;
}

export function TaskDetailHeader({ task, isOwner }: TaskDetailHeaderProps) {
  const isCompleted = task.status === "COMPLETED" || task.status === "CLOSED" || task.status === "SETTLED";
  const rewardInEth = (task.budget || 0) * 0.001;

  const handleShare = () => {
    const url = `${window.location.origin}/vote/${task.id}`;
    navigator.clipboard.writeText(url);
    alert("Voting link copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
              isCompleted 
                ? "bg-purple-900/40 text-purple-400 border-purple-500/20" 
                : "bg-emerald-900/40 text-emerald-400 border-emerald-500/20"
            }`}>
              {task.status}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-500 font-medium">Created {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
            {task.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700/30 text-zinc-300 hover:text-white hover:border-zinc-600 transition-all text-sm font-semibold"
          >
            <Share2 className="w-4 h-4" />
            Share Voting Link
          </button>
          
          {isOwner && !isCompleted && (
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all text-sm font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              Finalize Results
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-900/30 border border-amber-500/20 text-amber-500">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-500 uppercase">Staked Reward</p>
            <p className="text-sm font-mono font-bold text-white">{rewardInEth.toFixed(3)} ETH</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-500 uppercase">Total Votes</p>
            <p className="text-sm font-bold text-white">{task.totalSubmissions || 0}</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-900/30 border border-cyan-500/20 text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-500 uppercase">Deadline</p>
            <p className="text-sm font-bold text-white">
              {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
