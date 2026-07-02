"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletUser } from "@/hooks/useWalletUser";

const base: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid var(--line)",
  background: "transparent",
  color: "var(--text-1)",
  fontSize: "13px",
  fontFamily: "Geist, system-ui, sans-serif",
  padding: "8px 14px",
  borderRadius: "5px",
  cursor: "pointer",
  lineHeight: 1,
  letterSpacing: "-0.01em",
  transition: "border-color 120ms, background 120ms",
  whiteSpace: "nowrap",
};

function useHover() {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.borderColor = "var(--text-3)";
      e.currentTarget.style.background = "var(--surface-2)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.borderColor = "var(--line)";
      e.currentTarget.style.background = "transparent";
    },
  };
}

export function ConnectButton() {
  const { isAuthenticating, isLogged, login } = useWalletUser();
  const hover = useHover();

  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        /* Mounting skeleton */
        if (!ready) {
          return (
            <div
              style={{
                width: "118px",
                height: "33px",
                background: "var(--surface-2)",
                borderRadius: "5px",
              }}
            />
          );
        }

        /* Mid-SIWE signing */
        if (isAuthenticating) {
          return (
            <button disabled style={{ ...base, opacity: 0.5, cursor: "not-allowed" }}>
              Signing...
            </button>
          );
        }

        /* Not connected */
        if (!connected) {
          return (
            <button onClick={openConnectModal} style={base} {...hover}>
              Connect Wallet
            </button>
          );
        }

        /* Wrong network */
        if (chain.unsupported) {
          return (
            <button
              onClick={openAccountModal}
              style={{ ...base, borderColor: "var(--red)", color: "var(--red)" }}
            >
              Wrong Network
            </button>
          );
        }

        /* Connected but not authenticated */
        if (!isLogged) {
          return (
            <button
              onClick={login}
              style={{ ...base, borderColor: "var(--amber)", color: "var(--amber)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--amber-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Sign In
            </button>
          );
        }

        /* Fully connected + authenticated */
        const addr = account.address
          ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
          : account.displayName;

        return (
          <button
            onClick={openAccountModal}
            style={{
              ...base,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "12px",
              color: "var(--text-2)",
              letterSpacing: "0",
            }}
            {...hover}
          >
            {/* Green status dot */}
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "var(--green)",
                flexShrink: 0,
              }}
            />
            <span>{addr}</span>
            {account.displayBalance && (
              <>
                <span style={{ color: "var(--text-3)", margin: "0 2px" }}>·</span>
                <span style={{ color: "var(--amber)" }}>{account.displayBalance}</span>
              </>
            )}
          </button>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
