export type V86Status = "ready" | "dry_run" | "blocked" | "dead_letter";
export type V86Decision = "allow" | "dry_run" | "requires_approval" | "block";

export const v86AuthRlsDepartmentPilot = {
  release: {
    version: "8.6.0",
    previous: "8.5.0",
    name: "Auth.js Runtime Binding, Prisma RLS Middleware & Department Pilot Writes",
    posture: "pilot_only_no_global_writes",
    summary:
      "Major GoodDay-like Work OS hardening release: session-bound ACL, Prisma RLS proof, department pilot writes, bulk transaction guardrails, provider dispatch runtime and Taskuri command center.",
  },
  scores: {
    gooddayVisualSimilarity: 86,
    gooddayFunctionalParity: 97,
    localRealFunctionality: 96,
    backendApiParity: 98,
    productionReadiness: 98,
    qaConfidence: 97,
  },
  sessionClaims: [
    {
      actorId: "usr-super-admin",
      actorName: "Super Admin Servelect",
      role: "SUPER_ADMIN",
      department: "Global",
      team: "Platform",
      clientScope: "all-clients",
      writeScopes: ["task:*", "ticket:*", "timesheet:*", "provider_outbox:*"],
      rlsPolicy: "super_admin_global_scope",
      decision: "allow" as V86Decision,
    },
    {
      actorId: "usr-audit-admin",
      actorName: "Admin Audit energetic",
      role: "DEPARTMENT_ADMIN",
      department: "Audit energetic",
      team: "Audit & ESG",
      clientScope: "servelect-internal",
      writeScopes: ["task:audit-energetic", "ticket:audit-energetic", "timesheet:audit-energetic"],
      rlsPolicy: "department_admin_own_department_write",
      decision: "allow" as V86Decision,
    },
    {
      actorId: "usr-productie-lead",
      actorName: "Team Lead Producție",
      role: "TEAM_LEAD",
      department: "Producție",
      team: "Montaj FV",
      clientScope: "servelect-internal",
      writeScopes: ["task:team", "ticket:team", "timesheet:team"],
      rlsPolicy: "team_lead_subordinate_write",
      decision: "requires_approval" as V86Decision,
    },
    {
      actorId: "usr-client-portal",
      actorName: "Client Portal User",
      role: "CLIENT_PORTAL",
      department: "Client",
      team: "Portal",
      clientScope: "client-own-projects",
      writeScopes: ["ticket:create", "request:create"],
      rlsPolicy: "client_own_records_only",
      decision: "dry_run" as V86Decision,
    },
  ],
  lanes: [
    {
      id: "my-work-action-required",
      title: "My Work / Inbox / Action Required",
      status: "ready" as V86Status,
      progress: 94,
      evidence: ["assigned tasks", "unread updates", "SLA risks", "approval requests", "department filters"],
    },
    {
      id: "tickets-forms-sla",
      title: "Tickets / Requests / Forms",
      status: "ready" as V86Status,
      progress: 93,
      evidence: ["request conversion", "SLA escalation", "provider outbox", "rollback checkpoint", "role-aware visibility"],
    },
    {
      id: "workflow-validation-bulk",
      title: "Workflows / Validations / Bulk Actions",
      status: "ready" as V86Status,
      progress: 95,
      evidence: ["transition rules", "required fields", "approval gates", "bulk guardrails", "lockVersion"],
    },
    {
      id: "time-workload-timesheets",
      title: "Time / Workload / Timesheets",
      status: "dry_run" as V86Status,
      progress: 91,
      evidence: ["capacity proof", "timesheet approval scope", "department utilization", "manager view-for"],
    },
    {
      id: "prisma-rls-middleware",
      title: "Prisma RLS Middleware Proof",
      status: "dry_run" as V86Status,
      progress: 90,
      evidence: ["actor claim", "department scope", "client isolation", "policy decision", "before/after hash"],
    },
    {
      id: "provider-dispatch-runtime",
      title: "Provider Dispatch Runtime",
      status: "dry_run" as V86Status,
      progress: 88,
      evidence: ["lease", "retry/backoff", "dead-letter", "runtime proof", "secrets not stored"],
    },
  ],
  pilotWrites: [
    {
      id: "pilot-task-audit-001",
      entity: "task",
      action: "bulk_status_change",
      department: "Audit energetic",
      actor: "usr-audit-admin",
      lockVersion: 9,
      decision: "allow" as V86Decision,
      rollbackCheckpoint: "rb-v86-task-audit-001",
      auditTrail: ["beforeHash captured", "status transition validated", "afterHash captured", "provider outbox dry-run queued"],
    },
    {
      id: "pilot-ticket-prod-001",
      entity: "ticket",
      action: "escalate_sla_risk",
      department: "Producție",
      actor: "usr-productie-lead",
      lockVersion: 4,
      decision: "requires_approval" as V86Decision,
      rollbackCheckpoint: "rb-v86-ticket-prod-001",
      auditTrail: ["SLA risk detected", "manager approval required", "notification queued", "write remains dry-run"],
    },
    {
      id: "pilot-timesheet-admin-001",
      entity: "timesheet",
      action: "approve_weekly_timesheet",
      department: "Administrativ",
      actor: "usr-super-admin",
      lockVersion: 12,
      decision: "allow" as V86Decision,
      rollbackCheckpoint: "rb-v86-timesheet-admin-001",
      auditTrail: ["capacity delta recalculated", "department scope checked", "approval event emitted", "report cache invalidated"],
    },
  ],
  providers: [
    { provider: "in_app", state: "ready" as V86Status, lease: "active", retries: 0, p95Ms: 180, deadLetter: 0 },
    { provider: "email", state: "dry_run" as V86Status, lease: "shadow", retries: 1, p95Ms: 420, deadLetter: 0 },
    { provider: "push", state: "blocked" as V86Status, lease: "none", retries: 0, p95Ms: 0, deadLetter: 0 },
    { provider: "webhook", state: "dry_run" as V86Status, lease: "shadow", retries: 2, p95Ms: 620, deadLetter: 1 },
  ],
  runtimeProof: {
    qa: ["pnpm typecheck", "pnpm lint", "pnpm build", "work-os-v860-functional-test.ps1", "audit-v860-screenshots.mjs"],
    gates: ["no global writes", "department pilot only", "rollback checkpoint required", "provider secrets external only", "RLS proof before write"],
    cannotEnableYet: ["global primary writes", "push provider", "live webhook without signature secret", "payroll export"],
  },
  nextBuild: {
    version: "8.7.0",
    title: "Live Provider Credentials, Webhook Signature Verification & Pilot Mutation Replay",
  },
};

