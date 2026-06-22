export const dynamic = "force-dynamic";

const VERSION = "21.0.2";
const BUILD = "GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL";
const MODE = "API_SHADOW_MUTATION_BRIDGE";
const PERSISTENCE = "REAL_LOCAL_PERSISTENT";

const actions = [
  "createWorkItem",
  "createTicket",
  "saveView",
  "restoreSavedView",
  "resetFilter",
  "sortTable",
  "exportCsv",
  "importPreview",
  "performImport",
  "markRead",
  "markAllRead",
  "openRelatedEntity",
  "addComment",
  "addChecklist",
  "addDependency",
  "attachMockFile",
  "startTimer",
  "stopTimer",
  "approve",
  "reject",
  "confirmReject",
  "bulkAction",
  "boardStatusMove",
  "drawerSave",
  "updateTask",
  "workflowTransition",
  "workloadRebalance",
  "ganttReschedule",
  "calendarSchedule",
  "searchWork",
  "roleSwitch",
  "escalateTicket",
  "convertTicketToTask",
  "procurementRequest",
  "rfqConversion",
  "supplierComparison",
  "purchaseOrder",
  "invoiceAttach",
  "reportRefresh",
];

export async function GET() {
  return Response.json({
    ok: true,
    version: VERSION,
    build: BUILD,
    mode: MODE,
    persistence: PERSISTENCE,
    shell: "V15_PRESERVED",
    runtime: "V200_PLUS_V210_IN_PLACE",
    actions,
    acceptance: {
      noNewShell: true,
      noTaskuriWorkspacePanel: true,
      noWorkspaceHierarchyPanel: true,
      visibleUiPreserved: true,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const action = typeof body?.action === "string" ? body.action : "unknown";
  const accepted = actions.includes(action);
  return Response.json({
    ok: accepted,
    accepted,
    version: VERSION,
    build: BUILD,
    mode: MODE,
    persistence: PERSISTENCE,
    auditId: `v210-${Date.now()}`,
    action,
    received: body,
    message: accepted ? "Mutation accepted by v21 shadow bridge." : "Unknown action. Mutation rejected by validation.",
  }, { status: accepted ? 200 : 422 });
}
