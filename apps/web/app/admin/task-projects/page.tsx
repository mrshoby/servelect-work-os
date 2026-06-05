import type { ReactNode } from "react";

import {
  getTaskProjectMigrationPlan,
  getTaskProjectPersistenceHealth,
  getTaskProjectPersistenceRelease,
  getTaskProjectSchemaPlan,
  type TaskProjectPersistencePriority,
  type TaskProjectPersistenceStatus
} from "@/lib/enterprise/task-project-persistence";

const statusTone: Record<TaskProjectPersistenceStatus, string> = {
  "production-ready": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "api-ready": "bg-blue-50 text-blue-700 border-blue-200",
  partial: "bg-violet-50 text-violet-700 border-violet-200",
  mock: "bg-amber-50 text-amber-700 border-amber-200",
  blocked: "bg-red-50 text-red-700 border-red-200"
};

const priorityTone: Record<TaskProjectPersistencePriority, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  low: "bg-slate-50 text-slate-600 border-slate-200"
};

export default function AdminTaskProjectPersistencePage() {
  const release = getTaskProjectPersistenceRelease();
  const health = getTaskProjectPersistenceHealth();
  const schema = getTaskProjectSchemaPlan();
  const migration = getTaskProjectMigrationPlan();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-sm lg:p-8">
        <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/10">
          SERVELECT WORK OS · {release.version}
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight lg:text-4xl">{release.name}</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">{release.objective}</p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Metric label="Readiness WorkGraph" value={`${release.globalReadiness}%`} />
          <Metric label="Capabilități" value={String(release.capabilities.length)} />
          <Metric label="Tabele țintă" value={String(schema.tables.length)} />
          <Metric label="Pași migrare" value={String(migration.plan.length)} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">Task & Project persistence capabilities</h2>
              <p className="mt-1 text-sm text-slate-500">Contractul de tranziție de la mock/localStorage la API + PostgreSQL/Prisma.</p>
            </div>
            <Badge className={health.ok ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
              {health.recommendation}
            </Badge>
          </div>

          <div className="space-y-3">
            {release.capabilities.map((item) => (
              <article key={item.key} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-slate-950">{item.label}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{item.domain}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={statusTone[item.status]}>{item.status}</Badge>
                    <Badge className={priorityTone[item.priority]}>{item.priority}</Badge>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="w-12 text-sm font-black text-slate-700">{item.readiness}%</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.readiness}%` }} />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <InfoBox title="Acum" text={item.currentState} />
                  <InfoBox title="Țintă" text={item.targetState} />
                  <InfoBox title="Următor" text={item.nextAction} />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <ListBox title="API contract" items={item.apiContract} />
                  <ListBox title="Persistență țintă" items={item.persistenceTarget} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <Panel title="Health checks">
            <div className="space-y-2">
              {health.envChecks.map((check) => (
                <div key={check.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-black text-slate-800">{check.key}</span>
                    <Badge className={check.present ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                      {check.present ? "present" : "missing"}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{check.purpose}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Repository methods">
            <div className="space-y-3">
              {release.repositoryMethods.map((method) => (
                <div key={method.method} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="font-mono text-xs font-black text-slate-900">{method.method}</div>
                  <div className="mt-1 text-xs font-bold text-slate-400">{method.owner}</div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{method.description}</p>
                  <Badge className={`mt-2 ${statusTone[method.status]}`}>{method.status}</Badge>
                </div>
              ))}
            </div>
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
        <h2 className="text-lg font-black text-slate-950">Schema target · WorkGraph tables</h2>
        <p className="mt-1 text-sm text-slate-500">Tabelele principale care vor transforma aplicația din mock/localStorage în sistem Work OS persistent.</p>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Tabel</th>
                <th className="px-4 py-3">Modul</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Readiness</th>
                <th className="px-4 py-3">Indexuri</th>
                <th className="px-4 py-3">Audit events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schema.tables.map((table) => (
                <tr key={table.table} className="hover:bg-emerald-50/30">
                  <td className="px-4 py-4 font-mono text-xs font-black text-slate-900">{table.table}</td>
                  <td className="px-4 py-4 font-semibold text-slate-600">{table.ownerModule}</td>
                  <td className="px-4 py-4"><Badge className={statusTone[table.status]}>{table.status}</Badge></td>
                  <td className="px-4 py-4 font-black text-slate-700">{table.readiness}%</td>
                  <td className="min-w-[220px] px-4 py-4 text-xs text-slate-500">{table.indexes.join(", ")}</td>
                  <td className="min-w-[240px] px-4 py-4 text-xs text-slate-500">{table.auditEvents.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Migration plan</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {migration.plan.map((step) => (
            <div key={step.order} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-slate-400">Pas {step.order}</div>
              <div className="mt-2 text-sm font-bold leading-6 text-slate-700">{step.step}</div>
              <div className="mt-3 text-xs text-slate-500">Rollback: {step.rollback}</div>
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

function Badge({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-black ${className}`}>{children}</span>;
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-black text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function InfoBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-xs font-black uppercase tracking-wide text-slate-400">{title}</div>
      <div className="mt-1 text-sm leading-5 text-slate-600">{text}</div>
    </div>
  );
}

function ListBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <div className="text-xs font-black uppercase tracking-wide text-slate-400">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">{item}</span>)}
      </div>
    </div>
  );
}
