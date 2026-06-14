"use client";

import { useEffect, useState, useRef } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { authApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export function useWalletUser() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { token, walletAddress, setAuth, logout } = useAppStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authAttempted = useRef<string | null>(null);

  const login = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
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
      authAttempted.current = address;
    } catch (err: any) {
      console.error("SIWE Authentication failed: ", err);
      toast.error(err?.message || "Signature request cancelled or authentication failed", { id: "siwe-auth" });
      authAttempted.current = null;
      // We don't necessarily want to logout/disconnect here if it was just a cancelled signature
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    // Wait for wagmi to finish initializing
    if (!isConnecting && !isReconnecting) {
      if (isConnected && address) {
        // If we are connected with a DIFFERENT address than the one we have a token for,
        // then we must logout because the session is invalid for this new address.
        if (walletAddress && walletAddress.toLowerCase() !== address.toLowerCase()) {
          logout();
          authAttempted.current = null;
        }
      }
      // We NO LONGER logout automatically just because isConnected is false.
      // This allows the session to persist across page refreshes or minor connection drops.
      // The UI will still show "Connect Wallet" if isConnected is false, 
      // but once they reconnect the same wallet, they'll be logged in immediately.
    }
  }, [isConnected, address, isConnecting, isReconnecting, walletAddress]);

  return {
    address,
    isConnected,
    isAuthenticating,
    isInitializing: isConnecting || isReconnecting,
    isLogged: !!token && !!address && walletAddress?.toLowerCase() === address?.toLowerCase(),
    token,
    login,
    logout: () => {
      logout();
      disconnect();
      authAttempted.current = null;
    },
  };
}
