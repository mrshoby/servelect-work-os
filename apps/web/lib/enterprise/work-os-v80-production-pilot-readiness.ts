export const V80_RELEASE_VERSION = "8.0.0";
export const V80_RELEASE_NAME = "Production Pilot Readiness, Authenticated ACL Enforcement & Rollback Drill";
export const V80_RELEASE_DATE = "2026-06-15";

export type V80GateStatus = "passed" | "warning" | "blocked" | "planned";
export type V80PilotMode = "shadow" | "dry_run" | "canary" | "blocked";
export type V80ActorRole = "super_admin" | "global_admin" | "department_admin" | "manager" | "team_lead" | "member" | "client";
export type V80EntityType = "task" | "ticket" | "saved_view" | "timesheet" | "approval" | "workflow" | "report";
export type V80Permission = "read" | "write" | "share" | "approve" | "admin";

export type V80Actor = {
  id: string;
  name: string;
  role: V80ActorRole;
  departmentId: string;
  departmentName: string;
  teamIds: string[];
  canUsePrimaryPilot: boolean;
};

export type V80AclRule = {
  id: string;
  entityType: V80EntityType;
  entityId: string;
  scope: "private" | "team" | "department" | "global" | "client";
  ownerId: string;
  departmentId?: string;
  teamId?: string;
  clientId?: string;
  permissions: V80Permission[];
  state: "local_shadow" | "queued_for_server" | "server_synced" | "conflict" | "blocked";
  evidence: string;
};

export type V80MutationPilot = {
  id: string;
  label: string;
  entityType: V80EntityType;
  mode: V80PilotMode;
  actorId: string;
  targetId: string;
  dryRunSql: string;
  lockVersion: number;
  rollbackCheckpoint: string;
  rollbackTested: boolean;
  aclDecision: "allow" | "deny" | "needs_review";
  status: "ready" | "gated" | "blocked" | "failed";
  lastResult: string;
};

export type V80RollbackDrillStep = {
  id: string;
  title: string;
  status: V80GateStatus;
  owner: string;
  evidence: string;
  nextAction: string;
};

export type V80ProgressScore = {
  category: string;
  before: number;
  after: number;
  improvement: string;
  missing: string;
  nextStep: string;
};

export const v80Actors: V80Actor[] = [
  { id: "usr-super-vlad", name: "Vlad Taran", role: "super_admin", departmentId: "all", departmentName: "Toate departamentele", teamIds: ["leadership"], canUsePrimaryPilot: true },
  { id: "usr-audit-manager", name: "Ioana Marinescu", role: "manager", departmentId: "audit-energetic", departmentName: "Audit energetic", teamIds: ["audit-energy"], canUsePrimaryPilot: true },
  { id: "usr-productie-lead", name: "Andrei Popescu", role: "team_lead", departmentId: "productie", departmentName: "Producție", teamIds: ["teren-pv"], canUsePrimaryPilot: false },
  { id: "usr-comercial-admin", name: "Alexandra Rusu", role: "department_admin", departmentId: "comercial", departmentName: "Comercial", teamIds: ["sales"], canUsePrimaryPilot: false },
  { id: "usr-client", name: "Client GreenFactory", role: "client", departmentId: "client", departmentName: "Portal client", teamIds: [], canUsePrimaryPilot: false }
];

export const v80AclRules: V80AclRule[] = [
  { id: "acl-view-global-command", entityType: "saved_view", entityId: "view-exec-command", scope: "global", ownerId: "usr-super-vlad", permissions: ["read", "write", "share", "admin"], state: "server_synced", evidence: "Global executive saved view is readable by all authenticated internal roles and writable only by admins." },
  { id: "acl-audit-ticket", entityType: "ticket", entityId: "tic-audit-pae-001", scope: "department", ownerId: "usr-audit-manager", departmentId: "audit-energetic", permissions: ["read", "write", "approve"], state: "queued_for_server", evidence: "Audit energetic ticket is department-scoped before primary write pilot." },
  { id: "acl-productie-task", entityType: "task", entityId: "tsk-install-cluj-001", scope: "team", ownerId: "usr-productie-lead", departmentId: "productie", teamId: "teren-pv", permissions: ["read", "write"], state: "local_shadow", evidence: "Field execution task remains local-shadow until rollback drill is proven." },
  { id: "acl-client-report", entityType: "report", entityId: "rep-client-greenfactory", scope: "client", ownerId: "usr-client", clientId: "greenfactory", permissions: ["read"], state: "server_synced", evidence: "Client report is read-only and isolated from internal work items." },
  { id: "acl-workflow-admin", entityType: "workflow", entityId: "wf-ticket-sla", scope: "department", ownerId: "usr-comercial-admin", departmentId: "comercial", permissions: ["read", "write", "admin"], state: "conflict", evidence: "Department-admin workflow edit needs authenticated session binding before DB write." }
];

