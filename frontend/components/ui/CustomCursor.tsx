"use client";

import { useEffect, useState } from "react";

function isInteractiveElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (["a", "button", "input", "select", "textarea", "summary"].includes(tag)) return true;
  if (el.getAttribute("role") === "button") return true;
  if (el.classList.contains("cursor-pointer")) return true;
  return isInteractiveElement(el.parentElement);
}

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
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
      setVisible(false);
    }

    function onMouseEnter() {
      setVisible(true);
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
  }, [visible]);

  if (!visible) return null;

  const scale = clicking ? 0.5 : hovering ? 1.35 : 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
      {/* Outer Ring — enlarged distance, centered transform scale, clean border without glow */}
      <div
        className="pointer-events-none absolute h-11 w-11 rounded-full border border-white/80"
        style={{
          transform: `translate3d(${pos.x - 22}px, ${pos.y - 22}px, 0) scale(${scale})`,
          transformOrigin: "center center",
          transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out, border-color 0.15s ease-out",
          borderColor: hovering ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.7)",
          borderWidth: clicking ? "2px" : "1.5px",
        }}
      />

      {/* Solid White Center Dot — perfectly centered */}
      <div
        className="pointer-events-none absolute h-2 w-2 rounded-full bg-white"
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0) scale(${clicking ? 0.75 : hovering ? 1.25 : 1})`,
          transformOrigin: "center center",
          transition: "transform 0.05s linear, scale 0.15s ease-out",
        }}
      />
    </div>
  );
}