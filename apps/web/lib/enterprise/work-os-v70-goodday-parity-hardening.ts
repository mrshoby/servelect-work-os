export const V70_RELEASE_VERSION = "7.0.2";
export const V70_STORAGE_KEY = "servelect-work-os-v70-goodday-parity-hardening";

export type V70Status = "Backlog" | "De facut" | "In lucru" | "Review" | "Aprobare" | "Blocat" | "Finalizat" | "Anulat";
export type V70Priority = "Low" | "Normal" | "High" | "Urgent" | "Critical";
export type V70Department = "Management" | "Audit" | "Administrativ" | "Automatizari" | "Audit energetic" | "Comercial" | "Marketing" | "Productie" | "Mentenanta" | "Achizitii" | "Financiar" | "HR";
export type V70Role = "Super Admin" | "Global Admin" | "Department Admin" | "Manager" | "Project Manager" | "Team Lead" | "Specialist" | "Tehnician" | "Procurement" | "Finance" | "HR" | "Client";
export type V70EntityKind = "task" | "ticket" | "request" | "approval" | "notification" | "time" | "timesheet" | "automation" | "workflow" | "report";
export type V70FeatureState = "REAL_LOCAL_PERSISTENT" | "API_PREPARED" | "MOCK_INTERACTIVE" | "STATIC_UI" | "MISSING" | "BROKEN";

export interface V70User {
  id: string;
  name: string;
  role: V70Role;
  department: V70Department;
  managerId?: string;
  capacityMinutesPerWeek: number;
  avatar: string;
}

export interface V70Project {
  id: string;
  code: string;
  name: string;
  clientName: string;
  department: V70Department;
  managerId: string;
  status: "Activ" | "Viitor" | "Finalizat" | "Blocat";
  portfolio: string;
  folder: string;
}

export interface V70TaskType {
  id: string;
  name: string;
  icon: string;
  defaultWorkflowId: string;
  requiredFieldIds: string[];
  description: string;
}

export interface V70CustomField {
  id: string;
  name: string;
  type: "text" | "number" | "select" | "date" | "boolean";
  appliesTo: string[];
  required: boolean;
  options: string[];
}

export interface V70WorkflowStatus {
  id: V70Status;
  label: string;
  category: "todo" | "doing" | "review" | "done" | "blocked";
}

export interface V70Workflow {
  id: string;
  name: string;
  taskTypeIds: string[];
  statuses: V70WorkflowStatus[];
  transitions: Record<string, V70Status[]>;
  approvalGateStatuses: V70Status[];
  requiredFieldsByStatus: Record<string, string[]>;
}

export interface V70Comment { id: string; authorId: string; body: string; createdAt: string; }
export interface V70Attachment { id: string; name: string; type: "PDF" | "Image" | "Doc" | "Link" | "CSV"; url: string; }
export interface V70Activity { id: string; entityKind: V70EntityKind; entityId: string; actorId: string; action: string; detail?: string; createdAt: string; }
export interface V70ChecklistItem { id: string; title: string; done: boolean; }

