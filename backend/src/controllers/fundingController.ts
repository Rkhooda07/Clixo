import type { Request, Response } from "express";
import prisma from "../prisma.ts";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const SERVER_WALLET = new ethers.Wallet(
  process.env.SERVER_PRIVATE_KEY!,
  provider
);

const ETH_PER_CREDIT = 0.001;

export async function fundTask (req: Request, res: Response) {
  try {
    const taskId = Number(req.params.id);
    const { txHash } = req.body || {};

    if (!taskId) {
      return res.status(400).json({
        message: "taskId is required",
      });
    }

    // Fetch task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Fetch task owner (user)
    const user = await prisma.user.findUnique({
      where: { id: task.user_id },
    });

    if (!user) {
      return res.status(404).json({
        message: "Task owner not found",
      });
    }

    const remainingBudget = task.budget - task.fundedAmount;

    if (remainingBudget <= 0) {
      return res.status(400).json({
        message: "Task is already fully funded",
      });
    }

    // -> Try to use internal balance first
    if (user.balance > 0) {
      const usableFromBalance = Math.min(user.balance, remainingBudget);

      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: {
            balance: {
              decrement: usableFromBalance,
            },
          },
        }),
        prisma.task.update({
          where: { id: taskId },
          data: {
            fundedAmount: {
              increment: usableFromBalance,
            },
          },
        }),
        prisma.funding.create({
          data: {
            user_id: user.id,
            task_id: taskId,
            credits: usableFromBalance,
            source: "INTERNAL_BALANCE",
          },
        }),
      ]);

      const updatedTaskAfterBalance = await prisma.task.findUnique({
        where: { id: taskId },
      });

      // If fully funded after balance usage → activate
      if (
        updatedTaskAfterBalance &&
        updatedTaskAfterBalance.fundedAmount >= updatedTaskAfterBalance.budget &&
        updatedTaskAfterBalance.status !== "ACTIVE"
      ) {
        await prisma.task.update({
          where: { id: taskId },
          data: { status: "ACTIVE" },
        });
      }

      // If fully funded using balance only → return early
      if (
        updatedTaskAfterBalance &&
        updatedTaskAfterBalance.fundedAmount >= updatedTaskAfterBalance.budget
      ) {
        return res.json({
          success: true,
          source: "INTERNAL_BALANCE",
          newFundedAmount: updatedTaskAfterBalance.fundedAmount,
        });
      }
    }

    // -> If still not fully funded, require blockchain tx
    const latestTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    const updatedRemaining =
      latestTask!.budget - latestTask!.fundedAmount;

    if (updatedRemaining <= 0) {
      return res.status(400).json({
        message: "Task is already fully funded",
      });
    }

    if (!txHash) {
      return res.status(400).json({
        message: "txHash required for remaining funding",
      });
    }

    // Prevent tx replay
    const existingFunding = await prisma.funding.findUnique({
      where: { txHash },
    });

    if (existingFunding) {
      return res.status(400).json({
        message: "This transaction has already been processed",
      });
    }

    // Fetch tx from blockchain
    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      return res.status(400).json({
        message: "Transaction not found on chain",
      });
    }

    // Verify tx was sent to server wallet
    if (tx.to?.toLowerCase() !== SERVER_WALLET.address.toLowerCase()) {
      return res.status(400).json({
        message: "Transaction not sent to server wallet",
      });
    }

    // Wait for confirmation
    const receipt = await provider.waitForTransaction(txHash);

    if (!receipt || receipt.status !== 1) {
      return res.status(400).json({
        message: "Transaction failed or not confirmed",
      });
    }

    // Convert eth to credits
    const ethAmount = Number(ethers.formatEther(tx.value));
    const credits = ethAmount / ETH_PER_CREDIT;

    if (credits <= 0) {
      return res.status(400).json({
        message: "Invalid deposit amount",
      });
    }

    const usableCredits = Math.min(credits, updatedRemaining);
    const excessCredits = credits - usableCredits;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        fundedAmount: {
          increment: usableCredits,
        },
      },
    });

    await prisma.funding.create({
      data: {
        user_id: user.id,
        task_id: taskId,
        txHash,
        credits: credits,
        source: "BLOCKCHAIN",
      },
    });

    // Store excess credits in user's balance
    if (excessCredits > 0) {
      await prisma.user.update({
        where: { id: task.user_id },
        data: {
          balance: {
            increment: excessCredits,
          },
        },
      });
    }

    // Activate if fully funded
    if (updatedTask.fundedAmount >= updatedTask.budget &&
        updatedTask.status !== "ACTIVE"
    ) {
      await prisma.task.update({
        where: { id: taskId },
        data: {
          status: "ACTIVE",
        },
      });
    }

    return res.json({
      success: true,
      depositedEth: ethAmount,
      usableCredits,
      excessCredits,
      newFundedAmount: updatedTask.fundedAmount,
    });
  } catch (error: any) {
    console.error("Funding error: ", error);
    return res.status(500).json({
      message: "Funding failed",
      error: error.message,
    });
  }
}