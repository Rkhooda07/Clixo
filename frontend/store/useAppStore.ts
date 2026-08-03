import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  walletAddress: string | null;
  token: string | null;
  userId: number | null;
  workerId: number | null;
  setAuth: (
    token: string | null,
    walletAddress: string | null,
    userId: number | null,
    workerId: number | null
  ) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      walletAddress: null,
      token: null,
      userId: null,
      workerId: null,
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
        set({ walletAddress: null, token: null, userId: null, workerId: null });
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
