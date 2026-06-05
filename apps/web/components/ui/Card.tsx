import type { ReactNode } from "react";

import { cn } from "@servelect/shared";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("card", className)}>{children}</section>;
}

export function CardHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg font-black tracking-tight text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm font-medium leading-5 text-slate-500">{subtitle}</p> : null}
      </div>

      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
  actions
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  const actionContent = actions ?? children;

  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
          Servelect EMP
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">{subtitle}</p>
      </div>

      {actionContent ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actionContent}</div> : null}
    </div>
  );
}
