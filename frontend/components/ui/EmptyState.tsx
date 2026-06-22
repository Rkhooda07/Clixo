"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-zinc-800 bg-zinc-900/30 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-3 min-h-[200px]">
      <div className="p-2 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/30">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">{description}</p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
