"use client";

/**
 * Last-resort boundary: this replaces the root layout, so it renders its own
 * <html>/<body> and cannot rely on the app's fonts or Tailwind tokens being
 * present. Styles are inline on purpose.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          background: "#0c0c0e",
          color: "#f0f0f0",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Clixo hit an unexpected error.</h1>
        <p style={{ margin: 0, maxWidth: 380, fontSize: 13, lineHeight: 1.6, color: "#a4a4aa" }}>
          The page failed to render. Reloading usually fixes it.
          {error.digest ? ` Reference: ${error.digest}` : ""}
        </p>
        <button
          onClick={reset}
          style={{
            cursor: "pointer",
            borderRadius: 5,
            border: "1px solid #242428",
            background: "transparent",
            color: "#f0f0f0",
            padding: "8px 16px",
            fontSize: 13,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
