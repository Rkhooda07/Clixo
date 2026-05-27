"use client";

import React from "react";
import Link from "next/link";
import { Layers, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0f] border-t border-zinc-900 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-tr from-purple-700 to-cyan-500 shadow-md shadow-purple-900/20">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Clixo<span className="text-purple-500 font-extrabold">.</span>
            </span>
          </Link>
          <p className="text-zinc-500 text-xs text-center md:text-left">
            Decentralized video thumbnail testing platform built on Ethereum.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <span>Smart Contract (Sepolia Etherscan)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-zinc-800">|</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </a>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800/80 bg-zinc-900/40 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span>Built on Ethereum</span>
        </div>
      </div>
    </footer>
  );
}
