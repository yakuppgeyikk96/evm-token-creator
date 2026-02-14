"use client";

import Link from "next/link";
import { usePauseToken } from "@/hooks/use-pause-token";
import { TransactionStatus } from "@/components/transaction-status";

type PauseControlProps = {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  paused: boolean;
  chainId?: number;
  onSuccess: () => void;
};

export function PauseControl({ tokenAddress, tokenSymbol, paused, chainId, onSuccess }: PauseControlProps) {
  const { togglePause, hash, isPending, isConfirming, isConfirmed, error, reset } = usePauseToken();

  function handleClick() {
    togglePause({ tokenAddress, action: paused ? "unpause" : "pause" });
  }

  function handleReset() {
    reset();
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
          <h1 className="text-2xl font-bold">
            {paused ? "Unpause" : "Pause"} {tokenSymbol}
          </h1>
          <TransactionStatus
            hash={hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            error={error}
            onReset={handleReset}
            chainId={chainId}
            successMessage={
              paused
                ? "Token unpaused successfully!"
                : "Token paused successfully!"
            }
            resetLabel="Back to token"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 p-5">
      <h3 className="text-sm font-medium text-zinc-400">
        {paused ? "Unpause Token" : "Pause Token"}
      </h3>
      <p className="mt-1 text-xs text-zinc-600">
        {paused
          ? "Re-enable all token transfers."
          : "Temporarily halt all token transfers."}
      </p>
      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error.shortMessage || error.message}
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          paused
            ? "bg-white text-zinc-950 hover:bg-zinc-200"
            : "border border-yellow-600 text-yellow-400 hover:bg-yellow-900/20"
        }`}
      >
        {isPending
          ? "Confirm in wallet..."
          : paused
            ? "Unpause Token"
            : "Pause Token"}
      </button>
    </div>
  );
}
