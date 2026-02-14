import type { Metadata } from "next";
import { CreateTokenForm } from "./_components/create-token-form";

export const metadata: Metadata = {
  title: "Create Token",
  description: "Create a new ERC-20 token on the Base network",
};

export default function CreateTokenPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Create Token</h1>
      <p className="mt-2 text-zinc-400">
        Configure and deploy your ERC-20 token on the Base network.
      </p>
      <CreateTokenForm />
    </div>
  );
}