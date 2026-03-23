import type { Request, Response } from "express";
import prisma from "../prisma.ts";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const tasks = await prisma.task.findMany({
      where: status ? { status: String(status) }: {},
      include: {
        options: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      budget: task.budget,
      fundedAmount: task.fundedAmount,
      deadline: task.deadline,
      optionsCount: task.options.length,
    }));

    return res.json({ tasks: formatted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
};

export const getTasksById = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId},
      include: {
        options: true,
        submissions: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found :("
      });
    }

    return res.json({
      id: task.id,
      title: task.title,
      status: task.status,
      budget: task.budget,
      fundedAmount: task.fundedAmount,
      deadline: task.deadline,
      options: task.options.map((opt) => ({
        id: opt.id,
        image_url: opt.image_url,
        gateway_url: opt.gateway_url,
      })),
      totalSubmissions: task.submissions.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch task"
    });
  }
};