"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "../wallet/ConnectButton";
import { Menu, X, Layers, PlusCircle, LayoutDashboard, Compass, ClipboardList } from "lucide-react";

const navLinks = [
  { label: "Browse Tasks", href: "/browse", icon: Compass },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Tasks", href: "/my-tasks", icon: ClipboardList },
  { label: "Create Task", href: "/create-task", icon: PlusCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-sm shadow-cyan-900/30 group-hover:scale-105 transition-transform duration-200">
                <Layers className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight font-sans text-white">
                Clixo<span className="text-cyan-400 font-black">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-150 ${
                    isActive
                      ? "text-cyan-400 bg-cyan-900/20 border border-cyan-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Wallet and Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ConnectButton />
            </div>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 md:hidden transition-colors border border-zinc-700/30"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-3 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 text-base font-semibold px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "text-cyan-400 bg-cyan-900/40 border border-cyan-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 pb-1 border-t border-zinc-800 flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
