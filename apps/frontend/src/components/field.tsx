type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  maxLength?: number;
  hint?: string;
};

export function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  maxLength,
  hint,
}: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
      />
      {hint && !error && (
        <p className="mt-1 text-xs text-zinc-500">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-400" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
