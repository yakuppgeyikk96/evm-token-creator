import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tokens",
  description: "View and manage your created ERC-20 tokens",
};

export default function MyTokensPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">My Tokens</h1>
      <p className="mt-2 text-zinc-400">
        View and manage tokens you have created.
      </p>
    </div>
  );
}
