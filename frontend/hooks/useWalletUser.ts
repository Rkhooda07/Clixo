"use client";

import { useEffect, useState, useRef } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { authApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export function useWalletUser() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { token, walletAddress, setAuth, logout } = useAppStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authAttempted = useRef<string | null>(null);

  const login = async () => {
    if (!address || authAttempted.current === address) return;
    authAttempted.current = address;
    setIsAuthenticating(true);
    const toastId = toast.loading("Signing in with Ethereum...", { id: "siwe-auth" });

    try {
      // 1. Fetch challenge message
      const challenge = await authApi.getChallenge(address);

      // 2. Sign message
      const signature = await signMessageAsync({
        message: challenge.message,
      });

      // 3. Verify signature
      const res = await authApi.verify(address, signature, challenge.nonce);

      // 4. Set state
      setAuth(res.token, address, res.user.id, res.worker.id);
      toast.success("Wallet authenticated successfully!", { id: "siwe-auth" });
    } catch (err: any) {
      console.error("SIWE Authentication failed: ", err);
      toast.error(err?.message || "Signature request cancelled or authentication failed", { id: "siwe-auth" });
      authAttempted.current = null;
      logout();
      disconnect();
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      // If we don't have a token or the token is for a different address, trigger login
      if (!token || walletAddress?.toLowerCase() !== address.toLowerCase()) {
        login();
      }
    } else if (!isConnected && token) {
      logout();
    }
  }, [isConnected, address]);

  return {
    address,
    isConnected,
    isAuthenticating,
    token,
    login,
    logout: () => {
      logout();
      disconnect();
    },
  };
}
