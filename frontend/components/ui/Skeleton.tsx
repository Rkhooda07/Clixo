import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-sm animate-shimmer bg-[linear-gradient(90deg,var(--surface-2)_25%,var(--line)_50%,var(--surface-2)_75%)] bg-[length:200%_100%]",
        className
      )}
      style={style}
    />
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-surface border border-line rounded-lg overflow-hidden flex flex-col">
      <Skeleton className="rounded-none aspect-video" />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex justify-between">
          <Skeleton className="w-10 h-2.5" />
          <Skeleton className="w-16 h-2.5" />
        </div>
        <Skeleton className="w-4/5 h-4" />
        <Skeleton className="w-[55%] h-4" />
        <div className="h-px bg-subtle" />
        <Skeleton className="w-[120px] h-2.5" />
        <Skeleton className="h-0.5 rounded-[1px]" />
        <Skeleton className="w-full h-[34px] rounded-md" />
      </div>
    </div>
  );
}
