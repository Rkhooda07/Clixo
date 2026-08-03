"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Compass, Search } from "lucide-react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskCardSkeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { taskApi, meApi } from "@/lib/api";
import { useWalletUser } from "@/hooks/useWalletUser";
import { PageTransition } from "@/components/ui/PageTransition";
import { PageWrapper } from "@/components/layout/PageWrapper";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "highest", label: "Highest Reward" },
  { id: "needed", label: "Most Needed" },
  { id: "newest", label: "Newest" },
];

type FilterId = "all" | "highest" | "needed" | "newest";

const GRID = "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 pb-10";

export default function BrowsePage() {
  const { isConnected, token } = useWalletUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getAll(),
  });

  const { data: submissionsData } = useQuery({
    queryKey: ["submissions", token],
    queryFn: () => meApi.getSubmissions(),
    enabled: !!isConnected && !!token,
  });

  const votedTaskIds = useMemo(() => {
    if (!submissionsData?.submissions) return new Set<number>();
    return new Set(submissionsData.submissions.map((sub) => sub.taskId));
  }, [submissionsData]);

  const filteredTasks = useMemo(
    () =>
      (tasksData?.tasks || [])
        .filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          if (activeFilter === "highest") return (b.budget || 0) - (a.budget || 0);
          if (activeFilter === "needed") {
            const aN = (a.budget || 10) - (a.totalSubmissions || 0);
            const bN = (b.budget || 10) - (b.totalSubmissions || 0);
            return bN - aN;
          }
          if (activeFilter === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        }),
    [tasksData, searchQuery, activeFilter]
  );

  return (
    <PageWrapper className="flex flex-col flex-1">
      <PageTransition className="flex flex-col flex-1">
        {/* Header */}
        <div className="pt-10 pb-6 flex flex-col gap-5">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="eyebrow mb-2">Browse</div>
              <h1 className="text-[22px]">Open Tasks</h1>
            </div>

            {/* Search */}
            <div className="relative min-w-[220px] max-w-[280px] flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dim pointer-events-none"
              />
              <Input
                type="text"
                placeholder="Search tasks..."
                aria-label="Search tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filter row */}
          <Tabs
            items={FILTERS}
            value={activeFilter}
            onChange={(id) => setActiveFilter(id as FilterId)}
            aria-label="Filter tasks"
          />
        </div>

        {/* Grid */}
        {isTasksLoading ? (
          <div className={GRID}>
            {Array.from({ length: 6 }, (_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          searchQuery || activeFilter !== "all" ? (
            <EmptyState
              className="flex-1 mb-10"
              icon={<Compass size={16} />}
              message="No tasks match your search."
            />
          ) : (
            <EmptyState
              className="flex-1 mb-10"
              icon={<Compass size={16} />}
              message="No tasks open right now."
              action={{ label: "Check back soon or post one", href: "/create-task" }}
            />
          )
        ) : (
          <div className={GRID}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                mode="browse"
                hasVoted={votedTaskIds.has(task.id)}
              />
            ))}
          </div>
        )}
      </PageTransition>
    </PageWrapper>
  );
}
