import type { Metadata } from "next";
import { MyTokensContent } from "./my-tokens-content";

export const metadata: Metadata = {
  title: "My Tokens",
  description: "View and manage your created ERC-20 tokens",
};

export default function MyTokensPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <MyTokensContent />
    </div>
  );
}
