import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive background fetching
      staleTime: 5 * 60 * 1000, // 5 minutes cache default
      // A 4xx is a verdict, not a hiccup — retrying a 401 from a stale token
      // just doubles the round trips before the UI settles.
      retry: (failureCount, error) => {
        const status = axios.isAxiosError(error)
          ? error.response?.status
          : undefined;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});
