const steps = [
  {
    number: "01",
    title: "Connect Wallet",
    description:
      "Connect your wallet using MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet.",
  },
  {
    number: "02",
    title: "Configure Token",
    description:
      "Set your token name, symbol, initial supply, and choose features like minting, burning, and pausing.",
  },
  {
    number: "03",
    title: "Deploy",
    description:
      "Confirm the transaction in your wallet and your token is live on the Base network in seconds.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Deploy in three steps
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400">
          No Solidity knowledge required. No development environment needed.
        </p>
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="font-mono text-5xl font-bold text-violet-500/20">
                {step.number}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
