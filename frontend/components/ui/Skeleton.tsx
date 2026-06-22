"use client";

import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-800/50 rounded ${className}`} />
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="border border-zinc-800/50 bg-zinc-900/30 rounded-lg p-4 flex flex-col gap-4">
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="flex justify-between items-start gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="border-t border-zinc-800 pt-3 mt-2 flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>
    </div>
  );
}
