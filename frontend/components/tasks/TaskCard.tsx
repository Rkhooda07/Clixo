"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  mode: "browse" | "creator-dashboard" | "worker-dashboard";
  hasVoted?: boolean;
  earnedEth?: string;
  optionPickedImage?: string;
}

const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";

function ActionButton({
  href,
  label,
  disabled,
}: {
  href: string;
  label: string;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const base: React.CSSProperties = {
    display: "block",
    textAlign: "center",
    padding: "9px 0",
    fontFamily: disabled ? mono : geist,
    fontSize: "13px",
    fontWeight: 500,
    color: disabled ? "var(--green)" : "var(--text-1)",
    background: "var(--surface-2)",
    border: `1px solid ${hovered && !disabled ? "var(--text-3)" : "var(--line)"}`,
    borderRadius: "5px",
    textDecoration: "none",
    transition: "border-color 0.1s",
    letterSpacing: "-0.01em",
    cursor: disabled ? "default" : "pointer",
  };

  if (disabled) {
    return <div style={base}>{label}</div>;
  }

  return (
    <Link
      href={href}
      style={base}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </Link>
  );
}

export function TaskCard({
  task,
  mode,
  hasVoted = false,
  earnedEth,
  optionPickedImage,
}: TaskCardProps) {
  const [hovered, setHovered] = useState(false);

  const isOpen =
    task.status === "ACTIVE" || task.status === "CREATED";
  const isCompleted =
    task.status === "COMPLETED" ||
    task.status === "CLOSED" ||
    task.status === "SETTLED";

  const rewardEth = (task.budget * 0.001).toFixed(3);
  const optionCount = task.optionsCount ?? task.options?.length ?? 0;
  const votes = task.totalSubmissions ?? 0;
  const maxVotes = task.budget ?? 20;
  const progressPct = maxVotes > 0 ? Math.min(100, (votes / maxVotes) * 100) : 0;

  const thumbnailSrc =
    mode === "worker-dashboard" && optionPickedImage
      ? optionPickedImage
      : task.options?.[0]?.gateway_url ?? null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface-1)",
        border: `1px solid ${hovered ? "var(--text-3)" : "var(--line)"}`,
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "border-color 0.1s",
      }}
    >
      {/* ── Thumbnail image ───────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: "var(--surface-2)",
          flexShrink: 0,
        }}
      >
        {thumbnailSrc ? (
          <Image
            src={thumbnailSrc}
            alt={task.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: mono,
              fontSize: "11px",
              color: "var(--text-3)",
            }}
          >
            no preview
          </div>
        )}

        {/* Options count badge — top right */}
        {optionCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(12, 12, 14, 0.70)",
              borderRadius: "3px",
              padding: "3px 7px",
              fontFamily: mono,
              fontSize: "10px",
              color: "var(--text-2)",
              userSelect: "none",
            }}
          >
            {optionCount} options
          </div>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Status + ETH reward */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: isOpen ? "var(--green)" : "var(--text-3)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
          <span
            style={{
              fontFamily: mono,
              fontSize: "11px",
              color: "var(--amber)",
            }}
          >
            Ξ {rewardEth} ETH
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: geist,
            fontSize: "16px",
            fontWeight: 500,
            color: "var(--text-1)",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            margin: "0 0 12px 0",
          }}
        >
          {task.title}
        </h3>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "var(--line-subtle)",
            marginBottom: "12px",
          }}
        />

        {/* Vote meta */}
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--text-3)",
            marginBottom: "8px",
          }}
        >
          {optionCount} options · {votes}/{maxVotes} votes
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "2px",
            background: "var(--line)",
            borderRadius: "1px",
            overflow: "hidden",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: "var(--text-2)",
              transition: "width 0.4s ease-out",
            }}
          />
        </div>

        {/* Action — pinned to bottom */}
        <div style={{ marginTop: "auto" }}>
          {mode === "browse" && (
            <>
              {hasVoted ? (
                <ActionButton
                  href={`/tasks/${task.id}`}
                  label="Voted ✓"
                  disabled
                />
              ) : (
                <ActionButton
                  href={isCompleted ? `/tasks/${task.id}` : `/vote/${task.id}`}
                  label={isCompleted ? "View Results →" : "Vote Now →"}
                />
              )}
            </>
          )}

          {mode === "creator-dashboard" && (
            <ActionButton href={`/tasks/${task.id}`} label="View Results →" />
          )}

          {mode === "worker-dashboard" && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderTop: "1px solid var(--line)",
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "var(--text-3)",
                }}
              >
                Earnings
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "11px",
                  color: isCompleted ? "var(--green)" : "var(--amber)",
                }}
              >
                {isCompleted ? `+${earnedEth ?? "0.000"} ETH` : "Pending"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
