import { Activity, CheckCircle2, Database, GitBranch, ListChecks, RefreshCcw, ServerCog, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getTaskCrudHealth, getTaskCrudRelease, getTaskCrudSchema, listApiProjects, listApiTasks } from "@/lib/api-backed/task-project-api-store";

const toneByStatus = {
  ready: "green",
  planned: "blue",
  blocked: "red",
  active: "purple"
} as const;

export default function TaskCrudAdminPage() {
  const release = getTaskCrudRelease();
  const health = getTaskCrudHealth();
  const schema = getTaskCrudSchema();
  const tasks = listApiTasks().slice(0, 8);
  const projects = listApiProjects().slice(0, 5);

  return (
    <>
      <PageHeader
        title="Task & Project CRUD"
        subtitle="v1.7.0 — API-backed Store pentru nucleul Work OS: taskuri, proiecte, update, delete, reset și contract API."
      >
        <a href="/api/v1/tasks" className="btn-secondary">Tasks API</a>
        <a href="/api/v1/projects" className="btn-secondary">Projects API</a>
        <a href="/api/v1/enterprise/task-crud-health" className="btn-primary">Health</a>
      </PageHeader>

      <section className="mb-5 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/10">
              <Database className="h-3.5 w-3.5" /> API-backed Store · {release.version}
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight">Real Task CRUD pentru WorkGraph.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              v1.7 introduce endpoint-uri CRUD reale pentru taskuri și proiecte. Providerul actual este mock-memory, dar interfața API este pregătită pentru PostgreSQL/Prisma.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <Metric label="Taskuri" value={String(release.summary.tasks)} />
              <Metric label="Open tasks" value={String(release.summary.openTasks)} />
              <Metric label="Proiecte" value={String(release.summary.projects)} />
              <Metric label="Readiness" value={`${release.summary.persistenceReadiness}%`} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Health" subtitle="Status API + următorii pași" />
          <div className="space-y-3 p-5">
            {health.checks.map((check) => (
              <div key={check.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{check.label}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{check.details}</p>
                  </div>
                  <Badge tone={toneByStatus[check.status]}>{check.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="API contract" subtitle="Endpoint-uri active pentru taskuri și proiecte" />
          <div className="grid gap-3 p-5 md:grid-cols-2">
            {Object.entries(schema.apiContract).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-950">
                  <ServerCog className="h-4 w-4 text-emerald-600" /> {key}
                </div>
                <code className="break-words rounded-xl bg-slate-950 px-2 py-1 text-xs font-bold text-emerald-200">{value}</code>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Readiness" subtitle="Persistență Work OS" />
          <div className="space-y-4 p-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-black text-emerald-950">API-backed readiness</span>
                <span className="font-black text-emerald-700">{release.summary.persistenceReadiness}%</span>
              </div>
              <ProgressBar value={release.summary.persistenceReadiness} tone="green" />
            </div>
            <Info icon={CheckCircle2} title="Create/update/delete" body="Taskurile și proiectele au rute CRUD fără dynamic route params fragile." />
            <Info icon={RefreshCcw} title="Reset demo store" body="POST /api/v1/tasks cu action=reset reîncarcă mock data în providerul memory." />
            <Info icon={ShieldCheck} title="DB transition safe" body="Contractul API rămâne stabil când providerul trece pe Prisma/PostgreSQL." />
          </div>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Taskuri prin API store" subtitle="Primele taskuri din providerul API-backed" />
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <div key={task.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{task.title}</div>
                    <p className="mt-1 text-xs text-slate-500">{task.projectCode} · {task.assigneeName} · {task.dueDate}</p>
                  </div>
                  <Badge tone={task.status === "Finalizat" ? "green" : task.status === "Blocat" ? "red" : "blue"}>{task.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Proiecte prin API store" subtitle="Primele proiecte din providerul API-backed" />
          <div className="divide-y divide-slate-100">
            {projects.map((project) => (
              <div key={project.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{project.name}</div>
                    <p className="mt-1 text-xs text-slate-500">{project.code} · {project.clientName} · {project.location}</p>
                  </div>
                  <Badge tone={project.health === "Bun" ? "green" : project.health === "Critic" ? "red" : "orange"}>{project.health}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="min-w-12 text-xs font-black text-slate-600">{project.progress}%</span>
                  <ProgressBar value={project.progress} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="mt-4">
        <CardHeader title="Schema target" subtitle="Tabele care vor fi migrate către Prisma/PostgreSQL" />
        <div className="grid gap-3 p-5 lg:grid-cols-5">
          {schema.tables.map((table) => (
            <div key={table.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-950">
                <GitBranch className="h-4 w-4 text-emerald-600" /> {table.name}
              </div>
              <Badge tone={table.status === "api-ready" ? "green" : "blue"}>{table.status}</Badge>
              <div className="mt-3 text-xs font-semibold text-slate-500">PK: {table.primaryKey}</div>
              <ul className="mt-2 space-y-1 text-xs text-slate-500">
                {table.requiredFields.slice(0, 4).map((field) => <li key={field}>• {field}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </>
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

function Info({ icon: Icon, title, body }: { icon: typeof Activity; title: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-black text-slate-950">{title}</div>
        <p className="mt-1 text-xs leading-5 text-slate-500">{body}</p>
      </div>
    </div>
  );
}
