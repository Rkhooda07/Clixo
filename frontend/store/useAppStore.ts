import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  walletAddress: string | null;
  token: string | null;
  userId: number | null;
  workerId: number | null;
  /**
   * Shared across every mount of useWalletUser. It lives here rather than in
   * the hook because the navbar button and the page guard are separate mounts
   * that must agree on whether a signature is already in flight.
   */
  isAuthenticating: boolean;
  setAuth: (
    token: string | null,
    walletAddress: string | null,
    userId: number | null,
    workerId: number | null
  ) => void;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      walletAddress: null,
      token: null,
      userId: null,
      workerId: null,
      isAuthenticating: false,
      setIsAuthenticating: (isAuthenticating) => set({ isAuthenticating }),
      setAuth: (token, walletAddress, userId, workerId) => {
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("token", token);
          } else {
            localStorage.removeItem("token");
          }
          if (walletAddress) {
            localStorage.setItem("walletAddress", walletAddress);
          } else {
            localStorage.removeItem("walletAddress");
          }
        }
        set({ token, walletAddress, userId, workerId });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("walletAddress");
        }
        set({
          walletAddress: null,
          token: null,
          userId: null,
          workerId: null,
          isAuthenticating: false,
        });
      },
    }),
    {
      name: "clixo-storage",
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        token: state.token,
        userId: state.userId,
        workerId: state.workerId,
      }),
    }
  )
);
