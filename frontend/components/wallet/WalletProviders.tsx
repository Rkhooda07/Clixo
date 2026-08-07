"use client";

import React from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmi";

import "@rainbow-me/rainbowkit/styles.css";

const rkTheme = darkTheme({
  accentColor: "#e8a020",
  accentColorForeground: "#0c0c0e",
  borderRadius: "small",
  overlayBlur: "small",
});
rkTheme.colors.modalBackground = "#111113";
rkTheme.colors.modalBorder = "#242428";
rkTheme.colors.modalText = "#f0f0f0";
rkTheme.colors.modalTextSecondary = "#888890";
rkTheme.colors.generalBorder = "#242428";
rkTheme.fonts.body = "var(--font-geist), system-ui, sans-serif";
rkTheme.radii.modal = "6px";
rkTheme.radii.menuButton = "5px";

/**
 * The wallet stack — wagmi + RainbowKit + every connector `getDefaultConfig`
 * registers. Importing this module costs ~180 kB gzip, so it is deliberately
 * NOT in the root layout: only the lazily-mounted ConnectButton and the
 * layouts of routes that actually use wallet hooks pull it in.
 *
 * Several of these can be mounted at once (navbar button + page subtree).
 * They all share the `wagmiConfig` singleton, so they share one zustand store
 * and therefore one connection state. Only the navbar instance reconnects on
 * mount — route-level instances pass reconnectOnMount={false} so a page
 * navigation never kicks off a second handshake.
 */
export function WalletProviders({
  children,
  reconnectOnMount = true,
}: {
  children: React.ReactNode;
  reconnectOnMount?: boolean;
}) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={reconnectOnMount}>
      <RainbowKitProvider theme={rkTheme}>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
}
