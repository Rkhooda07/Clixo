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
    const { txHash } = req.body;

    if (!taskId || !txHash) {
      return res.status(400).json({
        message: "taskId and txHash are required",
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

    // Reject if already fully funded
    if (task.fundedAmount >= task.budget) {
      return res.status(400).json({
        message: "Task is already fully funded",
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

    const remainingBudget = task.budget - task.fundedAmount;

    if (credits <= 0) {
      return res.status(400).json({
        message: "Invalid deposit amount",
      });
    }

    const usableCredits = Math.min(credits, remainingBudget);
    const excessCredits = credits - usableCredits;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        fundedAmount: {
          increment: usableCredits,
        },
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