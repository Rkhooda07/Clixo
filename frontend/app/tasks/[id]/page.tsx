"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { taskApi } from "@/lib/api";
import { Task, Thumbnail } from "@/types";
import { TaskDetailHeader } from "@/components/tasks/TaskDetailHeader";
import { WinnerBanner } from "@/components/tasks/WinnerBanner";
import { ResultsGrid } from "@/components/tasks/ResultsGrid";
import { VotesOverTimeChart } from "@/components/tasks/VotesOverTimeChart";
import { PageTransition } from "@/components/ui/PageTransition";
import { PageWrapper } from "@/components/layout/PageWrapper";

const mono = "JetBrains Mono, monospace";

type TaskStats = {
  totalSubmissions?: number;
  winningOption?: number | null;
  rewardPerWorker?: number;
  timeSeries?: { date: string; votes: number }[];
  options?: { optionId: number; votes: number }[];
};

function LoadingSkeleton() {
  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {[120, 320, 240, 200].map((h, i) => (
        <div
          key={i}
          style={{
            height: `${h}px`,
            background: "var(--surface-1)",
            border: "1px solid var(--line)",
            borderRadius: "6px",
          }}
        />
      ))}
    </div>
  );
}

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = Number(params.id);

  const [task, setTask] = useState<Task | null>(null);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [taskData, statsData] = await Promise.all([
          taskApi.getById(taskId),
          taskApi.getStats(taskId),
        ]);

        const updatedOptions = taskData.options?.map((opt: Thumbnail) => {
          const optStat = statsData.options?.find(
            (s: { optionId: number }) => s.optionId === opt.id
          );
          return { ...opt, votes: optStat ? optStat.votes : 0 };
        });

        setTask({
          ...taskData,
          options: updatedOptions,
          totalSubmissions: statsData.totalSubmissions,
        });
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch task details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) fetchData();
  }, [taskId]);

  if (isLoading) return <LoadingSkeleton />;

  if (!task) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          minHeight: "calc(100dvh - 52px)",
        }}
      >
        <span style={{ fontFamily: mono, fontSize: "11px", color: "var(--text-3)" }}>
          Task not found.
        </span>
      </div>
    );
  }

  const isCompleted =
    task.status === "COMPLETED" || task.status === "CLOSED" || task.status === "SETTLED";
  const winningOptionId = stats?.winningOption;
  const winningOption = task.options?.find((opt) => opt.id === winningOptionId);

  return (
    <PageWrapper>
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
    <PageTransition
      style={{
        paddingTop: "40px",
        paddingBottom: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <TaskDetailHeader task={task} isOwner={true} />

      {isCompleted && winningOption && (
        <WinnerBanner
          winningOption={winningOption}
          totalVotes={task.totalSubmissions || 0}
        />
      )}

      {(task.options?.length ?? 0) > 0 && (
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            overflowX: "auto",
          }}
        >
          <ResultsGrid
            options={task.options || []}
            totalVotes={task.totalSubmissions || 0}
          />
        </div>
      )}

      <VotesOverTimeChart data={stats?.timeSeries || []} />
    </PageTransition>
    </div>
    </PageWrapper>
  );
}
