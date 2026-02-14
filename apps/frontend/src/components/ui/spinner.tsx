export function Spinner({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-zinc-700 border-t-white ${className}`}
    />
  );
}
