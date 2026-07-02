"use client";

import React from "react";
import Image from "next/image";
import { Thumbnail } from "@/types";

interface ResultsGridProps {
  options: Thumbnail[];
  totalVotes: number;
}

export function ResultsGrid({ options, totalVotes }: ResultsGridProps) {
  // Sort options by votes descending
  const sortedOptions = [...options].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        Individual Standing
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedOptions.map((option, index) => {
          const votePercentage = totalVotes > 0 
            ? Math.round(((option.votes || 0) / totalVotes) * 100) 
            : 0;
            
          return (
            <div 
              key={option.id} 
              className={`relative border rounded-2xl p-4 flex flex-col gap-4 transition-all duration-300 ${
                index === 0 
                  ? "bg-amber-950/10 border-amber-500/30 shadow-lg shadow-amber-900/5" 
                  : "bg-zinc-900/40 border-zinc-800/80"
              }`}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800/50">
                <Image
                  src={option.gateway_url || option.image_url || ""}
                  alt={`Option ${index + 1}`}
                  fill
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black shadow-lg ${
                  index === 0 ? "bg-amber-500 text-black" : "bg-black/60 text-white backdrop-blur-md"
                }`}>
                  RANK #{index + 1}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">Vote Distribution</span>
                  <span className={`text-sm font-black font-mono ${index === 0 ? "text-amber-500" : "text-white"}`}>
                    {votePercentage}%
                  </span>
                </div>
                
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === 0 ? "bg-amber-500" : "bg-purple-600"
                    }`}
                    style={{ width: `${votePercentage}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>{option.votes || 0} Votes</span>
                  <span>{totalVotes} Total</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
