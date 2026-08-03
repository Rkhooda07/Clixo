import React from "react";
import Image from "next/image";
import Link from "next/link";
import { WorkerVoteRecord } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { buttonVariants } from "@/components/ui/buttonVariants";

interface MyWorkProps {
  submissions: WorkerVoteRecord[];
  isLoading: boolean;
}

const HEADERS = ["Task Title", "Your Pick", "Status", "Earned", "Date"];
const TH = "eyebrow border-b border-line px-3 py-2.5 text-left font-normal";
const TD = "h-12 px-3 align-middle text-[13px] text-lo";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "—";
  }
}

function workRow(sub: WorkerVoteRecord) {
  return {
    isOpen: sub.taskStatus === "ACTIVE" || sub.taskStatus === "CREATED",
    title: sub.taskTitle || `Task #${sub.taskId}`,
    thumbSrc: sub.optionPickedImage || "",
    earnedEth: sub.earnedEth,
    date: formatDate(sub.submittedAt),
  };
}

function PickThumb({ src }: { src: string }) {
  if (!src) {
    return (
      <span className="flex h-6 w-10 shrink-0 items-center justify-center rounded-xs bg-raised font-mono text-[8px] text-dim">
        —
      </span>
    );
  }
  return (
    <span className="block h-6 w-10 shrink-0 overflow-hidden rounded-xs bg-raised">
      <Image
        src={src}
        alt="Your pick"
        width={40}
        height={24}
        className="block h-full w-full object-cover"
      />
    </span>
  );
}

function Earned({ isOpen, earnedEth }: { isOpen: boolean; earnedEth?: string }) {
  if (isOpen || !earnedEth) {
    return <Badge variant="amber">Pending</Badge>;
  }
  return <span className="font-mono text-xs text-amber">Ξ {earnedEth}</span>;
}

export function MyWork({ submissions, isLoading }: MyWorkProps) {
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
                      <Skeleton className={cn("h-2.5", j === 0 ? "w-[70%]" : "w-2/5")} />
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
              <Skeleton className="h-2.5 w-1/4" />
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        message="You haven't answered any tasks yet."
        action={{ label: "Browse open tasks", href: "/browse" }}
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
            {submissions.map((sub, i) => {
              const r = workRow(sub);
              return (
                <tr
                  key={`${sub.taskId}-${i}`}
                  className="border-b border-subtle transition-colors hover:bg-raised"
                >
                  <td className={cn(TD, "max-w-[260px]")}>
                    <span className="block truncate font-display font-medium tracking-[-0.01em] text-hi">
                      {r.title}
                    </span>
                  </td>
                  <td className={TD}>
                    <PickThumb src={r.thumbSrc} />
                  </td>
                  <td className={TD}>
                    <Badge variant={r.isOpen ? "green" : "default"}>
                      {r.isOpen ? "OPEN" : "CLOSED"}
                    </Badge>
                  </td>
                  <td className={TD}>
                    <Earned isOpen={r.isOpen} earnedEth={r.earnedEth} />
                  </td>
                  <td className={TD}>
                    <span className="font-mono text-[11px] text-dim">{r.date}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {submissions.map((sub, i) => {
          const r = workRow(sub);
          return (
            <Card key={`${sub.taskId}-${i}`} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <PickThumb src={r.thumbSrc} />
                  <span className="min-w-0 truncate font-display text-[13px] font-medium tracking-[-0.01em] text-hi">
                    {r.title}
                  </span>
                </div>
                <Badge variant={r.isOpen ? "green" : "default"}>
                  {r.isOpen ? "OPEN" : "CLOSED"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Earned isOpen={r.isOpen} earnedEth={r.earnedEth} />
                <span className="font-mono text-[11px] text-dim">{r.date}</span>
              </div>
              <Link
                href={`/tasks/${sub.taskId}`}
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
