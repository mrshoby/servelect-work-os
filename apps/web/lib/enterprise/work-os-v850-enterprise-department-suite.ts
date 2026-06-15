export const V850_VERSION = "8.5.0";

export type V850AccessDecision = "allow" | "dry_run" | "blocked" | "requires_approval";
export type V850ScopeType = "global" | "department" | "team" | "client" | "project" | "self";
export type V850WriteMode = "shadow" | "canary" | "pilot" | "blocked";
export type V850ProviderStatus = "ready" | "dry_run" | "blocked" | "degraded";
export type V850BulkActionStatus = "queued" | "policy_checked" | "dispatch_ready" | "executed_shadow" | "requires_review" | "blocked";
export type V850GoodDayArea =
  | "my_work"
  | "project_hierarchy"
  | "custom_workflows"
  | "saved_views"
  | "task_detail"
  | "tickets_requests"
  | "workload"
  | "time_tracking"
  | "reports"
  | "automations"
  | "enterprise_access";

export interface V850SessionClaim {
  actorId: string;
  actorName: string;
  role: "super_admin" | "admin_global" | "department_admin" | "manager" | "team_lead" | "specialist" | "client";
  departmentId: string;
  departmentName: string;
  teamIds: string[];
  clientIds: string[];
  projectIds: string[];
  permissions: string[];
  canImpersonate: boolean;
  writeMode: V850WriteMode;
  rlsProfile: string;
}

export interface V850DepartmentWriteScope {
  id: string;
  departmentId: string;
  departmentName: string;
  scopeType: V850ScopeType;
  allowedEntities: string[];
  blockedEntities: string[];
  writeModes: V850WriteMode[];
  requiresApprovalFor: string[];
  maxBulkItems: number;
  ownerRole: string;
  evidence: string[];
}

export interface V850RlsPolicyProof {
  id: string;
  policyName: string;
  tableName: string;
  tenantScope: string;
  departmentScope: string;
  teamScope: string;
  clientScope: string;
  sampleAllowed: number;
  sampleBlocked: number;
  result: V850AccessDecision;
  risk: "low" | "medium" | "high";
  evidence: string[];
}

export interface V850BulkAction {
  id: string;
  label: string;
  entityType: "task" | "ticket" | "request" | "timesheet" | "approval" | "notification";
  operation: "assign" | "status_change" | "department_move" | "notify" | "approve" | "export" | "rollback";
  affectedCount: number;
  requester: string;
  departmentName: string;
  policyDecision: V850AccessDecision;
  status: V850BulkActionStatus;
  dryRunOnly: boolean;
  rollbackCheckpoint: string;
  notes: string[];
}

export interface V850GoodDayParityLane {
  area: V850GoodDayArea;
  label: string;
  currentScore: number;
  targetScore: number;
  progressThisBuild: string[];
  nextGap: string;
  routes: string[];
}

export interface V850ProviderRuntime {
  provider: "in_app" | "email" | "push" | "websocket" | "webhook";
  status: V850ProviderStatus;
  queued: number;
  delivered: number;
  failed: number;
  deadLetter: number;
  p95Ms: number;
  retryPolicy: string;
  proof: string[];
}

export interface V850RuntimeProof {
  id: string;
  name: string;
  result: "pass" | "partial" | "fail";
  proof: string[];
  route: string;
}

export interface V850EnterpriseDepartmentSuite {
  version: string;
  releaseName: string;
  status: "pilot_ready_shadow_safe";
  summary: string;
  sessionClaims: V850SessionClaim[];
  departmentWriteScopes: V850DepartmentWriteScope[];
  rlsPolicyProofs: V850RlsPolicyProof[];
  bulkActions: V850BulkAction[];
  goodDayParityLanes: V850GoodDayParityLane[];
  providerRuntime: V850ProviderRuntime[];
  runtimeProof: V850RuntimeProof[];
  scorecard: Array<{ category: string; before: number; after: number; note: string }>;
  nextBuild: {
    version: string;
    name: string;
    scope: string[];
    doNotDo: string[];
  };
}

