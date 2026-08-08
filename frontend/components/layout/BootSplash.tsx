"use client";

import { useEffect, useState } from "react";
import { Logomark } from "@/components/ui/Logomark";

// Present in the server-rendered HTML, so it covers the pre-hydration window
// rather than appearing after React boots. It lives in the root layout, which
// survives client-side navigation — that alone is what keeps it to first load.
//
// The dismissal is CSS (see --animate-boot-veil); this timer only unmounts the
// dead node afterwards. If hydration stalls and the timer never runs, the veil
// still clears on schedule, and `pointer-events-none` means it never intercepts
// a click even while visible.
export function BootSplash() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Just past the end of --animate-boot-veil (180ms delay + 140ms fade).
    const t = setTimeout(() => setGone(true), 340);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className="animate-boot-veil pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-ink"
    >
      <Logomark className="animate-boot-mark size-12 text-hi" />
    </div>
  );
}
