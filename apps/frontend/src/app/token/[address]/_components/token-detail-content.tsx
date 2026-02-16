"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTokenDetail } from "@/hooks/use-token-detail";
import { Spinner } from "@/components/ui/spinner";
import { getExplorerUrl } from "@/lib/constants";
import { MintForm } from "./mint-form";
import { BurnForm } from "./burn-form";
import { PauseControl } from "./pause-control";
import { TransferOwnershipForm } from "./transfer-ownership-form";

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

type TokenDetailContentProps = {
  tokenAddress: `0x${string}`;
};

export function TokenDetailContent({ tokenAddress }: TokenDetailContentProps) {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const isValidAddress = ADDRESS_REGEX.test(tokenAddress);
  const { token, isLoading, error, refetch } = useTokenDetail(tokenAddress);

  const explorerUrl = getExplorerUrl(chainId);
  const tokenUrl = explorerUrl ? `${explorerUrl}/token/${tokenAddress}` : null;

  if (!isValidAddress) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <p className="text-lg font-medium text-red-400">Invalid token address</p>
        <Link
          href="/my-tokens"
          className="text-sm text-zinc-400 underline transition-colors hover:text-white"
        >
          Back to My Tokens
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <p className="text-lg font-medium text-red-400">
          {error ? "Failed to load token details" : "Token not found"}
        </p>
        <Link
          href="/my-tokens"
          className="text-sm text-zinc-400 underline transition-colors hover:text-white"
        >
          Back to My Tokens
        </Link>
      </div>
    );
  }

  const isOwner = userAddress?.toLowerCase() === token.owner.toLowerCase();
  const hasBalance = token.userBalance > BigInt(0);
  const showMint = token.isMintable && isOwner;
  const showBurn = token.isBurnable && hasBalance;
  const showPause = token.isPausable && isOwner;
  const showTransferOwnership = isOwner;

  const features = [
    token.isMintable && "Mintable",
    token.isBurnable && "Burnable",
    token.isPausable && "Pausable",
  ].filter(Boolean);

  return (
    <>
      <Link
        href="/my-tokens"
        className="text-sm text-zinc-400 transition-colors hover:text-white"
      >
        &larr; Back to My Tokens
      </Link>

      <div className="mt-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{token.name}</h1>
            <p className="mt-1 text-lg text-zinc-400">{token.symbol}</p>
          </div>
          {token.paused && (
            <span className="rounded-full bg-yellow-900/30 px-3 py-1 text-sm font-medium text-yellow-400">
              Paused
            </span>
          )}
        </div>

        <div className="mt-8 space-y-4">
          {/* Token Info */}
          <div className="rounded-lg border border-zinc-800 p-5">
            <h2 className="text-sm font-medium text-zinc-400">Token Info</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Supply</span>
                <span>{formatUnits(token.totalSupply, 18)}</span>
              </div>
              {token.cap > BigInt(0) && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Max Cap</span>
                  <span>{formatUnits(token.cap, 18)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500">Owner</span>
                <span className="font-mono">
                  {token.owner.slice(0, 6)}...{token.owner.slice(-4)}
                </span>
              </div>
              {isConnected && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Your Balance</span>
                  <span>{formatUnits(token.userBalance, 18)}</span>
                </div>
              )}
            </div>
          </div>

          {features.length > 0 && (
            <div className="flex gap-2">
              {features.map((feature) => (
                <span
                  key={feature as string}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
            <span className="font-mono text-xs text-zinc-600">
              {token.address}
            </span>
            {tokenUrl && (
              <a
                href={tokenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 underline transition-colors hover:text-white"
              >
                View on Basescan
              </a>
            )}
          </div>

          {/* Management Section */}
          {isConnected && (showMint || showBurn || showPause || showTransferOwnership) && (
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold">Management</h2>
              {showMint && (
                <MintForm
                  tokenAddress={tokenAddress}
                  tokenSymbol={token.symbol}
                  chainId={chainId}
                  onSuccess={refetch}
                />
              )}
              {showBurn && (
                <BurnForm
                  tokenAddress={tokenAddress}
                  tokenSymbol={token.symbol}
                  userBalance={token.userBalance}
                  chainId={chainId}
                  onSuccess={refetch}
                />
              )}
              {showPause && (
                <PauseControl
                  tokenAddress={tokenAddress}
                  tokenSymbol={token.symbol}
                  paused={token.paused}
                  chainId={chainId}
                  onSuccess={refetch}
                />
              )}
              {showTransferOwnership && (
                <TransferOwnershipForm
                  tokenAddress={tokenAddress}
                  tokenSymbol={token.symbol}
                  currentOwner={token.owner}
                  chainId={chainId}
                  onSuccess={refetch}
                />
              )}
            </div>
          )}

          {!isConnected && (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-zinc-800 p-6">
              <p className="text-sm text-zinc-400">
                Connect your wallet to manage this token.
              </p>
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
