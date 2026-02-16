"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type BaseError } from "wagmi";
import { BaseTokenAbi } from "@repo/contracts-abi/abis";

export type TransferOwnershipInput = {
  tokenAddress: `0x${string}`;
  newOwner: `0x${string}`;
};

export function useTransferOwnership() {
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

  function transferOwnership(input: TransferOwnershipInput) {
    writeContract({
      address: input.tokenAddress,
      abi: BaseTokenAbi,
      functionName: "transferOwnership",
      args: [input.newOwner],
    });
  }

  const error = writeError as BaseError | null;

  return { transferOwnership, hash, isPending, isConfirming, isConfirmed, error, reset };
}
