"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUserTokens } from "@/hooks/use-user-tokens";
import { Spinner } from "@/components/ui/spinner";
import { TokenCard } from "@/components/token-card";

export function MyTokensContent() {
  const { isConnected, chainId } = useAccount();
  const { tokens, isLoading, isDeployed, error } = useUserTokens();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-lg text-zinc-400">
          Connect your wallet to view your tokens.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tokens</h1>
          <p className="mt-2 text-zinc-400">
            View and manage tokens you have created.
          </p>
        </div>
        <Link
          href="/create"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          Create Token
        </Link>
      </div>

      <div className="mt-8">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {!isDeployed && (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-zinc-400">
              Token Factory contract is not deployed on this network yet.
            </p>
          </div>
        )}

        {isDeployed && error && (
          <p className="py-16 text-center text-sm text-red-400">
            Failed to load tokens. Please try again.
          </p>
        )}

        {isDeployed && !isLoading && !error && tokens.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-zinc-400">You haven&apos;t created any tokens yet.</p>
            <Link
              href="/create"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800/50"
            >
              Create your first token
            </Link>
          </div>
        )}

        {tokens.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tokens.map((token) => (
              <TokenCard
                key={token.address}
                token={token}
                chainId={chainId}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
