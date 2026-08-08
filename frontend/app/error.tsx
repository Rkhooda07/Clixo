"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Route-level error boundary. Without it a render throw shows Next's raw
 * "Application error: a client-side exception has occurred", with the navbar
 * and footer gone.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-16">
      <EmptyState
        className="flex-1"
        icon={<AlertTriangle size={16} />}
        message="Something broke on this page."
        detail="This one is on us, not on you. Retrying usually clears it; if it doesn't, the API may be down."
        action={{ label: "Try again", onClick: reset }}
      />
    </div>
  );
}
