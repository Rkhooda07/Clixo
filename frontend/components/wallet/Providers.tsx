"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { LazyMotion, domAnimation } from "framer-motion";
import { wagmiConfig } from "@/lib/wagmi";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";

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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rkTheme}>
          <LazyMotion features={domAnimation} strict>
            {children}
          </LazyMotion>
          <Toaster
            position="bottom-right"
            icons={{
              success: (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--green)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              ),
              error: (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--red)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              ),
            }}
            toastOptions={{
              style: {
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                color: "var(--text-1)",
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "12px",
                borderRadius: "5px",
              },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
