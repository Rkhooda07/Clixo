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

  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["my-tasks", address],
    queryFn: () => meApi.getTasks(),
    enabled: !!address,
  });

  const { data: subsData, isLoading: isSubsLoading } = useQuery({
    queryKey: ["my-submissions", address],
    queryFn: () => meApi.getSubmissions(),
    enabled: !!address,
  });

  const { data: earningsData, isLoading: isEarningsLoading } = useQuery({
    queryKey: ["my-earnings", address],
    queryFn: () => meApi.getEarnings(),
    enabled: !!address,
  });

  const rawTasks = tasksData?.tasks || [];
  const tasks = React.useMemo(() => {
    return rawTasks.map((t: any) => ({
      ...t,
      createdAt: t.createdAt ?? new Date().toISOString(),
      updatedAt: t.updatedAt ?? new Date().toISOString(),
      user_id: t.user_id ?? 0,
      signature: t.signature ?? null,
      amount: t.amount ?? null,
    }));
  }, [rawTasks]);

  const submissions = subsData?.submissions || [];
  const earnings = earningsData || { pending: 0, locked: 0, totalEarned: 0 };
  const isLoading = isTasksLoading || isSubsLoading || isEarningsLoading;

  const ethSpent = tasks.reduce((acc: number, t: Task) => acc + (t.fundedAmount || 0), 0) * 0.001;

  return (
    <WalletGuard>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Stats row */}
        <div style={{ padding: "32px 40px 24px" }}>
          <StatsRow
            stats={{
              ethBalance: "0.000",
              tasksCreated: tasks.length,
              ethSpent: ethSpent.toFixed(3),
              ethEarned: (earnings.totalEarned * 0.001).toFixed(3),
            }}
          />
        </div>

        {/* Subnav */}
        <div
          style={{
            padding: "0 40px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <ActivityTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Table content */}
        <div style={{ padding: "24px 40px", overflowX: "auto" }}>
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
