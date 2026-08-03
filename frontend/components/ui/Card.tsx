import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-line rounded-lg",
        interactive &&
          "transition-[border-color,transform,box-shadow] duration-200 hover:border-dim hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
        className
      )}
      {...props}
    />
  );
}
