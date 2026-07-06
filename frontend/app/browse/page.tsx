"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskCardSkeleton } from "@/components/ui/Skeleton";
import { taskApi, meApi } from "@/lib/api";
import { useWalletUser } from "@/hooks/useWalletUser";
import { PageTransition } from "@/components/ui/PageTransition";
import Link from "next/link";

const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";
const inter = "Inter, system-ui, sans-serif";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "highest", label: "Highest Reward" },
  { id: "needed", label: "Most Needed" },
  { id: "newest", label: "Newest" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function BrowsePage() {
  const { isConnected, token } = useWalletUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [searchFocused, setSearchFocused] = useState(false);

  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getAll(),
  });

  const { data: submissionsData, isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["submissions", token],
    queryFn: () => meApi.getSubmissions(),
    enabled: !!isConnected && !!token,
  });

  const tasks = tasksData?.tasks || [];

  const votedTaskIds = React.useMemo(() => {
    if (!submissionsData?.submissions) return new Set<number>();
    return new Set(submissionsData.submissions.map((sub) => sub.taskId));
  }, [submissionsData]);

  const loading = isTasksLoading || (isConnected && !!token && isSubmissionsLoading);

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (activeFilter === "highest") return (b.budget || 0) - (a.budget || 0);
      if (activeFilter === "needed") {
        const aN = (a.budget || 10) - (a.totalSubmissions || 0);
        const bN = (b.budget || 10) - (b.totalSubmissions || 0);
        return bN - aN;
      }
      if (activeFilter === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  return (
    <PageTransition
      style={{ display: "flex", flexDirection: "column", flex: 1 }}
      className="px-4 md:px-10"
    >
      {/* Header */}
      <div
        style={{
          paddingTop: "40px",
          paddingBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: "var(--text-3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Browse
            </div>
            <h1
              style={{
                fontFamily: geist,
                fontSize: "22px",
                fontWeight: 500,
                color: "var(--text-1)",
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Open Tasks
            </h1>
          </div>

          {/* Search */}
          <div style={{ position: "relative", minWidth: "220px", maxWidth: "280px", flex: 1 }}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%",
                background: "var(--surface-1)",
                border: `1px solid ${searchFocused ? "var(--text-3)" : "var(--line)"}`,
                borderRadius: "5px",
                padding: "8px 12px",
                fontFamily: inter,
                fontSize: "13px",
                color: "var(--text-1)",
                outline: "none",
                transition: "border-color 0.1s",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Filter row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            borderBottom: "1px solid var(--line)",
            paddingBottom: "0",
          }}
        >
          {FILTERS.map((f) => (
            <FilterTab
              key={f.id}
              label={f.label}
              isActive={activeFilter === f.id}
              onClick={() => setActiveFilter(f.id)}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            paddingBottom: "40px",
          }}
        >
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            minHeight: "200px",
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--text-3)",
            gap: "8px",
          }}
        >
          {searchQuery || activeFilter !== "all" ? (
            <span>No tasks match your search.</span>
          ) : (
            <>
              <span>No open tasks yet.</span>
              <Link
                href="/create-task"
                style={{ color: "var(--text-2)", textDecoration: "none" }}
              >
                Create one →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            paddingBottom: "40px",
          }}
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              mode="browse"
              hasVoted={votedTaskIds.has(task.id)}
            />
          ))}
        </div>
      )}
    </PageTransition>
  );
}

function FilterTab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 12px",
        fontFamily: geist,
        fontSize: "13px",
        fontWeight: 500,
        color: isActive ? "var(--text-1)" : hovered ? "var(--text-1)" : "var(--text-2)",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${isActive ? "var(--text-1)" : "transparent"}`,
        marginBottom: "-1px",
        cursor: "pointer",
        letterSpacing: "-0.01em",
        transition: "color 0.1s, border-color 0.1s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
