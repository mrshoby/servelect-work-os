import { cn } from "@servelect/shared";

type Tone = "green" | "blue" | "orange" | "red" | "purple" | "gray";

const tones: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  orange: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-1 ring-red-200",
  purple: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  gray: "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
};

export function Badge({ children, tone = "gray", className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return <span className={cn("badge", tones[tone], className)}>{children}</span>;
}
