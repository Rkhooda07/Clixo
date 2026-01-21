import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/jwt.ts";

export interface AuthenticatedRequest extends Request {
  auth?: {
    workerId: number,
    walletAddress: string,
  };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Missing or invalid Authorization header",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({
      message: "Authorization token missing",
    });
  }

  try {
    const decoded = verifyToken(token);

    req.auth = {
      workerId: decoded.workerId,
      walletAddress: decoded.walletAddress,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
