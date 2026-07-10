"use client";

import React from "react";

interface ActivityTabsProps {
  activeTab: "my-tasks" | "my-work";
  onTabChange: (tab: "my-tasks" | "my-work") => void;
}

const geist = "Geist, system-ui, sans-serif";

const TABS: { id: "my-tasks" | "my-work"; label: string }[] = [
  { id: "my-tasks", label: "Posted Tasks" },
  { id: "my-work", label: "My Opinions" },
];

export function ActivityTabs({ activeTab, onTabChange }: ActivityTabsProps) {
  return (
    <div style={{ display: "flex", gap: "24px" }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: "14px 0",
              fontFamily: geist,
              fontSize: "13px",
              fontWeight: 500,
              color: isActive ? "var(--text-1)" : "var(--text-2)",
              background: "transparent",
              border: "none",
              borderBottom: `1px solid ${isActive ? "var(--text-1)" : "transparent"}`,
              marginBottom: "-1px",
              cursor: "pointer",
              letterSpacing: "-0.01em",
              transition: "color 0.1s, border-color 0.1s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              if (!isActive) {
                el.style.color = "var(--text-1)";
                el.style.borderBottomColor = "var(--text-3)";
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              if (!isActive) {
                el.style.color = "var(--text-2)";
                el.style.borderBottomColor = "transparent";
              }
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
