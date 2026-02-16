"use client";

import { useReadContract, useReadContracts, useAccount } from "wagmi";
import { TokenFactoryAbi, BaseTokenAbi } from "@repo/contracts-abi/abis";
import { addresses } from "@repo/contracts-abi/addresses";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export type TokenInfo = {
  address: `0x${string}`;
  name: string;
  symbol: string;
  totalSupply: bigint;
  cap: bigint;
  isMintable: boolean;
  isBurnable: boolean;
  isPausable: boolean;
  paused: boolean;
  owner: `0x${string}`;
};

function isValidAddress(addr: string | undefined): addr is `0x${string}` {
  return !!addr && addr !== ZERO_ADDRESS;
}

export function useUserTokens() {
  const { address, chainId } = useAccount();
  const rawFactoryAddress = chainId ? addresses[chainId]?.tokenFactory : undefined;
  const factoryAddress = isValidAddress(rawFactoryAddress) ? rawFactoryAddress : undefined;
  const isDeployed = !!factoryAddress;

  const {
    data: tokenAddresses,
    isLoading: isLoadingAddresses,
    error: addressesError,
  } = useReadContract({
    address: factoryAddress,
    abi: TokenFactoryAbi,
    functionName: "getTokensByOwner",
    args: address ? [address] : undefined,
    query: { enabled: !!address && isDeployed },
  });

  const tokenContracts = (tokenAddresses ?? []).flatMap((tokenAddress) => [
    {
      address: tokenAddress,
      abi: BaseTokenAbi,
      functionName: "name",
    } as const,
    {
      address: tokenAddress,
      abi: BaseTokenAbi,
      functionName: "symbol",
    } as const,
    {
      address: tokenAddress,
      abi: BaseTokenAbi,
      functionName: "totalSupply",
    } as const,
    {
      address: tokenAddress,
      abi: BaseTokenAbi,
      functionName: "cap",
    } as const,
    {
      address: tokenAddress,
      abi: BaseTokenAbi,
      functionName: "getConfig",
    } as const,
    {
      address: tokenAddress,
      abi: BaseTokenAbi,
      functionName: "paused",
    } as const,
    {
      address: tokenAddress,
      abi: BaseTokenAbi,
      functionName: "owner",
    } as const,
  ]);

  const {
    data: tokenDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useReadContracts({
    contracts: tokenContracts,
    query: {
      enabled: !!tokenAddresses && tokenAddresses.length > 0,
    },
  });

  const tokens: TokenInfo[] = [];

  if (tokenAddresses && tokenDetails) {
    const fieldsPerToken = 7;
    for (let i = 0; i < tokenAddresses.length; i++) {
      const offset = i * fieldsPerToken;
      const name = tokenDetails[offset]?.result as string | undefined;
      const symbol = tokenDetails[offset + 1]?.result as string | undefined;
      const totalSupply = tokenDetails[offset + 2]?.result as bigint | undefined;
      const cap = tokenDetails[offset + 3]?.result as bigint | undefined;
      const config = tokenDetails[offset + 4]?.result as
        | { isMintable: boolean; isBurnable: boolean; isPausable: boolean }
        | undefined;
      const paused = tokenDetails[offset + 5]?.result as boolean | undefined;
      const owner = tokenDetails[offset + 6]?.result as `0x${string}` | undefined;

      if (name && symbol) {
        tokens.push({
          address: tokenAddresses[i],
          name,
          symbol,
          totalSupply: totalSupply ?? BigInt(0),
          cap: cap ?? BigInt(0),
          isMintable: config?.isMintable ?? false,
          isBurnable: config?.isBurnable ?? false,
          isPausable: config?.isPausable ?? false,
          paused: paused ?? false,
          owner: owner ?? "0x0000000000000000000000000000000000000000",
        });
      }
    }
  }

  return {
    tokens,
    isLoading: isDeployed && (isLoadingAddresses || isLoadingDetails),
    isDeployed,
    error: addressesError || detailsError,
  };
}
