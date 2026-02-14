import Link from "next/link";
import { formatUnits } from "viem";
import { type TokenInfo } from "@/hooks/use-user-tokens";
import { getExplorerUrl } from "@/lib/constants";

type TokenCardProps = {
  token: TokenInfo;
  chainId?: number;
};

export function TokenCard({ token, chainId }: TokenCardProps) {
  const explorerUrl = getExplorerUrl(chainId);
  const tokenUrl = explorerUrl ? `${explorerUrl}/token/${token.address}` : null;

  const features = [
    token.isMintable && "Mintable",
    token.isBurnable && "Burnable",
    token.isPausable && "Pausable",
  ].filter(Boolean);

  return (
    <Link
      href={`/token/${token.address}`}
      className="block rounded-lg border border-zinc-800 p-5 transition-colors hover:border-zinc-700"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{token.name}</h3>
          <p className="text-sm text-zinc-400">{token.symbol}</p>
        </div>
        {token.paused && (
          <span className="rounded-full bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
            Paused
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm">
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
      </div>

      {features.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {features.map((feature) => (
            <span
              key={feature as string}
              className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
            >
              {feature}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
        <span className="font-mono text-xs text-zinc-600">
          {token.address.slice(0, 6)}...{token.address.slice(-4)}
        </span>
        {tokenUrl && (
          <span
            role="link"
            onClick={(e) => {
              e.preventDefault();
              window.open(tokenUrl, "_blank", "noopener,noreferrer");
            }}
            className="text-xs text-zinc-400 underline transition-colors hover:text-white"
          >
            View on Basescan
          </span>
        )}
      </div>
    </Link>
  );
}
