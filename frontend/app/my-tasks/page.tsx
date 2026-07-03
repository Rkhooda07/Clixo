"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { meApi } from "@/lib/api";
import { Task } from "@/types";

const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";
const inter = "Inter, system-ui, sans-serif";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const data = await meApi.getTasks();
        if (active) setTasks(data.tasks);
      } catch (err) {
        console.error("Failed to fetch created tasks:", err);
        if (active) setTasks([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchTasks();
    return () => { active = false; };
  }, []);

  return (
    <WalletGuard>
      <main
        className="px-4 md:px-10"
        style={{ maxWidth: "1280px", margin: "0 auto", paddingTop: "40px", paddingBottom: "48px" }}
      >
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
              Creator
            </div>
            <h1 style={{ fontFamily: geist, fontSize: "22px", fontWeight: 500, color: "var(--text-1)", letterSpacing: "-0.02em", margin: 0 }}>
              My Tasks
            </h1>
          </div>

          <Link
            href="/create-task"
            style={{
              fontFamily: geist,
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--ink)",
              background: "var(--text-1)",
              border: "1px solid var(--text-1)",
              borderRadius: "5px",
              padding: "10px 18px",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              flexShrink: 0,
            }}
          >
            Create Task →
          </Link>
        </div>

        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            message="No tasks yet."
            action={{ label: "Create one", href: "/create-task" }}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} mode="creator-dashboard" />
            ))}
          </div>
        )}
      </main>
    </WalletGuard>
  );
}
