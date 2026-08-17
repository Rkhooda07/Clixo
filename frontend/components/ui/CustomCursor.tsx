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

  const ringSize = clicking ? 22 : hovering ? 48 : 34;

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[999999]">
      {/* Outer Ring with spring motion */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none rounded-full border-2 border-white mix-blend-difference"
        animate={{
          x: pos.x - ringSize / 2,
          y: pos.y - ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderWidth: clicking ? 3 : hovering ? 2.5 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: clicking ? 600 : hovering ? 400 : 350,
          damping: clicking ? 30 : hovering ? 28 : 26,
          mass: 0.5,
        }}
      />

      {/* Solid White Center Dot */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none w-2.5 h-2.5 rounded-full bg-white mix-blend-difference"
        animate={{
          x: pos.x - 5,
          y: pos.y - 5,
          scale: clicking ? 0.6 : hovering ? 1.3 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 35,
          mass: 0.2,
        }}
      />
    </div>
  );
}