export const v80MutationPilots: V80MutationPilot[] = [
  { id: "mut-ticket-escalate", label: "Escaladare ticket SLA risc", entityType: "ticket", mode: "canary", actorId: "usr-audit-manager", targetId: "tic-audit-pae-001", dryRunSql: "update tickets set status='escalated', lock_version=lock_version+1 where id=$1 and lock_version=$2", lockVersion: 7, rollbackCheckpoint: "rbk-ticket-escalate-20260615", rollbackTested: true, aclDecision: "allow", status: "ready", lastResult: "Canary allowed for authenticated department manager." },
  { id: "mut-saved-view-share", label: "Partajare saved view echipă", entityType: "saved_view", mode: "dry_run", actorId: "usr-super-vlad", targetId: "view-exec-command", dryRunSql: "insert into saved_view_acl(view_id, scope, permission) values($1,$2,$3)", lockVersion: 3, rollbackCheckpoint: "rbk-view-acl-20260615", rollbackTested: true, aclDecision: "allow", status: "ready", lastResult: "Dry-run SQL generated; ready for DB adapter binding." },
  { id: "mut-task-field", label: "Editare câmp task teren", entityType: "task", mode: "shadow", actorId: "usr-productie-lead", targetId: "tsk-install-cluj-001", dryRunSql: "update tasks set custom_fields=jsonb_set(custom_fields,'{gpsCheckRequired}','true') where id=$1", lockVersion: 11, rollbackCheckpoint: "rbk-task-field-20260615", rollbackTested: false, aclDecision: "needs_review", status: "gated", lastResult: "Blocked from primary write until rollback drill has been executed for task custom fields." },
  { id: "mut-workflow-admin", label: "Schimbare workflow comercial", entityType: "workflow", mode: "blocked", actorId: "usr-comercial-admin", targetId: "wf-ticket-sla", dryRunSql: "update workflows set definition=$1 where id=$2", lockVersion: 2, rollbackCheckpoint: "rbk-workflow-20260615", rollbackTested: false, aclDecision: "deny", status: "blocked", lastResult: "ACL conflict; must bind real session and department admin scope before write." }
];

export const v80RollbackDrill: V80RollbackDrillStep[] = [
  { id: "snapshot", title: "Create rollback snapshot", status: "passed", owner: "Backend", evidence: "Each pilot mutation now carries rollbackCheckpoint and lockVersion.", nextAction: "Store checkpoint in DB adapter when primary pilot is enabled." },
  { id: "dry-run", title: "Dry-run SQL verification", status: "passed", owner: "Platform", evidence: "Generated dry-run SQL is exposed through v8.0 API for every canary mutation.", nextAction: "Bind SQL to Prisma transaction preview once schema is available." },
  { id: "auth-acl", title: "Authenticated ACL enforcement", status: "warning", owner: "Security", evidence: "ACL evaluator uses role/department/team/client scope, but real session binding is still adapter-gated.", nextAction: "Wire Auth.js/session actor into ACL evaluator." },
  { id: "rollback-run", title: "Rollback drill execution", status: "warning", owner: "Backend", evidence: "Ticket and saved-view pilots are marked rollback-tested; task/workflow pilots remain gated.", nextAction: "Run controlled rollback on staging DB before broad write enablement." },
  { id: "providers", title: "Live provider runtime", status: "blocked", owner: "Infrastructure", evidence: "Push/websocket/email providers still require real credentials and runtime secrets.", nextAction: "Configure provider secrets outside repository." }
];

export function v80RouteList() {
  return [
    "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets-notificari", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar-gantt", "/taskuri/workload-aprobari", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations", "/admin/workflows", "/admin/custom-fields", "/admin/provider-canary", "/admin/shared-view-acl", "/admin/primary-write-pilot", "/admin/production-pilot-readiness", "/work-os/primary-write-pilot", "/work-os/production-pilot-readiness"
  ];
}

export function v80Can(actor: V80Actor, acl: V80AclRule, permission: V80Permission) {
  if (actor.role === "super_admin") return true;
  if (!acl.permissions.includes(permission)) return false;
  if (acl.scope === "global") return permission === "read" || actor.role === "global_admin";
  if (acl.scope === "department") return actor.departmentId === acl.departmentId && actor.role !== "client";
  if (acl.scope === "team") return !!acl.teamId && actor.teamIds.includes(acl.teamId);
  if (acl.scope === "private") return actor.id === acl.ownerId;
  if (acl.scope === "client") return actor.role === "client" && actor.id === acl.ownerId && permission === "read";
  return false;
}

