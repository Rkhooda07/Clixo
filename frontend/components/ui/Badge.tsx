import React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "green" | "red" | "amber";

const VARIANTS: Record<Variant, string> = {
  default: "border-line text-lo",
  green: "border-green/30 text-green",
  red: "border-red/30 text-red",
  amber: "border-amber/30 text-amber",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] leading-[1.6] whitespace-nowrap",
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
}