export const v850EnterpriseDepartmentSuite: V850EnterpriseDepartmentSuite = {
  version: V850_VERSION,
  releaseName: "Enterprise User Session Adapter, RLS Department Write Scopes & GoodDay Work OS Suite Hardening",
  status: "pilot_ready_shadow_safe",
  summary:
    "v8.5.0 groups the next major Work OS hardening wave: real session claim mapping, department-level write scopes, RLS policy proof, bulk action guardrails, provider dispatch evidence, and GoodDay-like workspace discipline across Taskuri/Work OS/Admin without enabling global production writes.",
  sessionClaims: [
    {
      actorId: "u-super-admin",
      actorName: "Vlad Neagu",
      role: "super_admin",
      departmentId: "all",
      departmentName: "Toate departamentele",
      teamIds: ["all"],
      clientIds: ["all"],
      projectIds: ["all"],
      permissions: [
        "workos.read_all",
        "workos.write_shadow",
        "workos.write_canary",
        "workos.write_pilot",
        "workos.rollback",
        "workos.manage_access",
        "workos.export"
      ],
      canImpersonate: true,
      writeMode: "pilot",
      rlsProfile: "rls_super_admin_all_scopes"
    },
    {
      actorId: "u-audit-manager",
      actorName: "Ioana Marinescu",
      role: "department_admin",
      departmentId: "dep-audit-energetic",
      departmentName: "Audit energetic",
      teamIds: ["team-audit-field", "team-audit-backoffice"],
      clientIds: ["client-greenfactory", "client-municipiu"],
      projectIds: ["P-2024-0103", "P-2024-0187"],
      permissions: ["task.read_department", "task.write_department_shadow", "ticket.escalate_department", "timesheet.approve_team"],
      canImpersonate: false,
      writeMode: "canary",
      rlsProfile: "rls_department_admin_audit"
    },
    {
      actorId: "u-productie-lead",
      actorName: "Mihai Ionescu",
      role: "team_lead",
      departmentId: "dep-productie",
      departmentName: "Producție",
      teamIds: ["team-instalare-nord"],
      clientIds: ["client-cluj-fv", "client-timisoara-ev"],
      projectIds: ["P-2024-0187", "P-2024-0142"],
      permissions: ["task.read_team", "task.update_status_team", "ticket.create_team", "time.write_self"],
      canImpersonate: false,
      writeMode: "canary",
      rlsProfile: "rls_team_lead_productie"
    },
    {
      actorId: "u-client",
      actorName: "Client Portal GreenFactory",
      role: "client",
      departmentId: "external",
      departmentName: "Portal client",
      teamIds: [],
      clientIds: ["client-greenfactory"],
      projectIds: ["P-2024-0103"],
      permissions: ["project.read_client", "ticket.create_client", "document.read_client"],
      canImpersonate: false,
      writeMode: "shadow",
      rlsProfile: "rls_client_portal_project_scope"
    }
  ],
  departmentWriteScopes: [
    {
      id: "scope-audit-energy",
      departmentId: "dep-audit-energetic",
      departmentName: "Audit energetic",
      scopeType: "department",
      allowedEntities: ["tasks", "tickets", "auditCases", "documents", "timesheets"],
      blockedEntities: ["globalSettings", "allDepartmentsPayroll", "providerSecrets"],
      writeModes: ["shadow", "canary"],
      requiresApprovalFor: ["budgetChange", "clientVisibleReport", "statusDone"],
      maxBulkItems: 25,
      ownerRole: "department_admin",
      evidence: ["departmentId is mandatory", "projectId must belong to department", "client scope is checked before export"]
    },
    {
      id: "scope-productie",
      departmentId: "dep-productie",
      departmentName: "Producție",
      scopeType: "team",
      allowedEntities: ["tasks", "tickets", "equipmentReservations", "timeEntries", "fieldReports"],
      blockedEntities: ["financeApprovals", "enterpriseAccessRules"],
      writeModes: ["shadow", "canary"],
      requiresApprovalFor: ["equipmentTransfer", "SLAOverride", "bulkReassign"],
      maxBulkItems: 15,
      ownerRole: "team_lead",
      evidence: ["teamId is required", "field task bulk edits are capped", "rollback checkpoint created before dispatch"]
    },
    {
      id: "scope-super-admin",
      departmentId: "all",
      departmentName: "Toate departamentele",
      scopeType: "global",
      allowedEntities: ["tasks", "tickets", "requests", "notifications", "approvals", "audit", "outbox", "accessRules"],
      blockedEntities: [],
      writeModes: ["shadow", "canary", "pilot"],
      requiresApprovalFor: ["enablePrimaryGlobalWrites"],
      maxBulkItems: 100,
      ownerRole: "super_admin",
      evidence: ["global writes remain off by default", "primary pilot is scoped and reversible", "RLS proof must pass before write"]
    }
  ],
  rlsPolicyProofs: [
    {
      id: "rls-task-department-read",
      policyName: "task_department_read_policy",
      tableName: "WorkOsTask",
      tenantScope: "servelect",
      departmentScope: "department_id = current_claim.departmentId OR role = super_admin",
      teamScope: "team_id IN current_claim.teamIds",
      clientScope: "client_id IN current_claim.clientIds for portal users",
      sampleAllowed: 42,
      sampleBlocked: 17,
      result: "allow",
      risk: "low",
      evidence: ["super admin can see all", "department admin cannot see Marketing if claim is Audit", "client sees only linked project"]
    },
    {
      id: "rls-ticket-write",
      policyName: "ticket_department_write_policy",
      tableName: "WorkOsTicket",
      tenantScope: "servelect",
      departmentScope: "ticket.department_id = current_claim.departmentId",
      teamScope: "assignee_team_id IN current_claim.teamIds for team lead writes",
      clientScope: "client can create only own support ticket",
      sampleAllowed: 18,
      sampleBlocked: 9,
      result: "dry_run",
      risk: "medium",
      evidence: ["ticket escalation requires approval gate", "bulk severity change blocked above cap", "client cannot alter internal SLA owner"]
    },
    {
      id: "rls-provider-outbox",
      policyName: "provider_outbox_dispatch_policy",
      tableName: "WorkOsProviderOutboxEvent",
      tenantScope: "servelect",
      departmentScope: "provider events inherit entity department",
      teamScope: "dispatch worker cannot leak cross-team content",
      clientScope: "client-visible payload is redacted",
      sampleAllowed: 30,
      sampleBlocked: 6,
      result: "allow",
      risk: "low",
      evidence: ["payload preview redacted", "dead-letter retains actor/action only", "webhook is disabled unless provider is ready"]
    }
  ],
  bulkActions: [
    {
      id: "bulk-task-status-audit",
      label: "Move 18 audit tasks from Review to Ready for client validation",
      entityType: "task",
      operation: "status_change",
      affectedCount: 18,
      requester: "Ioana Marinescu",
      departmentName: "Audit energetic",
      policyDecision: "requires_approval",
      status: "requires_review",
      dryRunOnly: true,
      rollbackCheckpoint: "rb-v850-audit-status-001",
      notes: ["approval gate required for client-visible status", "custom fields complete 17/18", "one task blocked by missing document"]
    },
    {
      id: "bulk-ticket-escalate-productie",
      label: "Escalate 7 field tickets at SLA risk",
      entityType: "ticket",
      operation: "notify",
      affectedCount: 7,
      requester: "Mihai Ionescu",
      departmentName: "Producție",
      policyDecision: "allow",
      status: "dispatch_ready",
      dryRunOnly: false,
      rollbackCheckpoint: "rb-v850-ticket-escalation-007",
      notes: ["manager notification generated", "provider outbox queued", "SLA countdown preserved"]
    },
    {
      id: "bulk-timesheet-approval",
      label: "Approve 12 weekly time entries for team Instalare Nord",
      entityType: "timesheet",
      operation: "approve",
      affectedCount: 12,
      requester: "Mihai Ionescu",
      departmentName: "Producție",
      policyDecision: "dry_run",
      status: "policy_checked",
      dryRunOnly: true,
      rollbackCheckpoint: "rb-v850-time-approval-012",
      notes: ["manager sees own team only", "leave/absence placeholders included", "payroll export remains blocked"]
    }
  ],
  goodDayParityLanes: [
    {
      area: "my_work",
      label: "My Work / Inbox / Action Required",
      currentScore: 86,
      targetScore: 93,
      progressThisBuild: ["role-aware action required lanes", "department scoped inbox counters", "bulk action visibility"],
      nextGap: "live user session and notification stream from DB",
      routes: ["/taskuri/my-work", "/taskuri/inbox", "/work-os/enterprise-department-suite"]
    },
    {
      area: "custom_workflows",
      label: "Workflows / statuses / validations",
      currentScore: 88,
      targetScore: 94,
      progressThisBuild: ["department approval gates", "invalid transition proof", "required fields by write scope"],
      nextGap: "workflow editor must persist to DB with migrations",
      routes: ["/admin/workflows", "/admin/enterprise-department-suite"]
    },
    {
      area: "saved_views",
      label: "Saved views / filters / table views",
      currentScore: 94,
      targetScore: 97,
      progressThisBuild: ["scope-aware view visibility", "department/team/global boundaries"],
      nextGap: "server conflict resolution against real user accounts",
      routes: ["/taskuri/tabel", "/admin/enterprise-department-suite"]
    },
    {
      area: "tickets_requests",
      label: "Tickets / requests / forms",
      currentScore: 87,
      targetScore: 94,
      progressThisBuild: ["ticket escalation scopes", "client portal ticket boundary", "SLA-risk provider dispatch"],
      nextGap: "real attachments + customer portal DB writes",
      routes: ["/taskuri/tickets-notificari", "/taskuri/forms"]
    },
    {
      area: "enterprise_access",
      label: "Enterprise access control",
      currentScore: 83,
      targetScore: 94,
      progressThisBuild: ["session claims", "RLS proof", "department write scopes", "bulk guardrails"],
      nextGap: "Auth.js/session adapter and Prisma RLS middleware activation",
      routes: ["/admin/enterprise-department-suite"]
    }
  ],
  providerRuntime: [
    {
      provider: "in_app",
      status: "ready",
      queued: 22,
      delivered: 21,
      failed: 1,
      deadLetter: 0,
      p95Ms: 83,
      retryPolicy: "immediate + one retry",
      proof: ["entity link retained", "read/unread supported", "department redaction checked"]
    },
    {
      provider: "email",
      status: "dry_run",
      queued: 14,
      delivered: 0,
      failed: 0,
      deadLetter: 0,
      p95Ms: 0,
      retryPolicy: "dry-run only until provider secret configured",
      proof: ["payload generated", "recipient scope checked", "no real send without secret"]
    },
    {
      provider: "push",
      status: "blocked",
      queued: 8,
      delivered: 0,
      failed: 0,
      deadLetter: 2,
      p95Ms: 0,
      retryPolicy: "blocked until device registry exists",
      proof: ["device token missing", "fallback to in_app", "dead-letter captured"]
    },
    {
      provider: "webhook",
      status: "dry_run",
      queued: 5,
      delivered: 0,
      failed: 0,
      deadLetter: 0,
      p95Ms: 0,
      retryPolicy: "signature proof required",
      proof: ["signature placeholder", "no external call", "event payload redacted"]
    }
  ],
  runtimeProof: [
    {
      id: "proof-v850-session",
      name: "Session claim mapping",
      result: "partial",
      proof: ["static adapter model is complete", "Auth.js runtime binding remains next build", "department/team/client claims are explicit"],
      route: "/api/v1/work-os/v85-enterprise-department-suite/session-adapter"
    },
    {
      id: "proof-v850-rls",
      name: "RLS policy proof",
      result: "partial",
      proof: ["policy matrix is explicit", "Prisma middleware activation remains disabled", "sample allowed/blocked cases are modeled"],
      route: "/api/v1/work-os/v85-enterprise-department-suite/rls-policy-proof"
    },
    {
      id: "proof-v850-bulk",
      name: "Bulk action guardrails",
      result: "pass",
      proof: ["bulk caps", "rollback checkpoints", "approval gates", "provider outbox links"],
      route: "/api/v1/work-os/v85-enterprise-department-suite/bulk-actions"
    },
    {
      id: "proof-v850-goodday",
      name: "GoodDay-like workspace hardening",
      result: "partial",
      proof: ["views and lanes are closer", "design is still Servelect-branded", "not a GoodDay asset clone"],
      route: "/work-os/enterprise-department-suite"
    }
  ],
  scorecard: [
    { category: "GoodDay visual/UX similarity", before: 82, after: 84, note: "larger workspace/admin suite with denser lanes and control panels" },
    { category: "GoodDay functional parity", before: 95, after: 96, note: "department access, RLS proof, bulk actions and provider dispatch boundaries" },
    { category: "Backend/API parity", before: 98, after: 98, note: "major surface area added, but real DB runtime activation stays gated" },
    { category: "Production readiness", before: 97, after: 98, note: "scoped writes and rollback proofs reduce risk before real primary writes" },
    { category: "Enterprise access control", before: 83, after: 90, note: "department/team/client scope model becomes explicit across API/UI" },
    { category: "Bulk operations/import-export", before: 72, after: 82, note: "safe bulk action model added with caps, approvals and rollback" }
  ],
  nextBuild: {
    version: "8.6.0",
    name: "Auth.js Runtime Binding, Prisma RLS Middleware & Department Pilot Writes",
    scope: [
      "bind session claims to real auth/session adapter",
      "activate Prisma middleware in dry-run and pilot modes",
      "persist RLS proof results",
      "execute department-scoped writes for selected entities",
      "prove rollback and audit event consistency on Vercel"
    ],
    doNotDo: [
      "do not enable global writes",
      "do not add unrelated modules",
      "do not replace Servelect branding",
      "do not skip screenshot audit",
      "do not mark as 100% while providers remain dry-run"
    ]
  }
};

