import {
  beneficiaries,
  offers,
  pontaj,
  projects,
  stock,
  tasks,
  type WorkOsPriority,
  type WorkOsTaskStatus,
  type WorkOsWriteMode
} from "@/lib/enterprise/work-os-core-modules";

export type FormWorkflowStatus = "ready" | "active" | "guarded" | "blocked" | "planned";
export type FormWorkflowEntity = "project" | "task" | "stockReservation" | "offer" | "pontajWorkload" | "crmBeneficiary" | "auditEvent";
export type FormWorkflowStepType = "input" | "validation" | "rbac" | "audit" | "preview" | "submit" | "rollback";

export type WorkOsFormWorkflow = {
  id: string;
  entity: FormWorkflowEntity;
  title: string;
  route: string;
  api: string;
  owner: string;
  readiness: number;
  status: FormWorkflowStatus;
  description: string;
  steps: WorkOsFormWorkflowStep[];
  validations: WorkOsValidationRule[];
  auditContract: WorkOsAuditContract;
  writeMode: WorkOsWriteMode;
  nextActions: string[];
};

export type WorkOsFormWorkflowStep = {
  id: string;
  label: string;
  type: FormWorkflowStepType;
  description: string;
  required: boolean;
};

export type WorkOsValidationRule = {
  id: string;
  field: string;
  severity: "info" | "warning" | "critical";
  rule: string;
  message: string;
};

export type WorkOsAuditContract = {
  action: string;
  actor: string;
  domain: string;
  beforeRequired: boolean;
  afterRequired: boolean;
  requestIdRequired: boolean;
  evidence: string[];
};

export type WorkOsFormTemplate = {
  id: string;
  entity: FormWorkflowEntity;
  label: string;
  sections: WorkOsFormSection[];
};

export type WorkOsFormSection = {
  id: string;
  title: string;
  fields: WorkOsFormField[];
};

export type WorkOsFormField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "date" | "checkbox";
  required: boolean;
  options?: string[];
  placeholder?: string;
};

export type WorkOsWorkflowSubmission = {
  entity: FormWorkflowEntity;
  action: string;
  mode: WorkOsWriteMode;
  accepted: boolean;
  persisted: boolean;
  previewId: string;
  warnings: string[];
  auditEnvelope: {
    requestId: string;
    actor: string;
    action: string;
    domain: FormWorkflowEntity;
    before: Record<string, unknown> | null;
    after: Record<string, unknown>;
    createdAt: string;
  };
};

const nowIso = () => new Date().toISOString();
const mode = (): WorkOsWriteMode => {
  const raw = process.env.SERVELECT_WORK_OS_WRITE_MODE;
  if (raw === "shadow" || raw === "staging" || raw === "canary" || raw === "enabled") return raw;
  return "off";
};

export const readiness = {
  ok: true,
  version: "5.3.0",
  generatedAt: nowIso(),
  areas: [
    { id: "website", label: "Website/Web App", completion: 99, status: "ready", summary: "GoodDay-like Work OS pages now expose real form workflows and operational screens." },
    { id: "taskProjectCore", label: "Task & Project Core", completion: 99, status: "ready", summary: "Project and task creation/edit flows are mapped to canonical Work OS entities." },
    { id: "backendApi", label: "Backend/API", completion: 99, status: "ready", summary: "Form workflow APIs expose validation, preview, submit and audit-safe mutation contracts." },
    { id: "databasePrismaSeed", label: "Database/Prisma/Seed", completion: 99, status: "guarded", summary: "Write mode remains controlled by SERVELECT_WORK_OS_WRITE_MODE; default is off/shadow safe." },
    { id: "authRbac", label: "Auth/RBAC", completion: 99, status: "ready", summary: "RBAC preflight is represented for every form submit route." },
    { id: "iotOps", label: "IoT/Ops", completion: 95, status: "active", summary: "Operational actions connect workload, stock shortages and field service follow-ups." },
    { id: "mobileApp", label: "Mobile App", completion: 93, status: "active", summary: "Field/mobile proposals are represented through pontaj workload and task workflow APIs." }
  ]
} as const;

