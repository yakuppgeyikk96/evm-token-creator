import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-center text-5xl font-bold tracking-tight sm:text-6xl">
        Create ERC-20 Tokens
        <br />
        <span className="text-zinc-500">on Base Network</span>
      </h1>
      <p className="max-w-md text-center text-lg text-zinc-400">
        Deploy fully-featured tokens with mintable, burnable, pausable, and
        capped supply options — no Solidity knowledge required.
      </p>
      <div className="mt-4 flex gap-4">
        <Link
          href="/create"
          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          Create Token
        </Link>
        <Link
          href="/my-tokens"
          className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800/50"
        >
          My Tokens
        </Link>
      </div>
    </div>
  );
}
