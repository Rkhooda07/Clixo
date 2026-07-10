"use client";

import React, { useState } from "react";
import { Task } from "@/types";

interface TaskDetailHeaderProps {
  task: Task;
  isOwner: boolean;
}

const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";
const inter = "Inter, system-ui, sans-serif";

export function TaskDetailHeader({ task, isOwner }: TaskDetailHeaderProps) {
  const [shareCopied, setShareCopied] = useState(false);
  const [shareHovered, setShareHovered] = useState(false);

  const isCompleted =
    task.status === "COMPLETED" || task.status === "CLOSED" || task.status === "SETTLED";
  const isOpen = task.status === "ACTIVE" || task.status === "CREATED";
  const rewardEth = ((task.budget || 0) * 0.001).toFixed(3);

  const handleShare = () => {
    const url = `${window.location.origin}/vote/${task.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Top row: eyebrow + title, actions */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: "var(--text-3)",
                letterSpacing: "0.08em",
              }}
            >
              TASK #{task.id}
            </span>
            <span
              style={{
                fontFamily: mono,
                fontSize: "11px",
                color: isOpen ? "var(--green)" : "var(--text-3)",
                letterSpacing: "0.04em",
              }}
            >
              {isOpen ? "OPEN" : isCompleted ? "CLOSED" : task.status}
            </span>
          </div>
          <h1
            style={{
              fontFamily: geist,
              fontSize: "22px",
              fontWeight: 500,
              color: "var(--text-1)",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {task.title}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <button
            onClick={handleShare}
            onMouseEnter={() => setShareHovered(true)}
            onMouseLeave={() => setShareHovered(false)}
            style={{
              fontFamily: mono,
              fontSize: "11px",
              color: shareCopied ? "var(--green)" : "var(--text-2)",
              background: "transparent",
              border: `1px solid ${shareHovered ? "var(--text-3)" : "var(--line)"}`,
              borderRadius: "5px",
              padding: "7px 14px",
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "border-color 0.1s, color 0.1s",
            }}
          >
            {shareCopied ? "Copied" : "Share Link"}
          </button>
        </div>
      </div>

      {/* Stats row — 2×2 grid on mobile, single row on desktop */}
      <div
        className="grid grid-cols-2 md:flex md:items-center"
        style={{
          gap: "20px",
          borderTop: "1px solid var(--line)",
          paddingTop: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <span
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "var(--text-3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Reward
          </span>
          <span style={{ fontFamily: mono, fontSize: "14px", color: "var(--amber)" }}>
            Ξ {rewardEth} ETH
          </span>
        </div>

        <div className="hidden md:block" style={{ width: "1px", height: "32px", background: "var(--line)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <span
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "var(--text-3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Total Contributors
          </span>
          <span style={{ fontFamily: mono, fontSize: "14px", color: "var(--text-1)" }}>
            {task.totalSubmissions || 0}
          </span>
        </div>

        <div className="hidden md:block" style={{ width: "1px", height: "32px", background: "var(--line)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <span
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "var(--text-3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Deadline
          </span>
          <span style={{ fontFamily: mono, fontSize: "14px", color: "var(--text-2)" }}>
            {task.deadline
              ? new Date(task.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </span>
        </div>

        <div className="hidden md:block" style={{ width: "1px", height: "32px", background: "var(--line)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <span
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "var(--text-3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Created
          </span>
          <span style={{ fontFamily: mono, fontSize: "14px", color: "var(--text-2)" }}>
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
