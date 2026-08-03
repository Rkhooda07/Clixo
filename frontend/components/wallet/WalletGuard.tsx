"use client";

import React from "react";
import { useWalletUser } from "@/hooks/useWalletUser";
import { ConnectButton } from "./ConnectButton";

function AuthPrompt({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="w-full max-w-[400px]">
        <div className="eyebrow mb-4">Authentication Required</div>
        <h2 className="text-[22px] mb-2.5">{title}</h2>
        <p className="text-[13px] text-lo leading-relaxed mb-7">{body}</p>
        {children}
        <p className="font-mono text-[10px] text-dim mt-4 leading-normal">
          One wallet = one account. No passwords.
        </p>
      </div>
    </div>
  );
}

export function WalletGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, token, isInitializing } = useWalletUser();

  if (isInitializing) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="font-mono text-[11px] text-dim tracking-[0.06em]">
          Initializing...
        </span>
      </div>
    );
  }

  if (!token) {
    return (
      <AuthPrompt
        title="Connect your wallet to continue."
        body="Clixo uses your Ethereum wallet to identify you. Connect and sign to post tasks or share your opinion."
      >
        <ConnectButton />
      </AuthPrompt>
    );
  }

  if (!isConnected) {
    return (
      <AuthPrompt
        title="Reconnecting wallet..."
        body="We found an active session. Waiting for your wallet provider to reconnect."
      >
        <ConnectButton />
      </AuthPrompt>
    );
  }

  return <>{children}</>;
}
