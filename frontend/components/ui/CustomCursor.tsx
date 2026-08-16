"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

export function CustomCursor() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) return;

    function onMouseMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
    }

    function onMouseDown() {
      setClicking(true);
    }

    function onMouseUp() {
      setClicking(false);
    }

    function onHoverStart() {
      setHovering(true);
    }

    function onHoverEnd() {
      setHovering(false);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    document.addEventListener("mouseover", onHoverStart, true);
    document.addEventListener("mouseout", onHoverEnd, true);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onHoverStart, true);
      document.removeEventListener("mouseout", onHoverEnd, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <m.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] w-8 h-8 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{
        transformOrigin: "center center",
        willChange: "transform, width, height, border-color, background-color, box-shadow",
        borderRadius: "50%",
        borderStyle: "solid",
      }}
      animate={{
        x: pos.x,
        y: pos.y,
        width: hovering ? 48 : clicking ? 24 : 32,
        height: hovering ? 48 : clicking ? 24 : 32,
        borderColor: hovering ? "var(--amber)" : "white",
        backgroundColor: clicking ? "rgba(232,160,32,0.3)" : "transparent",
        borderWidth: clicking ? 3 : hovering ? 2.5 : 2,
        boxShadow: hovering
          ? "0 0 0 1px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3), 0 0 24px rgba(232,160,32,0.4)"
          : "0 0 0 1px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)",
      }}
      transition={{
        type: "spring",
        stiffness: clicking ? 500 : hovering ? 350 : 300,
        damping: clicking ? 35 : hovering ? 30 : 28,
        mass: 0.8,
      }}
    >
      <m.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: clicking ? 0.3 : hovering ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 30,
        }}
        style={{
          background: "radial-gradient(circle at center, white 0%, transparent 70%)",
          opacity: 0.9,
        }}
      />
    </m.div>
  );
}