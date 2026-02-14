"use client";

import { useReadContracts, useAccount } from "wagmi";
import { BaseTokenAbi } from "@repo/contracts-abi/abis";

export type TokenDetail = {
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
  userBalance: bigint;
};

export function useTokenDetail(tokenAddress: `0x${string}`) {
  const { address: userAddress } = useAccount();

  const contracts = [
    { address: tokenAddress, abi: BaseTokenAbi, functionName: "name" } as const,
    { address: tokenAddress, abi: BaseTokenAbi, functionName: "symbol" } as const,
    { address: tokenAddress, abi: BaseTokenAbi, functionName: "totalSupply" } as const,
    { address: tokenAddress, abi: BaseTokenAbi, functionName: "cap" } as const,
    { address: tokenAddress, abi: BaseTokenAbi, functionName: "getConfig" } as const,
    { address: tokenAddress, abi: BaseTokenAbi, functionName: "paused" } as const,
    { address: tokenAddress, abi: BaseTokenAbi, functionName: "owner" } as const,
    {
      address: tokenAddress,
      abi: BaseTokenAbi,
      functionName: "balanceOf",
      args: [userAddress ?? "0x0000000000000000000000000000000000000000"],
    } as const,
  ];

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useReadContracts({
    contracts,
    query: { enabled: !!tokenAddress },
  });

  let token: TokenDetail | null = null;

  if (data) {
    const name = data[0]?.result as string | undefined;
    const symbol = data[1]?.result as string | undefined;
    const totalSupply = data[2]?.result as bigint | undefined;
    const cap = data[3]?.result as bigint | undefined;
    const config = data[4]?.result as
      | { isMintable: boolean; isBurnable: boolean; isPausable: boolean }
      | undefined;
    const paused = data[5]?.result as boolean | undefined;
    const owner = data[6]?.result as `0x${string}` | undefined;
    const userBalance = data[7]?.result as bigint | undefined;

    if (name && symbol) {
      token = {
        address: tokenAddress,
        name,
        symbol,
        totalSupply: totalSupply ?? BigInt(0),
        cap: cap ?? BigInt(0),
        isMintable: config?.isMintable ?? false,
        isBurnable: config?.isBurnable ?? false,
        isPausable: config?.isPausable ?? false,
        paused: paused ?? false,
        owner: owner ?? "0x0000000000000000000000000000000000000000",
        userBalance: userBalance ?? BigInt(0),
      };
    }
  }

  return { token, isLoading, error, refetch };
}
