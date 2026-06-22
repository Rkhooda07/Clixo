"use client";

import React from "react";
import Link from "next/link";
import { Task } from "@/types";
import { Coins, Eye, CheckCircle2, ChevronRight } from "lucide-react";

interface TaskCardProps {
  task: Task;
  mode: "browse" | "creator-dashboard" | "worker-dashboard";
  hasVoted?: boolean;
  earnedEth?: string;
  optionPickedImage?: string;
}

export function TaskCard({ task, mode, hasVoted = false, earnedEth, optionPickedImage }: TaskCardProps) {
  const isCompleted = task.status === "COMPLETED" || task.status === "CLOSED" || task.status === "SETTLED";
  const rewardInEth = task.budget * 0.001; // converting credits to eth

  return (
    <div className="border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700/50 hover:bg-zinc-900/50 rounded-xl p-4 flex flex-col gap-4 transition-all duration-200 relative group overflow-hidden">
      {/* Header Image Area */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/30 select-none">
        {mode === "worker-dashboard" && optionPickedImage ? (
          <img
            src={optionPickedImage}
            alt="Option selected"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : task.options && task.options.length > 0 && task.options[0].gateway_url ? (
          <img
            src={task.options[0].gateway_url}
            alt="Task option"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              mode === "browse" && !hasVoted && !isCompleted ? "blur-[2px] brightness-90" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
            <span className="text-xs font-mono">No option preview</span>
          </div>
        )}

        {/* Option overlays */}
        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm border border-zinc-700/30 px-2 py-1 rounded-full text-xs font-semibold text-zinc-300">
          {task.optionsCount || task.options?.length || 0} Options
        </div>

        {/* Staked ETH badge */}
        <div className="absolute bottom-2 right-2 bg-gradient-to-r from-amber-600/90 to-amber-500/90 border border-amber-500/30 px-2 py-1 rounded-full text-xs font-mono font-bold text-white shadow-md flex items-center gap-1">
          <Coins className="w-3 h-3 text-white" />
          <span>{rewardInEth.toFixed(3)} ETH</span>
        </div>
      </div>

      {/* Body Metadata */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2 mt-1">
          <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 leading-snug group-hover:text-cyan-400 transition-colors">
            {task.title}
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
              isCompleted
                ? "bg-purple-900/40 text-purple-400 border border-purple-500/20"
                : "bg-emerald-900/40 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            {task.status}
          </span>
        </div>
        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
          Staked budget of {task.budget} credits. Open for worker voting.
        </p>
      </div>

      {/* Progress metrics */}
      <div className="flex flex-col gap-1.5 mt-1 pt-2 border-t border-zinc-800">
        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium">
          <span>Votes Progress</span>
          <span className="text-zinc-200">{task.totalSubmissions || 0} Votes</span>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                ((task.totalSubmissions || 0) / (task.budget || 10)) * 100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Bottom Actions based on Mode */}
      <div className="mt-2 flex items-center justify-between pt-2 border-t border-zinc-800">
        {mode === "browse" && (
          <>
            {hasVoted ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-full justify-center font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Voted ✓
              </div>
            ) : isCompleted ? (
              <Link
                href={`/tasks/${task.id}`}
                className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-800 hover:text-white hover:bg-zinc-700 border border-zinc-700/50 px-3 py-2 rounded-lg w-full justify-center font-semibold transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                View Standing
              </Link>
            ) : (
              <Link
                href={`/vote/${task.id}`}
                className="group/btn flex items-center gap-1.5 text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:from-cyan-700 active:to-blue-700 px-3 py-2 rounded-lg w-full justify-center font-bold transition-all shadow-sm"
              >
                <span>Vote Now</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </>
        )}

        {mode === "creator-dashboard" && (
          <Link
            href={`/tasks/${task.id}`}
            className="flex items-center gap-1.5 text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3 py-2 rounded-lg w-full justify-center font-bold transition-all shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            View Results →
          </Link>
        )}

        {mode === "worker-dashboard" && (
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] text-zinc-500">Earnings Status</span>
            <span
              className={`text-xs font-mono font-bold ${
                isCompleted ? "text-emerald-400" : "text-amber-400 animate-pulse"
              }`}
            >
              {isCompleted ? `+ ${earnedEth || "0.000"} ETH` : "Pending"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
