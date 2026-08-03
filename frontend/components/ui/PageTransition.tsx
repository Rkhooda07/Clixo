"use client";

import React from "react";
import { m, useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function PageTransition({ children, style, className }: PageTransitionProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return (
      <div style={style} className={className}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      style={style}
      className={className}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </m.div>
  );
}
