import { WorkOsBadge, WorkOsCard, WorkOsJson, WorkOsMetric, WorkOsProgress, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { getWorkOsFormWorkflows, getWorkOsWorkflowByEntity, templates } from "@/lib/enterprise/work-os-form-workflows";

export default function Page() {
  const data = getWorkOsFormWorkflows();
  const workflow = getWorkOsWorkflowByEntity("stockReservation");
  const template = templates.find((item) => item.entity === "stockReservation") ?? templates[0];
  return (
    <WorkOsShell eyebrow="SERVELECT WORK OS v5.3" title="Stock Reservations" subtitle={workflow.description}>
      <section className="grid gap-4 md:grid-cols-4">
        <WorkOsMetric label="Readiness" value={`${workflow.readiness}%`} />
        <WorkOsMetric label="Write mode" value={workflow.writeMode} />
        <WorkOsMetric label="Validari" value={workflow.validations.length} />
        <WorkOsMetric label="Steps" value={workflow.steps.length} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkOsCard title="Workflow steps">
          <div className="space-y-3">
            {workflow.steps.map((step) => (
              <div key={step.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3"><div className="font-black text-slate-950">{step.label}</div><WorkOsBadge value={step.type} /></div>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </WorkOsCard>
        <WorkOsCard title="Validation rules">
          <div className="space-y-3">
            {workflow.validations.map((rule) => (
              <div key={rule.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3"><div className="font-black text-slate-950">{rule.field}</div><WorkOsBadge value={rule.severity} /></div>
                <p className="mt-2 text-sm text-slate-600">{rule.message}</p>
              </div>
            ))}
          </div>
        </WorkOsCard>
      </section>

      <WorkOsCard title="Template fields">
        <div className="grid gap-4 md:grid-cols-2">
          {template.sections.map((section) => (
            <div key={section.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="font-black text-slate-950">{section.title}</div>
              <div className="mt-3 space-y-2">
                {section.fields.map((field) => <div key={field.id} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">{field.label} · {field.type} · {field.required ? "required" : "optional"}</div>)}
              </div>
            </div>
          ))}
        </div>
      </WorkOsCard>

      <WorkOsCard title="Audit contract"><WorkOsJson value={workflow.auditContract} /></WorkOsCard>
      <WorkOsCard title="All workflow dashboard"><WorkOsJson value={data.kpis} /></WorkOsCard>
    </WorkOsShell>
  );
}
