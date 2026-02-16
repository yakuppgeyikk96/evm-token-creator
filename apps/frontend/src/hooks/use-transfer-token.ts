"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type BaseError } from "wagmi";
import { parseUnits } from "viem";
import { BaseTokenAbi } from "@repo/contracts-abi/abis";

export type TransferInput = {
  tokenAddress: `0x${string}`;
  to: `0x${string}`;
  amount: string;
};

export function useTransferToken() {
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

  function transfer(input: TransferInput) {
    writeContract({
      address: input.tokenAddress,
      abi: BaseTokenAbi,
      functionName: "transfer",
      args: [input.to, parseUnits(input.amount, 18)],
    });
  }

  const error = writeError as BaseError | null;

  return { transfer, hash, isPending, isConfirming, isConfirmed, error, reset };
}
