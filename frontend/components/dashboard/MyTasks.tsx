"use client";

import React from "react";
import { TaskCard } from "../tasks/TaskCard";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Task } from "@/types";

interface MyTasksProps {
  tasks: Task[];
  isLoading: boolean;
}

export function MyTasks({ tasks, isLoading }: MyTasksProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          title="No tasks created yet"
          description="Create your first labeling task to get insights from the community."
          icon={PlusCircle}
          action={
            <Link
              href="/create-task"
              className="mt-4 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all"
            >
              Create Task
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} mode="creator-dashboard" />
      ))}
    </div>
  );
}
