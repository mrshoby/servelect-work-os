export type V92Surface =
  | "dispatch-ledger"
  | "webhook-ledger"
  | "mutation-pilot"
  | "dead-letter"
  | "task-object-model"
  | "activity-stream"
  | "admin-governance";

export type V92Status = "ready" | "gated" | "queued" | "blocked" | "review";

export type V92LedgerEntry = {
  id: string;
  label: string;
  module: string;
  actor: string;
  target: string;
  status: V92Status;
  provider: string;
  attempts: number;
  lastEvent: string;
  evidence: string;
  nextAction: string;
};

export type V92WebhookEntry = {
  id: string;
  source: string;
  signature: "verified" | "missing" | "rejected";
  idempotencyKey: string;
  duplicatePolicy: "accept-first" | "reject-duplicate" | "manual-review";
  status: V92Status;
  mappedTask: string;
  evidence: string;
};

export type V92TaskMutationPilot = {
  id: string;
  title: string;
  department: string;
  assignee: string;
  mutation: string;
  approvalGate: string;
  writeMode: "dry-run" | "pilot-write" | "blocked";
  status: V92Status;
  rollbackCheckpoint: string;
  activity: string[];
};

export type V92TaskObject = {
  id: string;
  type: "task" | "milestone" | "request" | "approval" | "incident";
  title: string;
  folder: string;
  status: string;
  priority: string;
  owner: string;
  customFields: string[];
  dependencies: string[];
  recurrence: string;
  watchers: string[];
};

export type V92ReadinessItem = {
  category: string;
  previous: number;
  current: number;
  status: V92Status;
  evidence: string;
  next: string;
};

export const V92_RELEASE = {
  version: "9.2.0",
  name: "DB-Backed Provider Dispatch Ledger, Webhook Intake Ledger & Task Mutation Pilot",
  canonicalMenu: "Taskuri",
  productionWrites: "global_off_pilot_gated",
  summary:
    "Major incremental release that continues the validated v9.1 Taskuri execution layer into ledger-backed provider dispatch, webhook intake idempotency and manager-gated task mutation pilots. It keeps Taskuri as the single canonical execution surface and keeps global production writes disabled."
} as const;

export const v92Readiness: V92ReadinessItem[] = [
  {
    category: "GoodDay-like Task Execution",
    previous: 91,
    current: 93,
    status: "ready",
    evidence: "Task object model now includes type, dependencies, recurrence, custom fields, watchers and activity stream.",
    next: "Inline task drawer mutations with persisted comments and approvals."
  },
  {
    category: "Provider Dispatch Ledger",
    previous: 74,
    current: 86,
    status: "gated",
    evidence: "Provider events are visible as dispatch ledger entries with retry/dead-letter state and evidence envelope.",
    next: "Bind ledger entries to real database adapter when production provider credentials are available."
  },
  {
    category: "Webhook Intake Ledger",
    previous: 70,
    current: 85,
    status: "gated",
    evidence: "Signed intake is mapped to idempotency keys, duplicate policy and task/request objects.",
    next: "Persist webhook intake rows and signature proof in primary database."
  },
  {
    category: "Task Mutation Pilot",
    previous: 78,
    current: 88,
    status: "review",
    evidence: "Manager approval gates, rollback checkpoint and write-mode are visible before any mutation is allowed.",
    next: "Enable a narrow pilot for one department after database backup and rollback drill."
  },
  {
    category: "Production Readiness",
    previous: 91,
    current: 93,
    status: "gated",
    evidence: "Global writes remain off; all write candidates stay dry-run or pilot-write gated.",
    next: "Operator signoff, live provider secrets and DB migration proof."
  }
];

