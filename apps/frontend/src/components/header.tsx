"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const navLinks = [
  { href: "/create", label: "Create Token", requiresAuth: false },
  { href: "/my-tokens", label: "My Tokens", requiresAuth: true },
];

export function Header() {
  const pathname = usePathname();
  const { isConnected } = useAccount();

  const visibleLinks = navLinks.filter(
    (link) => !link.requiresAuth || isConnected,
  );

  return (
    <header className="border-b border-zinc-800 bg-neutral-900/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold text-white">
            EVM Token Creator
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-violet-500"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}
