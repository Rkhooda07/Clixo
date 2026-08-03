import React from "react";
import { cn } from "@/lib/utils";

export function Spinner({
  size = 12,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("btn-spinner", className)}
      style={size !== 12 ? { width: size, height: size } : undefined}
      aria-hidden="true"
    />
  );
}
