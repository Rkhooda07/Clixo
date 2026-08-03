import React from "react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: { n: number; label: string }[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* sm+: labeled steps with connectors */}
      <div className="hidden items-center sm:flex">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.04em]",
                  current >= s.n ? "text-hi" : "text-dim"
                )}
              >
                {String(s.n).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "font-display text-xs font-medium tracking-[-0.01em]",
                  current === s.n ? "text-hi" : "text-dim"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-px flex-1",
                  current > s.n ? "bg-dim" : "bg-line"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* below sm: dots + mono caption */}
      <div className="flex items-center gap-3 sm:hidden">
        <div className="flex items-center gap-1.5" aria-hidden>
          {steps.map((s) => (
            <span
              key={s.n}
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                current >= s.n ? "bg-hi" : "bg-line"
              )}
            />
          ))}
        </div>
        <span className="eyebrow">
          Step {current} of {steps.length}
        </span>
      </div>
    </div>
  );
}
