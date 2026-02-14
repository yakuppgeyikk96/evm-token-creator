"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type BaseError } from "wagmi";
import { BaseTokenAbi } from "@repo/contracts-abi/abis";

export type PauseInput = {
  tokenAddress: `0x${string}`;
  action: "pause" | "unpause";
};

export function usePauseToken() {
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

  function togglePause(input: PauseInput) {
    writeContract({
      address: input.tokenAddress,
      abi: BaseTokenAbi,
      functionName: input.action,
    });
  }

  const error = writeError as BaseError | null;

  return { togglePause, hash, isPending, isConfirming, isConfirmed, error, reset };
}