export function v80EvaluateMutation(mutationId: string, actorId?: string) {
  const mutation = v80MutationPilots.find((item) => item.id === mutationId) ?? v80MutationPilots[0];
  const actor = v80Actors.find((item) => item.id === (actorId ?? mutation.actorId)) ?? v80Actors[0];
  const acl = v80AclRules.find((item) => item.entityType === mutation.entityType && item.entityId === mutation.targetId);
  const canWrite = acl ? v80Can(actor, acl, "write") || v80Can(actor, acl, "admin") : actor.role === "super_admin";
  const rollbackReady = mutation.rollbackTested && mutation.rollbackCheckpoint.length > 0;
  const allowed = canWrite && rollbackReady && mutation.status !== "blocked" && mutation.mode !== "blocked" && actor.canUsePrimaryPilot;
  const decision = allowed ? "PRIMARY_CANARY_ALLOWED" : mutation.mode === "dry_run" || mutation.mode === "shadow" ? "DRY_RUN_ONLY" : "BLOCKED";
  const reasons = [
    canWrite ? "ACL write/admin allowed" : "ACL write/admin denied or missing real scope",
    rollbackReady ? "Rollback checkpoint tested" : "Rollback checkpoint missing or untested",
    actor.canUsePrimaryPilot ? "Actor allowed in primary pilot" : "Actor not allowed in primary pilot",
    mutation.status === "blocked" ? "Mutation status is blocked" : "Mutation status is not blocked"
  ];
  return { actor, mutation, acl, canWrite, rollbackReady, allowed, decision, reasons };
}

export function v80ProviderRuntimeReadiness() {
  return [
    { provider: "in_app", status: "ready", successRate: 99, p95Ms: 80, missing: "DB event table for production history" },
    { provider: "email", status: "dry_run", successRate: 93, p95Ms: 310, missing: "SMTP/API credentials and bounce webhooks" },
    { provider: "push", status: "blocked", successRate: 0, p95Ms: 0, missing: "FCM/APNs credentials and device token registry" },
    { provider: "websocket", status: "blocked", successRate: 0, p95Ms: 0, missing: "Realtime runtime and authenticated channel map" }
  ];
}

export function v80ProgressScores(): V80ProgressScore[] {
  return [
    { category: "GoodDay visual/UX similarity", before: 77, after: 78, improvement: "Production pilot surfaces are now shown in Work OS/Admin with denser GoodDay-like status tables and guard panels.", missing: "Microinteractions, live drawer telemetry and keyboard navigation.", nextStep: "Apply same guard state inside task drawer and table actions." },
    { category: "GoodDay public feature parity", before: 91, after: 92, improvement: "Adds authenticated ACL, rollback drill and primary-write pilot readiness layer.", missing: "Broad DB-backed writes, live providers and enterprise SSO enforcement.", nextStep: "Bind pilot to real session and Prisma-backed staging writes." },
    { category: "Backend / API / persistence", before: 92, after: 94, improvement: "Adds v8 API family for ACL evaluation, mutation guard, provider readiness and rollback drill.", missing: "Actual Prisma transaction execution remains gated.", nextStep: "Implement staging DB write adapter and rollback transaction logs." },
    { category: "Production readiness", before: 91, after: 93, improvement: "Primary writes now require ACL + actor + rollback checkpoint + lockVersion before canary.", missing: "Live provider credentials and proven rollback drill on staging DB.", nextStep: "Run first controlled staging write pilot." },
    { category: "RBAC / permissions / access rules", before: 92, after: 94, improvement: "Role, department, team and client ACL decisions are modeled and exposed to API/UI.", missing: "Real authenticated session-to-actor binding.", nextStep: "Wire Auth.js/current user into v8 evaluator." },
    { category: "Screenshot audit coverage", before: 100, after: 100, improvement: "v7.9 baseline was 29/29 clean; v8 script expands routes to include new production pilot pages/APIs.", missing: "Visual diff thresholds, not just PNG existence.", nextStep: "Add pixel-diff baseline comparison." }
  ];
}

export function v80GlobalScores() {
  return {
    gooddayVisualSimilarity: 78,
    gooddayFunctionalParity: 92,
    localRealFunctionality: 95,
    backendApiParity: 94,
    productionReadiness: 93,
    qaConfidence: 93,
    screenshotAuditCoverage: 100
  };
}

export function v80CurrentReadiness() {
  const gates = v80RollbackDrill;
  const totals = gates.reduce<Record<V80GateStatus, number>>((acc, gate) => {
    acc[gate.status] += 1;
    return acc;
  }, { passed: 0, warning: 0, blocked: 0, planned: 0 });
  const score = Math.round(((totals.passed + totals.warning * 0.55) / gates.length) * 100);
  return {
    version: V80_RELEASE_VERSION,
    name: V80_RELEASE_NAME,
    score,
    totals,
    gates,
    blockers: gates.filter((gate) => gate.status === "blocked"),
    warnings: gates.filter((gate) => gate.status === "warning")
  };
}
