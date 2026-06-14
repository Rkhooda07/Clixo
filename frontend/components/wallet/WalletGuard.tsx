"use client";

import React from "react";
import { useWalletUser } from "@/hooks/useWalletUser";
import { ConnectButton } from "./ConnectButton";
import { ShieldAlert, KeyRound, Loader2 } from "lucide-react";

export function WalletGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, token, isInitializing, address, walletAddress } = useWalletUser();

  if (isInitializing) {
    return (
      <div className="flex-1 min-h-[70vh] w-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  // Case 1: No session token at all - must connect and sign
  if (!token) {
    return (
      <div className="flex-1 min-h-[70vh] w-full flex flex-col items-center justify-center p-6 relative">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-900/10 rounded-full blur-[80px] -z-10" />

        <div className="max-w-md w-full border border-zinc-800 bg-[#111118]/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          
          <div className="inline-flex p-4 rounded-full bg-purple-950/40 text-purple-400 mb-6 ring-8 ring-purple-950/20 border border-purple-500/20">
            <KeyRound className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Secure Web3 Access Required
          </h2>
          
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            Clixo secures your account using your Ethereum wallet. Connect and authenticate your identity to manage tasks or submit worker votes.
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <ConnectButton />
            
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>One wallet = One account. No passwords needed.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Has token, but wallet is disconnected (common on page refresh/nav)
  if (!isConnected) {
    return (
      <div className="flex-1 min-h-[70vh] w-full flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full border border-zinc-800 bg-[#111118]/80 backdrop-blur-md rounded-2xl p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Reconnecting Wallet...</h3>
          <p className="text-zinc-400 text-xs mb-6">
            We found an active session for <span className="text-purple-400 font-mono">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>. 
            Waiting for your wallet provider to reconnect.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  // Case 3: Connected but address mismatch (handled by useWalletUser logout, but safety check)
  if (walletAddress && address && walletAddress.toLowerCase() !== address.toLowerCase()) {
    return (
      <div className="flex-1 min-h-[70vh] w-full flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full border border-red-900/30 bg-red-950/10 backdrop-blur-md rounded-2xl p-8 text-center border-dashed">
          <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Wallet Mismatch</h3>
          <p className="text-zinc-400 text-xs mb-6">
            The connected wallet does not match your active session. Please switch back or sign in again.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
