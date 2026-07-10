"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Task } from "@/types";

interface MyTasksProps {
  tasks: Task[];
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

function TaskRow({ task }: { task: Task }) {
  const [hovered, setHovered] = useState(false);

  const isOpen = task.status === "ACTIVE" || task.status === "CREATED";
  const rewardEth = (task.budget * 0.001).toFixed(3);
  const votes = task.totalSubmissions ?? 0;
  const maxVotes = task.budget ?? 20;
  const progressPct = maxVotes > 0 ? Math.min(100, (votes / maxVotes) * 100) : 0;
  const optionCount = task.optionsCount ?? task.options?.length ?? 0;

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
      {/* Title */}
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
          {task.title}
        </span>
      </td>

      {/* Thumbnails */}
      <td style={TD_STYLE}>
        <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--text-3)" }}>
          {optionCount}
        </span>
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

      {/* Progress */}
      <td style={TD_STYLE}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--text-3)", flexShrink: 0 }}>
            {votes}/{maxVotes}
          </span>
          <div
            style={{
              width: "80px",
              height: "2px",
              background: "var(--line)",
              borderRadius: "1px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: "var(--text-2)",
              }}
            />
          </div>
        </div>
      </td>

      {/* Reward */}
      <td style={TD_STYLE}>
        <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--amber)" }}>
          Ξ {rewardEth}
        </span>
      </td>

      {/* Action */}
      <td style={TD_STYLE}>
        <Link
          href={`/tasks/${task.id}`}
          style={{
            fontFamily: inter,
            fontSize: "13px",
            color: hovered ? "var(--text-1)" : "var(--text-2)",
            textDecoration: "none",
            transition: "color 0.1s",
          }}
        >
          View →
        </Link>
      </td>
    </tr>
  );
}

export function MyTasks({ tasks, isLoading }: MyTasksProps) {
  if (isLoading) {
    return (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Title", "Options", "Status", "Progress", "Reward", "Action"].map((h) => (
              <th key={h} style={TH_STYLE}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--line-subtle)" }}>
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <td key={j} style={{ ...TD_STYLE, padding: "0 12px" }}>
                  <div
                    style={{
                      height: "10px",
                      borderRadius: "2px",
                      background: "var(--surface-2)",
                      width: j === 1 ? "60%" : "40%",
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
          {["Title", "Options", "Status", "Progress", "Reward", "Action"].map((h) => (
            <th key={h} style={TH_STYLE}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              style={{
                ...TD_STYLE,
                textAlign: "center",
                padding: "48px 12px",
                fontFamily: mono,
                fontSize: "12px",
                color: "var(--text-3)",
              }}
            >
              You haven't posted any tasks yet.{" "}
              <Link
                href="/create-task"
                style={{ color: "var(--text-2)", textDecoration: "none" }}
              >
                Post your first task →
              </Link>
            </td>
          </tr>
        ) : (
          tasks.map((task) => <TaskRow key={task.id} task={task} />)
        )}
      </tbody>
    </table>
  );
}
