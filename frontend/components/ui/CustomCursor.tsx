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

  const ringRadius = clicking ? 10 : hovering ? 24 : 16;
  const ringDiameter = ringRadius * 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
      {/* Outer Ring */}
      <div
        className="pointer-events-none absolute rounded-full border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_20px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.8)]"
        style={{
          width: `${ringDiameter}px`,
          height: `${ringDiameter}px`,
          transform: `translate3d(${pos.x - ringRadius}px, ${pos.y - ringRadius}px, 0)`,
          transition: "transform 0.05s ease-out, width 0.15s ease-out, height 0.15s ease-out, border-width 0.15s ease-out, background-color 0.15s ease-out",
          backgroundColor: hovering ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
          borderWidth: clicking ? "3px" : hovering ? "2.5px" : "2px",
        }}
      />

      {/* Solid White Center Dot */}
      <div
        className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1),0_0_2px_rgba(0,0,0,0.9)]"
        style={{
          transform: `translate3d(${pos.x - 5}px, ${pos.y - 5}px, 0) scale(${clicking ? 0.6 : hovering ? 1.3 : 1})`,
          transition: "transform 0.02s linear, scale 0.15s ease-out",
        }}
      />
    </div>
  );
}