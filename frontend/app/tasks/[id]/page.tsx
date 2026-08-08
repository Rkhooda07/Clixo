"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { CloudOff } from "lucide-react";
import { taskApi } from "@/lib/api";
import { Task, TaskStats, Thumbnail } from "@/types";
import { TaskDetailHeader } from "@/components/tasks/TaskDetailHeader";
import { WinnerBanner } from "@/components/tasks/WinnerBanner";
import { ResultsGrid } from "@/components/tasks/ResultsGrid";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
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
  const [loadFailed, setLoadFailed] = useState(false);
  // Bumped by the retry button; the only reason this effect re-runs.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setLoadFailed(false);
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
        setLoadFailed(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) fetchData();
  }, [taskId, reloadKey]);

  if (isLoading) return <LoadingSkeleton />;

  // Distinct from "not found": a sleeping backend used to render as a deleted
  // task, which is a much worse thing to tell someone.
  if (loadFailed) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-16">
        <EmptyState
          className="flex-1"
          icon={<CloudOff size={16} />}
          message="Can't reach the Clixo API."
          detail="The backend is unreachable or still waking up. This task hasn't gone anywhere."
          action={{ label: "Try again", onClick: () => setReloadKey((k) => k + 1) }}
        />
      </div>
    );
  }

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
