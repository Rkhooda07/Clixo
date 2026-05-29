"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { taskApi } from "@/lib/api";
import { Task } from "@/types";
import { TaskDetailHeader } from "@/components/tasks/TaskDetailHeader";
import { WinnerBanner } from "@/components/tasks/WinnerBanner";
import { ResultsGrid } from "@/components/tasks/ResultsGrid";
import { VotesOverTimeChart } from "@/components/tasks/VotesOverTimeChart";
import { Skeleton } from "@/components/ui/Skeleton";

type TaskStats = {
  totalSubmissions?: number;
  winningOption?: number | null;
  rewardPerWorker?: number;
  timeSeries?: { date: string; votes: number }[];
  options?: { optionId: number; votes: number }[];
};

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
          taskApi.getStats(taskId)
        ]);
        
        // Merge stats into task options if needed
        const updatedOptions = taskData.options?.map(opt => {
          const optStat = statsData.options?.find((s: { optionId: number }) => s.optionId === opt.id);
          return {
            ...opt,
            votes: optStat ? optStat.votes : 0
          };
        });

        setTask({ ...taskData, options: updatedOptions, totalSubmissions: statsData.totalSubmissions });
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch task details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) fetchData();
  }, [taskId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-[300px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500">Task not found.</p>
      </div>
    );
  }

  const winningOptionId = stats?.winningOption;
  const winningOption = task.options?.find(opt => opt.id === winningOptionId);
  const isCompleted = task.status === "COMPLETED" || task.status === "CLOSED" || task.status === "SETTLED";
  const isOwner = true; // For now, assuming if they can see this they might be the owner or we handle it via backend

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12 animate-in fade-in duration-700">
      <TaskDetailHeader task={task} isOwner={isOwner} />

      {isCompleted && winningOption && (
        <WinnerBanner winningOption={winningOption} totalVotes={task.totalSubmissions || 0} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-12">
          <ResultsGrid options={task.options || []} totalVotes={task.totalSubmissions || 0} />
        </div>
        
        <div className="flex flex-col gap-12">
          <VotesOverTimeChart data={stats?.timeSeries || []} />
          
          <div className="bg-[#111118]/60 border border-zinc-800/50 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white">Task Metadata</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Contract Address</span>
                <span className="text-zinc-300 font-mono">0x71C...3a2F</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Network</span>
                <span className="text-zinc-300">Sepolia Testnet</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Worker Reward</span>
                <span className="text-zinc-300">{stats?.rewardPerWorker || 0} Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
