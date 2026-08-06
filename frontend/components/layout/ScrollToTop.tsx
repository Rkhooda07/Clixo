"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    // Hash navigation (e.g. /#how-it-works) owns its own scroll target.
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
