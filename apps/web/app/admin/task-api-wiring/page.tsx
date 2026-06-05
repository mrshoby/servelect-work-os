import { Cable, CheckCircle2, GitBranch, Layers3, RefreshCcw, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getTaskApiWiringStatus } from "@/lib/enterprise/task-api-wiring";
import { getProductCompletion } from "@/lib/enterprise/release-dashboard";

const toneByStatus = {
  ready: "green",
  partial: "blue",
  blocked: "red"
} as const;

export default function TaskApiWiringPage() {
  const status = getTaskApiWiringStatus();
  const completion = getProductCompletion();

  return (
    <>
      <PageHeader
        title="Task API Wiring"
        subtitle="v2.6.0 conectează controlat UI-ul de taskuri la API-backed store, păstrând aceeași interfață vizuală."
      >
        <Badge tone="blue">{status.version}</Badge>
      </PageHeader>

      <section className="grid gap-4 xl:grid-cols-4">
        <Card className="xl:col-span-2">
          <CardHeader title="Stadiu task core" subtitle="Progres real pentru modulul de taskuri/proiecte." />
          <div className="p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-4xl font-black text-slate-950">{status.completion}%</div>
                <p className="mt-2 text-sm font-semibold text-slate-500">Task & Project Core readiness</p>
              </div>
              <Cable className="h-14 w-14 text-emerald-600" />
            </div>
            <div className="mt-5"><ProgressBar value={status.completion} tone="green" /></div>
            <p className="mt-4 text-sm leading-6 text-slate-600">Mod curent: <b>{status.defaultMode}</b>. {status.visualChange}</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Website" subtitle="Beta readiness" />
          <div className="p-5">
            <div className="text-3xl font-black text-slate-950">{completion.website}%</div>
            <ProgressBar value={completion.website} tone="blue" className="mt-4" />
            <p className="mt-3 text-sm text-slate-500">Website-ul este în beta enterprise avansată.</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Mobile" subtitle="App readiness" />
          <div className="p-5">
            <div className="text-3xl font-black text-slate-950">{completion.mobile}%</div>
            <ProgressBar value={completion.mobile} tone="orange" className="mt-4" />
            <p className="mt-3 text-sm text-slate-500">Mobile rămâne schelet Expo/concept.</p>
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-3">
        {status.capabilities.map((capability) => (
          <Card key={capability.key}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-950">{capability.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{capability.current}</p>
                </div>
                <Badge tone={toneByStatus[capability.status]}>{capability.status}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 text-sm font-black text-slate-700">{capability.percent}%</div>
                <ProgressBar value={capability.percent} tone={capability.status === "blocked" ? "red" : capability.status === "partial" ? "blue" : "green"} />
              </div>
              <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">Următor: {capability.next}</p>
            </div>
          </Card>
        ))}
      </section>

      <Card className="mt-5">
        <CardHeader title="Plan de integrare v2.6 → v2.7" subtitle="Pașii necesari pentru ca /taskuri să folosească API-ul real fără să se schimbe designul." />
        <div className="grid gap-3 p-5 lg:grid-cols-2">
          {status.plan.map((step, index) => (
            <div key={step} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700">{index + 1}</div>
              <div className="text-sm font-semibold leading-6 text-slate-700">{step}</div>
            </div>
          ))}
        </div>
      </Card>

      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="flex gap-3 p-5"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><p className="text-sm font-semibold text-slate-600">Citirea din API poate fi activată controlat.</p></div>
        </Card>
        <Card>
          <div className="flex gap-3 p-5"><GitBranch className="h-5 w-5 text-blue-600" /><p className="text-sm font-semibold text-slate-600">Feature flags previn întreruperea UI-ului existent.</p></div>
        </Card>
        <Card>
          <div className="flex gap-3 p-5"><ShieldAlert className="h-5 w-5 text-amber-600" /><p className="text-sm font-semibold text-slate-600">DB write active rămâne blocat până la audit/RBAC complet.</p></div>
        </Card>
      </section>
    </>
  );
}
