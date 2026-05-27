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
    <div className="border border-dashed border-zinc-800 bg-[#111118]/30 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-4 min-h-[250px]">
      <div className="p-3 rounded-full bg-zinc-900/60 text-zinc-400 border border-zinc-800">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">{description}</p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
