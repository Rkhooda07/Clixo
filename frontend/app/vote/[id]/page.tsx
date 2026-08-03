"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { taskApi, submissionApi, meApi } from "@/lib/api";
import { Task, TaskStats, Thumbnail, WorkerVoteRecord } from "@/types";
import { ThumbnailGallery } from "@/components/vote/ThumbnailGallery";
import { AlreadyVoted } from "@/components/vote/AlreadyVoted";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/ui/PageTransition";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const taskId = Number(params.id);
  const { userId, token } = useAppStore();

  const [task, setTask] = useState<Task | null>(null);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOptionId, setVotedOptionId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // No token = not signed in: skip /me/submissions (it would 401) and
        // treat as "no previous vote".
        const [taskData, statsData, mySubs] = await Promise.all([
          taskApi.getById(taskId),
          taskApi.getStats(taskId),
          token
            ? meApi.getSubmissions()
            : Promise.resolve<{ submissions: WorkerVoteRecord[] }>({
                submissions: [],
              }),
        ]);

        const previousVote = mySubs.submissions.find(
          (s) => s.taskId === taskId,
        );
        if (previousVote) {
          setHasVoted(true);
          setVotedOptionId(previousVote.optionId);
        }

        const updatedOptions = taskData.options?.map((opt: Thumbnail) => {
          const optStat = statsData.options.find(
            (s) => s.optionId === opt.id,
          );
          return { ...opt, votes: optStat ? optStat.votes : 0 };
        });

        setTask({ ...taskData, options: updatedOptions });
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch voting data:", err);
        toast.error("Failed to load task details");
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) fetchData();
  }, [taskId, token]);

  const handleVote = async () => {
    if (selectedId === null || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submissionApi.submit(taskId, selectedId);
      toast.success("Opinion submitted. You'll earn ETH when this task closes.");
      setHasVoted(true);
      setVotedOptionId(selectedId);

      const statsData = await taskApi.getStats(taskId);
      setStats(statsData);
      if (task?.options) {
        const updatedOptions = task.options.map((opt) => {
          const optStat = statsData.options.find(
            (s) => s.optionId === opt.id,
          );
          return { ...opt, votes: optStat ? optStat.votes : 0 };
        });
        setTask({ ...task, options: updatedOptions });
      }
    } catch (err) {
      const apiMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined;
      let errMsg = apiMessage || "Failed to submit opinion";
      if (errMsg === "Task creator cannot vote on their own task.") {
        errMsg = "You posted this task, so you can't answer it.";
      } else if (errMsg === "You've already voted on this task." || errMsg === "Worker has already submitted for this task") {
        errMsg = "You've already answered this task.";
      }
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading ──────────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="font-mono text-[11px] tracking-[0.06em] text-dim">
          Loading...
        </span>
      </div>
    );
  }

  /* ── Not found ────────────────────────────────────────────────────────── */
  if (!task) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="font-mono text-xs text-dim">Task not found.</p>
      </div>
    );
  }

  const isCompleted =
    task.status === "COMPLETED" ||
    task.status === "CLOSED" ||
    task.status === "SETTLED";

  const isCreator = userId !== null && task.user_id === userId;

  const votedOption = task.options?.find((opt) => opt.id === votedOptionId);
  const rewardEth = (task.budget * 0.001).toFixed(3);
  const votes = task.totalSubmissions ?? 0;
  const maxVotes = task.budget ?? 20;
  const progressPct = maxVotes > 0 ? Math.min(100, (votes / maxVotes) * 100) : 0;

  /* ── Closed ───────────────────────────────────────────────────────────── */
  if (isCompleted) {
    return (
      <WalletGuard>
        <div className="flex flex-1 items-center justify-center p-10">
          <div className="max-w-[480px] text-center">
            <div className="eyebrow mb-5">Task #{task.id} · Closed</div>
            <h2 className="mb-3 text-2xl">Voting is Closed</h2>
            <p className="mb-7 text-[13px] leading-relaxed text-lo">
              This task has been completed and consensus has been reached. View
              the final standings below.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push(`/tasks/${taskId}`)}
            >
              View Results →
            </Button>
          </div>
        </div>
      </WalletGuard>
    );
  }

  /* ── Creator blocked ──────────────────────────────────────────────────── */
  if (isCreator) {
    return (
      <WalletGuard>
        <div className="flex flex-1 items-center justify-center p-10">
          <div className="max-w-[480px] text-center">
            <div className="eyebrow mb-5">Task #{task.id} · Creator</div>
            <h2 className="mb-3 text-2xl">You posted this task.</h2>
            <p className="mb-7 text-[13px] leading-relaxed text-lo">
              Task creators can&apos;t answer their own tasks.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push(`/tasks/${taskId}`)}
            >
              View Results →
            </Button>
          </div>
        </div>
      </WalletGuard>
    );
  }

  /* ── Already voted ────────────────────────────────────────────────────── */
  if (hasVoted) {
    return (
      <WalletGuard>
        <AlreadyVoted
          votedOption={votedOption}
          options={task.options || []}
          totalVotes={stats?.totalSubmissions || 0}
        />
      </WalletGuard>
    );
  }

  /* ── Shared sub-elements ──────────────────────────────────────────────── */
  const taskContextBlock = (
    <>
      <div className="eyebrow mb-3">Open for Opinions</div>

      <h1 className="mb-4 text-xl leading-[1.25]">{task.title}</h1>

      {task.description && (
        <p className="mb-4 text-[13px] leading-relaxed text-lo">
          {task.description}
        </p>
      )}

      <div className="mb-5 h-px bg-line" />

      <div className="eyebrow mb-1.5">Reward</div>
      <div className="mb-7 font-mono text-2xl tracking-[-0.01em] text-amber">
        Ξ {rewardEth} ETH
      </div>

      <div className="eyebrow mb-2 flex justify-between">
        <span>Opinions Needed</span>
        <span>
          {votes} / {maxVotes}
        </span>
      </div>
      <div className="h-0.5 overflow-hidden rounded-[1px] bg-line">
        <div
          className="h-full bg-lo transition-[width] duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </>
  );

  const submitBlock = (
    <div className="flex flex-col gap-2.5">
      <Button
        variant="primary"
        size="lg"
        loading={isSubmitting}
        disabled={selectedId === null}
        onClick={handleVote}
        className="w-full"
      >
        {isSubmitting
          ? "..."
          : selectedId === null
            ? "Select an option to continue"
            : "Submit Opinion"}
      </Button>
      <p className="m-0 text-center font-mono text-[10px] leading-normal text-dim">
        Your opinion is recorded on-chain. You&apos;ll earn ETH when this task closes.
      </p>
    </div>
  );

  /* ── Voting UI ────────────────────────────────────────────────────────── */
  return (
    <WalletGuard>
      <PageTransition className="flex-1 flex flex-col">
      {/* Desktop layout (md+) ────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-1">
        {/* Left 60%: thumbnail grid */}
        <div className="flex-[0_0_60%] overflow-y-auto p-10">
          <p className="mb-4 text-[11px] text-dim">
            Select the option you&apos;d choose. Your vote is anonymous and permanent.
          </p>
          <ThumbnailGallery
            options={task.options || []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Right 40%: context + submit */}
        <div className="sticky top-[52px] flex h-[calc(100dvh-52px)] flex-[0_0_40%] flex-col overflow-y-auto border-l border-line bg-surface px-6 py-8">
          <div className="flex-1">{taskContextBlock}</div>
          {submitBlock}
        </div>
      </div>

      {/* Mobile layout ────────────────────────────────────────────────────── */}
      <div className="md:hidden pb-[88px]">
        {/* Accordion: task context */}
        <div className="border-b border-line">
          <button
            type="button"
            aria-expanded={contextOpen}
            onClick={() => setContextOpen((v) => !v)}
            className="flex w-full cursor-pointer items-center justify-between bg-surface px-4 py-3.5 text-left"
          >
            <div>
              <span className="eyebrow mb-0.5 block">
                Task #{task.id} · Ξ {rewardEth} ETH
              </span>
              <span className="font-display text-sm font-medium tracking-[-0.02em] text-hi">
                {task.title}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "ml-3 shrink-0 text-dim transition-transform duration-200",
                contextOpen && "rotate-180"
              )}
            />
          </button>

          {contextOpen && (
            <div className="bg-surface px-4 pb-4">
              {task.description && (
                <p className="mb-3 text-[13px] leading-relaxed text-lo">
                  {task.description}
                </p>
              )}
              <div className="eyebrow mb-2 flex justify-between">
                <span>Opinions Needed</span>
                <span>
                  {votes} / {maxVotes}
                </span>
              </div>
              <div className="h-0.5 overflow-hidden rounded-[1px] bg-line">
                <div
                  className="h-full bg-lo"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <PageWrapper className="pt-4 pb-4">
          <p className="mb-4 text-[11px] text-dim">
            Select the option you&apos;d choose. Your vote is anonymous and permanent.
          </p>
          <ThumbnailGallery
            options={task.options || []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </PageWrapper>

      </div>
      </PageTransition>

      {/* Fixed bottom submit — outside PageTransition (position:fixed, not part of stagger) */}
      <div className="md:hidden fixed inset-x-0 bottom-0 border-t border-line bg-ink/95 px-4 py-3 backdrop-blur">
        {submitBlock}
      </div>
    </WalletGuard>
  );
}
