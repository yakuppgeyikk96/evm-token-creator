type ToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-zinc-800 px-4 py-3 transition-colors hover:border-zinc-700">
      <div>
        <span className="text-sm font-medium text-white">{label}</span>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-white accent-white"
      />
    </label>
  );
}
