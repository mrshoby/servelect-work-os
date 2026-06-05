import { AlertTriangle, CheckCircle2, Gauge, Route } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { getSitePerformanceAudit } from "@/lib/performance/site-audit";

export const dynamic = "force-dynamic";

export default function PerformanceAuditPage() {
  const audit = getSitePerformanceAudit();

  return (
    <>
      <PageHeader
        title="Performance Audit"
        subtitle="Verificare task-first pentru rutele principale: blocaje posibile, componente grele și recomandări de optimizare."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Rute verificate" value={String(audit.summary.totalRoutes)} tone="blue" />
        <MetricCard label="Optimizate" value={String(audit.summary.optimizedRoutes)} tone="green" />
        <MetricCard label="Warnings" value={String(audit.summary.warning)} tone="orange" />
        <MetricCard label="Critice" value={String(audit.summary.critical)} tone="red" />
      </div>

      <Card className="mt-5">
        <CardHeader
          title="Site slowdown map"
          subtitle="Lista rutelelor unde merită urmărită performanța după fiecare deploy."
        />

        <div className="divide-y divide-slate-100">
          {audit.routes.map((route) => (
            <div key={route.path} className="grid gap-4 px-5 py-4 lg:grid-cols-[190px_1fr_120px_120px] lg:items-center">
              <div>
                <div className="flex items-center gap-2 font-black text-slate-950">
                  <Route className="h-4 w-4 text-emerald-600" />
                  {route.path}
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{route.module}</div>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  {route.checks.map((check) => (
                    <span key={check} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {check}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-sm text-slate-500">{route.fix}</div>
              </div>

              <Badge tone={route.expectedWeight === "heavy" ? "purple" : route.expectedWeight === "medium" ? "blue" : "green"}>
                {route.expectedWeight}
              </Badge>

              <Badge tone={route.risk === "critical" ? "red" : route.risk === "warning" ? "orange" : "green"}>
                {route.risk}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "green" | "blue" | "orange" | "red" }) {
  const Icon = tone === "green" ? CheckCircle2 : tone === "red" ? AlertTriangle : Gauge;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-black text-slate-950">{value}</div>
          <div className="mt-1 text-sm font-bold text-slate-500">{label}</div>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
