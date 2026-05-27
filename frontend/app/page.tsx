"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { statsApi } from "@/lib/api";
import { PlatformStats } from "@/types";
import {
  Upload,
  Vote,
  Trophy,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";

export default function LandingPage() {
  const [stats, setStats] = useState<PlatformStats>({
    totalTasks: 0,
    totalEthDistributed: "0.000",
    totalWorkers: 0,
  });

  useEffect(() => {
    statsApi.get().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center text-center">
        {/* Powered by Ethereum Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-500/20 bg-purple-950/20 text-purple-400 text-xs font-semibold mb-6 animate-pulse select-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span>⚡ Powered by Ethereum Sepolia</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-black font-sans text-white tracking-tight leading-[1.1] max-w-3xl mb-6">
          Let the crowd pick your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 drop-shadow-sm">
            best thumbnail
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
          Upload your thumbnail variations, stake ETH as a reward, and gather immediate feedback from real Web3 workers who earn for their accuracy.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto">
          <Link
            href="/create-task"
            className="w-full sm:w-auto bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2"
          >
            <span>Create a Task</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/browse"
            className="w-full sm:w-auto border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:bg-zinc-900/60 text-zinc-300 font-semibold text-sm px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Start Earning</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </Link>
        </div>

        {/* Live Counters */}
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
      </section>

      {/* How It Works Section */}
      <section className="relative w-full border-y border-zinc-900 bg-[#0c0c13] py-20 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              How Clixo Works
            </h2>
            <p className="text-zinc-500 text-sm mt-2">
              Get direct signal in three simple decentralized steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-14 h-14 rounded-full bg-purple-950/40 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-lg mb-6 shadow-inner ring-4 ring-purple-950/20">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Upload</h3>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-[240px]">
                Task Creator uploads up to 10 video thumbnail variations and stakes Sepolia ETH reward.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-14 h-14 rounded-full bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-lg mb-6 shadow-inner ring-4 ring-cyan-950/20">
                <Vote className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Vote</h3>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-[240px]">
                Workers browse open test campaigns, review descriptions, and cast double-blind votes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-14 h-14 rounded-full bg-amber-950/40 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-lg mb-6 shadow-inner ring-4 ring-amber-950/20">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Win</h3>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-[240px]">
                The highest-rated thumbnail wins the stake, and victorious voters split the staked reward pools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Value Proposition */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Creators Card */}
          <div className="border border-zinc-800/80 bg-[#111118]/80 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-[40px] pointer-events-none" />
            <TrendingUp className="w-10 h-10 text-purple-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">For Video Creators</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Stop playing guessing games with the YouTube algorithm. Test CTR potential using crowdsourced Ethereum validators before uploading.
            </p>
            <ul className="space-y-2.5 mb-8 text-xs text-zinc-500 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Upload up to 10 designs in seconds</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Real human signal from native platform workers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Winner declared with Recharts analytics</span>
              </li>
            </ul>
            <Link
              href="/create-task"
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Launch a thumbnail test campaign</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Workers Card */}
          <div className="border border-zinc-800/80 bg-[#111118]/80 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
            <Award className="w-10 h-10 text-cyan-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">For Web3 Workers</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Monetize your creative instincts. Correctly identify the most clickable thumbnail options and split the staked bounty rewards.
            </p>
            <ul className="space-y-2.5 mb-8 text-xs text-zinc-500 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Browse campaigns with full wallet safety</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Earn instant Sepolia ETH upon completion</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Direct payout withdrawals through smart escrow contracts</span>
              </li>
            </ul>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Browse open task campaigns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}