import { getPrismaTaskRepositoryAdapterRelease } from "@/lib/enterprise/prisma-task-repository-adapter";

function toneFor(status: string) {
  switch (status) {
    case "ready":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "partial":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "planned":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "blocked":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function riskTone(risk: string) {
  switch (risk) {
    case "critical":
      return "bg-red-50 text-red-700 ring-red-200";
    case "high":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "medium":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    default:
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}

export default function PrismaTaskRepositoryAdapterPage() {
  const release = getPrismaTaskRepositoryAdapterRelease();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS v{release.version}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{release.name}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <Metric label="Readiness" value={`${release.readiness}%`} />
          <Metric label="Mode" value={release.currentMode} />
          <Metric label="Write gate" value={release.writeGateOpen ? "open" : "closed"} />
          <Metric label="Production DB" value={release.isProductionDbActive ? "active" : "off"} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {release.layers.map((layer) => (
          <article key={layer.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">{layer.title}</h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{layer.module} · {layer.mode}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{layer.summary}</p>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(layer.status)}`}>{layer.status}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${riskTone(layer.risk)}`}>{layer.risk}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="min-w-14 text-sm font-black text-slate-800">{layer.readiness}%</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${layer.readiness}%` }} />
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">Done</div>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {layer.done.map((item) => <li key={item} className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">{item}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.16em] text-amber-600">Next</div>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {layer.next.map((item) => <li key={item} className="rounded-xl bg-amber-50 px-3 py-2 text-amber-800">{item}</li>)}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Safeguards</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {release.safeguards.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
