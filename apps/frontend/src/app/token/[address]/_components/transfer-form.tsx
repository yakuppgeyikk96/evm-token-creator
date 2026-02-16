"use client";

import { useState } from "react";
import { formatUnits } from "viem";
import { useTransferToken } from "@/hooks/use-transfer-token";
import { Field } from "@/components/field";
import { TransactionStatus } from "@/components/transaction-status";

type TransferFormProps = {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  userBalance: bigint;
  chainId?: number;
  onSuccess: () => void;
};

export function TransferForm({ tokenAddress, tokenSymbol, userBalance, chainId, onSuccess }: TransferFormProps) {
  const { transfer, hash, isPending, isConfirming, isConfirmed, error, reset } = useTransferToken();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!to.trim() || !amount.trim()) return;
    transfer({ tokenAddress, to: to as `0x${string}`, amount });
  }

  function handleReset() {
    reset();
    setTo("");
    setAmount("");
    onSuccess();
  }

  if (hash) {
    return (
      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        onReset={handleReset}
        chainId={chainId}
        successMessage="Tokens transferred successfully!"
        resetLabel="Back to token"
      />
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 p-5">
      <h3 className="text-sm font-medium text-zinc-400">Transfer Tokens</h3>
      <p className="mt-1 text-xs text-zinc-600">
        Your balance: {formatUnits(userBalance, 18)} {tokenSymbol}
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Field
          label="Recipient Address"
          placeholder="0x..."
          value={to}
          onChange={setTo}
        />
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
          {isPending ? "Confirm in wallet..." : "Transfer"}
        </button>
      </form>
    </div>
  );
}
