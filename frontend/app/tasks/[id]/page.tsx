"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { taskApi } from "@/lib/api";
import { Task, TaskStats, Thumbnail } from "@/types";
import { TaskDetailHeader } from "@/components/tasks/TaskDetailHeader";
import { WinnerBanner } from "@/components/tasks/WinnerBanner";
import { ResultsGrid } from "@/components/tasks/ResultsGrid";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageTransition } from "@/components/ui/PageTransition";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useAppStore } from "@/store/useAppStore";

// Recharts (~100KB) stays out of the route bundle until the chart renders.
const VotesOverTimeChart = dynamic(
  () =>
    import("@/components/tasks/VotesOverTimeChart").then(
      (mod) => mod.VotesOverTimeChart
    ),
  { ssr: false, loading: () => <Skeleton className="h-[240px]" /> }
);

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-10">
      <Skeleton className="h-[120px] rounded-lg" />
      <Skeleton className="h-[320px] rounded-lg" />
      <Skeleton className="h-[240px] rounded-lg" />
      <Skeleton className="h-[200px] rounded-lg" />
    </div>
  );
}

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = Number(params.id);
  const { userId } = useAppStore();

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
      <div className="flex flex-1 items-center justify-center">
        <span className="font-mono text-[11px] text-dim">Task not found.</span>
      </div>
    );
  }

  const isOwner = task.user_id === userId;
  const isCompleted =
    task.status === "COMPLETED" || task.status === "CLOSED" || task.status === "SETTLED";
  const winningOptionId = stats?.winningOption;
  const winningOption = task.options?.find((opt) => opt.id === winningOptionId);

  return (
    <PageWrapper>
      <div className="mx-auto max-w-[900px]">
        <PageTransition className="flex flex-col gap-8 pt-10 pb-10">
          <TaskDetailHeader task={task} isOwner={isOwner} />

          {isCompleted && winningOption && (
            <WinnerBanner
              winningOption={winningOption}
              totalVotes={task.totalSubmissions || 0}
            />
          )}

          {(task.options?.length ?? 0) > 0 && (
            <Card className="overflow-x-auto">
              <ResultsGrid
                options={task.options || []}
                totalVotes={task.totalSubmissions || 0}
              />
            </Card>
          )}

          <VotesOverTimeChart data={stats?.timeSeries || []} />
        </PageTransition>
      </div>
    </PageWrapper>
  );
}
