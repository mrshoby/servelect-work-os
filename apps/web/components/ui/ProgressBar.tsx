import { cn } from "@servelect/shared";

export function ProgressBar({ value, tone = "green", className }: { value: number; tone?: "green" | "blue" | "orange" | "red" | "purple"; className?: string }) {
  const colors = { green: "bg-servelect-600", blue: "bg-blue-600", orange: "bg-amber-500", red: "bg-red-500", purple: "bg-violet-600" };
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-slate-100", className)}>
      <div className={cn("h-full rounded-full", colors[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
