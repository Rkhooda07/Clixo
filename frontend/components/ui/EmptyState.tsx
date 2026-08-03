import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./buttonVariants";

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
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center border border-dashed border-line rounded-lg",
        className
      )}
    >
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
  );
}
