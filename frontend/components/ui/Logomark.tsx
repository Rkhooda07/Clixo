import { cn } from "@/lib/utils";

// Traced from assets/Logo.png. The mark is taller than it is wide and sits
// full-bleed in a square viewBox, so `size-*` sets its height and letterboxes
// the width — pair it with text by height, not by box width.
//
// Always decorative: it carries no accessible name, so any caller that drops
// the wordmark must label the interactive parent itself.
export function Logomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <path d="M12.3206 0L19.6794 0L16 12.8223ZM12.3206 32L19.6794 32L16 19.1777ZM1.784 6.3554L7.8606 6.3554L16 14.4948L14.4948 16L16 17.5052L7.8606 25.6446L1.784 25.6446L11.5401 16ZM30.216 6.3554L24.1394 6.3554L16 14.4948L17.5052 16L16 17.5052L24.1394 25.6446L30.216 25.6446L20.4599 16Z" />
    </svg>
  );
}
