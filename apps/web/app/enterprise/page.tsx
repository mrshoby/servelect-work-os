import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getEnterpriseReleaseManifest } from "@/lib/enterprise/v11";

const toneByStatus = {
  ready: "green",
  partial: "orange",
  planned: "blue",
  risk: "red"
} as const;

export default function EnterprisePage() {
  const manifest = getEnterpriseReleaseManifest();

  return (
    <>
      <PageHeader
        title="Enterprise Work OS v1.1"
        subtitle="Build major: stabilitate, audit complet site-wide, release board și direcție clară pentru activarea bazei de date reale."
      >
        <a href="/admin/performance" className="btn-secondary">Performance audit</a>
        <a href="/api/v1/enterprise/release" className="btn-primary">Release API</a>
      </PageHeader>

      <section className="mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-card">
        <div className="grid gap-0 xl:grid-cols-[1fr_380px]">
          <div className="p-6 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/10">
              <Sparkles className="h-4 w-4" /> SERVELECT WORK OS · Enterprise baseline
            </div>
            <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight lg:text-5xl">
              v1.1 trece de la patch-uri mici la release-uri majore, documentate și verificabile.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              Platforma rămâne task-first: proiecte, taskuri, IoT, CRM, echipamente, mentenanță, finanțări și HR sunt tratate ca operațiuni legate de acțiuni, responsabili, SLA și audit.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <HeroStat label="Readiness mediu" value={`${manifest.summary.avgCapabilityScore}%`} />
              <HeroStat label="Rute auditate" value="27" />
              <HeroStat label="Taskuri" value={String(manifest.summary.totalTasks)} />
              <HeroStat label="Alerte + tickete" value={String(manifest.summary.openAlerts + manifest.summary.openTickets)} />
            </div>
          </div>
          <div className="border-t border-white/10 bg-white/5 p-6 xl:border-l xl:border-t-0">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="font-black">Release confidence</span>
              <span className="font-black text-emerald-200">{manifest.summary.avgCapabilityScore}%</span>
            </div>
            <ProgressBar value={manifest.summary.avgCapabilityScore} tone="green" />
            <div className="mt-5 space-y-3">
              {manifest.qualityGates.slice(0, 4).map((gate) => (
                <div key={gate.id} className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                  <div className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> {gate.name}</div>
                  <div className="mt-1 text-xs text-slate-300">{gate.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
        <Card>
          <CardHeader title="Capability map" subtitle="Ce este gata, ce este parțial și ce intră în următoarele build-uri majore." />
          <div className="grid gap-3 p-5 lg:grid-cols-2">
            {manifest.capabilities.map((capability) => (
              <div key={capability.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-slate-400">{capability.area}</div>
                    <h3 className="mt-1 text-base font-black text-slate-950">{capability.name}</h3>
                  </div>
                  <Badge tone={toneByStatus[capability.status]}>{capability.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{capability.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500"><span>Scor</span><span>{capability.score}%</span></div>
                <ProgressBar value={capability.score} tone={capability.status === "ready" ? "green" : capability.status === "risk" ? "red" : "orange"} className="mt-2" />
                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
                  <b>Next:</b> {capability.nextStep}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="v1.x roadmap" subtitle="Build-uri majore, nu micro patch-uri." />
            <div className="space-y-3 p-5">
              {manifest.roadmap.map((item) => (
                <div key={item.version} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-black text-slate-950">v{item.version} · {item.title}</div>
                    <Badge tone={item.status === "current" ? "green" : item.status === "next" ? "blue" : "gray"}>{item.status}</Badge>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {item.goals.map((goal) => <li key={goal} className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {goal}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Enterprise counters" subtitle="Snapshot operațional din mock data." />
            <div className="grid grid-cols-2 gap-3 p-5">
              <SmallMetric icon={Layers3} label="Proiecte active" value={String(manifest.summary.activeProjects)} />
              <SmallMetric icon={Zap} label="Alerte deschise" value={String(manifest.summary.openAlerts)} />
              <SmallMetric icon={ShieldCheck} label="Aprobări" value={String(manifest.summary.pendingApprovals)} />
              <SmallMetric icon={CheckCircle2} label="Utilizatori" value={String(manifest.summary.users)} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><div className="text-2xl font-black">{value}</div><div className="text-xs font-semibold text-slate-300">{label}</div></div>;
}

function SmallMetric({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><Icon className="h-5 w-5 text-emerald-600" /><div className="mt-3 text-2xl font-black text-slate-950">{value}</div><div className="text-xs font-bold text-slate-500">{label}</div></div>;
}
