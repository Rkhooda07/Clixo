import React from "react";
import { cn } from "@/lib/utils";

interface StatBlockProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: "amber" | "green";
  className?: string;
}

export function StatBlock({ label, value, sub, accent, className }: StatBlockProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="eyebrow">{label}</div>
      <div
        className={cn(
          "font-mono text-lg leading-tight",
          accent === "amber" && "text-amber",
          accent === "green" && "text-green",
          !accent && "text-hi"
        )}
      >
        {value}
      </div>
      {sub !== undefined && <div className="text-xs text-dim">{sub}</div>}
    </div>
  );
}
