"use client";

import { connectWallet } from "@/lib/wallet";
import { getChallenge, verifyUser } from "@/lib/api";

export default function Navbar() {
  const handleConnect = async() => {
    try {
      const { signer, address } = await connectWallet();

      console.log("Wallet: ", address);

      const data = await getChallenge(address);

      console.log("Challenge message: ", data.message);
      console.log("Challenge nonce: ", data.nonce);

      const signature = await signer.signMessage(data.message);

      console.log(signature);

      const result = await verifyUser(
        address,
        signature,
        data.nonce
      );

      console.log("TOKEN: ", result.token);

      // Store token
      localStorage.setItem("token", result.token);

      console.log("User logged in successfully");

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex gap-4">
        <button onClick={handleConnect}>
          Connect wallet
        </button>
        <button>About</button>
      </div>
    </div>
  )
}
