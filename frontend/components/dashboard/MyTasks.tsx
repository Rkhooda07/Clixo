import React from "react";
import Link from "next/link";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { buttonVariants } from "@/components/ui/buttonVariants";

interface MyTasksProps {
  tasks: Task[];
  isLoading: boolean;
}

const HEADERS = ["Title", "Options", "Status", "Progress", "Reward", "Action"];
const TH = "eyebrow border-b border-line px-3 py-2.5 text-left font-normal";
const TD = "h-12 px-3 align-middle text-[13px] text-lo";

function taskRow(task: Task) {
  const votes = task.totalSubmissions ?? 0;
  const maxVotes = task.budget ?? 20;
  return {
    isOpen: task.status === "ACTIVE" || task.status === "CREATED",
    rewardEth: (task.budget * 0.001).toFixed(3),
    votes,
    maxVotes,
    progressPct: maxVotes > 0 ? Math.min(100, (votes / maxVotes) * 100) : 0,
    optionCount: task.optionsCount ?? task.options?.length ?? 0,
  };
}

function ProgressBar({ pct, className }: { pct: number; className?: string }) {
  return (
    <div className={cn("h-0.5 overflow-hidden rounded-[1px] bg-line", className)}>
      <div className="h-full bg-lo" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function MyTasks({ tasks, isLoading }: MyTasksProps) {
  if (isLoading) {
    return (
      <>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {HEADERS.map((h) => (
                  <th key={h} className={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr key={i} className="border-b border-subtle">
                  {HEADERS.map((h, j) => (
                    <td key={h} className={TD}>
                      <Skeleton className={cn("h-2.5", j === 0 ? "w-3/5" : "w-2/5")} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 md:hidden">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="flex flex-col gap-3 p-4">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-2.5 w-2/5" />
              <Skeleton className="h-0.5 w-full" />
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        message="You haven't posted any tasks yet."
        action={{ label: "Post your first task", href: "/create-task" }}
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th key={h} className={TH}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const r = taskRow(task);
              return (
                <tr
                  key={task.id}
                  className="group border-b border-subtle transition-colors hover:bg-raised"
                >
                  <td className={cn(TD, "max-w-[260px]")}>
                    <span className="block truncate font-display font-medium tracking-[-0.01em] text-hi">
                      {task.title}
                    </span>
                  </td>
                  <td className={TD}>
                    <span className="font-mono text-xs text-dim">{r.optionCount}</span>
                  </td>
                  <td className={TD}>
                    <Badge variant={r.isOpen ? "green" : "default"}>
                      {r.isOpen ? "OPEN" : "CLOSED"}
                    </Badge>
                  </td>
                  <td className={TD}>
                    <div className="flex items-center gap-2.5">
                      <span className="shrink-0 font-mono text-xs text-dim">
                        {r.votes}/{r.maxVotes}
                      </span>
                      <ProgressBar pct={r.progressPct} className="w-20 shrink-0" />
                    </div>
                  </td>
                  <td className={TD}>
                    <span className="font-mono text-xs text-amber">Ξ {r.rewardEth}</span>
                  </td>
                  <td className={TD}>
                    <Link
                      href={`/tasks/${task.id}`}
                      className="text-[13px] text-lo transition-colors hover:text-hi group-hover:text-hi"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {tasks.map((task) => {
          const r = taskRow(task);
          return (
            <Card key={task.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="min-w-0 truncate font-display text-[13px] font-medium tracking-[-0.01em] text-hi">
                  {task.title}
                </span>
                <Badge variant={r.isOpen ? "green" : "default"}>
                  {r.isOpen ? "OPEN" : "CLOSED"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-amber">Ξ {r.rewardEth}</span>
                <span className="font-mono text-xs text-dim">
                  {r.votes}/{r.maxVotes}
                </span>
              </div>
              <ProgressBar pct={r.progressPct} />
              <Link
                href={`/tasks/${task.id}`}
                className={buttonVariants({ variant: "outline", size: "sm", className: "self-start" })}
              >
                View →
              </Link>
            </Card>
          );
        })}
      </div>
    </>
  );
}
