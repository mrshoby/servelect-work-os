import { getBetaStabilizationRelease } from "@/lib/enterprise/beta-stabilization";

const statusClass = {
  stable: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  controlled: "bg-blue-50 text-blue-700 ring-blue-200",
  "needs-work": "bg-amber-50 text-amber-700 ring-amber-200",
  blocked: "bg-red-50 text-red-700 ring-red-200"
} as const;

const riskClass = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  critical: "bg-red-50 text-red-700"
} as const;

const checklistClass = {
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  active: "bg-blue-50 text-blue-700 ring-blue-200",
  next: "bg-amber-50 text-amber-700 ring-amber-200",
  blocked: "bg-red-50 text-red-700 ring-red-200"
} as const;

export default function BetaStabilizationPage() {
  const release = getBetaStabilizationRelease();

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white lg:p-8">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/15">
            SERVELECT WORK OS · v{release.version} · Enterprise Beta
          </div>
          <h1 className="mt-4 max-w-5xl text-3xl font-black tracking-tight lg:text-4xl">
            Enterprise Beta Stabilization
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">{release.summary}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Beta readiness" value={`${release.betaReadiness.score}%`} />
            <Metric label="Website" value={release.betaReadiness.website} />
            <Metric label="Mobile" value={release.betaReadiness.mobile} />
            <Metric label="Provider" value={release.betaReadiness.provider} />
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-3">
          <InfoCard title="Stadiu real" lines={[`Website: ${release.betaReadiness.website}`, `Mobile: ${release.betaReadiness.mobile}`, `Status: ${release.betaReadiness.label}`]} />
          <InfoCard title="Blockers critici" lines={release.betaReadiness.criticalBlockers.length ? release.betaReadiness.criticalBlockers : ["Nu există blockers critici noi în manifest."]} />
          <InfoCard title="Next build" lines={[`${release.nextBuild.version} — ${release.nextBuild.name}`, release.nextBuild.objective]} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {release.areas.map((area) => (
          <article key={area.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{area.module}</div>
                <h2 className="mt-1 text-lg font-black text-slate-950">{area.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{area.currentState}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass[area.status]}`}>{area.status}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${riskClass[area.risk]}`}>risk: {area.risk}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Mini label="Readiness" value={`${area.readiness}%`} />
              <Mini label="Owner" value={area.owner} />
              <Mini label="Scope" value={area.scope} />
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Beta gate</div>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{area.betaGate}</p>
            </div>

            <div className="mt-4">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Next actions</div>
              <div className="flex flex-wrap gap-2">
                {area.nextActions.map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Critical route audit manifest</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Criticality</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {release.criticalRoutes.map((route) => (
                <tr key={route.path}>
                  <td className="px-4 py-3 font-mono text-xs font-black text-slate-900">{route.path}</td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{route.expected}</td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{route.criticality}</td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{route.budgetMs}ms</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass[route.status]}`}>{route.status}</span></td>
                  <td className="px-4 py-3 text-slate-500">{route.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Beta release checklist</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          {release.checklist.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${checklistClass[item.status]}`}>{item.status}</span>
              <h3 className="mt-3 font-black text-slate-900">{item.label}</h3>
              <p className="mt-2 text-xs font-semibold text-slate-500">Owner: {item.owner}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{item.evidence}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className="text-xl font-black">{value}</div>
      <div className="mt-1 text-xs font-semibold text-slate-300">{label}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-1 line-clamp-2 text-sm font-black text-slate-800">{value}</div>
    </div>
  );
}

function InfoCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-5 text-slate-600">
        {lines.map((line) => (
          <li key={line}>• {line}</li>
        ))}
      </ul>
    </div>
  );
}
