import type { ReactNode } from "react";

export function WorkOsShell({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{subtitle}</p>
      </section>
      {children}
    </main>
  );
}

export function WorkOsMetric({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
      {hint ? <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function WorkOsCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function WorkOsBadge({ value }: { value: string }) {
  const tone = value.includes("critical") || value.includes("blocked") || value.includes("Blocat")
    ? "bg-red-50 text-red-700 ring-red-200"
    : value.includes("warning") || value.includes("planned")
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : value.includes("ready") || value.includes("Finalizat")
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : "bg-blue-50 text-blue-700 ring-blue-200";
  return <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${tone}`}>{value}</span>;
}

export function WorkOsProgress({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-12 text-sm font-black text-slate-700">{value}%</div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function WorkOsJson({ value }: { value: unknown }) {
  return <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{JSON.stringify(value, null, 2)}</pre>;
}
