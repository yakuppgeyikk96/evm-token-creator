export const EXPLORER_URLS: Record<number, string> = {
  84532: "https://sepolia.basescan.org",
  8453: "https://basescan.org",
};

export function getExplorerUrl(chainId: number | undefined) {
  return chainId ? EXPLORER_URLS[chainId] ?? null : null;
}
