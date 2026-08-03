import React from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function PageWrapper({ children, style, className }: PageWrapperProps) {
  return (
    <div className={cn("px-4 sm:px-8 lg:px-12", className)} style={style}>
      {children}
    </div>
  );
}
