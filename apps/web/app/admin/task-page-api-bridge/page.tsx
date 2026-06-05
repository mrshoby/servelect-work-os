import { Activity, CheckCircle2, Database, GitBranch, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getTaskPageApiBridgeHealth, getTaskPageApiBridgeRelease } from "@/lib/enterprise/task-page-api-bridge";

const tone = {
  ready: "green",
  partial: "blue",
  planned: "orange",
  blocked: "red"
} as const;

export default function TaskPageApiBridgeAdminPage() {
  const release = getTaskPageApiBridgeRelease();
  const health = getTaskPageApiBridgeHealth();

  return (
    <>
      <PageHeader
        title="Task Page API Bridge Activation"
        subtitle="v2.8 activează vizibil bridge-ul API în pagina Taskuri, cu fallback local și fără schimbare vizuală majoră."
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Task page API bridge" subtitle={release.taskPageMode} />
          <div className="p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-4xl font-black text-slate-950">{release.readiness}%</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{release.summary}</p>
              </div>
              <Badge tone={health.ok ? "green" : "red"}>{health.ok ? "healthy" : "needs work"}</Badge>
            </div>
            <ProgressBar value={release.readiness} tone="blue" className="mt-5" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Task core" subtitle="completion" />
          <div className="p-5">
            <Activity className="h-6 w-6 text-blue-600" />
            <div className="mt-4 text-3xl font-black text-slate-950">{release.productCompletion.overallCompletion}%</div>
            <ProgressBar value={release.productCompletion.overallCompletion} tone="blue" className="mt-4" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Production DB" subtitle="writes" />
          <div className="p-5">
            <Database className="h-6 w-6 text-amber-600" />
            <div className="mt-4 text-2xl font-black text-slate-950">OFF</div>
            <p className="mt-2 text-sm text-slate-500">DB writes reale rămân pentru v2.9+.</p>
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Capabilities" subtitle="Ce este activat în v2.8" />
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
                <ProgressBar value={capability.readiness} tone={capability.readiness > 70 ? "green" : "blue"} className="mt-4" />
                <div className="mt-3 text-xs font-black uppercase tracking-wide text-slate-400">{capability.route}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Before full production" subtitle="Ce mai lipsește" />
          <div className="space-y-3 p-5">
            {health.requiredBeforeProduction.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-700 shadow-sm">
                  {index < 2 ? <ShieldAlert className="h-4 w-4" /> : index < 4 ? <GitBranch className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </div>
                <div className="text-sm font-semibold leading-6 text-slate-700">{item}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}


