import { WorkOsCard, WorkOsMetric, WorkOsProgress, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { WorkOsFormWorkflowClient } from "@/components/work-os/WorkOsFormWorkflowClient";
import { getWorkOsFormWorkflows } from "@/lib/enterprise/work-os-form-workflows";

export default function WorkOsFormsPage() {
  const data = getWorkOsFormWorkflows();
  return (
    <WorkOsShell eyebrow="SERVELECT WORK OS v5.3" title="Real CRUD Screens & Form Workflows" subtitle="Formulare operationale pentru proiecte, taskuri, rezervari materiale, oferte si propuneri workload din pontaj.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <WorkOsMetric label="Workflows" value={data.kpis.workflows} />
        <WorkOsMetric label="Templates" value={data.kpis.templates} />
        <WorkOsMetric label="Validari" value={data.kpis.validationRules} />
        <WorkOsMetric label="Audit contracts" value={data.kpis.auditContracts} />
        <WorkOsMetric label="Write mode" value={data.writeMode} />
      </section>

      <WorkOsCard title="Status/procente vizibile pe site">
        <div className="grid gap-4 lg:grid-cols-2">
          {data.readiness.areas.map((area) => (
            <div key={area.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="font-black text-slate-950">{area.label}</div>
              <p className="mt-2 text-sm text-slate-600">{area.summary}</p>
              <div className="mt-3"><WorkOsProgress value={area.completion} /></div>
            </div>
          ))}
        </div>
      </WorkOsCard>

      <WorkOsFormWorkflowClient workflows={data.workflows} templates={data.templates} />
    </WorkOsShell>
  );
}
