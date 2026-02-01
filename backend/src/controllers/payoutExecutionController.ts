import type { Response } from "express";
import prisma from "../prisma.ts";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.ts";

export const executePayout = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { workerId } = req.auth!;
  
  let payoutAmount = 0;

  try {
    // Fetch worker
    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
    });

    if (!worker || !worker.wallet_address) {
      return res.status(400).json({
        message: "Wallet not linked",
      });
    }

    if (worker.pending_amount <= 0) {
      return res.status(400).json({
        message: "No funds available for withdrawal",
      });
    }

    if (worker.locked_amount > 0) {
      return res.status(400).json({
        message: "Existing payout in progress",
      });
    }

    payoutAmount = worker.pending_amount;

    // LOCK FUNDS
    await prisma.$transaction(async (tx) => {
      await tx.worker.update({
        where: { id: workerId },
        data: {
          pending_amount: 0,
          locked_amount: payoutAmount,
        },
      });
    });

    // Trigger blockchain transfer (placeholder)
    // const txHash = await sendOnChain(worker.wallet_address, payoutAmount);

    // Finalize payout (mock for now)
    await prisma.worker.update({
      where: { id: workerId },
      data: {
        locked_amount: 0,
      },
    });

    return res.json({
      status: "SUCCESS",
      amount: payoutAmount,
      walletAddress: worker.wallet_address,
      message: "Payout completed successfully",
    });
  } catch (error) {
    console.error("Payout execution error:", error);

    // 🔴 IMPORTANT: rollback locked funds on failure
    await prisma.worker.update({
      where: { id: workerId },
      data: {
        pending_amount: payoutAmount,
        locked_amount: 0,
      },
    });

    return res.status(500).json({
      message: "Payout failed. Funds restored.",
    });
  }
}