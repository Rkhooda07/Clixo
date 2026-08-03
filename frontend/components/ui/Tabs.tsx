"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  "aria-label"?: string;
}

export function Tabs({
  items,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = items.findIndex((t) => t.id === value);
    const next =
      e.key === "ArrowRight"
        ? items[(idx + 1) % items.length]
        : items[(idx - 1 + items.length) % items.length];
    onChange(next.id);
    listRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tab-id="${next.id}"]`)
      ?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex items-center gap-1 border-b border-line overflow-x-auto scrollbar-none",
        className
      )}
    >
      {items.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            data-tab-id={tab.id}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "shrink-0 -mb-px px-3 py-2.5 text-[13px] font-display font-medium tracking-[-0.01em] leading-none whitespace-nowrap cursor-pointer",
              "border-b-2 transition-colors duration-150",
              active
                ? "text-hi border-hi"
                : "text-lo border-transparent hover:text-hi hover:border-dim"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1.5 font-mono text-[10px]",
                  active ? "text-lo" : "text-dim"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
