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
  const { walletAddress, signature, nonce, workerId} = req.body;

  if (!walletAddress || !signature || !nonce || !workerId) {
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

  // Attach wallet to worker
  await prisma.worker.update({
    where: {id: workerId},
    data: {
      wallet_address: walletAddress,
    },
  });

  const token = signToken({
    workerId,
    walletAddress,
  });

  // Invalidate the nonce
  deleteChallenge(nonce);

  res.json({
    message: "Wallet verified and authenticated",
    token,
  });
};