import Link from "next/link";

export function BottomCta() {
  return (
    <section className="border-t border-zinc-800">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to create your token?
        </h2>
        <p className="mt-4 text-zinc-400">
          It only takes a few minutes to go from idea to a live token on Base.
        </p>
        <Link
          href="/create"
          className="mt-8 inline-block rounded-lg bg-violet-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-400"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
