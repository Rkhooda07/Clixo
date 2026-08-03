import type { Request, Response } from "express";
import prisma from "../prisma.ts";

export const getTaskStats = async(req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId},
      include: { options: true }
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const submissions = await prisma.submission.findMany({
      where: { task_id: taskId},
    });

    const voteMap: Record<number, number> = {};

    for (const sub of submissions) {
      voteMap[sub.option_id] = (voteMap[sub.option_id] || 0) + 1;
    }

    const optionStats = task.options.map((opt) => ({
      optionId: opt.id,
      votes: voteMap[opt.id] || 0,
    }));

    // Time-series data: group submissions by date
    const timeSeriesMap: Record<string, number> = {};
    submissions.forEach(sub => {
      const date = sub.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
      timeSeriesMap[date] = (timeSeriesMap[date] || 0) + 1;
    });

    const timeSeries = Object.entries(timeSeriesMap).map(([date, count]) => ({
      date,
      votes: count
    })).sort((a, b) => a.date.localeCompare(b.date));

    let winningOption: number | null = null;
    let maxVotes = 0;

    for (const opt of optionStats) {
      if (opt.votes > maxVotes) {
        maxVotes = opt.votes;
        winningOption = opt.optionId;
      }
    }

    let rewardPerWorker = 0;

    if (maxVotes > 0) {
      rewardPerWorker = Math.floor(task.budget / maxVotes);
    }

    return res.json({
      taskId: task.id,
      status: task.status,
      totalSubmissions: submissions.length,
      options: optionStats,
      timeSeries,
      winningOption,
      rewardPerWorker,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to fetch stats"
    });
  }
};