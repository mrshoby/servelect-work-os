import { getGanttView } from "@/lib/enterprise/work-os-execution-core";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function toneFor(value: string) {
  if (["ready", "active", "approved"].includes(value)) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (["watch", "pending", "queued", "staging", "shadow"].includes(value)) return "bg-amber-50 text-amber-700 ring-amber-200";
  if (["blocked", "rejected"].includes(value)) return "bg-red-50 text-red-700 ring-red-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function Card({ item, index }: { item: unknown; index: number }) {
  const record = (item && typeof item === "object") ? (item as Record<string, unknown>) : { value: item };
  const status = typeof record.status === "string" ? record.status : undefined;
  const title = String(record.title ?? record.name ?? record.label ?? record.id ?? `Item ${index + 1}`);
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        {status && <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(status)}`}>{status}</span>}
      </div>
      <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{pretty(record)}</pre>
    </article>
  );
}

export default function Page() {
  const data = getGanttView();
  const content = (data as Record<string, unknown>)["phases"];
  const items = Array.isArray(content) ? content : Object.entries((content ?? {}) as Record<string, unknown>).map(([label, value]) => ({ label, value }));

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS v5.4.0</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Gantt Timeline</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">Interactive execution module connected to projects, tasks, stock, pontaj, CRM, offers, field operations, audit, RBAC and admin controls.</p>
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        {items.map((item, index) => <Card key={index} item={item} index={index} />)}
      </section>
    </main>
  );
}