export const v92DispatchLedger: V92LedgerEntry[] = [
  {
    id: "disp-920-001",
    label: "SLA escalation notification",
    module: "Taskuri / Tickets",
    actor: "Mihai Ionescu",
    target: "TCK-790 escalation",
    status: "queued",
    provider: "email",
    attempts: 1,
    lastEvent: "2026-06-15T09:20:00.000Z",
    evidence: "Dispatch envelope created; provider delivery remains gated by environment secrets.",
    nextAction: "Verify provider secret and run dry-run delivery."
  },
  {
    id: "disp-920-002",
    label: "Manager approval reminder",
    module: "Taskuri / Approvals",
    actor: "Ioana Marinescu",
    target: "Approval gate for SWO-791",
    status: "gated",
    provider: "in-app",
    attempts: 0,
    lastEvent: "2026-06-15T09:24:00.000Z",
    evidence: "Approval request is present but primary write remains gated.",
    nextAction: "Manager accepts pilot write or returns to dry-run."
  },
  {
    id: "disp-920-003",
    label: "Webhook replay notification",
    module: "Provider Runtime",
    actor: "System",
    target: "Webhook replay queue",
    status: "review",
    provider: "webhook",
    attempts: 2,
    lastEvent: "2026-06-15T09:28:00.000Z",
    evidence: "Replay candidate deduplicated by idempotency key.",
    nextAction: "Confirm duplicate policy before retry."
  },
  {
    id: "disp-920-004",
    label: "Dead-letter recovery action",
    module: "Operations",
    actor: "Alexandra Rusu",
    target: "DLQ-920-004",
    status: "blocked",
    provider: "push",
    attempts: 3,
    lastEvent: "2026-06-15T09:33:00.000Z",
    evidence: "Provider not configured; recovery action is blocked by design.",
    nextAction: "Add provider secret or keep disabled."
  }
];

export const v92WebhookLedger: V92WebhookEntry[] = [
  {
    id: "wh-920-001",
    source: "signed-provider-intake",
    signature: "verified",
    idempotencyKey: "taskuri:provider:SWO-790:001",
    duplicatePolicy: "accept-first",
    status: "ready",
    mappedTask: "SWO-790",
    evidence: "Signature verified and idempotency key accepted."
  },
  {
    id: "wh-920-002",
    source: "request-intake-form",
    signature: "verified",
    idempotencyKey: "request:client:CL-204:maintenance",
    duplicatePolicy: "accept-first",
    status: "queued",
    mappedTask: "REQ-920",
    evidence: "Request was mapped to Taskuri intake and waits for triage."
  },
  {
    id: "wh-920-003",
    source: "provider-retry",
    signature: "missing",
    idempotencyKey: "provider:retry:unknown",
    duplicatePolicy: "manual-review",
    status: "review",
    mappedTask: "Manual review",
    evidence: "Missing signature keeps event out of mutation pilot."
  },
  {
    id: "wh-920-004",
    source: "duplicate-webhook",
    signature: "verified",
    idempotencyKey: "taskuri:provider:SWO-790:001",
    duplicatePolicy: "reject-duplicate",
    status: "blocked",
    mappedTask: "SWO-790",
    evidence: "Duplicate event rejected; original event remains source of truth."
  }
];

export const v92TaskMutationPilots: V92TaskMutationPilot[] = [
  {
    id: "pilot-920-001",
    title: "Move SWO-791 from Review to Approved",
    department: "Producție",
    assignee: "Andrei Popescu",
    mutation: "task.status.update",
    approvalGate: "Department manager approval required",
    writeMode: "dry-run",
    status: "review",
    rollbackCheckpoint: "task:SOW-791:status:review:v6",
    activity: ["Mutation prepared", "ACL checked", "Manager approval pending"]
  },
  {
    id: "pilot-920-002",
    title: "Create request task from signed webhook",
    department: "Mentenanță",
    assignee: "Mihai Ionescu",
    mutation: "task.create.from_request",
    approvalGate: "Request intake triage gate",
    writeMode: "pilot-write",
    status: "gated",
    rollbackCheckpoint: "request:REQ-920:precreate",
    activity: ["Webhook mapped", "Idempotency accepted", "Pilot write waits for gate"]
  },
  {
    id: "pilot-920-003",
    title: "Add dependency SWO-792 after SWO-790",
    department: "Audit energetic",
    assignee: "Alexandra Rusu",
    mutation: "task.dependency.add",
    approvalGate: "Dependency conflict check",
    writeMode: "dry-run",
    status: "ready",
    rollbackCheckpoint: "dependency:SWO-792:none",
    activity: ["Dependency graph checked", "No cycle found", "Ready for pilot gate"]
  }
];

