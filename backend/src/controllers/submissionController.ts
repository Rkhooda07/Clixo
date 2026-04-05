import type { Request, Response } from "express";
import prisma from "../prisma.ts";

/*
  Create a new submission
  Worrked selects option for a task
*/
export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { taskId, optionId } = req.body;
    const workerId = (req as any).auth?.workerId;

    const parsedTaskId = Number(taskId);
    const parsedOptionId = Number(optionId);

    // Basic sanity check
    if (!workerId || !parsedTaskId || !parsedOptionId) {
      return res.status(400).json ({
        message: "Missing required fields",
      });
    }

    // Check existence of task
    const task = await prisma.task.findUnique({
      where: {id: parsedTaskId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Prevent submission to a completed task
    if (task.status !== "ACTIVE") {
      return res.status(400).json({
        message: "Task is not active yet",
      });
    }

    // If deadline is set, prevent submission after deadline
    if (task.deadline) {
      const now = new Date();
      const deadline = new Date(task.deadline);

      if (now > deadline) {
        return res.status(400).json({
          message: "Task deadline has passed",
        });
      }
    }

    // Check option belong to task
    const option = await prisma.option.findFirst({
      where: {
        id: parsedOptionId,
        task_id: parsedTaskId,
      },
    });

    if (!option) {
      return res.status(400).json({
        message: "Invalid option for this task",
      });
    }

    // Prevent duplicate submission
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        worker_id: workerId,
        task_id: parsedTaskId,
      },
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: "Worker has already submitted for this task",
      });
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        worker_id: workerId,
        task_id: parsedTaskId,
        option_id: parsedOptionId
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("Error creating submission: ", error);
    res.status(500).json({ message: "Internal server error "});
  }
};

/*
  Get all submissions for a specific task
*/
export const getSubmissionsByTask = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);

    const submissions = await prisma.submission.findMany({
      where: { task_id: taskId },
      include: {
        option: true,
        worker: true,
      },
    });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching task submissions: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/*
  Get all submissions made by a worker
*/
export const getSubmissionsByWorker = async (req: Request, res: Response) => {
  try {
    const workerId = Number(req.params.workerId);

    const submissions = await prisma.submission.findMany({
      where: { worker_id: workerId },
      include: {
        task: true,
        option: true,
      },
    });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching worker submissions: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};