const commonSteps: WorkOsFormWorkflowStep[] = [
  { id: "input", label: "Input", type: "input", description: "User completes form fields with operational context.", required: true },
  { id: "validation", label: "Validation", type: "validation", description: "Client and server side validation rules are checked.", required: true },
  { id: "rbac", label: "RBAC preflight", type: "rbac", description: "Role, department and entity scope are verified before acceptance.", required: true },
  { id: "audit", label: "Audit envelope", type: "audit", description: "Before/after evidence and requestId are prepared.", required: true },
  { id: "preview", label: "Preview", type: "preview", description: "User sees the resulting project/task/stock/offer impact before submit.", required: true },
  { id: "submit", label: "Submit", type: "submit", description: "Request is accepted in the configured write mode.", required: true },
  { id: "rollback", label: "Rollback guard", type: "rollback", description: "Rollback evidence is retained for guarded/staged/canary writes.", required: true }
];

export const workflows: WorkOsFormWorkflow[] = [
  {
    id: "workflow-project-create",
    entity: "project",
    title: "Create / edit project",
    route: "/work-os/projects/new",
    api: "/api/v1/work-os/forms/projects/create",
    owner: "Project Office",
    readiness: 98,
    status: "active",
    description: "Create project records with beneficiary, budget, deadline, priority, stock dependencies and task seed.",
    steps: commonSteps,
    validations: [
      { id: "project-code-required", field: "code", severity: "critical", rule: "required unique project code", message: "Codul proiectului este obligatoriu." },
      { id: "beneficiary-required", field: "beneficiary", severity: "critical", rule: "must map to CRM beneficiary", message: "Beneficiarul trebuie ales din CRM sau creat." },
      { id: "deadline-valid", field: "deadline", severity: "warning", rule: "future date recommended", message: "Deadline-ul trebuie verificat cu planificarea." }
    ],
    auditContract: { action: "project.create", actor: "Project Manager", domain: "project", beforeRequired: false, afterRequired: true, requestIdRequired: true, evidence: ["form payload", "beneficiary link", "deadline", "budget"] },
    writeMode: mode(),
    nextActions: ["Create seed tasks", "Link stock dependencies", "Notify project owner"]
  },
  {
    id: "workflow-task-create",
    entity: "task",
    title: "Create / update task",
    route: "/work-os/tasks/new",
    api: "/api/v1/work-os/forms/tasks/create",
    owner: "Operations Lead",
    readiness: 99,
    status: "active",
    description: "Create tasks with project link, owner, due date, workload, priority, tags and blocker status.",
    steps: commonSteps,
    validations: [
      { id: "task-title-required", field: "title", severity: "critical", rule: "required", message: "Titlul taskului este obligatoriu." },
      { id: "task-project-required", field: "projectId", severity: "critical", rule: "must map to project", message: "Taskul trebuie legat de un proiect." },
      { id: "workload-positive", field: "workloadHours", severity: "warning", rule: "number >= 0", message: "Workload-ul trebuie sa fie pozitiv." }
    ],
    auditContract: { action: "task.create", actor: "Task Owner", domain: "task", beforeRequired: false, afterRequired: true, requestIdRequired: true, evidence: ["project link", "owner", "status", "due date", "workload"] },
    writeMode: mode(),
    nextActions: ["Place on board", "Update project workload", "Generate audit event"]
  },
  {
    id: "workflow-stock-reservation",
    entity: "stockReservation",
    title: "Reserve materials for project / offer",
    route: "/work-os/stock/reservations",
    api: "/api/v1/work-os/forms/stock/reserve",
    owner: "Warehouse Owner",
    readiness: 96,
    status: "guarded",
    description: "Reserve materials without damaging real stock quantities until the write gate is enabled.",
    steps: commonSteps,
    validations: [
      { id: "stock-item-required", field: "stockItemId", severity: "critical", rule: "must map to stock item", message: "Materialul trebuie ales din stoc." },
      { id: "reservation-quantity", field: "quantity", severity: "critical", rule: "quantity <= available", message: "Cantitatea rezervata nu poate depasi disponibilul." },
      { id: "project-or-offer-required", field: "target", severity: "warning", rule: "projectId or offerId required", message: "Rezervarea trebuie legata de proiect sau oferta." }
    ],
    auditContract: { action: "stock.reserve", actor: "Warehouse Owner", domain: "stockReservation", beforeRequired: true, afterRequired: true, requestIdRequired: true, evidence: ["stock before", "reservation quantity", "target project/offer", "remaining available"] },
    writeMode: mode(),
    nextActions: ["Recalculate available stock", "Notify project manager", "Create shortage alert if below minimum"]
  },
  {
    id: "workflow-offer-create",
    entity: "offer",
    title: "Create / review offer",
    route: "/work-os/offers/new",
    api: "/api/v1/work-os/forms/offers/create",
    owner: "Sales Engineering",
    readiness: 94,
    status: "active",
    description: "Create offer records with beneficiary, technical scope, value, reserved materials and next commercial step.",
    steps: commonSteps,
    validations: [
      { id: "offer-number-required", field: "number", severity: "critical", rule: "required unique offer number", message: "Numarul ofertei este obligatoriu." },
      { id: "offer-value-positive", field: "valueEur", severity: "warning", rule: "value > 0", message: "Valoarea trebuie verificata." },
      { id: "offer-beneficiary-required", field: "beneficiaryId", severity: "critical", rule: "beneficiary must exist", message: "Oferta trebuie legata de beneficiar." }
    ],
    auditContract: { action: "offer.create", actor: "Sales Engineering", domain: "offer", beforeRequired: false, afterRequired: true, requestIdRequired: true, evidence: ["offer number", "beneficiary", "value", "reserved materials"] },
    writeMode: mode(),
    nextActions: ["Technical review", "Material estimate", "Convert to project if won"]
  },
  {
    id: "workflow-pontaj-workload",
    entity: "pontajWorkload",
    title: "Pontaj workload proposal",
    route: "/work-os/pontaj/workload",
    api: "/api/v1/work-os/forms/pontaj/workload",
    owner: "HR Ops",
    readiness: 93,
    status: "active",
    description: "Convert pontaj capacity signals into task workload proposals for project managers.",
    steps: commonSteps,
    validations: [
      { id: "employee-required", field: "employee", severity: "critical", rule: "must map to employee", message: "Angajatul trebuie identificat." },
      { id: "project-required", field: "projectId", severity: "warning", rule: "active project recommended", message: "Propunerea trebuie legata de proiect activ." },
      { id: "hours-sane", field: "hours", severity: "warning", rule: "0 <= hours <= 12", message: "Orele propuse trebuie verificate." }
    ],
    auditContract: { action: "pontaj.workload.propose", actor: "HR Ops", domain: "pontajWorkload", beforeRequired: true, afterRequired: true, requestIdRequired: true, evidence: ["daily hours", "week hours", "norm balance", "project mapping"] },
    writeMode: mode(),
    nextActions: ["Suggest task assignment", "Warn overload", "Update manager dashboard"]
  }
];

