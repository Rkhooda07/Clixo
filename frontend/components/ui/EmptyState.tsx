import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./buttonVariants";
import { Logomark } from "./Logomark";

interface EmptyStateProps {
  message: string;
  detail?: string;
  icon?: React.ReactNode;
  action?: { label: string; href: string };
  className?: string;
}

export function EmptyState({
  message,
  detail,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        // Centring stays on this element. Callers pass `flex-1`, and a
        // percentage height on an inner wrapper does not resolve against a
        // flex-sized parent — the content would sit above the watermark.
        "relative overflow-hidden flex flex-col items-center justify-center px-6 py-12 text-center border border-dashed border-line rounded-lg",
        className
      )}
    >
      <Logomark className="pointer-events-none absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 text-hi opacity-[0.06]" />
      <div className="relative flex flex-col items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-raised text-dim">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-hi font-display font-medium">
            {message}
          </div>
          {detail && <div className="text-xs text-lo max-w-[320px]">{detail}</div>}
        </div>
        {action && (
          <Link
            href={action.href}
            className={buttonVariants({ variant: "outline", size: "sm", className: "mt-1" })}
          >
            {action.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
