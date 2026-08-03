import React from "react";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow mb-1.5">{children}</div>;
}

export function CharCount({ current, max }: { current: number; max: number }) {
  return (
    <div className="mt-1 text-right font-mono text-[10px] text-dim">
      {current}/{max}
    </div>
  );
}
