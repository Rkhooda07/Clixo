"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmi";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";

import "@rainbow-me/rainbowkit/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#7c3aed",
            accentColorForeground: "white",
            borderRadius: "medium",
            overlayBlur: "small",
          })}
        >
          {children}
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
                fontFamily: "JetBrains Mono, monospace",
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
