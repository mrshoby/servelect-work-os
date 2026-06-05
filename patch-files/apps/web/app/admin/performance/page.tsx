import { Activity, AlertTriangle, CheckCircle2, Gauge, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { getSiteAuditSummary, siteAuditItems, type SiteAuditRisk } from "@/lib/performance/site-audit";

const riskTone: Record<SiteAuditRisk, "green" | "orange" | "red" | "purple"> = {
  low: "green",
  medium: "orange",
  high: "red",
  critical: "purple"
};

export default function PerformanceAuditPage() {
  const summary = getSiteAuditSummary();

  return (
    <>
      <PageHeader title="Site Performance Audit" subtitle="Verificare statică pentru slowdowns, blocaje UI și zone cu risc de performanță.">
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">v1.0.1</Badge>
          <Badge tone="blue">Task page hotfix</Badge>
          <Badge tone="orange">Manual smoke test required</Badge>
        </div>
      </PageHeader>

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <MetricCard icon={Gauge} label="Zone verificate" value={String(summary.total)} />
        <MetricCard icon={CheckCircle2} label="Fixate în patch" value={String(summary.fixed)} />
        <MetricCard icon={AlertTriangle} label="De urmărit" value={String(summary.watch)} />
        <MetricCard icon={ShieldAlert} label="Critice" value={String(summary.critical)} />
      </section>

      <Card>
        <CardHeader title="Rezultate audit" subtitle="Lista zonelor unde am identificat blocaje reale sau riscuri viitoare." />

        <div className="divide-y divide-slate-100">
          {siteAuditItems.map((item) => (
            <div key={`${item.route}-${item.area}`} className="grid gap-4 p-5 xl:grid-cols-[220px_140px_1fr_1fr]">
              <div>
                <div className="text-sm font-black text-slate-950">{item.route}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{item.area}</div>
              </div>

              <div className="flex items-start gap-2">
                <Badge tone={item.status === "fixed" ? "green" : "orange"}>{item.status}</Badge>
                <Badge tone={riskTone[item.risk]}>{item.risk}</Badge>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-wide text-slate-400">Problemă</div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.issue}</p>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-wide text-slate-400">Fix / recomandare</div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-500">{label}</div>
    </div>
  );
}
