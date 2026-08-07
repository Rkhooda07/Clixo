"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, domMax } from "framer-motion";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";

/**
 * Root providers. Deliberately free of wagmi/RainbowKit imports — the wallet
 * stack lives in WalletProviders and is pulled in only where it is used, so
 * routes with no wallet interaction (`/`, `/tasks/[id]`) never download it.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={domMax} strict>
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
    </QueryClientProvider>
  );
}
