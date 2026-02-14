"use client";

import { useState } from "react";
import Link from "next/link";
import { formatUnits } from "viem";
import { useBurnToken } from "@/hooks/use-burn-token";
import { Field } from "@/components/field";
import { TransactionStatus } from "@/components/transaction-status";

type BurnFormProps = {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  userBalance: bigint;
  chainId?: number;
  onSuccess: () => void;
};

export function BurnForm({ tokenAddress, tokenSymbol, userBalance, chainId, onSuccess }: BurnFormProps) {
  const { burn, hash, isPending, isConfirming, isConfirmed, error, reset } = useBurnToken();
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount.trim()) return;
    burn({ tokenAddress, amount });
  }

  function handleReset() {
    reset();
    setAmount("");
    onSuccess();
  }

  if (hash) {
    return (
      <div>
        <Link
          href="/my-tokens"
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          &larr; Back to My Tokens
        </Link>
        <div className="mt-6">
          <h1 className="text-2xl font-bold">Burn {tokenSymbol}</h1>
          <TransactionStatus
            hash={hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            error={error}
            onReset={handleReset}
            chainId={chainId}
            successMessage="Tokens burned successfully!"
            resetLabel="Back to token"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 p-5">
      <h3 className="text-sm font-medium text-zinc-400">Burn Tokens</h3>
      <p className="mt-1 text-xs text-zinc-600">
        Your balance: {formatUnits(userBalance, 18)} {tokenSymbol}
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Field
          label="Amount"
          placeholder="e.g. 100"
          value={amount}
          onChange={setAmount}
          type="number"
        />
        {error && (
          <p className="text-sm text-red-400">
            {error.shortMessage || error.message}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Confirm in wallet..." : "Burn"}
        </button>
      </form>
    </div>
  );
}