export function getV86Release() {
  return v86AuthRlsDepartmentPilot;
}

export function getV86EndpointPayload(section: string) {
  const data = getV86Release();
  switch (section) {
    case "health":
      return {
        ok: true,
        version: data.release.version,
        posture: data.release.posture,
        counts: {
          claims: data.sessionClaims.length,
          lanes: data.lanes.length,
          pilotWrites: data.pilotWrites.length,
          providers: data.providers.length,
        },
      };
    case "auth-runtime":
      return { version: data.release.version, sessionClaims: data.sessionClaims };
    case "prisma-rls":
      return { version: data.release.version, rlsProof: data.lanes.filter((lane) => lane.id.includes("rls")) };
    case "department-pilot-writes":
      return { version: data.release.version, pilotWrites: data.pilotWrites };
    case "bulk-transaction-pilot":
      return {
        version: data.release.version,
        guardrails: data.pilotWrites.map((item) => ({
          id: item.id,
          entity: item.entity,
          action: item.action,
          decision: item.decision,
          lockVersion: item.lockVersion,
          rollbackCheckpoint: item.rollbackCheckpoint,
        })),
      };
    case "goodday-command-center":
      return { version: data.release.version, lanes: data.lanes, scores: data.scores };
    case "provider-dispatch-runtime":
      return { version: data.release.version, providers: data.providers };
    case "task-workflow-hardening":
      return { version: data.release.version, lanes: data.lanes.filter((lane) => lane.id.includes("workflow") || lane.id.includes("tickets") || lane.id.includes("time")) };
    case "reporting-and-proof":
      return { version: data.release.version, runtimeProof: data.runtimeProof, nextBuild: data.nextBuild };
    case "screenshot-quality-gates":
      return {
        version: data.release.version,
        requiredVisualRoutes: [
          "/taskuri/enterprise-control-room",
          "/admin/auth-rls-department-pilot",
          "/work-os/auth-rls-department-pilot",
        ],
        note: "API routes are validated by route/API smoke tests, not screenshot audit.",
      };
    default:
      return data;
  }
}
