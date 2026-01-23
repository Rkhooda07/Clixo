import type { Response } from "express";
import prisma from "../prisma.ts";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.ts";

/*
  Read-only payout preview
  No balance change
*/

export const getPayoutPreview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { workerId, walletAddress } = req.auth!;

    // Fetch worker's balances
    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      select: {
        pending_amount: true,
        locked_amount: true,
        wallet_address: true,
      },
    });

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    // Valid checks
    const warnings: string[] = [];

    if (!worker.wallet_address) {
      warnings.push("Wallet not linked");
    }

    if (worker.pending_amount <= 0) {
      warnings.push("No funds available");
    }

    // Payyout calculation 
    const eligibleAmount = worker.pending_amount;

    const estimatedGasFee = 2;

    const netReceivable = eligibleAmount > estimatedGasFee ? eligibleAmount - estimatedGasFee: 0;

    if (eligibleAmount <= estimatedGasFee) {
      warnings.push("Balance too low to cover gas fees");
    }

    // Final decision
    const canWithdraw = warnings.length === 0 && netReceivable > 0;

    // read-only response
    return res.json({
      workerId,
      walletAddress,

      balances: {
        pending: worker.pending_amount,
        locked: worker.locked_amount,
      },

      payout: {
        eligibleAmount,
        estimatedGasFee,
        netReceivable,
      },

      canWithdraw,
      warnings,
    });
  } catch (error) {
    console.error("Payout preview error: ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};