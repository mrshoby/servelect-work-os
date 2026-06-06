import { WorkOsCard, WorkOsJson, WorkOsMetric, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { getWorkOsCore, getWorkOsDashboard } from "@/lib/enterprise/work-os-core-modules";

export default function AdminWorkOsCorePage() {
  const core = getWorkOsCore();
  const dashboard = getWorkOsDashboard();
  return (
    <WorkOsShell eyebrow="Admin · SERVELECT WORK OS" title="Real Work OS Core Modules Implementation" subtitle="Pachet de bază pentru aplicația enterprise inspirată de GoodDay, ClickUp, Linear, Asana și Monday, adaptată Servelect.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WorkOsMetric label="Module" value={core.modules.length} />
        <WorkOsMetric label="Proiecte" value={core.projects.length} />
        <WorkOsMetric label="Taskuri" value={core.tasks.length} />
        <WorkOsMetric label="Alerte" value={dashboard.kpis.criticalAlerts + dashboard.kpis.stockWarnings} />
      </section>
      <WorkOsCard title="Core contract"><WorkOsJson value={{ version: core.version, productionWrites: core.productionWrites, modules: core.modules.map((m) => ({ id: m.id, route: m.route, api: m.api, readiness: m.readiness })) }} /></WorkOsCard>
    </WorkOsShell>
  );
}
