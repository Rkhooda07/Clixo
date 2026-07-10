"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid var(--line)" }}
      className="w-full py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div
              style={{ background: "var(--text-1)", borderRadius: "3px" }}
              className="w-[15px] h-[15px]"
            />
            <span
              style={{
                fontFamily: "Geist, system-ui, sans-serif",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--text-1)",
                fontSize: "13px",
              }}
            >
              Clixo
            </span>
          </Link>
          <p style={{ color: "var(--text-3)", fontSize: "12px" }}>
            Decentralised opinion market on Ethereum.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-3)", fontSize: "12px" }}
            className="flex items-center gap-1 hover:text-[var(--text-2)] transition-colors"
          >
            <span>Sepolia Etherscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-3)", fontSize: "12px" }}
            className="flex items-center gap-1 hover:text-[var(--text-2)] transition-colors"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Network status */}
        <div className="flex items-center gap-2" style={{ color: "var(--text-3)", fontSize: "12px" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
          <span>Sepolia Testnet</span>
        </div>
      </div>
    </footer>
  );
}
