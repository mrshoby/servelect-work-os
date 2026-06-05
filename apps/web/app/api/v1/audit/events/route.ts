import { listAuditEvents } from "@/lib/backend/audit";
import { jsonOk } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

const staticGovernanceEvents = [
  {
    id: "audit-v09-001",
    userId: "system",
    userName: "SERVELECT WORK OS",
    action: "a activat Action Center",
    target: "v0.9",
    entityType: "system",
    entityId: "v0.9",
    metadata: { module: "Action Center", version: "0.9.0" },
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: "audit-v09-002",
    userId: "system",
    userName: "SERVELECT WORK OS",
    action: "a sincronizat workflow execution log",
    target: "Workflow-uri custom",
    entityType: "workflow",
    entityId: "workflow-executions",
    metadata: { module: "Automatizări", version: "0.9.0" },
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  }
];

export async function GET() {
  const runtimeEvents = listAuditEvents(100);
  const events = [...runtimeEvents, ...staticGovernanceEvents].slice(0, 100);

  return jsonOk({
    version: "0.9.0",
    total: events.length,
    events
  });
}
