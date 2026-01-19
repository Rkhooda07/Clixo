type Challenge = {
  walletAddress: string,
  nonce: string,
  message: string,
  expiresAt: number,
};

const challenges = new Map<string, Challenge>();

export const saveChallenge = (challenge: Challenge) => {
  challenges.set(challenge.nonce, challenge);
}

export const getChallenge = (nonce: string) => {
  return challenges.get(nonce);
}

export const deleteChallenge = (nonce: string) => {
  challenges.delete(nonce);
}