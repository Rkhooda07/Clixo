"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletUser } from "@/hooks/useWalletUser";
import { Loader2, Wallet } from "lucide-react";

export function ConnectButton() {
  const { isAuthenticating, isLogged, login } = useWalletUser();

  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) {
          return (
            <div className="w-[140px] h-[36px] bg-zinc-800 animate-pulse rounded-lg" />
          );
        }

        if (isAuthenticating) {
          return (
            <button
              disabled
              className="flex items-center gap-2 border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-sm font-medium px-4 py-2 rounded-lg font-mono"
            >
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              Authenticating...
            </button>
          );
        }

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className="relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:from-cyan-700 active:to-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              onClick={openAccountModal}
              className="bg-red-900/30 hover:bg-red-950/40 text-red-400 border border-red-900/50 text-sm font-medium px-4 py-2 rounded-lg"
            >
              Wrong Network
            </button>
          );
        }

        // If connected to wallet but not authenticated with backend
        if (!isLogged) {
          return (
            <button
              onClick={login}
              className="flex items-center gap-2 border border-cyan-500 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-400 text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Sign In
            </button>
          );
        }

        return (
          <button
            onClick={openAccountModal}
            className="flex items-center gap-2 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900/60 text-zinc-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg font-mono transition-colors shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{account.displayName}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-cyan-400 font-mono text-xs">{account.displayBalance}</span>
          </button>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
