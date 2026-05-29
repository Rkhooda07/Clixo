"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { taskApi, submissionApi, meApi } from "@/lib/api";
import { Task, Thumbnail } from "@/types";
import { ThumbnailGallery } from "@/components/vote/ThumbnailGallery";
import { AlreadyVoted } from "@/components/vote/AlreadyVoted";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { ShieldAlert, Info } from "lucide-react";

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const taskId = Number(params.id);
  const { address } = useAccount();

  const [task, setTask] = useState<Task | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOptionId, setVotedOptionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [taskData, statsData, mySubs] = await Promise.all([
          taskApi.getById(taskId),
          taskApi.getStats(taskId),
          meApi.getSubmissions(),
        ]);

        // Check if already voted
        const previousVote = mySubs.submissions.find((s: any) => s.taskId === taskId);
        if (previousVote) {
          setHasVoted(true);
          setVotedOptionId(previousVote.optionId);
        }

        // Check if creator (In Clixo, address sync is handled by backend, but we can do a simple check)
        // Ideally the taskData should return creator address or we check user_id
        // For now, let's assume we can't fully check without more backend info, or we just rely on backend error if they try to vote.

        // Merge stats
        const updatedOptions = taskData.options?.map(opt => {
          const optStat = statsData.options.find((s: any) => s.optionId === opt.id);
          return {
            ...opt,
            votes: optStat ? optStat.votes : 0
          };
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

  const handleVote = async (optionId: number) => {
    try {
      await submissionApi.submit(taskId, optionId);
      toast.success("Vote recorded successfully!");
      setHasVoted(true);
      setVotedOptionId(optionId);
      
      // Refresh stats
      const statsData = await taskApi.getStats(taskId);
      setStats(statsData);
      
      // Update task options with new votes
      if (task?.options) {
        const updatedOptions = task.options.map(opt => {
          const optStat = statsData.options.find((s: any) => s.optionId === opt.id);
          return { ...opt, votes: optStat ? optStat.votes : 0 };
        });
        setTask({ ...task, options: updatedOptions });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to submit vote";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
        <Skeleton className="h-12 w-3/4 rounded-xl" />
        <Skeleton className="h-6 w-1/2 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <Skeleton className="aspect-video rounded-3xl" />
          <Skeleton className="aspect-video rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500">Task not found.</p>
      </div>
    );
  }

  const isCompleted = task.status === "COMPLETED" || task.status === "CLOSED" || task.status === "SETTLED";
  const votedOption = task.options?.find(opt => opt.id === votedOptionId);

  return (
    <WalletGuard>
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/30 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest">
            <Info className="w-3.5 h-3.5" />
            Consensus Mission #{task.id}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight max-w-3xl">
            {task.title}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Review the instructions and choose the option that best matches the task. Your signal helps the requester reach consensus.
          </p>
        </div>

        {isCompleted ? (
          <div className="bg-amber-950/10 border border-amber-500/20 rounded-3xl p-8 flex flex-col items-center text-center gap-4">
            <ShieldAlert className="w-12 h-12 text-amber-500" />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-white">Voting is Closed</h2>
              <p className="text-zinc-400 max-w-md">
                This mission has been completed and consensus has been reached. You can view the final results on the dashboard.
              </p>
            </div>
            <button 
              onClick={() => router.push(`/tasks/${taskId}`)}
              className="mt-4 px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all border border-zinc-800"
            >
              View Final Standings
            </button>
          </div>
        ) : hasVoted ? (
          <AlreadyVoted 
            votedOption={votedOption} 
            options={task.options || []} 
            totalVotes={stats?.totalSubmissions || 0} 
          />
        ) : (
          <ThumbnailGallery options={task.options || []} onVote={handleVote} />
        )}
      </div>
    </WalletGuard>
  );
}
