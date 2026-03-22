import type { Request, Response } from "express";
import prisma from "../prisma.ts";


// Shows all tasks created by a user and sub count
export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth?.workerId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const tasks = await prisma.task.findMany({
      where: { user_id: userId },
      include: {
        submissions: true
      },
      orderBy: {
        createdAt: "desc"
      },
    });

    const formatted = tasks.map(task => ({
      id: task.id,
      status: task.status,
      budget: task.budget,
      fundedAmount: task.fundedAmount,
      deadline: task.deadline,
      totalSubmissions: task.submissions.length
    }));

    res.json({ tasks: formatted });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
};

// Shows all submissions by worker
export const getMySubmissions = async (req: Request, res: Response) => {
  try {
    const workerId = (req as any).auth?.workerId;
    if (!workerId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }
  
    const submissions = await prisma.submission.findMany({
      where: { worker_id: workerId },
      include: {
        task: true,
      },
      orderBy: { createdAt: "desc" },
    });
  
    const formatted = submissions.map(sub => ({
      taskId: sub.task_id,
      optionId: sub.option_id,
      taskStatus: sub.task.status,
      submittedAt: sub.createdAt,
    }));
  
    res.json({ submissions: formatted });

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch submissions"
    });
  }
};

// Shows worker earnings
export const getMyEarnings = async (req: Request, res: Response) => {
  try {
    const workerId = (req as any).auth?.workerId;
    if (!workerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
    });
    if (!worker) {
      return res.status(404).json({
        message: "Worker not found"
      });
    }

    const totalEarned = worker.pending_amount + worker.locked_amount;

    res.json({
      pending: worker.pending_amount,
      locked: worker.locked_amount,
      totalEarned,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch earnings"
    });
  }
};

// Show funding history of user (funding ledger)
export const getMyFundingHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth?.workerId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const fundings = await prisma.funding.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      fundings: fundings.map(f => ({
        credits: f.credits,
        source: f.source,
        txHash: f.txHash,
        createdAt: f.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch funding history"
    });
  }
};