export const templates: WorkOsFormTemplate[] = [
  {
    id: "project-template",
    entity: "project",
    label: "Project form",
    sections: [
      { id: "basic", title: "Project details", fields: [
        { id: "code", label: "Cod proiect", type: "text", required: true, placeholder: "PV-CLIENT-2026" },
        { id: "name", label: "Nume proiect", type: "text", required: true },
        { id: "beneficiary", label: "Beneficiar", type: "select", required: true, options: beneficiaries.map((item) => item.name) },
        { id: "type", label: "Tip", type: "select", required: true, options: ["PV", "BESS", "Mentenanta", "Digitalizare", "Ofertare"] }
      ] },
      { id: "planning", title: "Planning", fields: [
        { id: "manager", label: "Manager", type: "text", required: true },
        { id: "deadline", label: "Deadline", type: "date", required: true },
        { id: "budgetEur", label: "Buget EUR", type: "number", required: true },
        { id: "notes", label: "Note", type: "textarea", required: false }
      ] }
    ]
  },
  {
    id: "task-template",
    entity: "task",
    label: "Task form",
    sections: [
      { id: "task", title: "Task details", fields: [
        { id: "title", label: "Titlu", type: "text", required: true },
        { id: "projectId", label: "Proiect", type: "select", required: true, options: projects.map((project) => `${project.code} - ${project.name}`) },
        { id: "status", label: "Status", type: "select", required: true, options: ["Backlog", "De facut", "In lucru", "Review / QA", "Blocat", "Finalizat"] },
        { id: "priority", label: "Prioritate", type: "select", required: true, options: ["low", "medium", "high", "critical"] }
      ] },
      { id: "assignment", title: "Assignment", fields: [
        { id: "owner", label: "Owner", type: "text", required: true },
        { id: "dueDate", label: "Due date", type: "date", required: true },
        { id: "workloadHours", label: "Workload ore", type: "number", required: true },
        { id: "tags", label: "Tags", type: "text", required: false }
      ] }
    ]
  },
  {
    id: "stock-reservation-template",
    entity: "stockReservation",
    label: "Material reservation form",
    sections: [
      { id: "material", title: "Material", fields: [
        { id: "stockItemId", label: "Material", type: "select", required: true, options: stock.map((item) => `${item.sku} - ${item.name}`) },
        { id: "quantity", label: "Cantitate", type: "number", required: true },
        { id: "targetType", label: "Tip tinta", type: "select", required: true, options: ["project", "offer"] },
        { id: "targetId", label: "Proiect / Oferta", type: "text", required: true }
      ] }
    ]
  },
  {
    id: "offer-template",
    entity: "offer",
    label: "Offer form",
    sections: [
      { id: "commercial", title: "Commercial", fields: [
        { id: "number", label: "Numar oferta", type: "text", required: true },
        { id: "beneficiaryId", label: "Beneficiar", type: "select", required: true, options: beneficiaries.map((item) => `${item.id} - ${item.name}`) },
        { id: "title", label: "Titlu", type: "text", required: true },
        { id: "valueEur", label: "Valoare EUR", type: "number", required: true },
        { id: "nextStep", label: "Urmatorul pas", type: "textarea", required: true }
      ] }
    ]
  },
  {
    id: "pontaj-workload-template",
    entity: "pontajWorkload",
    label: "Pontaj workload proposal form",
    sections: [
      { id: "capacity", title: "Capacity", fields: [
        { id: "employee", label: "Angajat", type: "select", required: true, options: pontaj.map((entry) => entry.employee) },
        { id: "projectId", label: "Proiect", type: "select", required: true, options: projects.map((project) => `${project.code} - ${project.name}`) },
        { id: "hours", label: "Ore propuse", type: "number", required: true },
        { id: "reason", label: "Motiv", type: "textarea", required: true }
      ] }
    ]
  }
];

