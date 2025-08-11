export function Badge({ children, tone = "zinc" }: { children: React.ReactNode; tone?: "zinc" | "emerald" | "red" | "amber" }) {
  const tones: Record<string, string> = {
    zinc: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
    emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${tones[tone]}`}>{children}</span>;
}
