"use client";

import { useEffect, useState, useRef } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { authApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export function useWalletUser() {
  const { address, isConnected, isConnecting, isReconnecting, connector } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { token, walletAddress, setAuth, logout } = useAppStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const authAttempted = useRef<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

      // 2. Sign message — wagmi reports connected before the connector
      // finishes its handshake, so retry briefly on that specific race.
      let signature: string;
      for (let attempt = 0; ; attempt++) {
        try {
          signature = await signMessageAsync({ message: challenge.message });
          break;
        } catch (err: any) {
          if (attempt >= 4 || err?.name !== "ConnectorNotConnectedError") throw err;
          await new Promise((r) => setTimeout(r, 300));
        }
      }

      // 3. Verify signature
      const res = await authApi.verify(address, signature, challenge.nonce);

      // 4. Set state
      setAuth(res.token, address, res.user.id, res.worker.id);
      toast.success("Wallet authenticated successfully!", { id: "siwe-auth" });
      authAttempted.current = address;
    } catch (err: any) {
      console.error("SIWE Authentication failed: ", err);
      toast.error(err?.message || "Signature request cancelled or authentication failed", { id: "siwe-auth" });
      // Keep authAttempted set so a rejected signature doesn't re-prompt in a
      // loop — the manual Sign In button is the retry path.
      // We don't necessarily want to logout/disconnect here if it was just a cancelled signature
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    // Wait for wagmi and store to finish initializing
    if (!isConnecting && !isReconnecting && isHydrated) {
      if (isConnected && address) {
        // If we are connected with a DIFFERENT address than the one we have a token for,
        // then we must logout because the session is invalid for this new address.
        if (walletAddress && walletAddress.toLowerCase() !== address.toLowerCase()) {
          logout();
          authAttempted.current = null;
        }
      }
    }
  }, [isConnected, address, isConnecting, isReconnecting, isHydrated, walletAddress]);

  // Auto-prompt the SIWE signature right after connecting, so connect + sign
  // feel like one step. One attempt per address; rejection falls back to the
  // manual Sign In button.
  useEffect(() => {
    if (isConnecting || isReconnecting || !isHydrated) return;
    if (!isConnected || !address || !connector || isAuthenticating) return;
    if (token && walletAddress?.toLowerCase() === address.toLowerCase()) return;
    if (authAttempted.current === address) return;
    authAttempted.current = address;
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, connector, isConnecting, isReconnecting, isHydrated, token, walletAddress, isAuthenticating]);

  return {
    address,
    isConnected,
    isAuthenticating,
    isInitializing: isConnecting || isReconnecting || !isHydrated,
    isLogged: isHydrated && !!token && !!address && walletAddress?.toLowerCase() === address?.toLowerCase(),
    token,
    login,
    logout: () => {
      logout();
      disconnect();
      authAttempted.current = null;
    },
  };
}
