import type { Request, Response } from "express";
import prisma from "../prisma.ts";

/*
  Apply rewards to worker balances
  (Can be done only once)
*/
export const settleTaskRewards = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);

    if (!taskId) {
      return res.status(400).json({
        message: "Invalid task"
      });
    }

    // Getting task with submissions
    const task = await prisma.task.findUnique({
      where: {id: taskId},
      include: {
        submissions: true
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // Task must be ACTIVE to settle
    if (task.status !== "ACTIVE") {
      return res.status(400).json({
        message: "Task must be ACTIVE before settlement",
      });
    }

    // Count votes to find winning option
    const counts: Record<number, number> = {};

    for (const submission of task.submissions) {
      counts[submission.option_id] = 
        (counts[submission.option_id] || 0) + 1;
    }

    let winningOptionId: number | null = null;
    let maxVotes = 0;

    for (const [optionId, count] of Object.entries(counts)) {
      if (count > maxVotes) {
        maxVotes = count;
        winningOptionId = Number(optionId);
      }
    }

    if (!winningOptionId) {
      return res.status(400).json({
        message: "No winning option found",
      });
    }

    // Eligible submissions
    const winners = task.submissions.filter(
      (s) => s.option_id === winningOptionId
    );

    if (winners.length === 0) {
      return res.status(400).json({
        message: "No eligible workers"
      });
    }

    // Calculate reward from task budget
    const totalReward = task.budget;

    if (task.fundedAmount < totalReward) {
      return res.status(400).json({
        message: "Insufficient funded amount for settlement",
      });
    }

    const rewardPerWorker = Math.floor(totalReward / winners.length);

    // Apply rewards and deduct budget
    await prisma.$transaction(async (tx) => {
      for (const submission of winners) {
        await tx.worker.update({
          where: { id: submission.worker_id },
          data: {
            pending_amount: {
              increment: rewardPerWorker,
            },
          },
        });
      }

      // Deduct full budget from fundedAmount
      await tx.task.update({
        where: { id: taskId },
        data: {
          fundedAmount: {
            decrement: totalReward,
          },
          status: "SETTLED",
        },
      });
    });

    res.json({
      taskId,
      winners: winners.length,
      rewardPerWorker,
      totalReward,
      status: "SETTLED",
    });
  } catch (error) {
    console.error("Reward settlement error: ", error);
    res.status(500).json({ message: "Internal server error"});
  }
};