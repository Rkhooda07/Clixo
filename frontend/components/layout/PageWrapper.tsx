import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function PageWrapper({ children, style, className }: PageWrapperProps) {
  return (
    <div
      className={`px-4 sm:px-8 lg:px-12${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
