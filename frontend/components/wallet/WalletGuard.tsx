"use client";

import React from "react";
import { useWalletUser } from "@/hooks/useWalletUser";
import { ConnectButton } from "./ConnectButton";

const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";
const inter = "Inter, system-ui, sans-serif";

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minHeight: "calc(100dvh - 52px)",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: "10px",
            color: "var(--text-3)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Authentication Required
        </div>
        <h2
          style={{
            fontFamily: geist,
            fontSize: "22px",
            fontWeight: 500,
            color: "var(--text-1)",
            letterSpacing: "-0.02em",
            marginBottom: "10px",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: inter,
            fontSize: "13px",
            color: "var(--text-2)",
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          {body}
        </p>
        {children}
        <p
          style={{
            fontFamily: mono,
            fontSize: "10px",
            color: "var(--text-3)",
            marginTop: "16px",
            lineHeight: 1.5,
          }}
        >
          One wallet = one account. No passwords.
        </p>
      </div>
    </div>
  );
}

export function WalletGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, token, isInitializing, address } = useWalletUser();

  if (isInitializing) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          minHeight: "calc(100dvh - 52px)",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--text-3)",
            letterSpacing: "0.06em",
          }}
        >
          Initializing...
        </span>
      </div>
    );
  }

  if (!token) {
    return (
      <AuthPrompt
        title="Connect your wallet to continue."
        body="Clixo uses your Ethereum wallet to identify you. Connect and sign to manage tasks or submit votes."
      >
        <ConnectButton />
      </AuthPrompt>
    );
  }

  if (!isConnected) {
    return (
      <AuthPrompt
        title="Reconnecting wallet..."
        body={`We found an active session. Waiting for your wallet provider to reconnect.`}
      >
        <ConnectButton />
      </AuthPrompt>
    );
  }

  return <>{children}</>;
}
