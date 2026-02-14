"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type BaseError } from "wagmi";
import { parseUnits } from "viem";
import { BaseTokenAbi } from "@repo/contracts-abi/abis";

export type BurnInput = {
  tokenAddress: `0x${string}`;
  amount: string;
};

export function useBurnToken() {
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
  } = useWaitForTransactionReceipt({ hash });

  function burn(input: BurnInput) {
    writeContract({
      address: input.tokenAddress,
      abi: BaseTokenAbi,
      functionName: "burn",
      args: [parseUnits(input.amount, 18)],
    });
  }

  const error = writeError as BaseError | null;

  return { burn, hash, isPending, isConfirming, isConfirmed, error, reset };
}
