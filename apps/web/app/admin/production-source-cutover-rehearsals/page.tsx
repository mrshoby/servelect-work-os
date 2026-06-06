import { getProductionSourceCutoverRehearsals } from "@/lib/enterprise/production-source-cutover-rehearsals";

function toneFor(status: string) {
  switch (status) {
    case "ready":
    case "verified":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "shadow":
    case "staging":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "attention":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "blocked":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function Metric({ label, value, evidence }: { label: string; value: number; evidence: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-black text-slate-950">{value}%</div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} /></div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{evidence}</p>
    </div>
  );
}

export default function ProductionSourceCutoverPage() {
  const release = getProductionSourceCutoverRehearsals();
  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">v{release.version} · Source-of-truth cutover</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{release.name}</h1>
        <p className="mt-3 max-w-6xl text-sm leading-6 text-slate-600">{release.summary}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.25rem] bg-slate-950 p-5 text-white"><div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Readiness</div><div className="mt-2 text-4xl font-black">{release.readiness}%</div></div>
          <div className="rounded-[1.25rem] bg-emerald-50 p-5 text-emerald-900"><div className="text-xs font-black uppercase tracking-[0.18em]">Domains</div><div className="mt-2 text-4xl font-black">{release.domains.length}</div></div>
          <div className="rounded-[1.25rem] bg-blue-50 p-5 text-blue-900"><div className="text-xs font-black uppercase tracking-[0.18em]">Adapters</div><div className="mt-2 text-4xl font-black">{release.adapters.length}</div></div>
          <div className="rounded-[1.25rem] bg-amber-50 p-5 text-amber-900"><div className="text-xs font-black uppercase tracking-[0.18em]">Writes</div><div className="mt-2 text-2xl font-black">OFF by default</div></div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {release.metrics.map((metric) => <Metric key={metric.id} label={metric.label} value={metric.value} evidence={metric.evidence} />)}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Critical domain cutover board</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {release.domains.slice(0, 8).map((domain) => (
            <article key={domain.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black text-slate-950">{domain.label}</h3><p className="mt-1 text-sm text-slate-500">{domain.primarySource} → {domain.targetReadModel}</p></div><span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(domain.status)}`}>{domain.status}</span></div>
              <div className="mt-4 grid gap-3 md:grid-cols-3"><div><div className="text-xs font-bold text-slate-400">Readiness</div><div className="text-lg font-black">{domain.readiness}%</div></div><div><div className="text-xs font-bold text-slate-400">Parity</div><div className="text-lg font-black">{domain.parity}%</div></div><div><div className="text-xs font-bold text-slate-400">Write mode</div><div className="text-lg font-black">{domain.writeMode}</div></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {release.rehearsals.map((rehearsal) => (
          <article key={rehearsal.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3"><h3 className="font-black text-slate-950">{rehearsal.label}</h3><span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(rehearsal.status)}`}>{rehearsal.status}</span></div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{rehearsal.scope}</p>
            <div className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">Owner: {rehearsal.owner} · Window: {rehearsal.window}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">{rehearsal.checks.map((check) => <li key={check} className="rounded-xl bg-slate-50 px-3 py-2">{check}</li>)}</ul>
          </article>
        ))}
      </section>
    </main>
  );
}
