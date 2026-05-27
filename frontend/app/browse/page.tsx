"use client";

import React, { useEffect, useState } from "react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { taskApi, meApi } from "@/lib/api";
import { Task } from "@/types";
import { Compass, Search, Filter } from "lucide-react";
import { useWalletUser } from "@/hooks/useWalletUser";

export default function BrowsePage() {
  const { isConnected, token } = useWalletUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [votedTaskIds, setVotedTaskIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "highest" | "needed" | "newest">("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await taskApi.getAll();
      setTasks(data.tasks);

      // If connected, fetch their worker submissions to see what they already voted on
      if (isConnected && token) {
        const subData = await meApi.getSubmissions();
        const votedIds = new Set(subData.submissions.map((sub) => sub.taskId));
        setVotedTaskIds(votedIds);
      }
    } catch (err) {
      console.error("Browse fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isConnected, token]);

  // Filters and Sorting
  const filteredTasks = tasks
    .filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch;
    })
    .sort((a, b) => {
      if (activeFilter === "highest") {
        return (b.budget || 0) - (a.budget || 0);
      }
      if (activeFilter === "needed") {
        const aNeeded = (a.budget || 10) - (a.totalSubmissions || 0);
        const bNeeded = (b.budget || 10) - (b.totalSubmissions || 0);
        return bNeeded - aNeeded; // sort descending by needed votes
      }
      if (activeFilter === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0; // Default ordering (from backend, usually desc)
    });

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#0a0a0f] text-zinc-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 select-none">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-8 h-8 text-purple-500" />
              <span>Browse Open Campaigns</span>
            </h1>
            <p className="text-zinc-500 text-xs mt-1">
              Select open thumbnail tasks, cast your votes, and secure ETH shares.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111118]/80 border border-zinc-800 focus:border-purple-500/50 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-white focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-8 select-none">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === "all"
                  ? "bg-purple-700 text-white shadow-lg shadow-purple-900/30"
                  : "text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 border border-zinc-800"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setActiveFilter("highest")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === "highest"
                  ? "bg-purple-700 text-white shadow-lg shadow-purple-900/30"
                  : "text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 border border-zinc-800"
              }`}
            >
              Highest Reward
            </button>
            <button
              onClick={() => setActiveFilter("needed")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === "needed"
                  ? "bg-purple-700 text-white shadow-lg shadow-purple-900/30"
                  : "text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 border border-zinc-800"
              }`}
            >
              Most Votes Needed
            </button>
            <button
              onClick={() => setActiveFilter("newest")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === "newest"
                  ? "bg-purple-700 text-white shadow-lg shadow-purple-900/30"
                  : "text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 border border-zinc-800"
              }`}
            >
              Newest Campaigns
            </button>
          </div>
        </div>

        {/* Task Grid / Skeletons / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={Compass}
              title="No campaigns found"
              description="There are no active thumbnail testing campaigns matching your search or filters at the moment."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
}
