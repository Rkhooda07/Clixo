"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { ExternalLink, LayoutDashboard, LogOut } from "lucide-react";
import { useWalletUser } from "@/hooks/useWalletUser";
import { useEthPrice } from "@/hooks/useEthPrice";
import { Button } from "@/components/ui/Button";
import { StatBlock } from "@/components/ui/StatBlock";

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
      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-lo transition-colors duration-100 hover:bg-raised hover:text-hi"
    >
      <LayoutDashboard size={14} className="shrink-0 text-dim" aria-hidden="true" />
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ethPrice = useEthPrice();

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
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
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
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex h-[34px] cursor-pointer items-center gap-2 rounded-md border border-line bg-transparent px-3.5 font-mono text-xs whitespace-nowrap text-lo transition-colors duration-150 hover:border-dim hover:bg-raised"
      >
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-green" aria-hidden="true" />
        <span>{shortAddr}</span>
        {displayBalance && (
          <>
            <span className="mx-0.5 text-dim">·</span>
            <span className="text-amber">{displayBalance}</span>
          </>
        )}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-[100] w-[min(240px,calc(100vw-24px))] origin-top-right scale-100 overflow-hidden rounded-lg border border-line bg-surface shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-[opacity,scale] duration-[120ms] ease-out starting:scale-95 starting:opacity-0 motion-reduce:transition-none">
          {/* Row 1: Connected + full address */}
          <div className="px-4 py-2.5">
            <div className="eyebrow mb-1">Connected</div>
            <div className="font-mono text-xs break-all text-lo">{address}</div>
          </div>

          <div className="h-px bg-line" />

          {/* Row 2: Balance */}
          <div className="px-4 py-2.5">
            <StatBlock
              label="Balance"
              accent="amber"
              value={displayBalance ?? "0 ETH"}
              sub={usdEstimate !== null ? `≈ $${usdEstimate} USD` : undefined}
            />
          </div>

          <div className="h-px bg-line" />

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

          <div className="h-px bg-line" />

          {/* Row 5: Etherscan */}
          <a
            href={etherscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-dim transition-colors duration-100 hover:bg-raised hover:text-lo"
          >
            <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
            View on Etherscan
          </a>

          {/* Row 6: Disconnect */}
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-xs text-dim transition-colors duration-100 hover:bg-raised hover:text-red"
          >
            <LogOut size={14} className="shrink-0" aria-hidden="true" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export function ConnectButton() {
  const { isAuthenticating, isLogged, login, logout } = useWalletUser();

  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) {
          return <div className="h-[34px] w-[118px] rounded-md bg-raised" />;
        }

        if (isAuthenticating) {
          return (
            <Button variant="outline" loading>
              Signing...
            </Button>
          );
        }

        if (!connected) {
          return (
            <Button variant="outline" onClick={openConnectModal}>
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported) {
          return <Button variant="danger">Wrong Network</Button>;
        }

        if (!isLogged) {
          return (
            <Button variant="amber" onClick={login}>
              Sign In
            </Button>
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
