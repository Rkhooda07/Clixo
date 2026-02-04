import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export const serverWallet = new ethers.Wallet(
  process.env.SERVER_PRIVATE_KEY!,
  provider
);

export const sendEth = async (
  to: string,
  amountInEth: number
) => {
  const tx = await serverWallet.sendTransaction({
    to,
    value: ethers.parseEther(amountInEth.toString()),
  });

  return tx;
};