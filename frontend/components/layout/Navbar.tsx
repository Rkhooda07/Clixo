"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ConnectButton } from "../wallet/ConnectButton";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Browse Tasks", href: "/browse" },
  { label: "Dashboard", href: "/dashboard" },
];

const createTaskLink = { label: "Post a Task", href: "/create-task" };

const WORDMARK = "font-display text-[15px] font-semibold tracking-[0.08em] text-hi";

function DesktopNavLink({
  link,
  active,
}: {
  link: { label: string; href: string };
  active: boolean;
}) {
  return (
    <Link
      href={link.href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center self-stretch border-b-2 px-2.5 text-[13px] tracking-[-0.01em] transition-colors duration-100",
        active
          ? "border-hi text-hi"
          : "border-transparent text-lo hover:border-dim hover:text-hi focus-visible:border-dim focus-visible:text-hi"
      )}
    >
      {link.label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (drawerOpen) dialogRef.current?.showModal();
  }, [drawerOpen]);

  // Close the drawer on navigation; no-op when already closed.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-line bg-ink">
        <div className="mx-auto flex h-[52px] max-w-[1280px] items-center justify-between px-6">
          {/* Wordmark */}
          <Link href="/" prefetch={false} className={WORDMARK}>
            CLIXO
          </Link>

          {/* Center nav — desktop only */}
          <div className="hidden items-stretch gap-0.5 md:flex">
            {navLinks.map((link) => (
              <DesktopNavLink key={link.href} link={link} active={pathname === link.href} />
            ))}
            {/* Post a Task — separated by a left hairline to mark it as an action */}
            <div className="ml-2 flex items-stretch border-l border-line pl-7">
              <DesktopNavLink
                link={createTaskLink}
                active={pathname === createTaskLink.href}
              />
            </div>
          </div>

          {/* Right: hamburger (mobile) + wallet */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              className="flex cursor-pointer items-center justify-center p-1.5 text-lo transition-colors duration-100 hover:text-hi md:hidden"
            >
              <Menu size={18} />
            </button>

            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Mobile drawer — native modal dialog: Escape, focus trap, and inert
          background come for free. Content mounts only while open. */}
      <dialog
        ref={dialogRef}
        aria-label="Navigation"
        onClose={() => setDrawerOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="fixed top-0 right-0 bottom-0 left-auto m-0 h-dvh max-h-none w-[280px] max-w-none translate-x-0 border-l border-line bg-surface p-0 text-lo transition-transform duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] starting:translate-x-full motion-reduce:transition-none backdrop:bg-[rgba(12,12,14,0.75)]"
      >
        {drawerOpen && (
          <div className="flex h-full flex-col">
            {/* Drawer header */}
            <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-line px-5">
              <span className={WORDMARK}>CLIXO</span>
              <button
                onClick={() => dialogRef.current?.close()}
                aria-label="Close navigation"
                className="flex cursor-pointer items-center p-1 text-dim transition-colors duration-100 hover:text-hi"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer links */}
            <nav className="grow divide-y divide-subtle p-3">
              {[...navLinks, createTaskLink].map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    onClick={() => dialogRef.current?.close()}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block px-3 py-3 text-sm transition-colors duration-100",
                      active ? "text-hi" : "text-lo hover:text-hi focus-visible:text-hi"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer wallet */}
            <div className="shrink-0 border-t border-line px-5 py-4">
              <ConnectButton />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

export default Navbar;
