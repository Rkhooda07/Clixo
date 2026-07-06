"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletUser } from "@/hooks/useWalletUser";

const mono = "JetBrains Mono, monospace";
const inter = "Inter, system-ui, sans-serif";
const geist = "Geist, system-ui, sans-serif";

const base: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid var(--line)",
  background: "transparent",
  color: "var(--text-1)",
  fontSize: "13px",
  fontFamily: geist,
  padding: "8px 14px",
  borderRadius: "5px",
  cursor: "pointer",
  lineHeight: 1,
  letterSpacing: "-0.01em",
  transition: "border-color 120ms, background 120ms",
  whiteSpace: "nowrap",
};

function useHoverHandlers() {
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

function useEthPrice() {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
      .then((r) => r.json())
      .then((d) => setPrice(d?.ethereum?.usd ?? null))
      .catch(() => {});
  }, []);
  return price;
}

function DropdownLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "block",
        padding: "10px 16px",
        fontFamily: inter,
        fontSize: "13px",
        color: "var(--text-2)",
        textDecoration: "none",
        transition: "background 0.1s, color 0.1s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--surface-2)";
        e.currentTarget.style.color = "var(--text-1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-2)";
      }}
    >
      {label}
    </Link>
  );
}

interface AuthenticatedPillProps {
  address: string;
  displayBalance: string | undefined;
  onLogout: () => void;
}

function AuthenticatedPill({
  address,
  displayBalance,
  onLogout,
}: AuthenticatedPillProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const ethPrice = useEthPrice();
  const hover = useHoverHandlers();

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const ethAmount = parseFloat(displayBalance ?? "0") || 0;
  const usdEstimate =
    ethPrice !== null ? (ethAmount * ethPrice).toFixed(2) : null;
  const etherscanUrl = `https://sepolia.etherscan.io/address/${address}`;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          ...base,
          fontFamily: mono,
          fontSize: "12px",
          color: "var(--text-2)",
          letterSpacing: "0",
        }}
        {...hover}
      >
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "var(--green)",
            flexShrink: 0,
          }}
        />
        <span>{shortAddr}</span>
        {displayBalance && (
          <>
            <span style={{ color: "var(--text-3)", margin: "0 2px" }}>·</span>
            <span style={{ color: "var(--amber)" }}>{displayBalance}</span>
          </>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "240px",
            background: "var(--surface-1)",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {/* Row 1: Connected + full address */}
          <div style={{ padding: "10px 16px" }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: "var(--text-3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Connected
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: "12px",
                color: "var(--text-2)",
                wordBreak: "break-all",
              }}
            >
              {address}
            </div>
          </div>

          <div style={{ height: "1px", background: "var(--line)" }} />

          {/* Row 2: Balance */}
          <div style={{ padding: "10px 16px" }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: "var(--text-3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Balance
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: "16px",
                color: "var(--amber)",
              }}
            >
              {displayBalance ?? "0 ETH"}
            </div>
            {usdEstimate !== null && (
              <div
                style={{
                  fontFamily: inter,
                  fontSize: "11px",
                  color: "var(--text-3)",
                  marginTop: "2px",
                }}
              >
                ≈ ${usdEstimate} USD
              </div>
            )}
          </div>

          <div style={{ height: "1px", background: "var(--line)" }} />

          {/* Rows 3 & 4: Dashboard links */}
          <DropdownLink
            href="/dashboard?tab=tasks"
            label="My Tasks"
            onClick={() => setOpen(false)}
          />
          <DropdownLink
            href="/dashboard?tab=work"
            label="My Work"
            onClick={() => setOpen(false)}
          />

          <div style={{ height: "1px", background: "var(--line)" }} />

          {/* Row 5: Etherscan */}
          <a
            href={etherscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{
              display: "block",
              padding: "10px 16px",
              fontFamily: inter,
              fontSize: "12px",
              color: "var(--text-3)",
              textDecoration: "none",
              transition: "background 0.1s, color 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface-2)";
              e.currentTarget.style.color = "var(--text-2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-3)";
            }}
          >
            View on Etherscan ↗
          </a>

          {/* Row 6: Disconnect */}
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 16px",
              fontFamily: inter,
              fontSize: "12px",
              color: "var(--text-3)",
              background: "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              transition: "background 0.1s, color 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface-2)";
              e.currentTarget.style.color = "var(--red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-3)";
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export function ConnectButton() {
  const { isAuthenticating, isLogged, login, logout } = useWalletUser();
  const hover = useHoverHandlers();

  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

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

        if (isAuthenticating) {
          return (
            <button
              disabled
              style={{ ...base, opacity: 0.5, cursor: "not-allowed" }}
            >
              Signing...
            </button>
          );
        }

        if (!connected) {
          return (
            <button onClick={openConnectModal} style={base} {...hover}>
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              style={{ ...base, borderColor: "var(--red)", color: "var(--red)" }}
            >
              Wrong Network
            </button>
          );
        }

        if (!isLogged) {
          return (
            <button
              onClick={login}
              style={{
                ...base,
                borderColor: "var(--amber)",
                color: "var(--amber)",
              }}
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

        return (
          <AuthenticatedPill
            address={account.address ?? ""}
            displayBalance={account.displayBalance}
            onLogout={logout}
          />
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
