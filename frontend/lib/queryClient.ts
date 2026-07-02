import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive background fetching
      retry: 1, // Minimize retry attempts in production
      staleTime: 5 * 60 * 1000, // 5 minutes cache default
    },
  },
});
