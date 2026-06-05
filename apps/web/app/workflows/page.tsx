import { ArrowRight, GitBranch, PlayCircle } from "lucide-react";
import { workflowTemplates } from "@/lib/workflows/templates";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";

const categoryTone = {
  IoT: "orange",
  CRM: "blue",
  Mentenanță: "red",
  Finanțări: "green",
  HR: "purple",
  Proiecte: "green"
} as const;

export default function WorkflowsPage() {
  return (
    <>
      <PageHeader
        title="Workflow-uri custom"
        subtitle="v0.8 — template-uri automate pentru taskuri, aprobări, alerte și operațiuni Servelect."
      >
        <a href="/api/v1/workflows/templates" className="btn-secondary">
          API templates
          <ArrowRight className="h-4 w-4" />
        </a>
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[1fr_.75fr]">
        <Card>
          <CardHeader title="Template-uri operaționale" subtitle="Rulate prin /api/v1/workflows/run. În mock creează taskuri în repository; în Prisma va persista în DB." />
          <div className="grid gap-4 p-5 pt-0 md:grid-cols-2">
            {workflowTemplates.map((template) => (
              <div key={template.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white">
                      <GitBranch className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-950">{template.name}</div>
                      <div className="text-xs font-semibold text-slate-500">{template.trigger}</div>
                    </div>
                  </div>
                  <Badge tone={categoryTone[template.category]}>{template.category}</Badge>
                </div>

                <p className="text-sm leading-6 text-slate-600">{template.description}</p>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">Task implicit</div>
                  <div className="mt-1 text-sm font-black text-slate-900">{template.defaultTask.title}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone="blue">{template.defaultTask.status}</Badge>
                    <Badge tone={template.defaultTask.priority === "Critic" ? "red" : template.defaultTask.priority === "Urgent" ? "orange" : "green"}>{template.defaultTask.priority}</Badge>
                    <Badge tone="gray">{template.defaultTask.estimateHours}h</Badge>
                  </div>
                </div>

                <ol className="mt-4 space-y-2">
                  {template.steps.map((step, index) => (
                    <li key={step} className="flex gap-2 text-xs font-semibold text-slate-600">
                      <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-emerald-50 text-[10px] font-black text-emerald-700">{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Execuție API demo" subtitle="Exemplu pentru testare rapidă în Postman / PowerShell." />
          <div className="space-y-4 p-5 pt-0">
            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs font-semibold text-slate-100">
              <pre className="whitespace-pre-wrap">{`POST /api/v1/workflows/run\nContent-Type: application/json\n\n{\n  "templateId": "iot-inverter-offline-task",\n  "projectCode": "P-2024-0187",\n  "projectName": "Sistem FV 9.6 kWp"\n}`}</pre>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 ring-1 ring-emerald-100">
              <div className="mb-2 flex items-center gap-2 font-black">
                <PlayCircle className="h-4 w-4" />
                Ce aduce v0.8
              </div>
              Workflow-urile nu mai sunt doar text în arhitectură: există template-uri codificate, API de listare și API de execuție care creează taskuri prin repository layer.
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
