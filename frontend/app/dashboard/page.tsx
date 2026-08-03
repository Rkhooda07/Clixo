"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { MyTasks } from "@/components/dashboard/MyTasks";
import { MyWork } from "@/components/dashboard/MyWork";
import { Tabs } from "@/components/ui/Tabs";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { meApi } from "@/lib/api";
import { Task } from "@/types";
import { PageTransition } from "@/components/ui/PageTransition";
import { PageWrapper } from "@/components/layout/PageWrapper";

function DashboardContent() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: "my-tasks" | "my-work" =
    tabParam === "work" ? "my-work" : "my-tasks";

  function setActiveTab(tab: "my-tasks" | "my-work") {
    router.push(`/dashboard?tab=${tab === "my-work" ? "work" : "tasks"}`);
  }

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

  const tasks = React.useMemo(() => {
    const rawTasks = tasksData?.tasks || [];
    return rawTasks.map((t) => ({
      ...t,
      createdAt: t.createdAt ?? new Date().toISOString(),
      updatedAt: t.updatedAt ?? new Date().toISOString(),
      user_id: t.user_id ?? 0,
      signature: t.signature ?? null,
      amount: t.amount ?? null,
    }));
  }, [tasksData]);

  const submissions = subsData?.submissions || [];
  const earnings = earningsData || { pending: 0, locked: 0, totalEarned: 0 };
  const isLoading = isTasksLoading || isSubsLoading || isEarningsLoading;

  const ethSpent = tasks.reduce((acc: number, t: Task) => acc + (t.fundedAmount || 0), 0) * 0.001;

  return (
    <WalletGuard>
      <PageTransition className="flex flex-1 flex-col">

        {/* Stats row */}
        <PageWrapper className="pt-8 pb-6">
          <StatsRow
            stats={{
              ethBalance: balance ? Number(balance.formatted).toFixed(3) : "—",
              tasksCreated: tasks.length,
              ethSpent: ethSpent.toFixed(3),
              ethEarned: (earnings.totalEarned * 0.001).toFixed(3),
            }}
          />
        </PageWrapper>

        {/* Subnav */}
        <PageWrapper className="flex items-end justify-between gap-4 border-b border-line">
          <Tabs
            aria-label="Dashboard activity"
            className="border-b-0"
            items={[
              {
                id: "my-tasks",
                label: "Posted Tasks",
                count: isTasksLoading ? undefined : tasks.length,
              },
              {
                id: "my-work",
                label: "My Opinions",
                count: isSubsLoading ? undefined : submissions.length,
              },
            ]}
            value={activeTab}
            onChange={(id) => setActiveTab(id === "my-work" ? "my-work" : "my-tasks")}
          />
          <Link
            href="/create-task"
            className={buttonVariants({ variant: "outline", size: "sm", className: "mb-1.5 shrink-0" })}
          >
            <Plus size={14} className="text-dim" />
            Post a Task
          </Link>
        </PageWrapper>

        {/* Table content */}
        <PageWrapper className="py-6">
          {activeTab === "my-tasks" ? (
            <MyTasks tasks={tasks} isLoading={isLoading} />
          ) : (
            <MyWork submissions={submissions} isLoading={isLoading} />
          )}
        </PageWrapper>

      </PageTransition>
    </WalletGuard>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
