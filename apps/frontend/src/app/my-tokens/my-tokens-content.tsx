"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function MyTokensContent() {
  const { isConnected } = useAccount();

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
      <h1 className="text-3xl font-bold">My Tokens</h1>
      <p className="mt-2 text-zinc-400">
        View and manage tokens you have created.
      </p>
    </>
  );
}
