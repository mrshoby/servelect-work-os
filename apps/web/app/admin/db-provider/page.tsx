import { getDbProviderRuntimeRelease } from "@/lib/enterprise/db-provider-runtime";

const statusClass = {
  ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  partial: "bg-blue-50 text-blue-700 ring-blue-200",
  mock: "bg-amber-50 text-amber-700 ring-amber-200",
  blocked: "bg-red-50 text-red-700 ring-red-200"
} as const;

const riskClass = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  critical: "bg-red-50 text-red-700"
} as const;

const gateClass = {
  passed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  active: "bg-blue-50 text-blue-700 ring-blue-200",
  next: "bg-amber-50 text-amber-700 ring-amber-200",
  blocked: "bg-red-50 text-red-700 ring-red-200"
} as const;

export default function DbProviderRuntimePage() {
  const release = getDbProviderRuntimeRelease();

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white lg:p-8">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/15">
            SERVELECT WORK OS · v{release.version} · DB Provider Runtime
          </div>
          <h1 className="mt-4 max-w-5xl text-3xl font-black tracking-tight lg:text-4xl">DB Provider Wiring & Prisma Runtime Pack</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            v2.1 pregătește comutarea controlată de la mock-memory/localStorage către Prisma/PostgreSQL, fără să schimbe interfața existentă și fără să activeze scrieri reale fără safety gates.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Readiness" value={`${release.readiness.score}%`} />
            <Metric label="Provider mode" value={release.provider.mode} />
            <Metric label="DATABASE_URL" value={release.provider.databaseUrlConfigured ? "set" : "missing"} />
            <Metric label="Safety gates" value={`${release.readiness.gatesPassed}/${release.readiness.gatesTotal}`} />
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-3">
          <InfoCard title="Runtime state" lines={[`Mode: ${release.provider.mode}`, `Writes enabled: ${release.provider.productionWritesEnabled ? "yes" : "no"}`, `Log level: ${release.provider.prismaLogLevel}`]} />
          <InfoCard title="Blockers" lines={release.readiness.blockedItems.length ? release.readiness.blockedItems : ["Nu există blockers critici în manifest."]} />
          <InfoCard title="Next build" lines={[`${release.nextBuild.version} — ${release.nextBuild.name}`, release.nextBuild.objective]} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {release.layers.map((layer) => (
          <article key={layer.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{layer.owner}</div>
                <h2 className="mt-1 text-lg font-black text-slate-950">{layer.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{layer.purpose}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass[layer.status]}`}>{layer.status}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${riskClass[layer.risk]}`}>risk: {layer.risk}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Mini label="Readiness" value={`${layer.readiness}%`} />
              <Mini label="Current" value={layer.currentProvider} />
              <Mini label="Target" value={layer.targetProvider} />
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{layer.evidence}</div>

            <div className="mt-4 flex flex-wrap gap-2">
              {layer.nextActions.map((action) => (
                <span key={action} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">{action}</span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Entity runtime map</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Readiness</th>
                <th className="px-4 py-3">Migration step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {release.entities.map((entity) => (
                <tr key={entity.id}>
                  <td className="px-4 py-3 font-black text-slate-900">{entity.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{entity.table}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{entity.prismaModel}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass[entity.status]}`}>{entity.status}</span></td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{entity.readiness}%</td>
                  <td className="px-4 py-3 text-slate-500">{entity.migrationStep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Runtime plan</h2>
          <div className="mt-4 space-y-3">
            {release.runtimePlan.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">{index + 1}</div>
                <div>{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Safety gates</h2>
          <div className="mt-4 space-y-3">
            {release.safetyGates.map((gate) => (
              <div key={gate.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-black text-slate-900">{gate.label}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${gateClass[gate.status]}`}>{gate.status}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500">Required for: {gate.requiredFor}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{gate.evidence}</p>
              </div>
            ))}
          </div>
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
