const stats = [
  { label: "Low Fees", value: "< $0.01", detail: "per transaction" },
  { label: "Fast", value: "2 sec", detail: "block times" },
  { label: "Secure", value: "L2", detail: "Ethereum security" },
];

export function WhyBaseSection() {
  return (
    <section className="border-t border-zinc-800">
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Built on Base
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400">
          An Ethereum L2 built by Coinbase, offering the best of Ethereum with
          lower costs.
        </p>
        <div className="mt-12 rounded-lg border border-zinc-800 p-8">
          <div className="grid grid-cols-1 divide-y divide-zinc-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="py-6 text-center sm:py-0">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
