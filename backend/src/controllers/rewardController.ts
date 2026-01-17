import type { Request, Response } from "express";
import prisma from "../prisma.ts";

/*
  It's a read-only reward calculation
  No DB updates are performed here
*/

export const previewTaskRewards = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);

    if (!taskId) {
      return res.status(400).json({
        message: "Invalid taskID" 
      });
    }

    // Getting task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        submissions: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // Checking the completion of task
    if (task.status !== "COMPLETED") {
      return res.status(400).json({
        message: "Task is not completed yet",
      });
    }

    // Determine winning option
    const voteCount: Record<number, number> = {};

    for (const submission of task.submissions) {
      voteCount[submission.option_id] = 
        (voteCount[submission.option_id] || 0) + 1;
    }

    let winningOptionId: number | null = null;
    let maxVotes = 0;

    for (const [optionId, count] of Object.entries(voteCount)) {
      if (count > maxVotes) {
        maxVotes = count;
        winningOptionId = Number(optionId);
      }
    }

    if (!winningOptionId) {
      return res.status(400).json({
        message: "No valid winning option found",
      });
    }

    // Filter eligible submissions
    const winningSubmissions = task.submissions.filter(
      (s) => s.option_id === winningOptionId
    );

    const eligibleWorkers = winningSubmissions.length;

    if (eligibleWorkers === 0) {
      return res.status(400).json({
        message: "No eligible workers for reward",
      });
    }

    // Calculate reward
    const totalReward = Number(task.amount) || 0;
    const rewardPerWorker = totalReward / eligibleWorkers;

    // read-only response
    const rewards = winningSubmissions.map((s) => ({
      workerId: s.worker_id,
      reward: rewardPerWorker.toString(),
    }));

    res.json({
      taskId,
      totalReward: task.amount,
      winningOptionId,
      eligibleWorkers,
      rewardPerWorker: rewardPerWorker.toString(),
      rewards,
    });
  } catch (error) {
    console.error("Reward preview error: ", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};