"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { ActivityTabs } from "@/components/dashboard/ActivityTabs";
import { MyTasks } from "@/components/dashboard/MyTasks";
import { MyWork } from "@/components/dashboard/MyWork";
import { meApi } from "@/lib/api";
import { Task } from "@/types";
import { useAccount } from "wagmi";
import { PageTransition } from "@/components/ui/PageTransition";
import { PageWrapper } from "@/components/layout/PageWrapper";

const geist = "Geist, system-ui, sans-serif";

function DashboardContent() {
  const { address } = useAccount();
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

      <PageTransition style={{ display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Stats row */}
        <PageWrapper style={{ paddingTop: "32px", paddingBottom: "24px" }}>
          <StatsRow
            stats={{
              ethBalance: "0.000",
              tasksCreated: tasks.length,
              ethSpent: ethSpent.toFixed(3),
              ethEarned: (earnings.totalEarned * 0.001).toFixed(3),
            }}
          />
        </PageWrapper>

        {/* Subnav */}
        <PageWrapper
          style={{
            borderBottom: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ActivityTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <Link
            href="/create-task"
            style={{
              fontFamily: geist,
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text-2)",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              padding: "6px 10px",
              border: "1px solid var(--line)",
              borderRadius: "5px",
              transition: "border-color 0.1s, color 0.1s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--text-3)";
              el.style.color = "var(--text-1)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--line)";
              el.style.color = "var(--text-2)";
            }}
          >
            New Task →
          </Link>
        </PageWrapper>

        {/* Table content */}
        <PageWrapper style={{ paddingTop: "24px", paddingBottom: "24px", overflowX: "auto" }}>
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
