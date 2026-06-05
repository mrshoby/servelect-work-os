import { Database, FileJson, GitBranch, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

const seedStatus = [
  {
    title: "Seed manifest",
    status: "ready",
    progress: 78,
    description: "Planul de seed este definit pentru workspace, users, projects, tasks și audit baseline."
  },
  {
    title: "Repository adapter",
    status: "shadow-ready",
    progress: 58,
    description: "Adapterul este pregătit conceptual pentru mock-memory / prisma-shadow / prisma-active."
  },
  {
    title: "Prisma runtime",
    status: "mock-memory",
    progress: 48,
    description: "Runtime-ul real Prisma nu este încă activat pentru scrieri production."
  },
  {
    title: "DB write gate",
    status: "planned",
    progress: 35,
    description: "Scrierile reale în DB trebuie activate gradual prin feature flag și audit."
  }
] as const;

const statusTone: Record<string, "green" | "blue" | "orange" | "red" | "gray" | "purple"> = {
  ready: "green",
  "shadow-ready": "blue",
  "mock-memory": "gray",
  planned: "orange",
  blocked: "red"
};

export default function PrismaSeedExecutionPage() {
  return (
    <>
      <PageHeader
        title="Prisma Seed Execution"
        subtitle="Seed execution + repository adapter plan. Pagina este stabilizată pentru build v2.7.3."
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Seed readiness" subtitle="Workspace + WorkGraph baseline" />
          <div className="p-5">
            <div className="text-4xl font-black text-slate-950">58%</div>
            <ProgressBar value={58} tone="blue" className="mt-5" />
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Seed-ul și repository adapterul sunt pregătite la nivel de plan/runtime contract. DB writes reale rămân controlate pentru build-urile următoare.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Provider" subtitle="current mode" />
          <div className="p-5">
            <Database className="h-7 w-7 text-emerald-600" />
            <div className="mt-4 text-2xl font-black text-slate-950">mock-memory</div>
            <p className="mt-2 text-sm text-slate-500">Safe default pentru beta.</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Next mode" subtitle="controlled" />
          <div className="p-5">
            <GitBranch className="h-7 w-7 text-blue-600" />
            <div className="mt-4 text-2xl font-black text-slate-950">shadow</div>
            <p className="mt-2 text-sm text-slate-500">Comparare API/mock cu DB fără risc.</p>
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Seed execution stages" subtitle="Fără chei duplicate / status map instabil" />
          <div className="space-y-3 p-5">
            {seedStatus.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{item.title}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>
                  <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                </div>
                <ProgressBar value={item.progress} tone={item.progress >= 60 ? "blue" : "orange"} className="mt-4" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Repository adapter plan" subtitle="Ce urmează" />
          <div className="space-y-3 p-5">
            {[
              { icon: FileJson, text: "Finalizează seed manifest pentru entitățile WorkGraph." },
              { icon: ShieldCheck, text: "Adaugă audit event la fiecare seed/write operation." },
              { icon: Database, text: "Activează Prisma shadow read/check fără writes reale." },
              { icon: GitBranch, text: "Introdu feature flag pentru prisma-active pe mediu separat." }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-700 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-slate-400">Step {index + 1}</div>
                    <div className="mt-1 text-sm font-semibold leading-6 text-slate-700">{item.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </>
  );
}
