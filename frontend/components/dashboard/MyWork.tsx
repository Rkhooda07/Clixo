"use client";

import React from "react";
import { TaskCard } from "../tasks/TaskCard";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { Compass } from "lucide-react";
import Link from "next/link";
import { WorkerVoteRecord, Task } from "@/types";

interface MyWorkProps {
  submissions: WorkerVoteRecord[];
  isLoading: boolean;
}

export function MyWork({ submissions, isLoading }: MyWorkProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          title="No work submitted yet"
          description="Browse active tasks and start voting to earn ETH rewards."
          icon={Compass}
          action={
            <Link
              href="/browse"
              className="mt-4 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all"
            >
              Browse Tasks
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {submissions.map((sub, index) => {
        // Map WorkerVoteRecord to a partial Task object for TaskCard
        const mockTask: Task = {
          id: sub.taskId,
          title: sub.taskTitle || `Task #${sub.taskId}`,
          status: sub.taskStatus,
          budget: sub.taskBudget || 0,
          fundedAmount: 0,
          createdAt: sub.submittedAt,
          updatedAt: sub.submittedAt,
          user_id: 0,
          signature: null,
          amount: null,
          deadline: null,
          options: []
        };

        return (
          <TaskCard 
            key={`${sub.taskId}-${index}`} 
            task={mockTask} 
            mode="worker-dashboard"
            optionPickedImage={sub.optionPickedImage}
            earnedEth={sub.earnedEth}
          />
        );
      })}
    </div>
  );
}
