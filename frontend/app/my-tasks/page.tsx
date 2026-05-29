"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, PlusCircle } from "lucide-react";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { meApi } from "@/lib/api";
import { Task } from "@/types";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const data = await meApi.getTasks();
        if (active) {
          setTasks(data.tasks);
        }
      } catch (err) {
        console.error("Failed to fetch created tasks:", err);
        if (active) {
          setTasks([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      active = false;
    };
  }, []);

  return (
    <WalletGuard>
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest">
              <BarChart3 className="w-4 h-4" />
              Creator Analytics
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              My Created Tasks
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Review only the campaigns created by your connected wallet. Open any task to view its analytics page.
            </p>
          </div>

          <Link
            href="/create-task"
            className="inline-flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-[0_0_15px_rgba(124,58,237,0.25)]"
          >
            <PlusCircle className="w-4 h-4" />
            Create Task
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No created tasks yet"
            description="Create your first labeling task to start collecting worker signal and analytics."
            action={
              <Link
                href="/create-task"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-sm font-bold transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Create Task
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} mode="creator-dashboard" />
            ))}
          </div>
        )}
      </main>
    </WalletGuard>
  );
}
