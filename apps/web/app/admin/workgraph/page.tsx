import { getWorkGraphHealth, getWorkGraphMigrationPlan, getWorkGraphPersistenceRelease, type WorkGraphReadinessStatus } from "@/lib/enterprise/workgraph-persistence";

const statusTone: Record<WorkGraphReadinessStatus, string> = {
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "db-ready": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "api-ready": "bg-blue-50 text-blue-700 border-blue-200",
  partial: "bg-violet-50 text-violet-700 border-violet-200",
  mock: "bg-amber-50 text-amber-700 border-amber-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  planned: "bg-slate-50 text-slate-700 border-slate-200",
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  "shadow-ready": "bg-cyan-50 text-cyan-700 border-cyan-200"
};

const priorityTone = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  low: "bg-slate-50 text-slate-600 border-slate-200"
} as const;

export default function AdminWorkGraphPage() {
  const release = getWorkGraphPersistenceRelease();
  const health = getWorkGraphHealth();
  const plan = getWorkGraphMigrationPlan();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-sm lg:p-8">
        <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/10">
          SERVELECT WORK OS · {release.version}
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight lg:text-4xl">{release.name}</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">{release.objective}</p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Metric label="Readiness global" value={`${release.globalReadiness}%`} />
          <Metric label="Tabele WorkGraph" value={String(health.counters.totalTables)} />
          <Metric label="ready" value={String(health.counters.dbReady)} />
          <Metric label="Mock rămase" value={String(health.counters.mock)} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-950">WorkGraph persistence matrix</h2>
              <p className="mt-1 text-sm text-slate-500">Harta entităților care trebuie mutate din mock/localStorage în Prisma/PostgreSQL.</p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              {health.recommendation}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Entitate</th>
                  <th className="px-4 py-3">Tabel țintă</th>
                  <th className="px-4 py-3">Sursă curentă</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Readiness</th>
                  <th className="px-4 py-3">Prioritate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {release.tables.map((table) => (
                  <tr key={table.entity} className="hover:bg-emerald-50/30">
                    <td className="px-4 py-4">
                      <div className="font-black text-slate-950">{table.label}</div>
                      <div className="mt-1 text-xs text-slate-500">{table.ownerModule}</div>
                    </td>
                    <td className="min-w-[220px] px-4 py-4 font-mono text-xs text-slate-600">{table.targetTable}</td>
                    <td className="px-4 py-4 text-slate-600">{table.currentSource}</td>
                    <td className="px-4 py-4"><Badge className={statusTone[table.status]}>{table.status}</Badge></td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-[150px] items-center gap-3">
                        <span className="w-10 text-xs font-black text-slate-700">{table.readiness}%</span>
                        <div className="h-2 flex-1 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${table.readiness}%` }} /></div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><Badge className={priorityTone[table.priority]}>{table.priority}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <Panel title="Blockers">
            <ul className="space-y-2 text-sm text-slate-600">
              {release.blockers.map((blocker) => <li key={blocker} className="rounded-2xl bg-slate-50 p-3">{blocker}</li>)}
            </ul>
          </Panel>

          <Panel title={`Next build · ${release.nextBuild.version}`}>
            <div className="font-black text-slate-950">{release.nextBuild.name}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {release.nextBuild.focus.map((item) => <li key={item} className="rounded-2xl border border-slate-200 p-3">{item}</li>)}
            </ul>
          </Panel>
        </aside>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Plan de migrare</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {plan.phases.map((phase) => (
            <div key={phase.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-black text-slate-950">{phase.title}</div>
              <div className="mt-3 text-xs font-black uppercase tracking-wide text-slate-400">Entități</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {phase.entities.map((entity) => <span key={entity.entity} className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">{entity.entity}</span>)}
              </div>
              <div className="mt-4 text-xs font-black uppercase tracking-wide text-slate-400">Exit criteria</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {phase.exitCriteria.map((criteria) => <li key={criteria}>• {criteria}</li>)}
              </ul>
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
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-semibold text-slate-300">{label}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-black text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-black ${className}`}>{children}</span>;
}





