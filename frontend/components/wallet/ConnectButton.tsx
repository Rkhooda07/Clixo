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
            <div className="w-[140px] h-[38px] bg-zinc-800 animate-pulse rounded-lg" />
          );
        }

        if (isAuthenticating) {
          return (
            <button
              disabled
              className="flex items-center gap-2 border border-purple-500/30 bg-purple-950/20 text-purple-400 text-sm font-medium px-4 py-2 rounded-lg font-mono"
            >
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              Authenticating...
            </button>
          );
        }

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className="relative group overflow-hidden bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] flex items-center gap-2"
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
              className="flex items-center gap-2 border border-purple-500 bg-purple-950/40 hover:bg-purple-900/60 text-purple-400 text-sm font-bold px-5 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(124,58,237,0.2)]"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Sign In
            </button>
          );
        }

        return (
          <button
            onClick={openAccountModal}
            className="flex items-center gap-2 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900/60 text-zinc-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg font-mono transition-colors shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{account.displayName}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-purple-400 font-mono text-xs">{account.displayBalance}</span>
          </button>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
