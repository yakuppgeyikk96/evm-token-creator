"use client";

import { useState, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCreateToken, type CreateTokenInput } from "@/hooks/use-create-token";
import { addresses } from "@repo/contracts-abi/addresses";
import { Field } from "@/components/field";
import { Toggle } from "@/components/toggle";
import { TransactionStatus } from "./transaction-status";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const defaultForm: CreateTokenInput = {
  name: "",
  symbol: "",
  initialSupply: "",
  cap: "",
  isMintable: false,
  isBurnable: false,
  isPausable: false,
};

export function CreateTokenForm() {
  const { isConnected, chainId } = useAccount();
  const factoryAddress = chainId ? addresses[chainId]?.tokenFactory : undefined;
  const isDeployed = !!factoryAddress && factoryAddress !== ZERO_ADDRESS;
  const [form, setForm] = useState<CreateTokenInput>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createToken, hash, isPending, isConfirming, isConfirmed, error, reset } =
    useCreateToken();

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Token name is required";
    }

    if (!form.symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    } else if (form.symbol.length > 11) {
      newErrors.symbol = "Symbol must be 11 characters or less";
    }

    if (!form.initialSupply.trim()) {
      newErrors.initialSupply = "Initial supply is required";
    } else if (Number(form.initialSupply) <= 0) {
      newErrors.initialSupply = "Initial supply must be greater than 0";
    }

    if (form.cap && Number(form.cap) > 0 && Number(form.cap) < Number(form.initialSupply)) {
      newErrors.cap = "Cap must be greater than or equal to initial supply";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate() || !chainId) return;
    createToken(form, chainId);
  }

  function handleReset() {
    setForm(defaultForm);
    setErrors({});
    reset();
  }

  if (hash) {
    return (
      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        onReset={handleReset}
        chainId={chainId}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <Field
          label="Token Name"
          placeholder="e.g. My Token"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          error={errors.name}
        />
        <Field
          label="Symbol"
          placeholder="e.g. MTK"
          value={form.symbol}
          onChange={(v) => setForm((f) => ({ ...f, symbol: v.toUpperCase() }))}
          error={errors.symbol}
          maxLength={11}
        />
        <Field
          label="Initial Supply"
          placeholder="e.g. 1000000"
          value={form.initialSupply}
          onChange={(v) => setForm((f) => ({ ...f, initialSupply: v }))}
          error={errors.initialSupply}
          type="number"
        />
        <Field
          label="Max Supply Cap"
          placeholder="Leave empty for no cap"
          value={form.cap}
          onChange={(v) => setForm((f) => ({ ...f, cap: v }))}
          error={errors.cap}
          type="number"
          hint="Set to 0 or leave empty for unlimited supply"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-zinc-300">
          Token Features
        </legend>
        <Toggle
          label="Mintable"
          description="Owner can mint new tokens"
          checked={form.isMintable}
          onChange={(v) => setForm((f) => ({ ...f, isMintable: v }))}
        />
        <Toggle
          label="Burnable"
          description="Holders can burn their tokens"
          checked={form.isBurnable}
          onChange={(v) => setForm((f) => ({ ...f, isBurnable: v }))}
        />
        <Toggle
          label="Pausable"
          description="Owner can pause all transfers"
          checked={form.isPausable}
          onChange={(v) => setForm((f) => ({ ...f, isPausable: v }))}
        />
      </fieldset>

      {error && (
        <p className="text-sm text-red-400" aria-live="polite">
          {error.shortMessage || error.message}
        </p>
      )}

      <div className="pt-2">
        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : !isDeployed ? (
          <p className="text-center text-sm text-zinc-400">
            Token Factory contract is not deployed on this network yet.
          </p>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Confirm in wallet..." : "Create Token"}
          </button>
        )}
      </div>
    </form>
  );
}
