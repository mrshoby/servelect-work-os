import { WorkOsBadge, WorkOsCard, WorkOsMetric, WorkOsProgress, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { getWorkOsDashboard, getWorkOsReadiness } from "@/lib/enterprise/work-os-core-modules";

export default function WorkOsPage() {
  const dashboard = getWorkOsDashboard();
  const readiness = getWorkOsReadiness();
  return (
    <WorkOsShell eyebrow="SERVELECT WORK OS v5.2" title="Unified Work OS Core" subtitle="Platformă reală pentru proiecte, taskuri, stocuri, pontaj, CRM, ofertare, audit și operațiuni energetice.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WorkOsMetric label="Proiecte active" value={dashboard.kpis.activeProjects} />
        <WorkOsMetric label="Taskuri deschise" value={dashboard.kpis.openTasks} />
        <WorkOsMetric label="Blocaje" value={dashboard.kpis.blockedTasks} />
        <WorkOsMetric label="Valoare oferte" value={`€${dashboard.kpis.openOfferValueEur.toLocaleString("ro-RO")}`} />
      </section>

      <WorkOsCard title="Status/procente vizibile pe site" subtitle="Readiness pe ariile majore ale aplicației.">
        <div className="grid gap-4 lg:grid-cols-2">
          {readiness.areas.map((area) => (
            <div key={area.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">{area.label}</div>
                <WorkOsBadge value={area.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{area.summary}</p>
              <div className="mt-3"><WorkOsProgress value={area.completion} /></div>
            </div>
          ))}
        </div>
      </WorkOsCard>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkOsCard title="Alerte operaționale">
          <div className="space-y-3">
            {dashboard.alerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{alert.title}</div>
                  <WorkOsBadge value={alert.severity} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{alert.impact}</p>
                <p className="mt-2 text-xs font-semibold text-emerald-700">{alert.recommendedAction}</p>
              </div>
            ))}
          </div>
        </WorkOsCard>

        <WorkOsCard title="Fluxuri cross-module">
          <div className="space-y-3">
            {dashboard.flows.map((flow) => (
              <div key={flow.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{flow.label}</div>
                  <WorkOsBadge value={flow.status} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{flow.from}{" → "}{flow.to}</p>
                <p className="mt-1 text-sm text-slate-600">{flow.description}</p>
              </div>
            ))}
          </div>
        </WorkOsCard>
      </section>
    </WorkOsShell>
  );
}
