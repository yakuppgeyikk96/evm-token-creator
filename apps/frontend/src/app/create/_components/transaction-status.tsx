"use client";

import { type BaseError } from "wagmi";

const EXPLORER_URLS: Record<number, string> = {
  84532: "https://sepolia.basescan.org",
  8453: "https://basescan.org",
};

type TransactionStatusProps = {
  hash: `0x${string}`;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: BaseError | null;
  onReset: () => void;
  chainId?: number;
  tokenAddress?: `0x${string}`;
};

export function TransactionStatus({
  hash,
  isPending,
  isConfirming,
  isConfirmed,
  error,
  onReset,
  chainId,
  tokenAddress,
}: TransactionStatusProps) {
  const explorerUrl = chainId ? EXPLORER_URLS[chainId] : null;
  const txUrl = explorerUrl ? `${explorerUrl}/tx/${hash}` : null;
  const tokenUrl =
    explorerUrl && tokenAddress
      ? `${explorerUrl}/token/${tokenAddress}`
      : null;

  async function addToMetaMask() {
    if (!tokenAddress || !window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            decimals: 18,
          },
        },
      });
    } catch {
      // User rejected or wallet doesn't support it
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-lg border border-zinc-800 p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {isPending && (
            <>
              <Spinner />
              <p className="text-lg font-medium">Confirm in your wallet...</p>
              <p className="text-sm text-zinc-400">
                Please confirm the transaction in your wallet.
              </p>
            </>
          )}

          {isConfirming && (
            <>
              <Spinner />
              <p className="text-lg font-medium">Transaction submitted</p>
              <p className="text-sm text-zinc-400">
                Waiting for on-chain confirmation...
              </p>
              {txUrl && (
                <a
                  href={txUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 underline transition-colors hover:text-white"
                >
                  View on Basescan
                </a>
              )}
            </>
          )}

          {isConfirmed && (
            <>
              <SuccessIcon />
              <p className="text-lg font-medium text-green-400">
                Token created successfully!
              </p>
              {tokenAddress && (
                <div className="w-full rounded-lg bg-zinc-800/50 p-3">
                  <p className="text-xs text-zinc-400">Token Address</p>
                  <p className="mt-1 break-all font-mono text-sm text-white">
                    {tokenAddress}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                {tokenUrl && (
                  <a
                    href={tokenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 underline transition-colors hover:text-white"
                  >
                    View token on Basescan
                  </a>
                )}
                {txUrl && (
                  <a
                    href={txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 underline transition-colors hover:text-white"
                  >
                    View transaction
                  </a>
                )}
              </div>
              {tokenAddress && (
                <button
                  type="button"
                  onClick={addToMetaMask}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800/50"
                >
                  Add to MetaMask
                </button>
              )}
            </>
          )}

          {error && (
            <>
              <ErrorIcon />
              <p className="text-lg font-medium text-red-400">
                Transaction failed
              </p>
              <p className="text-sm text-zinc-400">
                {error.shortMessage || error.message}
              </p>
            </>
          )}
        </div>
      </div>

      {(isConfirmed || error) && (
        <button
          onClick={onReset}
          className="w-full rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800/50"
        >
          Create another token
        </button>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
  );
}

function SuccessIcon() {
  return (
    <svg
      className="h-10 w-10 text-green-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="h-10 w-10 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
