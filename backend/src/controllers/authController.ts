import type { Request, Response } from "express";
import crypto from "crypto";
import { saveChallenge } from "../auth/siweStore.ts";

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
  const message = `
    Sign in to Clixo 
    Wallet: ${walletAddress} 
    Nonce: ${nonce} 
    Issued At: ${new Date().toISOString()}
  `;

  // Store challenge with 5 min of expiry
  saveChallenge({
    walletAddress,
    nonce,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  res.json({ message, nonce });
};