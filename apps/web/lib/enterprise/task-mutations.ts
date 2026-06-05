import { currentEnterpriseVersion } from "./release-status";

export type TaskMutationMode = "mock-memory" | "prisma-shadow" | "prisma-write-gated" | "prisma-active";
export type TaskMutationStatus = "ready" | "shadow" | "gated" | "blocked" | "planned";
export type TaskMutationRisk = "low" | "medium" | "high";

export type TaskMutationCapability = {
  id: string;
  label: string;
  operation: "create" | "update" | "delete" | "status-change" | "timer" | "comment" | "subtask" | "attachment";
  status: TaskMutationStatus;
  mode: TaskMutationMode;
  readiness: number;
  risk: TaskMutationRisk;
  done: string[];
  missing: string[];
};

export type MutationValidationRule = {
  id: string;
  label: string;
  appliesTo: string;
  severity: "info" | "warning" | "required";
  description: string;
};

export type MutationAuditEvent = {
  id: string;
  action: string;
  actor: string;
  target: string;
  provider: TaskMutationMode;
  status: "accepted" | "shadow-compared" | "blocked";
  message: string;
};

export const taskMutationCapabilities: TaskMutationCapability[] = [
  {
    id: "create-task",
    label: "Create task",
    operation: "create",
    status: "shadow",
    mode: "prisma-shadow",
    readiness: 64,
    risk: "high",
    done: ["API contract exists", "mock-memory provider works", "Prisma mapping planned", "audit event shape defined"],
    missing: ["DB write active flag", "Zod runtime validation", "UI create modal API wiring", "rollback strategy"]
  },
  {
    id: "update-task",
    label: "Update task fields",
    operation: "update",
    status: "shadow",
    mode: "prisma-shadow",
    readiness: 59,
    risk: "high",
    done: ["PATCH contract planned", "field allowlist defined", "status/progress fields mapped"],
    missing: ["server-side field validation", "optimistic update rollback", "audit diff", "RBAC permission check"]
  },
  {
    id: "status-change",
    label: "Change task status / Kanban movement",
    operation: "status-change",
    status: "gated",
    mode: "prisma-write-gated",
    readiness: 62,
    risk: "medium",
    done: ["status model stable", "board UI supports movement", "API-backed route prepared"],
    missing: ["persistent status update", "activity log event", "concurrency protection"]
  },
  {
    id: "delete-task",
    label: "Delete / cancel task",
    operation: "delete",
    status: "gated",
    mode: "prisma-write-gated",
    readiness: 44,
    risk: "high",
    done: ["operation exists in contract", "soft-delete strategy documented"],
    missing: ["soft delete column", "restore flow", "admin permission enforcement", "linked subtasks audit"]
  },
  {
    id: "timer-entry",
    label: "Task timer / time entry",
    operation: "timer",
    status: "planned",
    mode: "mock-memory",
    readiness: 36,
    risk: "medium",
    done: ["UI timer demo exists", "TimeEntry type exists"],
    missing: ["persistent time entries", "timesheet approval", "daily/weekly rollup", "mobile timer sync"]
  },
  {
    id: "comments",
    label: "Comments",
    operation: "comment",
    status: "planned",
    mode: "mock-memory",
    readiness: 31,
    risk: "medium",
    done: ["Comment model exists", "task drawer section exists conceptually"],
    missing: ["comment CRUD API", "mentions", "attachments in comment", "audit/activity timeline"]
  },
  {
    id: "subtasks",
    label: "Subtasks / checklist",
    operation: "subtask",
    status: "planned",
    mode: "mock-memory",
    readiness: 34,
    risk: "medium",
    done: ["Subtask/checklist model exists", "progress calculation exists in UI"],
    missing: ["subtask CRUD API", "reorder", "per-subtask owner/deadline", "activity log"]
  },
  {
    id: "attachments",
    label: "Attachments",
    operation: "attachment",
    status: "blocked",
    mode: "mock-memory",
    readiness: 22,
    risk: "high",
    done: ["Attachment type exists"],
    missing: ["file storage provider", "upload endpoint", "virus/file validation", "permissions", "R2/S3 integration"]
  }
];

export const validationRules: MutationValidationRule[] = [
  {
    id: "title-required",
    label: "Task title required",
    appliesTo: "create/update",
    severity: "required",
    description: "A task cannot be created without a title between 3 and 160 characters."
  },
  {
    id: "project-required",
    label: "Project link required",
    appliesTo: "create",
    severity: "required",
    description: "Task mutations should be linked to a project or explicit workspace inbox."
  },
  {
    id: "status-allowlist",
    label: "Status allowlist",
    appliesTo: "update/status-change",
    severity: "required",
    description: "Only approved statuses are accepted: Backlog, De făcut, În lucru, Review / QA, Blocat, Finalizat, Anulat."
  },
  {
    id: "rbac-mutation",
    label: "RBAC mutation gate",
    appliesTo: "all mutations",
    severity: "warning",
    description: "Mutation endpoints must enforce roles before production DB writes are enabled."
  },
  {
    id: "audit-required",
    label: "Audit event required",
    appliesTo: "all mutations",
    severity: "required",
    description: "Every mutation must emit an audit event containing actor, target, previous value and next value."
  }
];

