"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Next 15.1 has no pending-navigation hook (useLinkStatus lands in 15.3), so
// this keys off pathname. That works here because every heavy route owns a
// loading.tsx: the router commits — and pathname changes — the moment the
// transition starts, not when its data resolves.
//
// Deliberately not reading useSearchParams: it would opt the whole app out of
// static rendering from the root layout, and ?tab= switches are not navigations
// worth a progress bar.
//
// ponytail: the sweep is a fixed animation, not measured progress. Swap the
// keyframes for useLinkStatus's pending flag once this is on Next >= 15.3.
export function RouteProgress() {
  const pathname = usePathname();
  const [runs, setRuns] = useState(0);
  const seen = useRef(pathname);

  useEffect(() => {
    if (seen.current === pathname) return;
    seen.current = pathname;
    setRuns((n) => n + 1);
  }, [pathname]);

  // runs === 0 is the first load, which the splash already covers.
  if (runs === 0) return null;

  return (
    <div
      key={runs}
      aria-hidden="true"
      className="animate-route-progress pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-0 bg-hi/50"
    />
  );
}