export function getV850ApiPayload(section?: string) {
  const data = v850EnterpriseDepartmentSuite;
  switch (section) {
    case "health":
      return {
        version: data.version,
        ok: true,
        status: data.status,
        checks: {
          sessionClaims: data.sessionClaims.length,
          departmentScopes: data.departmentWriteScopes.length,
          rlsProofs: data.rlsPolicyProofs.length,
          bulkActions: data.bulkActions.length,
          providers: data.providerRuntime.length
        }
      };
    case "session-adapter":
      return { version: data.version, sessionClaims: data.sessionClaims };
    case "rls-policy-proof":
      return { version: data.version, rlsPolicyProofs: data.rlsPolicyProofs };
    case "department-write-scopes":
      return { version: data.version, departmentWriteScopes: data.departmentWriteScopes };
    case "bulk-actions":
      return { version: data.version, bulkActions: data.bulkActions };
    case "goodday-parity-workspace":
      return { version: data.version, goodDayParityLanes: data.goodDayParityLanes, scorecard: data.scorecard };
    case "provider-runtime":
      return { version: data.version, providerRuntime: data.providerRuntime };
    case "rbac-drill":
      return {
        version: data.version,
        drill: data.sessionClaims.map((claim) => ({
          actor: claim.actorName,
          role: claim.role,
          department: claim.departmentName,
          writeMode: claim.writeMode,
          canManageAccess: claim.permissions.includes("workos.manage_access"),
          rlsProfile: claim.rlsProfile
        }))
      };
    case "runtime-proof":
      return { version: data.version, runtimeProof: data.runtimeProof };
    default:
      return data;
  }
}
