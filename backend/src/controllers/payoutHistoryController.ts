import type { Request, Response } from "express";
import prisma from "../prisma.ts";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.ts";

export const getMypayouts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const workerId = req.auth?.workerId;

    if (!workerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const payouts = await prisma.payout.findMany({
      where: { workerId },
      orderBy: { createdAt: "desc"},
    });
    return res.json(payouts);
  } catch (error) {
    console.log("Payout history error: ", error);
    return res.status(500).json({
      message: "Failed to fetch payout history",
    });
  }
};