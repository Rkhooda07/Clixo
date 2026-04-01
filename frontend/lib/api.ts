const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

type ChallengeResponse = {
  message: string;
  nonce: string;
};

export const getChallenge = async (walletAddress: string) => {
  const res = await fetch(`${BASE}/auth/challenge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress }),
  });

  if (!res.ok) {
    throw new Error("Failed to get challenge");
  }

  return res.json() as Promise<ChallengeResponse>;
}
