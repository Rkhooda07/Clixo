"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "../wallet/ConnectButton";
import { X } from "lucide-react";

const navLinks = [
  { label: "Browse Tasks", href: "/browse" },
  { label: "Dashboard", href: "/dashboard" },
];

function HamburgerLines() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none" aria-hidden="true">
      <line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="6.5" x2="18" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const wordmark: React.CSSProperties = {
  fontFamily: "Geist, system-ui, sans-serif",
  fontWeight: 600,
  fontSize: "15px",
  letterSpacing: "0.08em",
  color: "var(--text-1)",
  textDecoration: "none",
};

export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          background: "var(--ink)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Wordmark */}
          <Link href="/" prefetch={false} style={wordmark}>
            CLIXO
          </Link>

          {/* Center nav — desktop only */}
          <div className="hidden md:flex" style={{ alignItems: "stretch", gap: "2px" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    alignSelf: "stretch",
                    color: isActive ? "var(--text-1)" : "var(--text-2)",
                    fontSize: "13px",
                    textDecoration: "none",
                    padding: "0 10px",
                    borderBottom: `2px solid ${isActive ? "var(--text-1)" : "transparent"}`,
                    transition: "color 100ms, border-color 100ms",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "var(--text-1)";
                    if (!isActive) el.style.borderBottomColor = "var(--text-3)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = isActive ? "var(--text-1)" : "var(--text-2)";
                    if (!isActive) el.style.borderBottomColor = "transparent";
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: hamburger (mobile) + wallet */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="md:hidden">
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation"
                aria-expanded={drawerOpen}
                style={{
                  color: "var(--text-2)",
                  background: "none",
                  border: "none",
                  padding: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HamburgerLines />
              </button>
            </div>

            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 49,
          background: "rgba(12, 12, 14, 0.75)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 250ms",
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        aria-hidden={!drawerOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "280px",
          background: "var(--surface-1)",
          borderLeft: "1px solid var(--line)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          padding: "0",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            borderBottom: "1px solid var(--line)",
            flexShrink: 0,
          }}
        >
          <span style={wordmark}>CLIXO</span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
            style={{
              color: "var(--text-3)",
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer links */}
        <nav style={{ padding: "12px", flexGrow: 1 }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: "block",
                  color: isActive ? "var(--text-1)" : "var(--text-2)",
                  fontSize: "14px",
                  textDecoration: "none",
                  padding: "10px 12px",
                  borderRadius: "5px",
                  background: isActive ? "var(--surface-2)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer wallet */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--line)",
            flexShrink: 0,
          }}
        >
          <ConnectButton />
        </div>
      </div>
    </>
  );
}

export default Navbar;
