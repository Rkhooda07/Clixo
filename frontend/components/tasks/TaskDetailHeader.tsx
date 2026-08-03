"use client";

import React, { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Task } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatBlock } from "@/components/ui/StatBlock";
import { cn } from "@/lib/utils";

interface TaskDetailHeaderProps {
  task: Task;
  isOwner: boolean;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TaskDetailHeader({ task }: TaskDetailHeaderProps) {
  const [shareCopied, setShareCopied] = useState(false);

  const isCompleted =
    task.status === "COMPLETED" || task.status === "CLOSED" || task.status === "SETTLED";
  const isOpen = task.status === "ACTIVE" || task.status === "CREATED";
  const rewardEth = ((task.budget || 0) * 0.001).toFixed(3);

  const handleShare = () => {
    const url = `${window.location.origin}/vote/${task.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Top row: eyebrow + title, actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.08em] text-dim">
              TASK #{task.id}
            </span>
            <Badge variant={isOpen ? "green" : "default"}>
              {isOpen ? "Open" : isCompleted ? "Closed" : task.status}
            </Badge>
          </div>
          <h1 className="m-0 text-[22px] leading-[1.3]">{task.title}</h1>
          {task.description && (
            <p className="m-0 text-[13px] leading-relaxed text-lo">
              {task.description}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className={cn("shrink-0", shareCopied && "text-green hover:text-green")}
        >
          {shareCopied ? <Check size={14} /> : <Link2 size={14} className="text-lo" />}
          {shareCopied ? "Copied" : "Share Link"}
        </Button>
      </div>

      {/* Stats row — 2×2 grid on mobile, single row on desktop */}
      <div className="grid grid-cols-2 gap-5 border-t border-line pt-4 md:flex md:items-center">
        <StatBlock label="Reward" value={`Ξ ${rewardEth} ETH`} accent="amber" />
        <div className="hidden h-8 w-px bg-line md:block" />
        <StatBlock label="Total Contributors" value={task.totalSubmissions || 0} />
        <div className="hidden h-8 w-px bg-line md:block" />
        <StatBlock
          label="Deadline"
          value={task.deadline ? formatDate(task.deadline) : "—"}
        />
        <div className="hidden h-8 w-px bg-line md:block" />
        <StatBlock label="Created" value={formatDate(task.createdAt)} />
      </div>
    </div>
  );
}
