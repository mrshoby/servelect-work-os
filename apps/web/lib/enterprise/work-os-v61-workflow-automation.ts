export type V61WorkflowDomain =
  | "tasks"
  | "projects"
  | "iot"
  | "inventory"
  | "procurement"
  | "invoices"
  | "maintenance"
  | "documents"
  | "approvals"
  | "team";

export type V61WorkflowTriggerType =
  | "task_status_changed"
  | "iot_alert_created"
  | "stock_below_minimum"
  | "invoice_due_soon"
  | "approval_pending_too_long"
  | "project_risk_changed"
  | "maintenance_ticket_created"
  | "document_missing"
  | "team_overloaded"
  | "manual_run";

export type V61WorkflowActionType =
  | "create_task"
  | "create_approval"
  | "assign_owner"
  | "notify_user"
  | "escalate_to_manager"
  | "reserve_materials"
  | "create_ticket"
  | "request_document"
  | "start_sla_timer"
  | "add_audit_event";

export type V61RuleStatus = "active" | "draft" | "paused" | "shadow";
export type V61Risk = "low" | "medium" | "high" | "critical";
export type V61SlaState = "healthy" | "warning" | "breached" | "paused";
export type V61GeneratedTaskStatus = "ready" | "shadowed" | "queued" | "blocked" | "created";

export interface V61WorkflowTrigger {
  id: string;
  type: V61WorkflowTriggerType;
  label: string;
  domain: V61WorkflowDomain;
  condition: string;
  sampleEvent: string;
}

export interface V61WorkflowAction {
  id: string;
  type: V61WorkflowActionType;
  label: string;
  targetRole: string;
  targetModule: V61WorkflowDomain;
  writeMode: "shadow" | "safe" | "requires_approval" | "real_ready";
  auditRequired: boolean;
}

export interface V61WorkflowRule {
  id: string;
  name: string;
  description: string;
  domain: V61WorkflowDomain;
  ownerRole: string;
  status: V61RuleStatus;
  risk: V61Risk;
  trigger: V61WorkflowTrigger;
  actions: V61WorkflowAction[];
  slaPolicyId: string;
  approvalRequired: boolean;
  automationScore: number;
  lastRunAt: string;
  runCount: number;
}

export interface V61SlaPolicy {
  id: string;
  name: string;
  appliesTo: V61WorkflowDomain[];
  ownerRole: string;
  responseMinutes: number;
  resolutionMinutes: number;
  escalationPath: string[];
  state: V61SlaState;
  activeItems: number;
  warningItems: number;
  breachedItems: number;
}

export interface V61GeneratedTask {
  id: string;
  source: V61WorkflowDomain;
  title: string;
  projectId: string;
  assigneeRole: string;
  priority: "low" | "medium" | "high" | "urgent" | "critical";
  status: V61GeneratedTaskStatus;
  dueInHours: number;
  linkedEntity: string;
  auditTrail: string[];
}

export interface V61CommandCenterMetric {
  id: string;
  label: string;
  value: string;
  trend: string;
  tone: "green" | "blue" | "amber" | "red" | "purple";
}

export interface V61GoodDayParityScore {
  feature: string;
  before: number;
  after: number;
  implemented: string;
}

export const v61WorkflowTriggers: V61WorkflowTrigger[] = [
  { id: "trg-iot-offline", type: "iot_alert_created", label: "Invertor offline", domain: "iot", condition: "alert.severity >= high && inverter.status === offline", sampleEvent: "Invertor Huawei SUN2000 offline la P-2024-0103", },
  { id: "trg-stock-min", type: "stock_below_minimum", label: "Stoc sub minim", domain: "inventory", condition: "item.availableQty < item.minimumQty", sampleEvent: "Conector MC4 sub prag în depozit Cluj", },
  { id: "trg-invoice-due", type: "invoice_due_soon", label: "Factură scadentă", domain: "invoices", condition: "invoice.dueDate <= today + 5 days && invoice.status !== paid", sampleEvent: "Factură furnizor INV-2026-044 scadentă", },
  { id: "trg-approval-aging", type: "approval_pending_too_long", label: "Aprobare blocată", domain: "approvals", condition: "approval.status === pending && ageHours > 24", sampleEvent: "Aprobare achiziție panouri blocată peste 24h", },
  { id: "trg-project-risk", type: "project_risk_changed", label: "Risc proiect crescut", domain: "projects", condition: "project.health === at_risk || project.blockers.length > 0", sampleEvent: "P-2024-0187 intră în risc: document aviz lipsă", },
  { id: "trg-document-missing", type: "document_missing", label: "Document obligatoriu lipsă", domain: "documents", condition: "phase.requiredDocuments.some(doc => !doc.exists)", sampleEvent: "PV recepție lipsă pentru faza PIF", },
  { id: "trg-team-overload", type: "team_overloaded", label: "Echipă supraîncărcată", domain: "team", condition: "user.workloadPercent > 115 for 2 days", sampleEvent: "Mihai Ionescu are workload 128%", },
  { id: "trg-maint-ticket", type: "maintenance_ticket_created", label: "Ticket mentenanță creat", domain: "maintenance", condition: "ticket.priority >= urgent", sampleEvent: "Ticket critic pentru invertor offline", }
];

