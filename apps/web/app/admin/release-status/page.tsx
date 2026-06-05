import { getReleaseStatus } from "@/lib/enterprise/release-dashboard";

const tone = {
  stable: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  beta: "bg-blue-50 text-blue-700 ring-blue-200",
  partial: "bg-amber-50 text-amber-700 ring-amber-200",
  mock: "bg-slate-100 text-slate-700 ring-slate-200",
  blocked: "bg-red-50 text-red-700 ring-red-200"
} as const;

export default function ReleaseStatusPage() {
  const status = getReleaseStatus();
  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Release status live</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">SERVELECT WORK OS {status.version}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{status.summary}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Metric label="Overall" value={`${Math.round((status.websiteCompletion + status.appCompletion) / 2)}%`} />
          <Metric label="Website/Web" value={`${status.websiteCompletion}%`} />
          <Metric label="Mobile App" value={`${status.appCompletion}%`} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {status.areas.map((area) => (
          <article key={area.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">{area.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{area.summary}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${tone[area.status]}`}>{area.status}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="min-w-14 text-sm font-black text-slate-800">{area.completion}%</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${area.completion}%` }} /></div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div><div className="text-xs font-black uppercase text-slate-400">FÄƒcut</div><ul className="mt-2 space-y-1 text-sm text-slate-500">{area.done.map((i) => <li key={i}>â€¢ {i}</li>)}</ul></div>
              <div><div className="text-xs font-black uppercase text-slate-400">UrmeazÄƒ</div><ul className="mt-2 space-y-1 text-sm text-slate-500">{area.next.map((i) => <li key={i}>â€¢ {i}</li>)}</ul></div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-black uppercase text-slate-400">{label}</div><div className="mt-1 text-3xl font-black text-slate-950">{value}</div></div>;
}

