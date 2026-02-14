"use client";

import { useState } from "react";
import Link from "next/link";
import { useMintToken } from "@/hooks/use-mint-token";
import { Field } from "@/components/field";
import { TransactionStatus } from "@/components/transaction-status";

type MintFormProps = {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  chainId?: number;
  onSuccess: () => void;
};

export function MintForm({ tokenAddress, tokenSymbol, chainId, onSuccess }: MintFormProps) {
  const { mint, hash, isPending, isConfirming, isConfirmed, error, reset } = useMintToken();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!to.trim() || !amount.trim()) return;
    mint({ tokenAddress, to: to as `0x${string}`, amount });
  }

  function handleReset() {
    reset();
    setTo("");
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
          <h1 className="text-2xl font-bold">Mint {tokenSymbol}</h1>
          <TransactionStatus
            hash={hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            error={error}
            onReset={handleReset}
            chainId={chainId}
            successMessage="Tokens minted successfully!"
            resetLabel="Back to token"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 p-5">
      <h3 className="text-sm font-medium text-zinc-400">Mint Tokens</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Field
          label="Recipient Address"
          placeholder="0x..."
          value={to}
          onChange={setTo}
        />
        <Field
          label="Amount"
          placeholder="e.g. 1000"
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
          {isPending ? "Confirm in wallet..." : "Mint"}
        </button>
      </form>
    </div>
  );
}