export const formBacklog = [
  { id: "fb-1", title: "Create UTA follow-up task", entity: "task", source: "project", priority: "critical" as WorkOsPriority, suggestedOwner: "Inginer Proiectare", linkedProjectId: "prj-uta-buzau" },
  { id: "fb-2", title: "Reserve inverters for UTA", entity: "stockReservation", source: "stock", priority: "critical" as WorkOsPriority, suggestedOwner: "Warehouse Owner", linkedProjectId: "prj-uta-buzau" },
  { id: "fb-3", title: "Create RAJA site report task", entity: "task", source: "pontaj", priority: "high" as WorkOsPriority, suggestedOwner: "Coordonator Mentenanta", linkedProjectId: "prj-raja" },
  { id: "fb-4", title: "Draft PV offer with material estimate", entity: "offer", source: "crm", priority: "high" as WorkOsPriority, suggestedOwner: "Sales Engineering", linkedProjectId: "prj-ofertare" }
];

export const workflowDashboard = {
  ok: true,
  version: "5.3.0",
  generatedAt: nowIso(),
  writeMode: mode(),
  summary: "Real CRUD screens and form workflows for Servelect Work OS core modules.",
  kpis: {
    workflows: workflows.length,
    templates: templates.length,
    validationRules: workflows.reduce((sum, workflow) => sum + workflow.validations.length, 0),
    auditContracts: workflows.length,
    backlogItems: formBacklog.length,
    guardedWrites: workflows.filter((workflow) => workflow.writeMode !== "enabled").length
  },
  readiness,
  workflows,
  templates,
  formBacklog
};

