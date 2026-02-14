import type { Metadata } from "next";
import { TokenDetailContent } from "./_components/token-detail-content";

type Props = {
  params: Promise<{ address: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  return {
    title: `Token ${address.slice(0, 6)}...${address.slice(-4)}`,
    description: `View and manage token at ${address}`,
  };
}

export default async function TokenDetailPage({ params }: Props) {
  const { address } = await params;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <TokenDetailContent tokenAddress={address as `0x${string}`} />
    </div>
  );
}
