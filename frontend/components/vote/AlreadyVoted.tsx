"use client";

import React from "react";
import { CheckCircle2, TrendingUp, Users } from "lucide-react";
import { Thumbnail } from "@/types";

interface AlreadyVotedProps {
  votedOption: Thumbnail | undefined;
  options: Thumbnail[];
  totalVotes: number;
}

export function AlreadyVoted({ votedOption, options, totalVotes }: AlreadyVotedProps) {
  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-4 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-500 shadow-2xl shadow-emerald-900/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-white">Your Vote is Locked In!</h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Thank you for participating. Your contribution helps creators optimize their content using decentralized consensus.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Your Selection */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            Your Selection
          </h3>
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-900/10">
            <img 
              src={votedOption?.gateway_url || votedOption?.image_url || ""} 
              alt="Your voted thumbnail"
              className="w-full aspect-video object-cover"
            />
            <div className="absolute top-4 left-4 bg-emerald-500 text-black px-3 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>YOUR CHOICE</span>
            </div>
          </div>
        </div>

        {/* Live Standings */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            Current Standings
          </h3>
          <div className="bg-[#111118]/80 border border-zinc-800/60 rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
            {options.map((opt) => {
              const percentage = totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
              const isVoted = opt.id === votedOption?.id;
              
              return (
                <div key={opt.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={isVoted ? "text-emerald-400" : "text-zinc-400"}>
                      Option {isVoted && "(Your Vote)"}
                    </span>
                    <span className="text-white font-mono">{percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isVoted ? "bg-emerald-500" : "bg-purple-600/60"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-4 border-t border-zinc-800/50 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Total Voters</p>
                  <p className="text-sm font-bold text-white">{totalVotes}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Status</p>
                  <p className="text-sm font-bold text-emerald-500">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
