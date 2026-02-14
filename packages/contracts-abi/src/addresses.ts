type ChainAddresses = {
  tokenFactory: `0x${string}`;
};

// Chain IDs: Base Mainnet = 8453, Base Sepolia = 84532
export const addresses: Record<number, ChainAddresses> = {
  84532: {
    tokenFactory: "0x0000000000000000000000000000000000000000", // TODO: deploy to Base Sepolia
  },
  8453: {
    tokenFactory: "0x0000000000000000000000000000000000000000", // TODO: deploy to Base Mainnet
  },
};