export const v92TaskObjects: V92TaskObject[] = [
  {
    id: "SWO-790",
    type: "task",
    title: "Provider canary activation pentru notificări Taskuri",
    folder: "Notifications / Providers",
    status: "In lucru",
    priority: "Urgent",
    owner: "Mihai Ionescu",
    customFields: ["Provider=email", "Write mode=dry-run", "Department=Automatizări"],
    dependencies: ["SWO-789"],
    recurrence: "none",
    watchers: ["Andrei Popescu", "Ioana Marinescu"]
  },
  {
    id: "SWO-791",
    type: "approval",
    title: "Shared view ACL pentru Saved Views pe departamente",
    folder: "Taskuri / Saved Views",
    status: "Review",
    priority: "Ridicată",
    owner: "Andrei Popescu",
    customFields: ["ACL=department", "Approval=required", "Evidence=attached"],
    dependencies: ["SWO-790"],
    recurrence: "none",
    watchers: ["Cristian Radu", "Alexandra Rusu"]
  },
  {
    id: "REQ-920",
    type: "request",
    title: "Cerere client mapată din webhook intake",
    folder: "Requests / Intake",
    status: "Triage",
    priority: "Medie",
    owner: "Ioana Marinescu",
    customFields: ["Source=webhook", "Signature=verified", "Idempotency=accepted"],
    dependencies: [],
    recurrence: "none",
    watchers: ["Mihai Ionescu"]
  },
  {
    id: "MIL-920",
    type: "milestone",
    title: "Production pilot gate review",
    folder: "Release / Governance",
    status: "Planificat",
    priority: "Critical",
    owner: "Platform Owner",
    customFields: ["Gate=go/no-go", "Writes=global_off", "Rollback=required"],
    dependencies: ["SWO-790", "SWO-791", "REQ-920"],
    recurrence: "weekly until pilot accepted",
    watchers: ["Director", "Security/RBAC Owner", "Database Owner"]
  }
];

export const v92ActivityStream = [
  "09:00 · NEXT_BUILD_PLAN.md read before apply",
  "09:05 · dispatch ledger added to Taskuri real routes",
  "09:12 · webhook idempotency mapped to requests and task objects",
  "09:18 · manager approval gate attached to mutation pilot",
  "09:24 · dead-letter recovery remains blocked without provider secrets",
  "09:30 · global production writes remain disabled"
];

export const v92Guardrails = [
  "No separate runtime app or secondary Work OS shell",
  "Taskuri remains the canonical execution entry",
  "Global production writes remain disabled",
  "Pilot writes require manager gate, rollback checkpoint and audit envelope",
  "Webhook intake requires signature and idempotency proof",
  "Provider dispatch can be queued/replayed but not globally delivered without secrets"
];

export function getV92ProviderLedgerTaskMutationPilot() {
  const totalLedger = v92DispatchLedger.length + v92WebhookLedger.length;
  const blocked = [...v92DispatchLedger, ...v92WebhookLedger].filter((item) => item.status === "blocked").length;
  const gated = [...v92DispatchLedger, ...v92TaskMutationPilots].filter((item) => item.status === "gated" || item.status === "review").length;
  return {
    release: V92_RELEASE,
    summary: {
      totalLedger,
      blocked,
      gated,
      taskObjects: v92TaskObjects.length,
      readiness: Math.round(v92Readiness.reduce((sum, item) => sum + item.current, 0) / v92Readiness.length)
    },
    readiness: v92Readiness,
    dispatchLedger: v92DispatchLedger,
    webhookLedger: v92WebhookLedger,
    mutationPilots: v92TaskMutationPilots,
    taskObjects: v92TaskObjects,
    activityStream: v92ActivityStream,
    guardrails: v92Guardrails
  };
}

export function getV92SurfacePayload(surface: V92Surface) {
  const data = getV92ProviderLedgerTaskMutationPilot();
  return {
    ...data,
    surface,
    surfaceTitle:
      surface === "dispatch-ledger"
        ? "Provider Dispatch Ledger"
        : surface === "webhook-ledger"
          ? "Webhook Intake Ledger"
          : surface === "mutation-pilot"
            ? "Task Mutation Pilot"
            : surface === "dead-letter"
              ? "Dead-letter & Replay Recovery"
              : surface === "task-object-model"
                ? "GoodDay-like Task Object Model"
                : surface === "activity-stream"
                  ? "Updates & Activity Stream"
                  : "Provider Ledger Governance"
  };
}


