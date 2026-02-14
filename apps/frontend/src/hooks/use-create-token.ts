"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type BaseError } from "wagmi";
import { parseUnits } from "viem";
import { TokenFactoryAbi } from "@repo/contracts-abi/abis";
import { addresses } from "@repo/contracts-abi/addresses";

export type CreateTokenInput = {
  name: string;
  symbol: string;
  initialSupply: string;
  cap: string;
  isMintable: boolean;
  isBurnable: boolean;
  isPausable: boolean;
};

export function useCreateToken() {
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({ hash });

  function createToken(input: CreateTokenInput, chainId: number) {
    const factoryAddress = addresses[chainId]?.tokenFactory;
    if (!factoryAddress) return;

    const initialSupply = parseUnits(input.initialSupply, 18);
    const cap = input.cap ? parseUnits(input.cap, 18) : BigInt(0);

    writeContract({
      address: factoryAddress,
      abi: TokenFactoryAbi,
      functionName: "createToken",
      args: [
        {
          name: input.name,
          symbol: input.symbol,
          initialSupply,
          cap,
          config: {
            isMintable: input.isMintable,
            isBurnable: input.isBurnable,
            isPausable: input.isPausable,
          },
        },
      ],
    });
  }

  const error = writeError as BaseError | null;

  return {
    createToken,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    receipt,
    error,
    reset,
  };
}
