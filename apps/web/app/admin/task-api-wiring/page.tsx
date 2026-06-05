import { Activity, CheckCircle2, Database, GitBranch, ServerCog } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

const completion = {
  version: "2.7.3",
  overallCompletion: 80,
  areas: [
    { id: "website", label: "Website / Web App", completion: 80, tone: "green" },
    { id: "task-project", label: "Task & Project Core", completion: 68, tone: "blue" },
    { id: "backend-api", label: "Backend / API", completion: 62, tone: "blue" },
    { id: "database", label: "Database / Prisma / Seed", completion: 55, tone: "orange" },
    { id: "auth-rbac", label: "Auth / RBAC", completion: 42, tone: "orange" },
    { id: "iot-ops", label: "IoT / Operations", completion: 36, tone: "red" },
    { id: "mobile", label: "Mobile App", completion: 23, tone: "red" }
  ] as const
};

const bridgeItems = [
  {
    title: "Task API Client",
    description: "Client TypeScript pregătit pentru /api/v1/tasks și /api/v1/projects.",
    status: "ready"
  },
  {
    title: "UI Store Bridge",
    description: "Punte între Zustand/localStorage și API-backed store, cu fallback local.",
    status: "partial"
  },
  {
    title: "Task Board API Contract",
    description: "Contract pentru board state, status changes, drawer hydration și optimistic updates.",
    status: "partial"
  },
  {
    title: "Production DB Writes",
    description: "Încă nu este activ complet. Necesită repository adapter + Prisma write-gate.",
    status: "planned"
  }
] as const;

const toneByStatus = {
  ready: "green",
  partial: "blue",
  planned: "orange",
  blocked: "red"
} as const;

export default function TaskApiWiringPage() {
  return (
    <>
      <PageHeader
        title="Task API Wiring"
        subtitle="Stabilizare v2.7.3: pregătire UI taskuri pentru API-backed mode fără să schimbăm interfața vizuală principală."
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Product completion" subtitle="Status general website + aplicație" />
          <div className="p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-4xl font-black text-slate-950">{completion.overallCompletion}%</div>
                <p className="mt-2 text-sm text-slate-500">
                  Enterprise beta avansată. Taskurile sunt în migrare spre API-backed mode, dar nu sunt încă 100% production DB-backed.
                </p>
              </div>
              <Badge tone="blue">v{completion.version}</Badge>
            </div>
            <ProgressBar value={completion.overallCompletion} tone="blue" className="mt-5" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Task Core" subtitle="Readiness" />
          <div className="p-5">
            <div className="text-3xl font-black text-slate-950">68%</div>
            <ProgressBar value={68} tone="blue" className="mt-4" />
            <p className="mt-3 text-sm text-slate-500">UI + board + drawer pregătite pentru API-backed mode.</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="API / Backend" subtitle="Readiness" />
          <div className="p-5">
            <div className="text-3xl font-black text-slate-950">62%</div>
            <ProgressBar value={62} tone="blue" className="mt-4" />
            <p className="mt-3 text-sm text-slate-500">Contracte API disponibile, providerul real DB nu este încă fully active.</p>
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="API-backed bridge components" subtitle="Ce există în v2.7.x" />
          <div className="space-y-3 p-5">
            {bridgeItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{item.title}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>
                  <Badge tone={toneByStatus[item.status]}>{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Next implementation steps" subtitle="Ce trebuie făcut pentru taskuri full funcționale" />
          <div className="space-y-3 p-5">
            {[
              "Leagă pagina /taskuri la useTaskApiBridge pentru load/refresh real.",
              "Activează create/update/delete task prin API, cu fallback local.",
              "Adaugă optimistic update + rollback pentru schimbare status.",
              "Persistă subtaskuri, comments, attachments și time entries.",
              "Adaugă audit event la fiecare mutație task/project.",
              "Activează DB-backed mode controlat prin feature flag."
            ].map((step, index) => (
              <div key={step} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">
                  {index + 1}
                </div>
                <div className="text-sm font-semibold leading-6 text-slate-700">{step}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-4">
        {[
          { icon: ServerCog, label: "API client", value: "ready" },
          { icon: GitBranch, label: "Feature flags", value: "ready" },
          { icon: Activity, label: "Board state", value: "partial" },
          { icon: Database, label: "DB writes", value: "planned" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <div className="p-5">
                <Icon className="h-6 w-6 text-emerald-600" />
                <div className="mt-4 text-sm font-black text-slate-950">{item.label}</div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{item.value}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </section>
    </>
  );
}
