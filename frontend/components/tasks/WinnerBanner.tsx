"use client";

import React from "react";
import { Trophy, CheckCircle2 } from "lucide-react";
import { Thumbnail } from "@/types";

interface WinnerBannerProps {
  winningOption: Thumbnail;
  totalVotes: number;
}

export function WinnerBanner({ winningOption, totalVotes }: WinnerBannerProps) {
  const votePercentage = totalVotes > 0 
    ? Math.round(((winningOption.votes || 0) / totalVotes) * 100) 
    : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-[#111118]/80 p-6 shadow-2xl shadow-amber-900/10">
      {/* Decorative background effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -z-10" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/5 blur-[60px] -z-10" />
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative shrink-0 group">
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
          <div className="relative aspect-video w-64 md:w-80 rounded-2xl overflow-hidden border border-amber-500/30">
            <img 
              src={winningOption.gateway_url || winningOption.image_url || ""} 
              alt="Winning Option" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-black text-xs font-black shadow-lg">
              <Trophy className="w-3.5 h-3.5" />
              <span>WINNER</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
              Most Clickable Thumbnail Identified
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
              The community has reached consensus. This thumbnail outperformed others by a significant margin. 
              We recommend using this for your next video upload.
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-8 mt-2">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Community Confidence</p>
              <p className="text-3xl font-black text-amber-500 font-mono">{votePercentage}%</p>
            </div>
            <div className="w-px h-10 bg-zinc-800" />
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Total Consensus Votes</p>
              <p className="text-3xl font-black text-white font-mono">{winningOption.votes || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
