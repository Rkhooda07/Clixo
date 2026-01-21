import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not set");
}

export const signToken = (payload: {
  workerId: number;
  walletAddress: string;
}) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as {
    workerId: number,
    walletAddress: string,
    iat: number,
    exp: number,
  };
};