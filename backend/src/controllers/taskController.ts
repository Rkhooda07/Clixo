import type { Request, Response } from "express";
import prisma from "../prisma.ts";
import { validateCreateTaskBody } from "../validators/taskValidators.ts";

/**
 * Controller: createTask
 * Handles POST /tasks — creates a new task draft with options.
 */

export async function createTask(req: Request, res: Response) {
  try {
    // Validate the incoming request body
    const { valid, errors } = validateCreateTaskBody(req.body);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid task data",
        errors,
      });
    }

    const walletAddress = (req as any).auth?.walletAddress;
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing authenticated wallet address.",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        address: {
          equals: walletAddress,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Authenticated wallet does not have a user record.",
      });
    }

    // Destructure data
    const { title, description, signature, amount, budget, deadline, options } = req.body;

    // Create task and related options in a single txn
    const task = await prisma.task.create({
      data: {
        title,
        description:
          typeof description === "string" && description.trim().length > 0
            ? description.trim()
            : null,
        signature: signature || null,
        amount: amount || null,
        budget,
        deadline: new Date(deadline),
        fundedAmount: 0,
        status: "CREATED",
        user_id: user.id,
        options: {
          create: options.map((opt: any) => ({
            ipfs_cid: opt.ipfs_cid,
            ipfs_uri: opt.ipfs_uri || null,
            gateway_url: opt.gateway_url,
            image_url: opt.image_url || null,
            option_id: opt.optionId || null,
          })),
        },
      },
      include: { options: true },
    });

    return res.status(201).json({
      success: true,
      message: "Task draft created successfully.",
      task,
    });
  } catch (error: any) {
    console.error("❌ Prisma error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while creating task.",
      error: error.message,
    });
  }
}