export interface V70Task {
  id: string;
  code: string;
  title: string;
  description: string;
  typeId: string;
  status: V70Status;
  priority: V70Priority;
  projectId: string;
  department: V70Department;
  ownerId: string;
  assigneeId: string;
  watcherIds: string[];
  dueDate: string;
  startDate?: string;
  estimateMinutes: number;
  progress: number;
  customFields: Record<string, string | number | boolean>;
  checklist: V70ChecklistItem[];
  comments: V70Comment[];
  attachments: V70Attachment[];
  dependencyIds: string[];
  recurrenceRule?: string;
  reminderAt?: string;
  ticketId?: string;
  requestId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface V70Ticket {
  id: string;
  code: string;
  title: string;
  type: "Client" | "IoT" | "Internal" | "Maintenance" | "Procurement" | "HR";
  severity: V70Priority;
  status: "Nou" | "In triere" | "In lucru" | "Asteapta client" | "Escaladat" | "Rezolvat" | "Inchis";
  requester: string;
  requesterId?: string;
  assigneeId: string;
  projectId?: string;
  clientName?: string;
  equipmentId?: string;
  slaDueAt: string;
  escalated: boolean;
  taskId?: string;
  comments: V70Comment[];
  attachments: V70Attachment[];
  activity: V70Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface V70RequestFormField { id: string; label: string; type: "text" | "select" | "date" | "number"; required: boolean; options: string[]; }
export interface V70RequestForm { id: string; name: string; target: "task" | "ticket" | "project"; department: V70Department; fields: V70RequestFormField[]; active: boolean; submissions: number; }
export interface V70RequestSubmission { id: string; formId: string; requester: string; values: Record<string, string>; convertedToKind?: "task" | "ticket" | "project"; convertedToId?: string; createdAt: string; }

export interface V70Notification {
  id: string;
  title: string;
  body: string;
  userId: string;
  read: boolean;
  entityKind: V70EntityKind;
  entityId: string;
  route: string;
  createdAt: string;
}

export interface V70Approval {
  id: string;
  title: string;
  entityKind: V70EntityKind;
  entityId: string;
  requesterId: string;
  approverId: string;
  status: "Pending" | "Approved" | "Rejected";
  comment?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface V70SavedView {
  id: string;
  name: string;
  scope: "tasks" | "tickets" | "workload" | "reports" | "timesheets";
  route: string;
  ownerId: string;
  shared: boolean;
  filters: Record<string, string | boolean>;
  columns: string[];
  density: "compact" | "comfortable";
  grouping: string;
  createdAt: string;
}

export interface V70TimeEntry { id: string; taskId: string; userId: string; date: string; minutes: number; note: string; source: "Timer" | "Manual" | "Field"; createdAt: string; }
export interface V70Timesheet { id: string; userId: string; weekStart: string; status: "Draft" | "Submitted" | "Approved" | "Rejected"; entryIds: string[]; totalMinutes: number; managerId: string; submittedAt?: string; decidedAt?: string; }

export interface V70AutomationRule {
  id: string;
  name: string;
  trigger: "iot_alarm" | "ticket_sla_risk" | "task_overdue" | "project_completed" | "stock_low" | "certification_expiring" | "approval_requested";
  condition: string;
  action: "create_ticket" | "create_task" | "notify_manager" | "request_approval" | "create_handover_checklist";
  enabled: boolean;
  runs: number;
  lastRunAt?: string;
}

export interface V70ReportDefinition { id: string; name: string; type: "tasks" | "tickets" | "workload" | "timesheets" | "projects"; filters: Record<string, string>; lastExportAt?: string; }

export interface V70State {
  users: V70User[];
  projects: V70Project[];
  taskTypes: V70TaskType[];
  customFields: V70CustomField[];
  workflows: V70Workflow[];
  tasks: V70Task[];
  tickets: V70Ticket[];
  requestForms: V70RequestForm[];
  requestSubmissions: V70RequestSubmission[];
  notifications: V70Notification[];
  approvals: V70Approval[];
  savedViews: V70SavedView[];
  timeEntries: V70TimeEntry[];
  timesheets: V70Timesheet[];
  automations: V70AutomationRule[];
  reports: V70ReportDefinition[];
  activity: V70Activity[];
}

export const v70Now = () => new Date().toISOString();
export const v70Id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
export const v70DaysFromNow = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
export const minutesToHuman = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

function activity(entityKind: V70EntityKind, entityId: string, actorId: string, action: string, detail?: string): V70Activity {
  return { id: v70Id("act"), entityKind, entityId, actorId, action, detail, createdAt: v70Now() };
}

export function buildV70Seed(): V70State {
  const users: V70User[] = [
    { id: "u_andrei", name: "Andrei Popescu", role: "Super Admin", department: "Management", capacityMinutesPerWeek: 2400, avatar: "AP" },
    { id: "u_ioana", name: "Ioana Marinescu", role: "Manager", department: "Productie", managerId: "u_andrei", capacityMinutesPerWeek: 2400, avatar: "IM" },
    { id: "u_mihai", name: "Mihai Ionescu", role: "Tehnician", department: "Mentenanta", managerId: "u_ioana", capacityMinutesPerWeek: 2400, avatar: "MI" },
    { id: "u_vlad", name: "Vlad Neagu", role: "Specialist", department: "Audit energetic", managerId: "u_andrei", capacityMinutesPerWeek: 2400, avatar: "VN" },
    { id: "u_alexandra", name: "Alexandra Rusu", role: "Finance", department: "Financiar", managerId: "u_andrei", capacityMinutesPerWeek: 2400, avatar: "AR" },
    { id: "u_cristian", name: "Cristian Radu", role: "Procurement", department: "Achizitii", managerId: "u_andrei", capacityMinutesPerWeek: 2400, avatar: "CR" }
  ];

  const projects: V70Project[] = [
    { id: "p_green_500", code: "P-2024-0103", name: "Sistem FV 500 kWp GreenFactory SA", clientName: "GreenFactory SA", department: "Productie", managerId: "u_ioana", status: "Activ", portfolio: "Industrial PV", folder: "Executie 2026" },
    { id: "p_cluj_96", code: "P-2024-0187", name: "Sistem FV 9.6 kWp Cluj-Napoca", clientName: "Primaria Cluj-Napoca", department: "Audit energetic", managerId: "u_vlad", status: "Activ", portfolio: "Audit + Prosumatori", folder: "Audit 2026" },
    { id: "p_ev_timisoara", code: "P-2024-0142", name: "Statie incarcare EV Timisoara", clientName: "UTA Buzau", department: "Productie", managerId: "u_ioana", status: "Viitor", portfolio: "EV Charging", folder: "Pipeline" }
  ];

  const workflows: V70Workflow[] = [
    {
      id: "wf_standard",
      name: "Standard Servelect task workflow",
      taskTypeIds: ["type_task", "type_request", "type_document", "type_procurement", "type_iot", "type_hr"],
      statuses: [
        { id: "Backlog", label: "Backlog", category: "todo" },
        { id: "De facut", label: "De facut", category: "todo" },
        { id: "In lucru", label: "In lucru", category: "doing" },
        { id: "Review", label: "Review", category: "review" },
        { id: "Aprobare", label: "Aprobare", category: "review" },
        { id: "Blocat", label: "Blocat", category: "blocked" },
        { id: "Finalizat", label: "Finalizat", category: "done" },
        { id: "Anulat", label: "Anulat", category: "done" }
      ],
      transitions: {
        "Backlog": ["De facut", "Anulat"],
        "De facut": ["In lucru", "Blocat", "Anulat"],
        "In lucru": ["Review", "Blocat", "Aprobare"],
        "Review": ["In lucru", "Aprobare", "Finalizat"],
        "Aprobare": ["Finalizat", "In lucru"],
        "Blocat": ["In lucru", "Anulat"],
        "Finalizat": [],
        "Anulat": []
      },
      approvalGateStatuses: ["Aprobare"],
      requiredFieldsByStatus: { "Review": ["cf_deliverable"], "Aprobare": ["cf_costImpact"], "Finalizat": ["cf_deliverable"] }
    }
  ];

  const taskTypes: V70TaskType[] = [
    { id: "type_task", name: "Task", icon: "check", defaultWorkflowId: "wf_standard", requiredFieldIds: ["cf_deliverable"], description: "Activitate standard de proiect." },
    { id: "type_ticket", name: "Ticket", icon: "ticket", defaultWorkflowId: "wf_standard", requiredFieldIds: ["cf_slaClass"], description: "Incident, cerere sau suport operational." },
    { id: "type_request", name: "Request", icon: "form", defaultWorkflowId: "wf_standard", requiredFieldIds: ["cf_requestSource"], description: "Cerere convertibila in task, ticket sau proiect." },
    { id: "type_iot", name: "IoT Alert", icon: "alert", defaultWorkflowId: "wf_standard", requiredFieldIds: ["cf_equipmentId"], description: "Alerta din monitorizare energie/echipamente." },
    { id: "type_procurement", name: "Procurement", icon: "box", defaultWorkflowId: "wf_standard", requiredFieldIds: ["cf_costImpact"], description: "Achizitie sau stoc sub minim." },
    { id: "type_document", name: "Document", icon: "file", defaultWorkflowId: "wf_standard", requiredFieldIds: ["cf_deliverable"], description: "Document tehnic, PV receptie, aviz, raport." },
    { id: "type_hr", name: "HR", icon: "user", defaultWorkflowId: "wf_standard", requiredFieldIds: ["cf_requestSource"], description: "Certificari, pontaj, training, concedii." }
  ];

  const customFields: V70CustomField[] = [
    { id: "cf_slaClass", name: "SLA class", type: "select", appliesTo: ["type_ticket", "type_iot"], required: true, options: ["4h", "24h", "3 zile", "Planificat"] },
    { id: "cf_equipmentId", name: "Equipment / serial", type: "text", appliesTo: ["type_iot", "type_ticket"], required: false, options: [] },
    { id: "cf_costImpact", name: "Impact cost EUR", type: "number", appliesTo: ["type_procurement", "type_task"], required: false, options: [] },
    { id: "cf_deliverable", name: "Livrabil", type: "text", appliesTo: ["type_task", "type_document"], required: true, options: [] },
    { id: "cf_requestSource", name: "Sursa cerere", type: "select", appliesTo: ["type_request", "type_hr"], required: true, options: ["Client", "Intern", "IoT", "Manager", "Stoc"] }
  ];

  const tasks: V70Task[] = [
    makeTask("t_pif_docs", "SWO-1001", "Verificare documente PIF si PV receptie", "type_document", "Review", "High", "p_green_500", "Productie", "u_ioana", "u_vlad", v70DaysFromNow(2), 360, 66),
    makeTask("t_inverter", "SWO-1002", "Investigatie invertor offline - hala 2", "type_iot", "In lucru", "Critical", "p_green_500", "Mentenanta", "u_ioana", "u_mihai", v70DaysFromNow(1), 240, 35),
    makeTask("t_stock_low", "SWO-1003", "Comanda cablu solar 6mm - stoc sub minim", "type_procurement", "De facut", "Urgent", "p_green_500", "Achizitii", "u_cristian", "u_cristian", v70DaysFromNow(3), 120, 10),
    makeTask("t_audit_report", "SWO-1004", "Raport audit energetic si recomandari consum", "type_task", "In lucru", "Normal", "p_cluj_96", "Audit energetic", "u_vlad", "u_vlad", v70DaysFromNow(5), 480, 52)
  ];
  tasks[1].dependencyIds = ["t_pif_docs"];
  tasks[0].customFields.cf_deliverable = "PV receptie + anexe PIF";
  tasks[1].customFields.cf_equipmentId = "INV-GF-H2-07";
  tasks[2].customFields.cf_costImpact = 1850;
  tasks[3].customFields.cf_deliverable = "Raport audit energetic";

  const tickets: V70Ticket[] = [
    { id: "tick_inv_07", code: "TCK-401", title: "Invertor offline - GreenFactory hala 2", type: "IoT", severity: "Critical", status: "Escaladat", requester: "Monitorizare IoT", assigneeId: "u_mihai", projectId: "p_green_500", clientName: "GreenFactory SA", equipmentId: "INV-GF-H2-07", slaDueAt: v70DaysFromNow(1), escalated: true, taskId: "t_inverter", comments: [], attachments: [], activity: [activity("ticket", "tick_inv_07", "u_mihai", "Ticket escalated", "SLA critic")], createdAt: v70Now(), updatedAt: v70Now() },
    { id: "tick_pif", code: "TCK-402", title: "Lipseste document PIF semnat", type: "Internal", severity: "High", status: "In lucru", requester: "Ioana Marinescu", assigneeId: "u_vlad", projectId: "p_green_500", clientName: "GreenFactory SA", slaDueAt: v70DaysFromNow(2), escalated: false, taskId: "t_pif_docs", comments: [], attachments: [], activity: [], createdAt: v70Now(), updatedAt: v70Now() }
  ];

  const requestForms: V70RequestForm[] = [
    { id: "form_client_support", name: "Cerere suport client / interventie", target: "ticket", department: "Mentenanta", active: true, submissions: 0, fields: [
      { id: "client", label: "Client", type: "text", required: true, options: [] },
      { id: "issue", label: "Problema", type: "text", required: true, options: [] },
      { id: "severity", label: "Severitate", type: "select", required: true, options: ["Normal", "High", "Urgent", "Critical"] }
    ]},
    { id: "form_project_request", name: "Cerere proiect / lucrare noua", target: "task", department: "Comercial", active: true, submissions: 0, fields: [
      { id: "client", label: "Client", type: "text", required: true, options: [] },
      { id: "scope", label: "Descriere cerere", type: "text", required: true, options: [] }
    ]}
  ];

  const notifications: V70Notification[] = [
    { id: "n_ticket", title: "Ticket escaladat", body: "Invertor offline are SLA critic.", userId: "u_ioana", read: false, entityKind: "ticket", entityId: "tick_inv_07", route: "/taskuri/tickets-notificari", createdAt: v70Now() },
    { id: "n_assign", title: "Task alocat", body: "Raport audit energetic este asignat.", userId: "u_vlad", read: false, entityKind: "task", entityId: "t_audit_report", route: "/taskuri/my-work", createdAt: v70Now() }
  ];

  const approvals: V70Approval[] = [
    { id: "ap_budget", title: "Aprobare impact cost cablu solar", requesterId: "u_cristian", approverId: "u_alexandra", entityKind: "task", entityId: "t_stock_low", status: "Pending", createdAt: v70Now() }
  ];

  const savedViews: V70SavedView[] = [
    { id: "sv_sla", name: "SLA risk tickets", scope: "tickets", route: "/taskuri/tickets-notificari", ownerId: "u_ioana", shared: true, filters: { slaRisk: true }, columns: ["code", "title", "severity", "sla", "assignee"], density: "compact", grouping: "severity", createdAt: v70Now() },
    { id: "sv_my_work", name: "My Work urgent", scope: "tasks", route: "/taskuri/my-work", ownerId: "u_vlad", shared: false, filters: { priority: "Urgent" }, columns: ["code", "title", "status", "dueDate"], density: "compact", grouping: "status", createdAt: v70Now() }
  ];

  const timeEntries: V70TimeEntry[] = [
    { id: "time_audit", taskId: "t_audit_report", userId: "u_vlad", date: v70DaysFromNow(0), minutes: 135, note: "Analiza consum + raport audit", source: "Manual", createdAt: v70Now() }
  ];
  const timesheets: V70Timesheet[] = [
    { id: "ts_vlad", userId: "u_vlad", weekStart: v70DaysFromNow(-2), status: "Draft", entryIds: ["time_audit"], totalMinutes: 135, managerId: "u_andrei" }
  ];

  const automations: V70AutomationRule[] = [
    { id: "auto_iot", name: "IoT alert -> create ticket", trigger: "iot_alarm", condition: "production=0 OR inverter offline", action: "create_ticket", enabled: true, runs: 1, lastRunAt: v70Now() },
    { id: "auto_sla", name: "Ticket SLA risk -> notify manager", trigger: "ticket_sla_risk", condition: "slaDueAt < 24h", action: "notify_manager", enabled: true, runs: 1, lastRunAt: v70Now() },
    { id: "auto_stock", name: "Stock low -> procurement task", trigger: "stock_low", condition: "quantity < minQuantity", action: "create_task", enabled: true, runs: 0 },
    { id: "auto_hr", name: "Certification expiring -> HR task", trigger: "certification_expiring", condition: "expiresIn < 30d", action: "create_task", enabled: true, runs: 0 }
  ];

  const reports: V70ReportDefinition[] = [
    { id: "rep_tasks", name: "Task execution report", type: "tasks", filters: { period: "this_week" } },
    { id: "rep_sla", name: "Ticket SLA report", type: "tickets", filters: { severity: "High+" } },
    { id: "rep_workload", name: "Workload report", type: "workload", filters: { department: "all" } },
    { id: "rep_time", name: "Timesheet report", type: "timesheets", filters: { week: "current" } }
  ];

  return { users, projects, taskTypes, customFields, workflows, tasks, tickets, requestForms, requestSubmissions: [], notifications, approvals, savedViews, timeEntries, timesheets, automations, reports, activity: [activity("task", "t_pif_docs", "u_ioana", "Seed loaded", "v7.0.0 parity hardening seed")] };
}

function makeTask(id: string, code: string, title: string, typeId: string, status: V70Status, priority: V70Priority, projectId: string, department: V70Department, ownerId: string, assigneeId: string, dueDate: string, estimateMinutes: number, progress: number): V70Task {
  return {
    id,
    code,
    title,
    description: `${title} - activitate operationala Servelect Work OS.`,
    typeId,
    status,
    priority,
    projectId,
    department,
    ownerId,
    assigneeId,
    watcherIds: [ownerId, assigneeId].filter((value, index, array) => array.indexOf(value) === index),
    dueDate,
    startDate: v70DaysFromNow(-1),
    estimateMinutes,
    progress,
    customFields: {},
    checklist: [
      { id: `${id}_c1`, title: "Date validate", done: progress > 25 },
      { id: `${id}_c2`, title: "Documente / dovezi atasate", done: progress > 60 },
      { id: `${id}_c3`, title: "Confirmare manager/client", done: progress >= 100 }
    ],
    comments: [{ id: `${id}_com`, authorId: ownerId, body: "Seed v7.0.0 GoodDay parity hardening.", createdAt: v70Now() }],
    attachments: [],
    dependencyIds: [],
    createdAt: v70Now(),
    updatedAt: v70Now()
  };
}

export function validateTransition(task: V70Task, nextStatus: V70Status, workflow: V70Workflow, customFields: V70CustomField[]) {
  const allowed = workflow.transitions[task.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    return { ok: false, message: `Tranzitie invalida: ${task.status} -> ${nextStatus}` };
  }
  const requiredIds = workflow.requiredFieldsByStatus[nextStatus] ?? [];
  const missing = requiredIds.filter((fieldId) => {
    const field = customFields.find((item) => item.id === fieldId);
    const value = task.customFields[fieldId];
    return field?.required && (value === undefined || value === "");
  });
  if (missing.length > 0) {
    return { ok: false, message: `Campuri obligatorii lipsa: ${missing.join(", ")}` };
  }
  return { ok: true, message: "Tranzitie permisa" };
}

export function calculateV70Workload(state: V70State) {
  return state.users
    .filter((user) => user.capacityMinutesPerWeek > 0)
    .map((user) => {
      const assignedTasks = state.tasks.filter((task) => task.assigneeId === user.id && task.status !== "Finalizat" && task.status !== "Anulat");
      const plannedMinutes = assignedTasks.reduce((sum, task) => sum + task.estimateMinutes, 0);
      const trackedMinutes = state.timeEntries.filter((entry) => entry.userId === user.id).reduce((sum, entry) => sum + entry.minutes, 0);
      const utilization = Math.round((plannedMinutes / Math.max(user.capacityMinutesPerWeek, 1)) * 100);
      return {
        user,
        assignedTasks,
        plannedMinutes,
        trackedMinutes,
        capacityMinutes: user.capacityMinutesPerWeek,
        utilization,
        overloaded: utilization > 100,
        underutilized: utilization < 45
      };
    });
}

export function buildNotification(userId: string, title: string, body: string, entityKind: V70EntityKind, entityId: string, route: string): V70Notification {
  return { id: v70Id("not"), title, body, userId, read: false, entityKind, entityId, route, createdAt: v70Now() };
}

export function createTaskFromTicket(ticket: V70Ticket, ownerId = "u_ioana"): V70Task {
  const id = v70Id("task");
  return {
    ...makeTask(id, `SWO-${Math.floor(2000 + Math.random() * 7999)}`, ticket.title, "type_ticket", "De facut", ticket.severity, ticket.projectId ?? "p_green_500", "Mentenanta", ownerId, ticket.assigneeId, ticket.slaDueAt.slice(0, 10), 180, 0),
    ticketId: ticket.id,
    customFields: { cf_slaClass: ticket.severity === "Critical" ? "4h" : "24h", cf_equipmentId: ticket.equipmentId ?? "" }
  };
}

export function exportV70Csv(state: V70State, type: "tasks" | "tickets" | "workload" | "timesheets") {
  if (type === "tickets") {
    const rows = state.tickets.map((ticket) => [ticket.code, ticket.title, ticket.status, ticket.severity, ticket.assigneeId, ticket.slaDueAt, String(ticket.escalated)]);
    return csv(["code", "title", "status", "severity", "assignee", "slaDueAt", "escalated"], rows);
  }
  if (type === "workload") {
    const rows = calculateV70Workload(state).map((row) => [row.user.name, row.user.department, String(row.assignedTasks.length), String(row.plannedMinutes), String(row.capacityMinutes), String(row.utilization)]);
    return csv(["user", "department", "assignedTasks", "plannedMinutes", "capacityMinutes", "utilization"], rows);
  }
  if (type === "timesheets") {
    const rows = state.timesheets.map((sheet) => [sheet.id, sheet.userId, sheet.weekStart, sheet.status, String(sheet.totalMinutes), sheet.managerId]);
    return csv(["id", "user", "weekStart", "status", "totalMinutes", "manager"], rows);
  }
  const rows = state.tasks.map((task) => [task.code, task.title, task.status, task.priority, task.projectId, task.assigneeId, task.dueDate, String(task.estimateMinutes), String(task.progress)]);
  return csv(["code", "title", "status", "priority", "project", "assignee", "dueDate", "estimateMinutes", "progress"], rows);
}

function csv(header: string[], rows: string[][]) {
  return [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
}

export function v70ProgressScores() {
  return [
    { category: "GoodDay public feature parity", before: 76, current: 81, missing: "Backend real complet, advanced reporting, enterprise access inheritance." },
    { category: "Task management core", before: 86, current: 90, missing: "Server-side multi-user concurrency." },
    { category: "Tickets / Requests / Forms", before: 55, current: 74, missing: "Backend queue, portal extern client, atasamente reale R2/S3." },
    { category: "Notifications", before: 68, current: 78, missing: "Server-side delivery, email/push, subscriptions reale." },
    { category: "Workflows / custom statuses / validations", before: 58, current: 73, missing: "Workflow builder complet, audit immutable server-side." },
    { category: "Custom fields / task types", before: 55, current: 72, missing: "Schema migrations si permissions per field." },
    { category: "Saved views / filters / table views", before: 64, current: 76, missing: "Shared views server-side si per-user columns API." },
    { category: "Dependencies / recurrence / reminders", before: 48, current: 65, missing: "Scheduler backend si rescheduling real pe Gantt." },
    { category: "Time tracking / My Time / Timesheets", before: 60, current: 72, missing: "Approval server-side, export payroll/pontaj real." },
    { category: "Workload / resource planning", before: 64, current: 74, missing: "Drag allocation pe timeline si absente/concedii live." },
    { category: "Reports / analytics", before: 52, current: 66, missing: "Charts avansate, PDF real, BI snapshots." },
    { category: "Automations", before: 50, current: 68, missing: "Engine server-side, cron/queue, retries." },
    { category: "RBAC / access rules", before: 68, current: 72, missing: "Policy enforcement backend peste toate mutatiile." },
    { category: "Backend / API / persistence", before: 42, current: 48, missing: "DB primary writes, migration, concurrent users." },
    { category: "Screenshot audit coverage", before: 35, current: 45, missing: "Rulare PNG reala confirmata in mediul local/Vercel." },
    { category: "QA/build stability", before: 80, current: 82, missing: "E2E browser flows automate, no-warning lint." },
    { category: "Production readiness", before: 45, current: 52, missing: "DB, auth real, storage, observability, backup." }
  ];
}

export function v70ParityFeatureMatrix() {
  return [
    { feature: "Tasks & Projects", status: "REAL_LOCAL_PERSISTENT" as V70FeatureState, score: 90, note: "Task CRUD, status, drawer-like updates, project links." },
    { feature: "Requests & Forms", status: "REAL_LOCAL_PERSISTENT" as V70FeatureState, score: 74, note: "Form builder simplu, submit, convert to task/ticket." },
    { feature: "Tickets", status: "REAL_LOCAL_PERSISTENT" as V70FeatureState, score: 76, note: "Ticket center, SLA, escalation, convert to task, comments." },
    { feature: "Notifications", status: "REAL_LOCAL_PERSISTENT" as V70FeatureState, score: 78, note: "Read/unread, mark all, generated by actions." },
    { feature: "Workflows", status: "REAL_LOCAL_PERSISTENT" as V70FeatureState, score: 73, note: "Definitions, transition rules, approval gates, validations." },
    { feature: "Custom fields / task types", status: "REAL_LOCAL_PERSISTENT" as V70FeatureState, score: 72, note: "Registry, admin-like edit, visible in forms/table." },
    { feature: "Saved views", status: "REAL_LOCAL_PERSISTENT" as V70FeatureState, score: 76, note: "Create/delete, filters, columns, private/shared, local persistence." },
    { feature: "Time tracking / timesheets", status: "REAL_LOCAL_PERSISTENT" as V70FeatureState, score: 72, note: "Timer/manual entries, timesheet submit/approve." },
    { feature: "Workload", status: "REAL_LOCAL_PERSISTENT" as V70FeatureState, score: 74, note: "Calculated from estimates, capacity and time entries." },
    { feature: "Automations", status: "MOCK_INTERACTIVE" as V70FeatureState, score: 68, note: "Rules run interactively; server queue pending." },
    { feature: "Backend persistence", status: "API_PREPARED" as V70FeatureState, score: 48, note: "Adapter/readiness API prepared; primary DB writes pending." },
    { feature: "Screenshot audit", status: "API_PREPARED" as V70FeatureState, score: 45, note: "Script included; must be run against local/prod browser." }
  ];
}

export function v70RouteList() {
  return [
    "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/tickets-notificari", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar", "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations", "/admin/workflows", "/admin/custom-fields", "/admin/access-rules", "/admin/goodday-parity", "/api/v1/work-os/v7-parity"
  ];
}
