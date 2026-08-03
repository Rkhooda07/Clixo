"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full bg-surface border border-line rounded-md px-3 py-2 text-[13px] text-hi placeholder:text-dim leading-relaxed resize-none",
        "outline-none focus-visible:outline-none transition-[border-color,box-shadow] duration-150",
        "focus:border-dim focus:shadow-[0_0_0_3px_rgba(240,240,240,0.05)]",
        className
      )}
      {...props}
    />
  );
}
