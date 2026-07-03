"use client";

import React from "react";

export function Skeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "var(--surface-2)",
        borderRadius: "3px",
        ...style,
      }}
    />
  );
}

export function TaskCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Thumbnail */}
      <div style={{ aspectRatio: "16 / 9", background: "var(--surface-2)" }} />

      {/* Body */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Status + reward row */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton style={{ width: "40px", height: "10px" }} />
          <Skeleton style={{ width: "64px", height: "10px" }} />
        </div>

        {/* Title */}
        <Skeleton style={{ width: "80%", height: "16px" }} />
        <Skeleton style={{ width: "55%", height: "16px" }} />

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--line-subtle)" }} />

        {/* Meta */}
        <Skeleton style={{ width: "120px", height: "10px" }} />

        {/* Progress bar */}
        <div
          style={{
            height: "2px",
            background: "var(--surface-2)",
            borderRadius: "1px",
          }}
        />

        {/* Button */}
        <Skeleton style={{ width: "100%", height: "34px", borderRadius: "5px" }} />
      </div>
    </div>
  );
}
