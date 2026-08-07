"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { authApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

/**
 * Module scope on purpose: this hook is mounted several times at once (the
 * navbar button, the page guard, and the guard's own button), and each mount
 * used to keep its own attempt ref. That is what raised two signature prompts
 * for a single connect. One in-flight login is shared by every mount.
 */
let loginPromise: Promise<void> | null = null;
let authAttempted: string | null = null;

export function useWalletUser() {
  const { address, isConnected, isConnecting, isReconnecting, connector } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const {
    token,
    walletAddress,
    setAuth,
    logout,
    isAuthenticating,
    setIsAuthenticating,
  } = useAppStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const login = useCallback(async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    // A concurrent mount already started this — wait on it rather than
    // raising a second signature prompt.
    if (loginPromise) return loginPromise;

    setIsAuthenticating(true);
    toast.loading("Signing in with Ethereum...", { id: "siwe-auth" });

    loginPromise = (async () => {
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
      } catch (err: any) {
        console.error("SIWE Authentication failed: ", err);
        toast.error(
          err?.message || "Signature request cancelled or authentication failed",
          { id: "siwe-auth" }
        );
        // Connecting and signing are one step, so a failed signature leaves
        // nothing half-done: drop the connection and let the single Connect
        // button be the retry. authAttempted is deliberately left set here —
        // the disconnect effect below clears it once the wallet has actually
        // gone, so this cannot re-prompt while disconnect is still settling.
        disconnect();
      } finally {
        setIsAuthenticating(false);
      }
    })();

    try {
      await loginPromise;
    } finally {
      loginPromise = null;
    }
  }, [address, signMessageAsync, setAuth, setIsAuthenticating, disconnect]);

  // Once the wallet is actually gone, allow a fresh attempt. Doing this here
  // rather than in the failure path means a rejected signature can never
  // re-prompt in the window before disconnect settles.
  useEffect(() => {
    if (!isConnected) authAttempted = null;
  }, [isConnected]);

  useEffect(() => {
    // Wait for wagmi and store to finish initializing
    if (!isConnecting && !isReconnecting && isHydrated) {
      if (isConnected && address) {
        // If we are connected with a DIFFERENT address than the one we have a token for,
        // then we must logout because the session is invalid for this new address.
        if (walletAddress && walletAddress.toLowerCase() !== address.toLowerCase()) {
          logout();
          authAttempted = null;
        }
      }
    }
  }, [isConnected, address, isConnecting, isReconnecting, isHydrated, walletAddress]);

  // Auto-prompt the SIWE signature right after connecting, so connect and sign
  // are one step with no second button to press. Guarded at module scope, so
  // only the first mount to reach here starts the attempt.
  useEffect(() => {
    if (isConnecting || isReconnecting || !isHydrated) return;
    if (!isConnected || !address || !connector || isAuthenticating) return;
    if (token && walletAddress?.toLowerCase() === address.toLowerCase()) return;
    if (authAttempted === address || loginPromise) return;
    authAttempted = address;
    login();
  }, [
    isConnected,
    address,
    connector,
    isConnecting,
    isReconnecting,
    isHydrated,
    token,
    walletAddress,
    isAuthenticating,
    login,
  ]);

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
      authAttempted = null;
    },
  };
}
