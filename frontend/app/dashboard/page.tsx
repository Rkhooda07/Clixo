"use client";

import React, { useEffect, useState } from "react";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { ActivityTabs } from "@/components/dashboard/ActivityTabs";
import { MyTasks } from "@/components/dashboard/MyTasks";
import { MyWork } from "@/components/dashboard/MyWork";
import { meApi } from "@/lib/api";
import { Task, WorkerVoteRecord, TaskStatus } from "@/types";
import { useAccount } from "wagmi";

export default function DashboardPage() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"my-tasks" | "my-work">("my-tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<WorkerVoteRecord[]>([]);
  const [earnings, setEarnings] = useState({ pending: 0, locked: 0, totalEarned: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [tasksData, subsData, earningsData] = await Promise.all([
          meApi.getTasks(),
          meApi.getSubmissions(),
          meApi.getEarnings(),
        ]);

        // Map backend tasks to frontend Task type
        const mappedTasks: Task[] = tasksData.tasks.map((t: any) => ({
          ...t,
          createdAt: new Date().toISOString(), // Fallback
          updatedAt: new Date().toISOString(), // Fallback
          user_id: 0, // Fallback
          signature: null,
          amount: null,
        }));

        setTasks(mappedTasks);
        setSubmissions(subsData.submissions);
        setEarnings(earningsData);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [address]);

  const ethSpent = tasks.reduce((acc, t) => acc + (t.fundedAmount || 0), 0) * 0.001;

  return (
    <WalletGuard>
      <div className="flex flex-col gap-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-zinc-400 text-sm">
            Welcome back! Monitor your tasks and worker performance.
          </p>
        </div>

        {/* Stats Section */}
        <StatsRow 
          stats={{
            tasksCreated: tasks.length,
            ethSpent: ethSpent.toFixed(3),
            ethEarned: (earnings.totalEarned * 0.001).toFixed(3),
            ethBalance: "0.000", // Would need real wallet balance if possible
          }}
        />

        {/* Activity Section */}
        <div className="flex flex-col gap-4">
          <ActivityTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            myTasksCount={tasks.length}
            myWorkCount={submissions.length}
          />

          {activeTab === "my-tasks" ? (
            <MyTasks tasks={tasks} isLoading={isLoading} />
          ) : (
            <MyWork submissions={submissions} isLoading={isLoading} />
          )}
        </div>
      </div>
    </WalletGuard>
  );
}
