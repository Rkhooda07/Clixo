"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { taskApi, submissionApi, meApi } from "@/lib/api";
import { Task, Thumbnail } from "@/types";
import { ThumbnailGallery } from "@/components/vote/ThumbnailGallery";
import { AlreadyVoted } from "@/components/vote/AlreadyVoted";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";
import { PageWrapper } from "@/components/layout/PageWrapper";

const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const taskId = Number(params.id);
  const { address } = useAccount();

  const [task, setTask] = useState<Task | null>(null);
  const [stats, setStats] = useState<any>(null);
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
        const [taskData, statsData, mySubs] = await Promise.all([
          taskApi.getById(taskId),
          taskApi.getStats(taskId),
          meApi.getSubmissions(),
        ]);

        const previousVote = mySubs.submissions.find(
          (s: any) => s.taskId === taskId,
        );
        if (previousVote) {
          setHasVoted(true);
          setVotedOptionId(previousVote.optionId);
        }

        const updatedOptions = taskData.options?.map((opt: Thumbnail) => {
          const optStat = statsData.options.find(
            (s: any) => s.optionId === opt.id,
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
  }, [taskId, address]);

  const handleVote = async () => {
    if (selectedId === null || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submissionApi.submit(taskId, selectedId);
      toast.success("Vote recorded.");
      setHasVoted(true);
      setVotedOptionId(selectedId);

      const statsData = await taskApi.getStats(taskId);
      setStats(statsData);
      if (task?.options) {
        const updatedOptions = task.options.map((opt) => {
          const optStat = statsData.options.find(
            (s: any) => s.optionId === opt.id,
          );
          return { ...opt, votes: optStat ? optStat.votes : 0 };
        });
        setTask({ ...task, options: updatedOptions });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading ──────────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100dvh - 52px)",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--text-3)",
            letterSpacing: "0.06em",
          }}
        >
          Loading...
        </span>
      </div>
    );
  }

  /* ── Not found ────────────────────────────────────────────────────────── */
  if (!task) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100dvh - 52px)",
        }}
      >
        <p style={{ fontFamily: mono, fontSize: "12px", color: "var(--text-3)" }}>
          Task not found.
        </p>
      </div>
    );
  }

  const isCompleted =
    task.status === "COMPLETED" ||
    task.status === "CLOSED" ||
    task.status === "SETTLED";

  const votedOption = task.options?.find((opt) => opt.id === votedOptionId);
  const rewardEth = (task.budget * 0.001).toFixed(3);
  const votes = task.totalSubmissions ?? 0;
  const maxVotes = task.budget ?? 20;
  const progressPct = maxVotes > 0 ? Math.min(100, (votes / maxVotes) * 100) : 0;

  /* ── Closed ───────────────────────────────────────────────────────────── */
  if (isCompleted) {
    return (
      <WalletGuard>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100dvh - 52px)",
            padding: "40px",
          }}
        >
          <div style={{ maxWidth: "480px", textAlign: "center" }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: "var(--text-3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Task #{task.id} · Closed
            </div>
            <h2
              style={{
                fontFamily: geist,
                fontSize: "24px",
                fontWeight: 500,
                color: "var(--text-1)",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              Voting is Closed
            </h2>
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "13px",
                color: "var(--text-2)",
                lineHeight: 1.6,
                marginBottom: "28px",
              }}
            >
              This task has been completed and consensus has been reached. View
              the final standings below.
            </p>
            <button
              onClick={() => router.push(`/tasks/${taskId}`)}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                borderRadius: "5px",
                color: "var(--text-1)",
                fontFamily: geist,
                fontSize: "13px",
                fontWeight: 500,
                padding: "10px 24px",
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              View Results →
            </button>
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
      <div
        style={{
          fontFamily: mono,
          fontSize: "10px",
          color: "var(--text-3)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        Task #{task.id}
      </div>

      <h1
        style={{
          fontFamily: geist,
          fontSize: "20px",
          fontWeight: 500,
          color: "var(--text-1)",
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          marginBottom: "16px",
        }}
      >
        {task.title}
      </h1>

      <div
        style={{
          height: "1px",
          background: "var(--line)",
          marginBottom: "20px",
        }}
      />

      <div
        style={{
          fontFamily: mono,
          fontSize: "10px",
          color: "var(--text-3)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "6px",
        }}
      >
        Reward
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: "24px",
          color: "var(--amber)",
          letterSpacing: "-0.01em",
          marginBottom: "28px",
        }}
      >
        Ξ {rewardEth} ETH
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: mono,
          fontSize: "10px",
          color: "var(--text-3)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        <span>Votes Needed</span>
        <span>
          {votes} / {maxVotes}
        </span>
      </div>
      <div
        style={{
          height: "2px",
          background: "var(--line)",
          borderRadius: "1px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPct}%`,
            background: "var(--text-2)",
            transition: "width 0.4s ease-out",
          }}
        />
      </div>
    </>
  );

  const submitBlock = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button
        onClick={handleVote}
        disabled={selectedId === null || isSubmitting}
        style={{
          width: "100%",
          height: "44px",
          borderRadius: "5px",
          fontFamily: geist,
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          cursor: selectedId === null || isSubmitting ? "not-allowed" : "pointer",
          transition: "background 150ms, color 150ms, border-color 150ms",
          border: `1px solid ${selectedId !== null && !isSubmitting ? "var(--text-1)" : "var(--line)"}`,
          background: selectedId !== null && !isSubmitting ? "var(--text-1)" : "var(--surface-2)",
          color: selectedId !== null && !isSubmitting ? "var(--ink)" : "var(--text-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          pointerEvents: isSubmitting ? "none" : "auto",
          opacity: isSubmitting ? 0.6 : 1,
        }}
      >
        {isSubmitting ? (
          <>
            <span className="btn-spinner" />
            <span>...</span>
          </>
        ) : selectedId === null ? (
          "Select a thumbnail to vote"
        ) : (
          "Submit Vote"
        )}
      </button>
      <p
        style={{
          fontFamily: mono,
          fontSize: "10px",
          color: "var(--text-3)",
          lineHeight: 1.5,
          textAlign: "center",
          margin: 0,
        }}
      >
        Your vote is recorded on-chain. You'll earn ETH when this task closes.
      </p>
    </div>
  );

  /* ── Voting UI ────────────────────────────────────────────────────────── */
  return (
    <WalletGuard>
      <PageTransition>
      {/* Desktop layout (md+) ────────────────────────────────────────────── */}
      <div className="hidden md:flex" style={{ minHeight: "calc(100dvh - 52px)" }}>
        {/* Left 60%: thumbnail grid */}
        <div
          style={{
            flex: "0 0 60%",
            padding: "40px",
            overflowY: "auto",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <div style={{ width: "100%" }}>
            <ThumbnailGallery
              options={task.options || []}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>

        {/* Right 40%: context + submit */}
        <div
          style={{
            flex: "0 0 40%",
            position: "sticky",
            top: "52px",
            height: "calc(100dvh - 52px)",
            background: "var(--surface-1)",
            borderLeft: "1px solid var(--line)",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div style={{ flex: 1 }}>{taskContextBlock}</div>
          <div>{submitBlock}</div>
        </div>
      </div>

      {/* Mobile layout ────────────────────────────────────────────────────── */}
      <div className="md:hidden" style={{ paddingBottom: "88px" }}>
        {/* Accordion: task context */}
        <div style={{ borderBottom: "1px solid var(--line)" }}>
          <button
            onClick={() => setContextOpen((v) => !v)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              background: "var(--surface-1)",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "var(--text-3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "2px",
                }}
              >
                Task #{task.id} · Ξ {rewardEth} ETH
              </span>
              <span
                style={{
                  fontFamily: geist,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-1)",
                  letterSpacing: "-0.02em",
                }}
              >
                {task.title}
              </span>
            </div>
            <ChevronDown
              size={16}
              color="var(--text-3)"
              style={{
                flexShrink: 0,
                marginLeft: "12px",
                transform: contextOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {contextOpen && (
            <div
              style={{
                padding: "0 16px 16px",
                background: "var(--surface-1)",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "var(--text-3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Votes</span>
                <span>
                  {votes} / {maxVotes}
                </span>
              </div>
              <div
                style={{
                  height: "2px",
                  background: "var(--line)",
                  borderRadius: "1px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "var(--text-2)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <PageWrapper style={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <ThumbnailGallery
            options={task.options || []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </PageWrapper>

      </div>
      </PageTransition>

      {/* Fixed bottom submit — outside PageTransition (position:fixed, not part of stagger) */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px",
          background: "var(--ink)",
          borderTop: "1px solid var(--line)",
        }}
      >
        {submitBlock}
      </div>
    </WalletGuard>
  );
}
