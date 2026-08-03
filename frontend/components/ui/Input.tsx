"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full bg-surface border border-line rounded-md px-3 py-2 text-[13px] text-hi placeholder:text-dim",
        "outline-none focus-visible:outline-none transition-[border-color,box-shadow] duration-150",
        "focus:border-dim focus:shadow-[0_0_0_3px_rgba(240,240,240,0.05)]",
        className
      )}
      {...props}
    />
  );
}