export const v61SlaPolicies: V61SlaPolicy[] = [
  { id: "sla-critical-iot", name: "Alerte IoT critice", appliesTo: ["iot", "maintenance"], ownerRole: "Manager Departament", responseMinutes: 30, resolutionMinutes: 240, escalationPath: ["Tehnician", "Manager Departament", "Director"], state: "warning", activeItems: 9, warningItems: 3, breachedItems: 1 },
  { id: "sla-procurement", name: "Achiziții proiecte active", appliesTo: ["procurement", "inventory"], ownerRole: "Specialist Achiziții", responseMinutes: 240, resolutionMinutes: 2880, escalationPath: ["Specialist Achiziții", "Manager Proiect", "Director"], state: "healthy", activeItems: 17, warningItems: 2, breachedItems: 0 },
  { id: "sla-invoice", name: "Facturi și plăți", appliesTo: ["invoices", "approvals"], ownerRole: "Financiar / Contabil", responseMinutes: 480, resolutionMinutes: 4320, escalationPath: ["Financiar / Contabil", "Director"], state: "warning", activeItems: 12, warningItems: 4, breachedItems: 0 },
  { id: "sla-project-docs", name: "Documente fază proiect", appliesTo: ["projects", "documents", "approvals"], ownerRole: "Manager Proiect", responseMinutes: 360, resolutionMinutes: 2160, escalationPath: ["Responsabil Proiect", "Manager Proiect", "Director"], state: "breached", activeItems: 21, warningItems: 5, breachedItems: 2 },
  { id: "sla-team-workload", name: "Workload echipă", appliesTo: ["team", "tasks"], ownerRole: "Manager Departament", responseMinutes: 720, resolutionMinutes: 2880, escalationPath: ["Manager Departament", "Director"], state: "healthy", activeItems: 10, warningItems: 1, breachedItems: 0 }
];

