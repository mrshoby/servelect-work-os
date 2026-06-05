import Link from "next/link";
import { ArrowRight, FileClock, GitBranch, ShieldCheck } from "lucide-react";

import { listAuditEvents } from "@/lib/backend/audit";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { listWorkflowExecutions } from "@/lib/workflows/executions";

const staticEvents = [
  {
    id: "audit-v09-001",
    userName: "SERVELECT WORK OS",
    action: "a activat Action Center",
    target: "v0.9",
    entityType: "system",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: "audit-v09-002",
    userName: "SERVELECT WORK OS",
    action: "a sincronizat workflow execution log",
    target: "Workflow-uri custom",
    entityType: "workflow",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  }
];

export default function AuditPage() {
  const auditEvents = [...listAuditEvents(100), ...staticEvents].slice(0, 100);
  const executions = listWorkflowExecutions(20);

  return (
    <>
      <PageHeader title="Audit & Governance Log" subtitle="v0.9 — jurnal pentru acțiuni critice, workflow-uri, RBAC și evenimente de sistem.">
        <Link href="/api/v1/audit/events" className="btn-secondary">
          API audit
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/api/v1/workflows/executions" className="btn-primary">
          API executions
          <GitBranch className="h-4 w-4" />
        </Link>
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[1fr_.42fr]">
        <Card>
          <CardHeader title="Evenimente audit" subtitle="În mock se păstrează în memoria serverului. În DB real se va lega de AuditEvent." />
          <div className="divide-y divide-slate-100 p-5 pt-0">
            {auditEvents.map((event) => (
              <div key={event.id} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white">
                    <FileClock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-950">{event.userName} {event.action}</div>
                    <div className="mt-1 text-sm text-slate-600">{event.target}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone="gray">{event.entityType}</Badge>
                      <Badge tone="green">{new Date(event.createdAt).toLocaleString("ro-RO")}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-400">{event.id}</div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Workflow execution log" subtitle="Execuții recente și status." />
            <div className="space-y-3 p-5 pt-0">
              {executions.map((execution) => (
                <div key={execution.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Badge tone={execution.status === "success" ? "green" : execution.status === "queued" ? "orange" : "red"}>{execution.status}</Badge>
                    <span className="text-xs font-bold text-slate-400">{execution.category}</span>
                  </div>
                  <div className="text-sm font-black text-slate-950">{execution.templateName}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{execution.message}</p>
                  <div className="mt-3 text-xs font-semibold text-slate-400">{new Date(execution.createdAt).toLocaleString("ro-RO")}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Governance status" />
            <div className="space-y-3 p-5 pt-0 text-sm leading-6 text-slate-600">
              <p className="flex gap-2"><ShieldCheck className="mt-1 h-4 w-4 flex-none text-emerald-600" /> Audit log este acum vizibil în Admin și disponibil prin API.</p>
              <p className="flex gap-2"><ShieldCheck className="mt-1 h-4 w-4 flex-none text-emerald-600" /> Workflow-urile au execution log separat, pregătit pentru DB.</p>
              <p className="flex gap-2"><ShieldCheck className="mt-1 h-4 w-4 flex-none text-emerald-600" /> Următoarea etapă poate activa PostgreSQL/Prisma pentru persistență reală.</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
