"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { ActivityTabs } from "@/components/dashboard/ActivityTabs";
import { MyTasks } from "@/components/dashboard/MyTasks";
import { MyWork } from "@/components/dashboard/MyWork";
import { meApi } from "@/lib/api";
import { Task } from "@/types";
import { useAccount } from "wagmi";

export default function DashboardPage() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"my-tasks" | "my-work">("my-tasks");

  // 1. Fetch user tasks using React Query
  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["my-tasks", address],
    queryFn: () => meApi.getTasks(),
    enabled: !!address,
  });

  // 2. Fetch user submissions using React Query
  const { data: subsData, isLoading: isSubsLoading } = useQuery({
    queryKey: ["my-submissions", address],
    queryFn: () => meApi.getSubmissions(),
    enabled: !!address,
  });

  // 3. Fetch user earnings using React Query
  const { data: earningsData, isLoading: isEarningsLoading } = useQuery({
    queryKey: ["my-earnings", address],
    queryFn: () => meApi.getEarnings(),
    enabled: !!address,
  });

  const rawTasks = tasksData?.tasks || [];
  const tasks = React.useMemo(() => {
    return rawTasks.map((t: any) => ({
      ...t,
      createdAt: new Date().toISOString(), // Fallback
      updatedAt: new Date().toISOString(), // Fallback
      user_id: 0, // Fallback
      signature: null,
      amount: null,
    }));
  }, [rawTasks]);

  const submissions = subsData?.submissions || [];
  const earnings = earningsData || { pending: 0, locked: 0, totalEarned: 0 };
  const isLoading = isTasksLoading || isSubsLoading || isEarningsLoading;

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
