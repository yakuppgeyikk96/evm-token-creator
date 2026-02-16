import Link from "next/link";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center px-4 py-24 sm:py-32 lg:py-40">
      <span className="mb-6 rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
        Base Network
      </span>
      <h1 className="text-center text-5xl font-bold tracking-tight sm:text-6xl">
        Create ERC-20 Tokens
        <br />
        <span className="text-zinc-500">on Base Network</span>
      </h1>
      <p className="mt-6 max-w-md text-center text-lg text-zinc-400">
        Deploy fully-featured tokens with mintable, burnable, pausable, and
        capped supply options — no Solidity knowledge required.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/create"
          className="rounded-lg bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-400"
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
      <p className="mt-8 font-mono text-xs text-zinc-600">
        No Solidity required · Deploy in under 60 seconds
      </p>
    </section>
  );
}
