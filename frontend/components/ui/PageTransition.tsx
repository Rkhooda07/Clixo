"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
  },
};

export function PageTransition({ children, style, className }: PageTransitionProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return (
      <div style={style} className={className}>
        {children}
      </div>
    );
  }

  const items = React.Children.toArray(children);

  return (
    <motion.div
      style={style}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
