"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WorkerVoteRecord } from "@/types";

interface MyWorkProps {
  submissions: WorkerVoteRecord[];
  isLoading: boolean;
}

const mono = "JetBrains Mono, monospace";
const inter = "Inter, system-ui, sans-serif";
const geist = "Geist, system-ui, sans-serif";

const TH_STYLE: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "10px",
  color: "var(--text-3)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  fontWeight: 400,
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid var(--line)",
};

const TD_STYLE: React.CSSProperties = {
  fontFamily: inter,
  fontSize: "13px",
  color: "var(--text-2)",
  padding: "0 12px",
  height: "48px",
  verticalAlign: "middle",
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "—";
  }
}

function WorkRow({ sub }: { sub: WorkerVoteRecord }) {
  const [hovered, setHovered] = useState(false);

  const isOpen = sub.taskStatus === "ACTIVE" || sub.taskStatus === "CREATED";
  const thumbSrc = sub.optionPickedImage || "";
  const earnedEth = sub.earnedEth;

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--surface-2)" : "transparent",
        borderBottom: "1px solid var(--line-subtle)",
        transition: "background 80ms",
      }}
    >
      {/* Task Title */}
      <td style={{ ...TD_STYLE, color: "var(--text-1)", maxWidth: "260px" }}>
        <span
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: geist,
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {sub.taskTitle || `Task #${sub.taskId}`}
        </span>
      </td>

      {/* Your Pick: tiny thumbnail */}
      <td style={TD_STYLE}>
        {thumbSrc ? (
          <div
            style={{
              width: "40px",
              height: "24px",
              borderRadius: "2px",
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
              background: "var(--surface-2)",
            }}
          >
            <Image
              src={thumbSrc}
              alt="Your pick"
              width={40}
              height={24}
              style={{ objectFit: "cover", display: "block" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "40px",
              height: "24px",
              borderRadius: "2px",
              background: "var(--surface-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: mono,
              fontSize: "8px",
              color: "var(--text-3)",
            }}
          >
            —
          </div>
        )}
      </td>

      {/* Status */}
      <td style={TD_STYLE}>
        <span
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: isOpen ? "var(--green)" : "var(--text-3)",
            letterSpacing: "0.04em",
          }}
        >
          {isOpen ? "OPEN" : "CLOSED"}
        </span>
      </td>

      {/* Earned */}
      <td style={TD_STYLE}>
        {isOpen || !earnedEth ? (
          <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--text-3)" }}>
            Pending
          </span>
        ) : (
          <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--amber)" }}>
            Ξ {earnedEth}
          </span>
        )}
      </td>

      {/* Date */}
      <td style={TD_STYLE}>
        <span style={{ fontFamily: mono, fontSize: "11px", color: "var(--text-3)" }}>
          {formatDate(sub.submittedAt)}
        </span>
      </td>
    </tr>
  );
}

export function MyWork({ submissions, isLoading }: MyWorkProps) {
  if (isLoading) {
    return (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Task Title", "Your Pick", "Status", "Earned", "Date"].map((h) => (
              <th key={h} style={TH_STYLE}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--line-subtle)" }}>
              {[1, 2, 3, 4, 5].map((j) => (
                <td key={j} style={{ ...TD_STYLE, padding: "0 12px" }}>
                  <div
                    style={{
                      height: "10px",
                      borderRadius: "2px",
                      background: "var(--surface-2)",
                      width: j === 1 ? "70%" : "40%",
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["Task Title", "Your Pick", "Status", "Earned", "Date"].map((h) => (
            <th key={h} style={TH_STYLE}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {submissions.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              style={{
                ...TD_STYLE,
                textAlign: "center",
                padding: "48px 12px",
                fontFamily: mono,
                fontSize: "12px",
                color: "var(--text-3)",
              }}
            >
              No votes yet.{" "}
              <Link
                href="/browse"
                style={{ color: "var(--text-2)", textDecoration: "none" }}
              >
                Browse tasks →
              </Link>
            </td>
          </tr>
        ) : (
          submissions.map((sub, i) => (
            <WorkRow key={`${sub.taskId}-${i}`} sub={sub} />
          ))
        )}
      </tbody>
    </table>
  );
}