export const sampleMutationAudit: MutationAuditEvent[] = [
  {
    id: "audit-task-create-shadow",
    action: "task.create",
    actor: "Andrei Popescu",
    target: "Verificare randament scăzut",
    provider: "prisma-shadow",
    status: "shadow-compared",
    message: "Mock-memory result accepted; Prisma shadow write simulated for response-shape parity."
  },
  {
    id: "audit-task-status-gated",
    action: "task.status.update",
    actor: "Mihai Ionescu",
    target: "Configurare invertor",
    provider: "prisma-write-gated",
    status: "accepted",
    message: "Mutation accepted in gated mode; DB write remains off until environment is confirmed."
  },
  {
    id: "audit-task-delete-blocked",
    action: "task.delete",
    actor: "Ioana Marinescu",
    target: "Task test legacy",
    provider: "mock-memory",
    status: "blocked",
    message: "Delete blocked because soft-delete and RBAC enforcement are not production-ready."
  }
];

export function getTaskMutationRelease() {
  const readiness = Math.round(taskMutationCapabilities.reduce((sum, item) => sum + item.readiness, 0) / taskMutationCapabilities.length);
  const blocked = taskMutationCapabilities.filter((item) => item.status === "blocked").length;
  const shadowReady = taskMutationCapabilities.filter((item) => item.status === "shadow" || item.status === "gated").length;

  return {
    ok: true,
    version: currentEnterpriseVersion,
    title: "DB-backed Task Mutations Pack",
    generatedAt: new Date().toISOString(),
    providerDefault: "mock-memory",
    supportedModes: ["mock-memory", "prisma-shadow", "prisma-write-gated", "prisma-active"] as TaskMutationMode[],
    dbWritesEnabled: false,
    shadowModeEnabled: true,
    mutationReadinessPercent: readiness,
    shadowReadyCount: shadowReady,
    blockedCount: blocked,
    honestStatus:
      "Task mutations are not fully production DB-backed yet. v2.5 creates the controlled contract, validation plan, audit plan and shadow/write-gated rollout path.",
    capabilities: taskMutationCapabilities,
    validationRules,
    sampleAudit: sampleMutationAudit,
    nextBuild: {
      version: "2.6.0",
      title: "Task UI API Wiring Pack",
      goal: "Wire /taskuri UI to the API-backed store with feature flag and localStorage fallback."
    }
  };
}

export function getTaskMutationHealth() {
  const release = getTaskMutationRelease();
  const requiredRules = validationRules.filter((rule) => rule.severity === "required").length;
  const highRisk = taskMutationCapabilities.filter((item) => item.risk === "high").length;

  return {
    ok: release.blockedCount === 0 ? true : false,
    version: release.version,
    generatedAt: new Date().toISOString(),
    providerDefault: release.providerDefault,
    dbWritesEnabled: release.dbWritesEnabled,
    shadowModeEnabled: release.shadowModeEnabled,
    readiness: release.mutationReadinessPercent,
    requiredValidationRules: requiredRules,
    highRiskCapabilities: highRisk,
    blockedCapabilities: release.blockedCount,
    message:
      release.blockedCount > 0
        ? "Some task mutation capabilities are intentionally blocked until DB, RBAC and storage providers are confirmed."
        : "Task mutation contract is ready for controlled rollout."
  };
}

export function getTaskMutationPlan() {
  return {
    ok: true,
    version: currentEnterpriseVersion,
    generatedAt: new Date().toISOString(),
    rolloutOrder: [
      "Keep mock-memory as default safe provider",
      "Enable prisma-shadow for create/update/status-change only",
      "Compare response shape and audit events",
      "Enable write-gated mode for internal admin users",
      "Wire /taskuri create modal to API store",
      "Wire status changes to PATCH API with rollback",
      "Add comments/subtasks/activity log persistence",
      "Enable Prisma active mode only after DB and RBAC pass audits"
    ],
    acceptanceCriteria: [
      "No regression in /taskuri performance",
      "Every mutation emits an audit event",
      "Every mutation can be disabled by feature flag",
      "Every DB write has rollback or soft-delete path",
      "Release status dashboard shows current task completion percentage"
    ],
    capabilities: taskMutationCapabilities
  };
}

export function getTaskMutationAudit() {
  return {
    ok: true,
    version: currentEnterpriseVersion,
    generatedAt: new Date().toISOString(),
    provider: "mock-memory/prisma-shadow-demo",
    events: sampleMutationAudit,
    requiredAuditFields: ["actorId", "workspaceId", "taskId", "action", "before", "after", "provider", "createdAt"],
    nextAction: "Persist these audit events in DB when Prisma active mode is enabled."
  };
}
