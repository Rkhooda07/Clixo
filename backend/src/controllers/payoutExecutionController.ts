import type { Response } from "express";
import prisma from "../prisma.ts";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.ts";
import { sendEth } from "../blockchain/ethClient.ts";

export const executePayout = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { workerId } = req.auth!;
  
  let payoutAmount = 0;
  const GAS_FEE = 2;
  const ETH_PER_CREDIT = 0.001;

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

    const payout = await prisma.payout.create({
      data: {
        workerId,
        amount: payoutAmount,
        gasFee: GAS_FEE,
        netAmount: payoutAmount - GAS_FEE,
        status: "PENDING",
      },
    });

    // Execute on-chain transfer
    const ethToSend = (payoutAmount - GAS_FEE) * ETH_PER_CREDIT;

    const tx = await sendEth(
      worker.wallet_address,
      ethToSend
    );

    // Finalise payout
    await prisma.$transaction([
      prisma.worker.update({
        where: { id: workerId },
        data: {
          locked_amount: 0,
        },
      }),
      prisma.payout.update({
        where: { id: payout.id },
        data: {
          status: "SUCCESS",
          txRef: tx.hash,
        },
      }),
    ]);

    return res.json({
      status: "SUCCESS",
      payoutId: payout.id,
      grossAmount: payoutAmount,
      gasFee: GAS_FEE,
      netAmount: payoutAmount - GAS_FEE,
      walletAddress: worker.wallet_address,
      message: "Payout completed successfully",
    });
  } catch (error) {
    console.error("Payout execution error:", error);

    // 🔴 IMPORTANT: rollback locked funds on failure
    await prisma.$transaction([
      prisma.worker.update({
        where: { id: workerId },
        data: {
          pending_amount: payoutAmount,
          locked_amount: 0,
        },
      }),
    ]);

    return res.status(500).json({
      message: "Payout failed. Funds restored.",
    });
  }
}