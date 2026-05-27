"use client";

import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-800/60 rounded ${className}`} />
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="border border-zinc-800 bg-[#111118] rounded-xl p-5 flex flex-col gap-4">
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="flex justify-between items-start gap-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="border-t border-zinc-900 pt-4 mt-2 flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
