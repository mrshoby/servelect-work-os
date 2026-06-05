import { AlertTriangle, Database, GitBranch, ShieldCheck, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getTaskMutationRelease } from "@/lib/enterprise/task-mutations";

const statusTone = {
  ready: "green",
  shadow: "blue",
  gated: "orange",
  blocked: "red",
  planned: "gray",
  low: "green",
  medium: "orange",
  high: "red",
  "mock-memory": "gray",
  "prisma-shadow": "blue",
  "prisma-write-gated": "orange",
  "prisma-active": "green"
} as const;

export default function TaskMutationsPage() {
  const release = getTaskMutationRelease();

  return (
    <>
      <PageHeader
        title="DB-backed Task Mutations"
        subtitle="v2.5 pregătește create/update/delete/status-change prin repository adapter, audit și shadow/write-gated rollout."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <Metric icon={Workflow} label="Mutation readiness" value={`${release.mutationReadinessPercent}%`} tone="blue" />
        <Metric icon={GitBranch} label="Shadow ready" value={String(release.shadowReadyCount)} tone="green" />
        <Metric icon={AlertTriangle} label="Blocked capabilities" value={String(release.blockedCount)} tone="red" />
        <Metric icon={Database} label="DB writes" value={release.dbWritesEnabled ? "ON" : "OFF"} tone="orange" />
      </section>

      <Card className="mt-5">
        <CardHeader title="Verdict sincer" subtitle={release.honestStatus} />
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 font-black text-amber-900">
              <AlertTriangle className="h-5 w-5" />
              Nu este încă full production DB active
            </div>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Acest build face contractul de mutații și calea de rollout. Scrierile reale în PostgreSQL rămân dezactivate implicit până când DB, seed, RBAC și rollback sunt validate.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 font-black text-emerald-900">
              <ShieldCheck className="h-5 w-5" />
              Ce este pregătit acum
            </div>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              Create/update/status-change pot fi mutate controlat prin API/repository adapter în shadow/gated mode, cu validare și audit planificate explicit.
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Task mutation capabilities" subtitle="Stadiul fiecărei operații critice din modulul de taskuri." />
        <div className="grid gap-4 p-5 xl:grid-cols-2">
          {release.capabilities.map((item) => (
            <div key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-black text-slate-950">{item.label}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">Operation: {item.operation}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                  <Badge tone={statusTone[item.mode]}>{item.mode}</Badge>
                  <Badge tone={statusTone[item.risk]}>risk {item.risk}</Badge>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="min-w-14 text-sm font-black text-slate-700">{item.readiness}%</div>
                <ProgressBar value={item.readiness} tone={item.readiness >= 60 ? "green" : item.readiness >= 40 ? "blue" : "orange"} />
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Făcut</div>
                  <ul className="mt-2 space-y-1 text-sm text-emerald-900">
                    {item.done.map((done) => <li key={done}>• {done}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">Lipsește</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {item.missing.map((missing) => <li key={missing}>• {missing}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Validation & audit contract" subtitle="Ce trebuie verificat înainte de orice mutație DB-backed production." />
        <div className="grid gap-4 p-5 xl:grid-cols-2">
          {release.validationRules.map((rule) => (
            <div key={rule.id} className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-950">{rule.label}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{rule.appliesTo}</p>
                </div>
                <Badge tone={rule.severity === "required" ? "red" : rule.severity === "warning" ? "orange" : "blue"}>{rule.severity}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{rule.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Sample audit events" subtitle="Modelul de audit care trebuie persistat când activăm Prisma active mode." />
        <div className="divide-y divide-slate-100">
          {release.sampleAudit.map((event) => (
            <div key={event.id} className="grid gap-3 p-5 lg:grid-cols-[220px_1fr_180px]">
              <div>
                <div className="font-black text-slate-950">{event.action}</div>
                <div className="mt-1 text-sm text-slate-500">{event.actor}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">{event.target}</div>
                <p className="mt-1 text-sm leading-6 text-slate-500">{event.message}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                <Badge tone={statusTone[event.provider]}>{event.provider}</Badge>
                <Badge tone={event.status === "blocked" ? "red" : event.status === "accepted" ? "green" : "blue"}>{event.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Database; label: string; value: string; tone: "green" | "blue" | "orange" | "red" }) {
  const numeric = Number(value.replace("%", ""));
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {!Number.isNaN(numeric) && <ProgressBar value={numeric} tone={tone} className="mt-4" />}
    </Card>
  );
}
