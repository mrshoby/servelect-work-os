import { AlertTriangle, CheckCircle2, Database, GitBranch, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getPrismaSeedExecutionRelease } from "@/lib/enterprise/prisma-seed-execution";

const stepTone = {
  planned: "orange",
  ready: "green",
  shadow: "blue",
  blocked: "red",
  "mock-memory": "gray",
  "shadow-ready": "blue",
  "db-ready": "green"
} as const;

export default function PrismaSeedExecutionPage() {
  const release = getPrismaSeedExecutionRelease();

  return (
    <>
      <PageHeader
        title="Prisma Seed Execution & Repository Adapter"
        subtitle="v2.4 pregătește seed idempotent, provider switch și repository adapter fără a activa încă scrieri reale în DB."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <Metric icon={Database} label="Seed readiness" value={`${release.seedReadinessPercent}%`} tone="orange" />
        <Metric icon={GitBranch} label="Adapter readiness" value={`${release.repositoryAdapterPercent}%`} tone="blue" />
        <Metric icon={PlayCircle} label="DB seed enabled" value={release.dbSeedEnabled ? "ON" : "OFF"} tone="red" />
        <Metric icon={AlertTriangle} label="DB write enabled" value={release.dbWriteEnabled ? "ON" : "OFF"} tone="red" />
      </section>

      <Card className="mt-5">
        <CardHeader title="Release warning" subtitle={release.warning} />
        <div className="p-5 text-sm leading-6 text-slate-600">
          Provider actual: <b>{release.providerMode}</b>. Următorul build: <b>v{release.nextBuild.version} — {release.nextBuild.title}</b>.
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Seed execution steps" subtitle="Pașii care trebuie rulați controlat când DATABASE_URL și migrările sunt confirmate." />
        <div className="grid gap-4 p-5 xl:grid-cols-2">
          {release.seedSteps.map((step) => (
            <div key={step.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">Step {step.order}</div>
                  <h3 className="mt-1 font-black text-slate-950">{step.label}</h3>
                </div>
                <Badge tone={stepTone[step.status]}>{step.status}</Badge>
              </div>
              <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-3 text-xs font-semibold text-emerald-200">{step.command}</pre>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.output}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Repository adapter stages" subtitle="Unde suntem cu trecerea reală de la mock-memory la Prisma adapter." />
        <div className="space-y-3 p-5">
          {release.repositoryAdapterStages.map((stage) => (
            <div key={stage.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="font-black text-slate-950">{stage.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{stage.summary}</p>
                  <p className="mt-2 text-sm font-bold text-emerald-700">Next: {stage.nextAction}</p>
                </div>
                <Badge tone={stepTone[stage.status]}>{stage.status}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="min-w-14 text-sm font-black text-slate-700">{stage.percent}%</div>
                <ProgressBar value={stage.percent} tone={stage.percent >= 60 ? "green" : stage.percent >= 40 ? "blue" : "orange"} />
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
