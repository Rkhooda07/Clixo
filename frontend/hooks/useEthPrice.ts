"use client";

import { useQuery } from "@tanstack/react-query";

export function useEthPrice(): number | null {
  const { data } = useQuery({
    queryKey: ["eth-price"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const json = await res.json();
      return (json?.ethereum?.usd as number | undefined) ?? null;
    },
    staleTime: 5 * 60_000,
    retry: 1,
  });
  return data ?? null;
}
