import { Database, ServerCog, ShieldCheck, Table2, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getDatabaseActivationRelease, getDatabaseHealth, getDatabaseSchemaManifest } from "@/lib/enterprise/database-activation";

const statusTone = {
  ready: "green",
  partial: "blue",
  mock: "orange",
  blocked: "red"
} as const;

export default function AdminDatabasePage() {
  const release = getDatabaseActivationRelease();
  const health = getDatabaseHealth();
  const schema = getDatabaseSchemaManifest();

  return (
    <>
      <PageHeader
        title="Database Activation"
        subtitle="v1.3.0 — fundația pentru PostgreSQL, Prisma, seed, audit persistent și migrarea din mock/localStorage către date reale."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone={release.productionDatabaseEnabled ? "green" : "orange"}>
            {release.productionDatabaseEnabled ? "PostgreSQL activ" : "Mock-safe mode"}
          </Badge>
          <Badge tone="blue">Readiness {release.overallReadiness}%</Badge>
          <Badge tone="purple">Next: {release.nextMilestone}</Badge>
        </div>
      </PageHeader>

      <section className="mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-card">
        <div className="grid gap-0 xl:grid-cols-[1fr_380px]">
          <div className="p-6 lg:p-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/10">
              <Database className="h-3.5 w-3.5" />
              {release.name}
            </div>

            <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight lg:text-4xl">
              Activăm treptat baza de date reală fără să stricăm interfața Work OS.
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              v1.3 definește layer-ele și entitățile care trebuie migrate în PostgreSQL/Prisma. UI-ul rămâne același,
              dar aplicația devine pregătită pentru taskuri, proiecte, useri, audit și workflow-uri persistente.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <HeroMetric label="Readiness DB" value={`${release.overallReadiness}%`} />
              <HeroMetric label="Entități mapate" value={String(release.entities.length)} />
              <HeroMetric label="API routes" value={String(release.apiRoutes.length)} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/5 p-6 xl:border-l xl:border-t-0">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-black">Provider curent</span>
              <Badge tone={health.ok ? "green" : "orange"}>{health.provider}</Badge>
            </div>
            <ProgressBar value={release.overallReadiness} tone={release.overallReadiness > 75 ? "green" : "orange"} />
            <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-200 ring-1 ring-white/10">
              {health.warning}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader title="Data layers" subtitle="Ce componente trebuie stabilizate înainte de persistare reală." />
          <div className="space-y-3 p-5 pt-0">
            {release.layers.map((layer) => (
              <div key={layer.key} className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ServerCog className="h-4 w-4 text-emerald-600" />
                      <h3 className="font-black text-slate-950">{layer.label}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{layer.purpose}</p>
                  </div>
                  <Badge tone={statusTone[layer.status]}>{layer.status}</Badge>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="min-w-14 text-sm font-black text-slate-700">{layer.readiness}%</div>
                  <div className="flex-1"><ProgressBar value={layer.readiness} /></div>
                </div>
                <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs font-semibold text-slate-600">
                  Următorul pas: {layer.nextAction}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Environment readiness" subtitle="Variabile necesare pentru DB real." />
            <div className="space-y-2 p-5 pt-0">
              {health.checks.map((check) => (
                <div key={check.key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-black text-slate-800">{check.key}</span>
                  <Badge tone={check.present ? "green" : "red"}>{check.value}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Schema draft" subtitle="Tabele candidate pentru Prisma/PostgreSQL." />
            <div className="max-h-[420px] space-y-2 overflow-auto p-5 pt-0">
              {schema.tables.map((table) => (
                <div key={table.table} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-slate-900">{table.table}</div>
                    <div className="truncate text-xs font-semibold text-slate-500">{table.label} · {table.module}</div>
                  </div>
                  <Badge tone={table.migrationStatus === "ready" ? "green" : table.migrationStatus === "draft" ? "blue" : "orange"}>
                    {table.migrationStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-5">
        <CardHeader title="Entity migration backlog" subtitle="Ordinea în care modulele trebuie mutate din mock/localStorage în DB real." />
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Entitate</th>
                <th className="px-5 py-3">Modul</th>
                <th className="px-5 py-3">Sursă curentă</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Prioritate</th>
                <th className="px-5 py-3">Readiness</th>
                <th className="px-5 py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {release.entities.map((entity) => (
                <tr key={entity.key} className="hover:bg-emerald-50/40">
                  <td className="px-5 py-4 font-black text-slate-950">{entity.label}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{entity.module}</td>
                  <td className="px-5 py-4"><Badge tone="blue">{entity.source}</Badge></td>
                  <td className="px-5 py-4"><Badge tone={statusTone[entity.status]}>{entity.status}</Badge></td>
                  <td className="px-5 py-4"><Badge tone={entity.priority === "critical" ? "red" : entity.priority === "high" ? "orange" : "purple"}>{entity.priority}</Badge></td>
                  <td className="min-w-[150px] px-5 py-4"><ProgressBar value={entity.readiness} /></td>
                  <td className="max-w-xl px-5 py-4 text-slate-500">{entity.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Next build plan" subtitle="v1.4 trebuie să transforme fundația v1.3 în persistare reală." />
        <div className="grid gap-4 p-5 pt-0 md:grid-cols-3">
          <NextCard icon={<Table2 className="h-5 w-5" />} title="Task & Project persistence" text="Mută taskurile și proiectele din mock/localStorage în repository DB real." />
          <NextCard icon={<Workflow className="h-5 w-5" />} title="Workflow executions" text="Persistă execuțiile workflow și leagă-le de audit events." />
          <NextCard icon={<ShieldCheck className="h-5 w-5" />} title="Audit & RBAC" text="Leagă acțiunile sensibile de audit log și permisiuni reale." />
        </div>
      </Card>
    </>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-semibold text-slate-300">{label}</div>
    </div>
  );
}

function NextCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-700">{icon}</div>
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}





