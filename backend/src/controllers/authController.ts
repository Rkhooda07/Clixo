import type { Request, Response } from "express";
import crypto from "crypto";
import { ethers } from "ethers";
import prisma from "../prisma.ts";
import { saveChallenge, getChallenge, deleteChallenge } from "../auth/siweStore.ts";
import { signToken } from "../auth/jwt.ts";

export const createSiweChallenge = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      message: "Wallet address required"
    });
  }

  // Generate nonce
  const nonce = crypto.randomBytes(16).toString("hex");

  // Create msg
  const message = `Sign in to Clixo Wallet: ${walletAddress} Nonce: ${nonce} Issued At: ${new Date().toISOString()}`;

  // Store challenge with 5 min of expiry
  saveChallenge({
    walletAddress,
    nonce,
    message,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return res.status(200).json({ message, nonce });
};

export const verifySiweSignature = async (req: Request, res: Response) => {
  const { walletAddress, signature, nonce } = req.body;

  if (!walletAddress || !signature || !nonce) {
    return res.status(400).json({
      message: "Missing fields"
    });
  }

  // Get challenge
  const challenge = getChallenge(nonce);

  if (!challenge) {
    return res.status(400).json({
      message: "Invalid or expired challenge"
    });
  }

  if (challenge.expiresAt < Date.now()) {
    return res.status(400).json({
      message: "Challenge expired"
    });
  }

  // Recover the sender
  const recoveredAddress = ethers.verifyMessage(
    challenge.message,
    signature
  );

  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    return res.status(401).json({
      message: "Signature mismatch"
    });
  }

  // Resolve the worker from the wallet address. If no worker exists yet,
  // create one so the wallet auth flow can issue a token on first connect.
  let worker = await prisma.worker.findFirst({
    where: {
      OR: [
        { wallet_address: walletAddress },
        { address: walletAddress },
      ],
    },
  });

  if (!worker) {
    worker = await prisma.worker.create({
      data: {
        address: walletAddress,
        wallet_address: walletAddress,
        pending_amount: 0,
        locked_amount: 0,
      },
    });
  } else if (worker.wallet_address !== walletAddress) {
    worker = await prisma.worker.update({
      where: { id: worker.id },
      data: {
        wallet_address: walletAddress,
      },
    });
  }

  // Find or create a corresponding User record so task creation succeeds
  let user = await prisma.user.findUnique({
    where: { address: walletAddress },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        address: walletAddress,
        balance: 0,
      },
    });
  }

  const token = signToken({
    workerId: worker.id,
    walletAddress,
  });

  // Invalidate the nonce
  deleteChallenge(nonce);

  res.json({
    message: "Wallet verified and authenticated",
    token,
    user: {
      id: user.id,
      address: user.address,
    },
    worker: {
      id: worker.id,
      address: worker.address,
    },
  });
};
