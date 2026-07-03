"use client";

import React from "react";

interface EmptyStateProps {
  message: string;
  action?: { label: string; href: string };
}

const mono = "JetBrains Mono, monospace";
const inter = "Inter, system-ui, sans-serif";

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "48px 24px",
        fontFamily: mono,
        fontSize: "11px",
        color: "var(--text-3)",
      }}
    >
      <span>{message}</span>
      {action && (
        <a
          href={action.href}
          style={{
            fontFamily: inter,
            fontSize: "13px",
            color: "var(--text-2)",
            textDecoration: "none",
          }}
        >
          {action.label} →
        </a>
      )}
    </div>
  );
}
