import { Activity, CheckCircle2, Database, GitBranch, LockKeyhole, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  getProductionTaskCrudHealth,
  getProductionTaskCrudPlan,
  getProductionTaskCrudRelease,
  getProductionTaskCrudWriteGate
} from "@/lib/enterprise/production-task-crud-write-gate";

const tone = {
  ready: "green",
  partial: "blue",
  guarded: "orange",
  blocked: "red",
  planned: "gray"
} as const;

export default function ProductionTaskCrudPage() {
  const release = getProductionTaskCrudRelease();
  const health = getProductionTaskCrudHealth();
  const writeGate = getProductionTaskCrudWriteGate();
  const plan = getProductionTaskCrudPlan();

  return (
    <>
      <PageHeader
        title="Production Task CRUD & Prisma Write-Gate"
        subtitle="v3.0 stabilizează Task CRUD pentru activare controlată Prisma/PostgreSQL, fără să activeze periculos scrieri production by default."
      >
        <Badge tone={health.ok ? "green" : "red"}>{health.ok ? "build safe" : "blocked"}</Badge>
        <Badge tone="orange">writes {writeGate.productionWritesEnabled ? "ON" : "OFF"}</Badge>
      </PageHeader>

      <section className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Task CRUD production readiness" subtitle={release.name} />
          <div className="p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-4xl font-black text-slate-950">{release.readiness}%</div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{release.summary}</p>
              </div>
              <Badge tone="blue">v{release.version}</Badge>
            </div>
            <ProgressBar value={release.readiness} tone="blue" className="mt-5" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Task Core" subtitle="readiness" />
          <div className="p-5">
            <Activity className="h-6 w-6 text-blue-600" />
            <div className="mt-4 text-3xl font-black text-slate-950">{release.taskCoreReadiness}%</div>
            <ProgressBar value={release.taskCoreReadiness} tone="blue" className="mt-4" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Prisma Write-Gate" subtitle={release.writeGateMode} />
          <div className="p-5">
            <LockKeyhole className="h-6 w-6 text-amber-600" />
            <div className="mt-4 text-3xl font-black text-slate-950">OFF</div>
            <p className="mt-2 text-sm text-slate-500">Safe default: production writes disabled.</p>
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="CRUD capabilities" subtitle="Create / update / archive readiness" />
          <div className="space-y-3 p-5">
            {release.capabilities.map((capability) => (
              <div key={capability.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{capability.label}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{capability.description}</p>
                  </div>
                  <Badge tone={tone[capability.status]}>{capability.status}</Badge>
                </div>
                <ProgressBar value={capability.readiness} tone={capability.readiness >= 70 ? "blue" : "orange"} className="mt-4" />
                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-500">
                  <span className="font-black text-slate-700">Route:</span> {capability.route}
                  <br />
                  <span className="font-black text-slate-700">Rule:</span> {capability.productionRule}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Write-gate safety checks" subtitle="Condiții înainte de Prisma active writes" />
          <div className="space-y-3 p-5">
            {release.safetyChecks.map((check, index) => (
              <div key={check} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-700 shadow-sm">
                  {index < 2 ? <ShieldCheck className="h-4 w-4" /> : index < 4 ? <Database className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </div>
                <div className="text-sm font-semibold leading-6 text-slate-700">{check}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Environment write-gate" subtitle="Nu activează DB writes fără flags explicite" />
          <div className="space-y-3 p-5">
            {writeGate.envFlags.map((flag) => (
              <div key={flag.key} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="font-black text-slate-950">{flag.key}</div>
                <div className="mt-1 text-sm text-slate-500">Required: {flag.requiredValue}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">Safe default: {flag.currentSafeDefault}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Roadmap v3.x" subtitle="Ce trebuie făcut ca taskurile să fie 100% production" />
          <div className="space-y-3 p-5">
            {plan.phases.map((phase) => (
              <div key={phase.phase} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-slate-400">{phase.phase}</div>
                    <div className="mt-1 font-black text-slate-950">{phase.title}</div>
                  </div>
                  <Badge tone={phase.status === "current" ? "green" : phase.status === "next" ? "blue" : "gray"}>{phase.status}</Badge>
                </div>
                <div className="mt-3 grid gap-2">
                  {phase.deliverables.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <GitBranch className="h-4 w-4 text-slate-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
