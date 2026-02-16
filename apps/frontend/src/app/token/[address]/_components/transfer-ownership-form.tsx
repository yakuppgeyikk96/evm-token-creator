"use client";

import { useState } from "react";
import Link from "next/link";
import { useTransferOwnership } from "@/hooks/use-transfer-ownership";
import { Field } from "@/components/field";
import { TransactionStatus } from "@/components/transaction-status";

type TransferOwnershipFormProps = {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  currentOwner: string;
  chainId?: number;
  onSuccess: () => void;
};

export function TransferOwnershipForm({
  tokenAddress,
  tokenSymbol,
  currentOwner,
  chainId,
  onSuccess,
}: TransferOwnershipFormProps) {
  const { transferOwnership, hash, isPending, isConfirming, isConfirmed, error, reset } =
    useTransferOwnership();
  const [newOwner, setNewOwner] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newOwner.trim()) return;
    transferOwnership({
      tokenAddress,
      newOwner: newOwner as `0x${string}`,
    });
  }

  function handleReset() {
    reset();
    setNewOwner("");
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
          <h1 className="text-2xl font-bold">Transfer Ownership — {tokenSymbol}</h1>
          <TransactionStatus
            hash={hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            error={error}
            onReset={handleReset}
            chainId={chainId}
            successMessage="Ownership transferred successfully!"
            resetLabel="Back to token"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 p-5">
      <h3 className="text-sm font-medium text-zinc-400">Transfer Ownership</h3>
      <p className="mt-1 text-xs text-zinc-600">
        Current owner: {currentOwner.slice(0, 6)}...{currentOwner.slice(-4)}
      </p>
      <div className="mt-3 rounded-md border border-red-900/50 bg-red-950/20 px-3 py-2">
        <p className="text-xs text-red-400">
          This action will transfer full control of the token to another address. This cannot be
          undone.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Field
          label="New Owner Address"
          placeholder="0x..."
          value={newOwner}
          onChange={setNewOwner}
        />
        {error && (
          <p className="text-sm text-red-400">
            {error.shortMessage || error.message}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending || !newOwner.trim()}
          className="w-full rounded-lg border border-red-600 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-900/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Confirm in wallet..." : "Transfer Ownership"}
        </button>
      </form>
    </div>
  );
}