export const v61WorkflowRules: V61WorkflowRule[] = [
  {
    id: "wf-iot-maintenance-task",
    name: "IoT alert → ticket/task mentenanță",
    description: "Când un invertor este offline sau randamentul scade sub prag, se creează automat task/ticket de mentenanță, se pornește SLA și se notifică managerul.",
    domain: "iot",
    ownerRole: "Manager Departament",
    status: "active",
    risk: "critical",
    trigger: v61WorkflowTriggers[0],
    actions: [
      { id: "act-create-ticket", type: "create_ticket", label: "Creează ticket urgent", targetRole: "Tehnician", targetModule: "maintenance", writeMode: "safe", auditRequired: true },
      { id: "act-sla", type: "start_sla_timer", label: "Pornește SLA critic", targetRole: "Manager Departament", targetModule: "maintenance", writeMode: "safe", auditRequired: true },
      { id: "act-notify", type: "notify_user", label: "Notifică manager și tehnician", targetRole: "Manager Departament", targetModule: "team", writeMode: "shadow", auditRequired: true }
    ],
    slaPolicyId: "sla-critical-iot",
    approvalRequired: false,
    automationScore: 92,
    lastRunAt: "2026-06-08T09:05:00",
    runCount: 38
  },
  {
    id: "wf-stock-procurement-task",
    name: "Stoc sub minim → task aprovizionare",
    description: "Produsele critice sub prag creează task pentru achiziții, leagă proiectele afectate și pregătesc aprobare dacă valoarea depășește pragul.",
    domain: "inventory",
    ownerRole: "Specialist Achiziții",
    status: "active",
    risk: "high",
    trigger: v61WorkflowTriggers[1],
    actions: [
      { id: "act-proc-task", type: "create_task", label: "Creează task aprovizionare", targetRole: "Specialist Achiziții", targetModule: "procurement", writeMode: "safe", auditRequired: true },
      { id: "act-approval", type: "create_approval", label: "Pregătește aprobare peste prag", targetRole: "Director", targetModule: "approvals", writeMode: "requires_approval", auditRequired: true }
    ],
    slaPolicyId: "sla-procurement",
    approvalRequired: true,
    automationScore: 88,
    lastRunAt: "2026-06-08T08:35:00",
    runCount: 22
  },
  {
    id: "wf-invoice-finance-task",
    name: "Factură scadentă → task financiar",
    description: "Facturile care se apropie de scadență sunt trimise în inbox financiar, cu notificare și escaladare dacă nu se rezolvă.",
    domain: "invoices",
    ownerRole: "Financiar / Contabil",
    status: "active",
    risk: "medium",
    trigger: v61WorkflowTriggers[2],
    actions: [
      { id: "act-fin-task", type: "create_task", label: "Creează task verificare plată", targetRole: "Financiar / Contabil", targetModule: "tasks", writeMode: "safe", auditRequired: true },
      { id: "act-fin-notify", type: "notify_user", label: "Notifică financiar", targetRole: "Financiar / Contabil", targetModule: "team", writeMode: "shadow", auditRequired: false }
    ],
    slaPolicyId: "sla-invoice",
    approvalRequired: false,
    automationScore: 84,
    lastRunAt: "2026-06-08T07:45:00",
    runCount: 14
  },
  {
    id: "wf-project-missing-doc",
    name: "Document lipsă → blocaj fază proiect",
    description: "Dacă un document obligatoriu lipsește, se creează task, se blochează avansarea fazei și se cere aprobare manager.",
    domain: "documents",
    ownerRole: "Manager Proiect",
    status: "shadow",
    risk: "high",
    trigger: v61WorkflowTriggers[5],
    actions: [
      { id: "act-doc-task", type: "request_document", label: "Cere document obligatoriu", targetRole: "Responsabil Proiect", targetModule: "documents", writeMode: "shadow", auditRequired: true },
      { id: "act-doc-approval", type: "create_approval", label: "Cere aprobare fază", targetRole: "Manager Proiect", targetModule: "approvals", writeMode: "requires_approval", auditRequired: true }
    ],
    slaPolicyId: "sla-project-docs",
    approvalRequired: true,
    automationScore: 79,
    lastRunAt: "2026-06-07T16:20:00",
    runCount: 9
  },
  {
    id: "wf-team-overload-rebalance",
    name: "Workload overload → rebalansare taskuri",
    description: "Când un tehnician sau manager depășește capacitatea, sistemul propune reassign către useri eligibili, cu audit și notificări.",
    domain: "team",
    ownerRole: "Manager Departament",
    status: "active",
    risk: "medium",
    trigger: v61WorkflowTriggers[6],
    actions: [
      { id: "act-reassign", type: "assign_owner", label: "Propune reassign taskuri", targetRole: "Manager Departament", targetModule: "tasks", writeMode: "requires_approval", auditRequired: true },
      { id: "act-overload-notify", type: "notify_user", label: "Notifică manager", targetRole: "Manager Departament", targetModule: "team", writeMode: "shadow", auditRequired: false }
    ],
    slaPolicyId: "sla-team-workload",
    approvalRequired: true,
    automationScore: 81,
    lastRunAt: "2026-06-08T06:30:00",
    runCount: 17
  }
];

export const v61GeneratedTasks: V61GeneratedTask[] = [
  { id: "gt-001", source: "iot", title: "Verifică invertor offline P-2024-0103", projectId: "P-2024-0103", assigneeRole: "Tehnician", priority: "critical", status: "ready", dueInHours: 4, linkedEntity: "IoT alert Huawei SUN2000", auditTrail: ["alert_received", "sla_started", "technician_suggested"] },
  { id: "gt-002", source: "inventory", title: "Comandă conectori MC4 pentru proiecte active", projectId: "P-2024-0187", assigneeRole: "Specialist Achiziții", priority: "high", status: "queued", dueInHours: 24, linkedEntity: "Stock item MC4", auditTrail: ["stock_below_min", "supplier_candidates_loaded", "approval_threshold_checked"] },
  { id: "gt-003", source: "invoices", title: "Validează factura INV-2026-044", projectId: "P-2024-0142", assigneeRole: "Financiar / Contabil", priority: "medium", status: "ready", dueInHours: 48, linkedEntity: "Invoice INV-2026-044", auditTrail: ["invoice_due_soon", "finance_task_created"] },
  { id: "gt-004", source: "documents", title: "Încarcă PV recepție pentru PIF", projectId: "P-2024-0187", assigneeRole: "Responsabil Proiect", priority: "urgent", status: "shadowed", dueInHours: 12, linkedEntity: "Required document PV recepție", auditTrail: ["missing_document_detected", "phase_gate_blocked_shadow"] },
  { id: "gt-005", source: "team", title: "Rebalansează taskuri Cristian Radu", projectId: "P-2024-0103", assigneeRole: "Manager Departament", priority: "high", status: "blocked", dueInHours: 8, linkedEntity: "Workload 128%", auditTrail: ["overload_detected", "eligible_assignees_checked", "manager_approval_required"] }
];