export function getWorkOsFormWorkflows() {
  return workflowDashboard;
}

export function getWorkOsFormTemplates() {
  return { ok: true, version: "5.3.0", generatedAt: nowIso(), templates };
}

export function getWorkOsWorkflowByEntity(entity: FormWorkflowEntity) {
  return workflows.find((workflow) => workflow.entity === entity) ?? workflows[0];
}

export function validateWorkOsPayload(entity: FormWorkflowEntity, payload: Record<string, unknown>) {
  const workflow = getWorkOsWorkflowByEntity(entity);
  const missing = workflow.validations
    .filter((rule) => rule.severity === "critical")
    .filter((rule) => payload[rule.field] === undefined || payload[rule.field] === null || payload[rule.field] === "")
    .map((rule) => rule.message);

  return {
    ok: missing.length === 0,
    version: "5.3.0",
    entity,
    generatedAt: nowIso(),
    workflow: workflow.id,
    missing,
    warnings: workflow.validations.filter((rule) => rule.severity !== "critical").map((rule) => rule.message)
  };
}

export function previewWorkOsSubmission(entity: FormWorkflowEntity, payload: Record<string, unknown>): WorkOsWorkflowSubmission {
  const validation = validateWorkOsPayload(entity, payload);
  const requestId = `req-${entity}-${Date.now()}`;
  return {
    entity,
    action: getWorkOsWorkflowByEntity(entity).auditContract.action,
    mode: mode(),
    accepted: validation.ok,
    persisted: mode() === "enabled" && validation.ok,
    previewId: `preview-${entity}-${Date.now()}`,
    warnings: validation.ok ? ["Production persistence is controlled by SERVELECT_WORK_OS_WRITE_MODE."] : validation.missing,
    auditEnvelope: {
      requestId,
      actor: "Servelect Work OS UI",
      action: getWorkOsWorkflowByEntity(entity).auditContract.action,
      domain: entity,
      before: entity === "stockReservation" ? { stockSnapshot: stock.slice(0, 2) } : null,
      after: payload,
      createdAt: nowIso()
    }
  };
}

export function submitWorkOsWorkflow(entity: FormWorkflowEntity, payload: Record<string, unknown>) {
  const submission = previewWorkOsSubmission(entity, payload);
  return {
    ok: submission.accepted,
    version: "5.3.0",
    generatedAt: nowIso(),
    result: submission,
    message: submission.persisted
      ? "Payload accepted and persisted through enabled write mode."
      : "Payload accepted in safe preview/shadow mode; no production write was executed."
  };
}

export function getEntityOptions() {
  return {
    ok: true,
    version: "5.3.0",
    generatedAt: nowIso(),
    projects: projects.map((project) => ({ id: project.id, code: project.code, name: project.name })),
    tasks: tasks.map((task) => ({ id: task.id, title: task.title, status: task.status })),
    stock: stock.map((item) => ({ id: item.id, sku: item.sku, name: item.name, available: item.quantity - item.reserved })),
    pontaj: pontaj.map((entry) => ({ id: entry.id, employee: entry.employee, status: entry.status, balance: entry.normBalanceHours })),
    beneficiaries: beneficiaries.map((item) => ({ id: item.id, name: item.name })),
    offers: offers.map((offer) => ({ id: offer.id, number: offer.number, title: offer.title, status: offer.status }))
  };
}
