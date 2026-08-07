import Link from "next/link";
import Image from "next/image";
import { Task } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/buttonVariants";

interface TaskCardProps {
  task: Task;
  mode: "browse" | "creator-dashboard" | "worker-dashboard";
  hasVoted?: boolean;
  earnedEth?: string;
  optionPickedImage?: string;
}

function ActionButton({
  href,
  label,
  disabled,
}: {
  href: string;
  label: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div
        className={buttonVariants({
          variant: "ghost",
          // No opacity here: halving --green dropped this to 2.88:1 on a card,
          // under AA. pointer-events-none and the ghost variant already read
          // as non-interactive without dimming the text.
          className:
            "w-full font-mono text-green cursor-default pointer-events-none",
        })}
      >
        {label}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={buttonVariants({ variant: "outline", className: "w-full" })}
    >
      {label}
    </Link>
  );
}

export function TaskCard({
  task,
  mode,
  hasVoted = false,
  earnedEth,
  optionPickedImage,
}: TaskCardProps) {
  const isOpen =
    task.status === "ACTIVE" || task.status === "CREATED";
  const isCompleted =
    task.status === "COMPLETED" ||
    task.status === "CLOSED" ||
    task.status === "SETTLED";

  const rewardEth = (task.budget * 0.001).toFixed(3);
  const optionCount = task.optionsCount ?? task.options?.length ?? 0;
  const votes = task.totalSubmissions ?? 0;
  const maxVotes = task.budget ?? 20;
  const progressPct = maxVotes > 0 ? Math.min(100, (votes / maxVotes) * 100) : 0;

  const thumbnailSrc =
    mode === "worker-dashboard" && optionPickedImage
      ? optionPickedImage
      : task.options?.[0]?.gateway_url ?? null;

  return (
    <Card interactive className="group flex flex-col overflow-hidden">
      {/* ── Thumbnail image ───────────────────────────────────────────── */}
      <div className="relative aspect-video bg-raised shrink-0 overflow-hidden">
        {thumbnailSrc ? (
          <Image
            src={thumbnailSrc}
            alt={task.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-dim">
            no preview
          </div>
        )}

        {/* Options count badge — top right */}
        {optionCount > 0 && (
          <div className="absolute top-2 right-2 bg-ink/70 rounded-sm px-[7px] py-[3px] font-mono text-[10px] text-lo select-none">
            {optionCount} options
          </div>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Status + ETH reward */}
        <div className="flex items-center justify-between mb-2.5">
          <Badge variant={isOpen ? "green" : "default"}>
            {isOpen ? "Open" : "Closed"}
          </Badge>
          <span className="font-mono text-[11px] text-amber">
            Ξ {rewardEth} ETH
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[16px] leading-[1.3] mb-3">{task.title}</h3>

        {/* Divider */}
        <div className="h-px bg-subtle mb-3" />

        {/* Vote meta */}
        <div className="font-mono text-[11px] text-dim mb-2">
          {optionCount} options · {votes}/{maxVotes} opinions
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-line rounded-[1px] overflow-hidden mb-4">
          <div
            className="h-full bg-lo transition-[width] duration-[400ms] ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Action — pinned to bottom */}
        <div className="mt-auto">
          {mode === "browse" && (
            <>
              {hasVoted ? (
                <ActionButton
                  href={`/tasks/${task.id}`}
                  label="Answered ✓"
                  disabled
                />
              ) : (
                <ActionButton
                  href={isCompleted ? `/tasks/${task.id}` : `/vote/${task.id}`}
                  label={isCompleted ? "View Results →" : "Give Opinion →"}
                />
              )}
            </>
          )}

          {mode === "creator-dashboard" && (
            <ActionButton href={`/tasks/${task.id}`} label="View Results →" />
          )}

          {mode === "worker-dashboard" && (
            <div className="flex justify-between items-center py-[9px] border-t border-line">
              <span className="font-mono text-[10px] text-dim">Earnings</span>
              <span
                className={`font-mono text-[11px] ${isCompleted ? "text-green" : "text-amber"}`}
              >
                {isCompleted ? `+${earnedEth ?? "0.000"} ETH` : "Pending"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
