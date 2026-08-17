"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

function isInteractiveElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (["a", "button", "input", "select", "textarea", "summary"].includes(tag)) return true;
  if (el.getAttribute("role") === "button") return true;
  if (el.classList.contains("cursor-pointer")) return true;
  return isInteractiveElement(el.parentElement);
}

export function CustomCursor() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reduce || !mounted) return;

    function onMouseMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
      const target = e.target as Element;
      setHovering(isInteractiveElement(target));
    }

    function onMouseDown() {
      setClicking(true);
    }

    function onMouseUp() {
      setClicking(false);
    }

    function onMouseLeave() {
      setIsVisible(false);
    }

    function onMouseEnter() {
      setIsVisible(true);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [reduce, mounted, isVisible]);

  if (reduce || !mounted || !isVisible) return null;

  // Outer ring dimension: base = 32px, hover = 46px, click = 20px
  const ringSize = clicking ? 20 : hovering ? 46 : 32;

  return (
    <>
      {/* Outer Ring */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full border border-white/90 shadow-[0_0_12px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.5)]"
        animate={{
          x: pos.x - ringSize / 2,
          y: pos.y - ringSize / 2,
          width: ringSize,
          height: ringSize,
          opacity: 1,
          borderColor: hovering ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.75)",
          borderWidth: clicking ? 2.5 : hovering ? 2 : 1.5,
          backgroundColor: hovering ? "rgba(255, 255, 255, 0.06)" : "transparent",
        }}
        transition={{
          type: "spring",
          stiffness: clicking ? 600 : hovering ? 400 : 350,
          damping: clicking ? 30 : hovering ? 28 : 26,
          mass: 0.5,
        }}
      />

      {/* Center White Dot */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8),0_1px_4px_rgba(0,0,0,0.6)]"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          scale: clicking ? 0.7 : hovering ? 1.4 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 35,
          mass: 0.2,
        }}
      />
    </>
  );
}