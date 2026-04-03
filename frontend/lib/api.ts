const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

type ChallengeResponse = {
  message: string;
  nonce: string;
};

type VerifyResponse = {
  message: string;
  token: string;
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
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to get challenge");
  }

  return res.json() as Promise<ChallengeResponse>;
}

export const verifyUser = async (
  walletAddress: string,
  signature: string,
  nonce: string
) => {
  const res = await fetch(`${BASE}/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress,
      signature,
      nonce,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Verification failed");
  }

  return res.json() as Promise<VerifyResponse>;
};

export const getTasks = async () => {
  const res = await fetch(`${BASE}/tasks`);

  if (!res.ok){ 
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
};

export const getTask = async (taskId: number) => {
  const res = await fetch(`${BASE}/tasks/${taskId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }

  return res.json();
};
