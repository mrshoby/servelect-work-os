import Link from "next/link";
import { AlertTriangle, ArrowRight, BellRing, CheckCircle2, Clock3, Gauge, GitBranch, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getActionCenterItems, getActionCenterSummary, type ActionCenterUrgency } from "@/lib/action-center/actions";

const urgencyTone: Record<ActionCenterUrgency, "red" | "orange" | "blue" | "green"> = {
  critical: "red",
  high: "orange",
  medium: "blue",
  low: "green"
};

const urgencyLabel: Record<ActionCenterUrgency, string> = {
  critical: "Critic",
  high: "Ridicat",
  medium: "Mediu",
  low: "Scăzut"
};

export default function ActionCenterPage() {
  const items = getActionCenterItems();
  const summary = getActionCenterSummary();
  const focusScore = Math.min(100, summary.critical * 28 + summary.high * 12 + summary.waiting * 6);

  return (
    <>
      <PageHeader
        title="Action Center"
        subtitle="v0.9 — coadă task-first pentru alerte, aprobări, tickete, riscuri și acțiuni operaționale Servelect."
      >
        <Link href="/api/v1/action-center" className="btn-secondary">
          API Action Center
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/workflows" className="btn-primary">
          Workflow-uri
          <GitBranch className="h-4 w-4" />
        </Link>
      </PageHeader>

      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Acțiuni totale" value={String(summary.total)} detail="din toate modulele" icon={BellRing} tone="green" />
        <Metric title="Critice" value={String(summary.critical)} detail="necesită intervenție" icon={ShieldAlert} tone="red" />
        <Metric title="Prioritate ridicată" value={String(summary.high)} detail="următorul pas azi" icon={AlertTriangle} tone="orange" />
        <Metric title="În așteptare" value={String(summary.waiting)} detail="aprobări / review" icon={Clock3} tone="blue" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_.36fr]">
        <Card>
          <CardHeader title="Coadă operațională unificată" subtitle="Taskuri, IoT, mentenanță, aprobări, finanțări și riscuri într-o singură listă executabilă." />
          <div className="space-y-3 p-5 pt-0">
            {items.map((item) => (
              <Link key={item.id} href={item.route} className="block rounded-[1.35rem] border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-card">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge tone={urgencyTone[item.urgency]}>{urgencyLabel[item.urgency]}</Badge>
                      <Badge tone="gray">{item.source}</Badge>
                      {item.projectCode && <Badge tone="green">{item.projectCode}</Badge>}
                    </div>
                    <h2 className="text-sm font-black text-slate-950">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">Următorul pas: {item.recommendedNextStep}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600 lg:w-56">
                    <div className="flex items-center justify-between gap-3"><span>Owner</span><b>{item.owner}</b></div>
                    <div className="mt-2 flex items-center justify-between gap-3"><span>Scadență</span><b>{item.dueLabel}</b></div>
                    <div className="mt-2 flex items-center justify-between gap-3"><span>Status</span><b>{item.status}</b></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Focus operațional" subtitle="Scor calculat din acțiuni critice/ridicate." />
            <div className="p-5 pt-0">
              <div className="mb-2 flex items-end justify-between">
                <div className="text-4xl font-black text-slate-950">{focusScore}</div>
                <Gauge className="h-8 w-8 text-emerald-600" />
              </div>
              <ProgressBar value={focusScore} tone={focusScore > 70 ? "red" : focusScore > 40 ? "orange" : "green"} />
              <p className="mt-3 text-sm leading-6 text-slate-600">Cu cât scorul este mai mare, cu atât managerul trebuie să prioritizeze alocarea de resurse, aprobări și intervenții.</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Distribuție surse" />
            <div className="space-y-3 p-5 pt-0">
              {Object.entries(summary.bySource).map(([source, count]) => (
                <div key={source}>
                  <div className="mb-1 flex justify-between text-sm"><span>{source}</span><b>{count}</b></div>
                  <ProgressBar value={(count / Math.max(summary.total, 1)) * 100} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Ce aduce v0.9" />
            <div className="space-y-3 p-5 pt-0 text-sm leading-6 text-slate-600">
              <p className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-none text-emerald-600" /> Centralizează tot ce necesită decizie sau acțiune.</p>
              <p className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-none text-emerald-600" /> Leagă modulele operaționale de taskuri și workflow-uri.</p>
              <p className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-none text-emerald-600" /> Pregătește dashboardul executiv pentru audit și SLA real.</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Metric({ title, value, detail, icon: Icon, tone }: { title: string; value: string; detail: string; icon: typeof BellRing; tone: "green" | "red" | "orange" | "blue" }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    orange: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700"
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</div>
          <div className="mt-2 text-3xl font-black text-slate-950">{value}</div>
          <div className="text-xs font-semibold text-slate-500">{detail}</div>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${colors[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