export const v61CommandCenterMetrics: V61CommandCenterMetric[] = [
  { id: "automations", label: "Workflow-uri active", value: "42", trend: "+9 față de v6.0", tone: "green" },
  { id: "sla", label: "SLA sub control", value: "87%", trend: "3 politici în warning", tone: "amber" },
  { id: "generated", label: "Taskuri generate", value: "118", trend: "shadow-safe + ready queue", tone: "blue" },
  { id: "approval", label: "Aprobări automate", value: "24", trend: "7 necesită manager", tone: "purple" },
  { id: "breach", label: "SLA breach", value: "3", trend: "2 documente, 1 IoT", tone: "red" }
];

export const v61GoodDayParityScores: V61GoodDayParityScore[] = [
  { feature: "Custom workflows", before: 3.4, after: 4.3, implemented: "Rule engine, triggers/actions, domain workflows" },
  { feature: "Task automation", before: 3.7, after: 4.4, implemented: "Cross-module task factory and queue" },
  { feature: "SLA operations", before: 3.2, after: 4.2, implemented: "SLA policies, breach dashboard, escalation paths" },
  { feature: "Operations command center", before: 3.8, after: 4.5, implemented: "Enterprise metrics, ready queue, risk radar" },
  { feature: "Servelect module integration", before: 4.0, after: 4.6, implemented: "IoT, stock, invoices, documents, team overload tied to tasks" },
  { feature: "Enterprise readiness", before: 4.1, after: 4.5, implemented: "Shadow-safe actions, approval-required writes, audit requirements" }
];

export function getV61WorkflowAutomationSnapshot() {
  const activeRules = v61WorkflowRules.filter((rule) => rule.status === "active").length;
  const shadowRules = v61WorkflowRules.filter((rule) => rule.status === "shadow").length;
  const breachedSla = v61SlaPolicies.reduce((sum, policy) => sum + policy.breachedItems, 0);
  const queuedTasks = v61GeneratedTasks.filter((task) => task.status === "queued" || task.status === "ready").length;
  const avgScore = Math.round(v61WorkflowRules.reduce((sum, rule) => sum + rule.automationScore, 0) / v61WorkflowRules.length);

  return {
    version: "6.1.0",
    release: "Workflow Automation, SLA Engine & Cross-Module Task Factory",
    activeRules,
    shadowRules,
    breachedSla,
    queuedTasks,
    avgScore,
    metrics: v61CommandCenterMetrics,
    rules: v61WorkflowRules,
    slaPolicies: v61SlaPolicies,
    generatedTasks: v61GeneratedTasks,
    parity: v61GoodDayParityScores
  };
}

export function simulateV61WorkflowRun(ruleId: string) {
  const rule = v61WorkflowRules.find((item) => item.id === ruleId) ?? v61WorkflowRules[0];
  const generatedTasks = v61GeneratedTasks.filter((task) => task.source === rule.domain);
  return {
    ruleId: rule.id,
    ruleName: rule.name,
    mode: rule.status === "active" ? "safe execution" : "shadow evaluation",
    approvalRequired: rule.approvalRequired,
    actions: rule.actions.map((action) => ({
      id: action.id,
      label: action.label,
      writeMode: action.writeMode,
      auditRequired: action.auditRequired
    })),
    generatedTasks,
    auditEvent: `v6.1 workflow ${rule.id} evaluated at 2026-06-08T09:45:00`,
    nextStep: rule.approvalRequired ? "Manager approval required before real mutation" : "Ready for safe task creation"
  };
}
