export type GoodDayRole =
  | "Super Admin"
  | "Global Admin"
  | "Department Admin"
  | "Manager"
  | "Project Manager"
  | "Team Lead"
  | "Specialist"
  | "Tehnician"
  | "Procurement"
  | "Finance"
  | "HR"
  | "Client";

export type GoodDayDepartment =
  | "Management"
  | "Audit"
  | "Administrativ"
  | "Automatizari"
  | "Audit energetic"
  | "Comercial"
  | "Marketing"
  | "Productie"
  | "Mentenanta"
  | "Achizitii"
  | "Financiar";

export type GoodDayStatus = "Backlog" | "De facut" | "In lucru" | "Review" | "Blocat" | "Aprobare" | "Finalizat" | "Anulat";
export type GoodDayPriority = "Low" | "Normal" | "High" | "Urgent" | "Critical";
export type GoodDayTaskType = "Task" | "Ticket" | "Request" | "Approval" | "Maintenance" | "Procurement" | "IoT Alert" | "Document" | "CRM Follow-up" | "HR";
export type GoodDayApprovalState = "None" | "Requested" | "Approved" | "Rejected";
export type GoodDayTicketStatus = "Nou" | "In triere" | "In lucru" | "Asteapta client" | "Escaladat" | "Rezolvat" | "Inchis";
export type GoodDayEntityKind = "task" | "ticket" | "project" | "approval" | "notification" | "time" | "automation";

export interface GoodDayUser {
  id: string;
  name: string;
  role: GoodDayRole;
  department: GoodDayDepartment;
  managerId?: string;
  capacityHoursPerDay: number;
  skills: string[];
  avatar: string;
  clientId?: string;
}

export interface GoodDayClient {
  id: string;
  name: string;
  segment: "B2B" | "Public" | "Industrial" | "Residential";
}

export interface GoodDayProject {
  id: string;
  name: string;
  code: string;
  clientId: string;
  department: GoodDayDepartment;
  managerId: string;
  status: "Activ" | "Viitor" | "Finalizat" | "Blocat";
  health: "On track" | "At risk" | "Delayed" | "Closed";
  progress: number;
  budget: number;
  budgetUsed: number;
  startDate: string;
  dueDate: string;
  phase: string;
  tags: string[];
}

export interface GoodDayChecklistItem {
  id: string;
  title: string;
  done: boolean;
}

export interface GoodDayComment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface GoodDayAttachment {
  id: string;
  name: string;
  type: "PDF" | "Image" | "Doc" | "Link" | "XML";
  url: string;
}

export interface GoodDayActivity {
  id: string;
  entityId: string;
  entityKind: GoodDayEntityKind;
  actorId: string;
  action: string;
  createdAt: string;
  detail?: string;
}

export interface GoodDayTimeEntry {
  id: string;
  taskId: string;
  userId: string;
  date: string;
  minutes: number;
  note: string;
  source: "Timer" | "Manual" | "Field";
}

export interface GoodDayTask {
  id: string;
  title: string;
  description: string;
  type: GoodDayTaskType;
  status: GoodDayStatus;
  priority: GoodDayPriority;
  projectId: string;
  clientId?: string;
  department: GoodDayDepartment;
  ownerId: string;
  assigneeId: string;
  reviewerId?: string;
  watcherIds: string[];
  startDate?: string;
  dueDate: string;
  estimateMinutes: number;
  progress: number;
  tags: string[];
  customFields: Record<string, string | number | boolean>;
  dependencyIds: string[];
  approvalState: GoodDayApprovalState;
  relatedEquipmentId?: string;
  relatedTicketId?: string;
  checklist: GoodDayChecklistItem[];
  comments: GoodDayComment[];
  attachments: GoodDayAttachment[];
  activity: GoodDayActivity[];
  recurring?: "daily" | "weekly" | "monthly" | "none";
  reminderAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoodDayTicket {
  id: string;
  title: string;
  type: "Client" | "IoT" | "Internal" | "Maintenance" | "Procurement";
  severity: GoodDayPriority;
  status: GoodDayTicketStatus;
  slaDueAt: string;
  requesterId: string;
  assigneeId: string;
  projectId?: string;
  clientId?: string;
  equipmentId?: string;
  taskId?: string;
  escalated: boolean;
  comments: GoodDayComment[];
  attachments: GoodDayAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface GoodDayNotification {
  id: string;
  title: string;
  body: string;
  kind: "task_assigned" | "mention" | "ticket_escalated" | "approval_requested" | "due_soon" | "sla_risk" | "system";
  userId: string;
  read: boolean;
  entityKind: GoodDayEntityKind;
  entityId: string;
  createdAt: string;
}

export interface GoodDayApproval {
  id: string;
  title: string;
  requesterId: string;
  approverId: string;
  entityKind: GoodDayEntityKind;
  entityId: string;
  status: "Pending" | "Approved" | "Rejected";
  comment?: string;
  history: GoodDayActivity[];
  createdAt: string;
  decidedAt?: string;
}

export interface GoodDaySavedView {
  id: string;
  name: string;
  scope: "tasks" | "tickets" | "workload" | "reports";
  filters: GoodDayFilters;
  columns: string[];
  grouping?: string;
  ownerId: string;
  shared: boolean;
}

export interface GoodDayAutomationRule {
  id: string;
  name: string;
  trigger: "ticket_sla_risk" | "task_overdue" | "project_completed" | "iot_alarm" | "stock_low" | "certification_expiring";
  condition: string;
  action: "notify_manager" | "create_task" | "create_ticket" | "request_approval" | "create_handover_checklist";
  enabled: boolean;
  runs: number;
  lastRunAt?: string;
}

export interface GoodDayFilters {
  search?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  ownerId?: string;
  department?: string;
  projectId?: string;
  clientId?: string;
  tag?: string;
  overdue?: boolean;
  blocked?: boolean;
  slaRisk?: boolean;
  approvalState?: string;
}

export interface GoodDayParityState {
  users: GoodDayUser[];
  clients: GoodDayClient[];
  projects: GoodDayProject[];
  tasks: GoodDayTask[];
  tickets: GoodDayTicket[];
  notifications: GoodDayNotification[];
  approvals: GoodDayApproval[];
  timeEntries: GoodDayTimeEntry[];
  savedViews: GoodDaySavedView[];
  automations: GoodDayAutomationRule[];
  auditLog: GoodDayActivity[];
}

export const GOODDAY_PARITY_STORAGE_KEY = "servelect-goodday-parity-functional-core-v1";

const now = () => new Date().toISOString();
const daysFromNow = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

export function buildGoodDayParitySeed(): GoodDayParityState {
  const users: GoodDayUser[] = [
    { id: "u_andrei", name: "Andrei Popescu", role: "Super Admin", department: "Management", capacityHoursPerDay: 8, skills: ["PM", "Financiar", "Aprobari"], avatar: "AP" },
    { id: "u_ioana", name: "Ioana Marinescu", role: "Manager", department: "Productie", managerId: "u_andrei", capacityHoursPerDay: 8, skills: ["Santier", "Echipa", "PIF"], avatar: "IM" },
    { id: "u_mihai", name: "Mihai Ionescu", role: "Tehnician", department: "Mentenanta", managerId: "u_ioana", capacityHoursPerDay: 8, skills: ["Invertor", "Service", "QR"], avatar: "MI" },
    { id: "u_cristian", name: "Cristian Radu", role: "Procurement", department: "Achizitii", managerId: "u_andrei", capacityHoursPerDay: 8, skills: ["Stoc", "RFQ", "Furnizori"], avatar: "CR" },
    { id: "u_alexandra", name: "Alexandra Rusu", role: "Finance", department: "Financiar", managerId: "u_andrei", capacityHoursPerDay: 8, skills: ["Buget", "Facturi", "Approval"], avatar: "AR" },
    { id: "u_vlad", name: "Vlad Neagu", role: "Specialist", department: "Audit energetic", managerId: "u_andrei", capacityHoursPerDay: 8, skills: ["PVGIS", "Audit", "Raport"], avatar: "VN" },
    { id: "u_client", name: "GreenFactory SA", role: "Client", department: "Comercial", capacityHoursPerDay: 0, skills: ["Viewer"], avatar: "GF", clientId: "c_greenfactory" }
  ];

  const clients: GoodDayClient[] = [
    { id: "c_greenfactory", name: "GreenFactory SA", segment: "Industrial" },
    { id: "c_primaria_cluj", name: "Primaria Cluj-Napoca", segment: "Public" },
    { id: "c_uta_buzau", name: "UTA Buzau", segment: "B2B" }
  ];

  const projects: GoodDayProject[] = [
    { id: "p_green_500", code: "P-2024-0103", name: "Sistem FV 500 kWp GreenFactory SA", clientId: "c_greenfactory", department: "Productie", managerId: "u_ioana", status: "Activ", health: "At risk", progress: 68, budget: 740000, budgetUsed: 520000, startDate: daysFromNow(-35), dueDate: daysFromNow(28), phase: "Executie", tags: ["FV", "industrial", "PIF"] },
    { id: "p_cluj_96", code: "P-2024-0187", name: "Sistem FV 9.6 kWp Cluj-Napoca", clientId: "c_primaria_cluj", department: "Audit energetic", managerId: "u_vlad", status: "Activ", health: "On track", progress: 44, budget: 15500, budgetUsed: 6100, startDate: daysFromNow(-12), dueDate: daysFromNow(15), phase: "Audit + proiectare", tags: ["audit", "rezidential", "avize"] },
    { id: "p_ev_timisoara", code: "P-2024-0142", name: "Statie incarcare EV Timisoara", clientId: "c_uta_buzau", department: "Productie", managerId: "u_ioana", status: "Viitor", health: "On track", progress: 14, budget: 62000, budgetUsed: 3300, startDate: daysFromNow(14), dueDate: daysFromNow(55), phase: "Pregatire kickoff", tags: ["EV", "logistica"] },
    { id: "p_buzau_handover", code: "P-2023-0219", name: "UTA Buzau - handover post implementare", clientId: "c_uta_buzau", department: "Productie", managerId: "u_ioana", status: "Finalizat", health: "Closed", progress: 100, budget: 96000, budgetUsed: 94200, startDate: daysFromNow(-120), dueDate: daysFromNow(-8), phase: "Handover", tags: ["finalizat", "raport"] }
  ];

  const baseActivity = (entityId: string, entityKind: GoodDayEntityKind, actorId: string, action: string, detail?: string): GoodDayActivity => ({ id: id("act"), entityId, entityKind, actorId, action, detail, createdAt: now() });

  const tasks: GoodDayTask[] = [
    makeTask("t_pif_docs", "Verificare documente PIF si PV receptie", "Document", "Review", "High", "p_green_500", "u_ioana", "u_vlad", "Productie", daysFromNow(2), 360, 66, ["PIF", "documente"], "Requested"),
    makeTask("t_inverter_offline", "Investigatie invertor offline - hala 2", "IoT Alert", "In lucru", "Critical", "p_green_500", "u_ioana", "u_mihai", "Mentenanta", daysFromNow(1), 240, 35, ["IoT", "service"], "None", "eq_inv_07"),
    makeTask("t_stock_low", "Comanda cablu solar 6mm - stoc sub minim", "Procurement", "De facut", "Urgent", "p_green_500", "u_cristian", "u_cristian", "Achizitii", daysFromNow(3), 120, 10, ["stoc", "achizitii"], "None"),
    makeTask("t_budget_approval", "Aprobare depasire buget structura metalica", "Approval", "Aprobare", "High", "p_green_500", "u_alexandra", "u_andrei", "Financiar", daysFromNow(4), 90, 20, ["buget", "approval"], "Requested"),
    makeTask("t_audit_report", "Raport audit energetic si recomandari consum", "Task", "In lucru", "Normal", "p_cluj_96", "u_vlad", "u_vlad", "Audit energetic", daysFromNow(5), 480, 52, ["audit", "raport"], "None"),
    makeTask("t_ev_kickoff", "Checklist kickoff statie EV", "Request", "Backlog", "Normal", "p_ev_timisoara", "u_ioana", "u_ioana", "Productie", daysFromNow(12), 180, 5, ["kickoff", "EV"], "None"),
    makeTask("t_client_followup", "Follow-up client pentru extindere contract mentenanta", "CRM Follow-up", "De facut", "Normal", "p_buzau_handover", "u_andrei", "u_andrei", "Comercial", daysFromNow(7), 90, 0, ["CRM", "client"], "None"),
    makeTask("t_hr_anre", "Verificare certificare ANRE - echipa productie", "HR", "De facut", "High", "p_green_500", "u_ioana", "u_ioana", "Productie", daysFromNow(10), 120, 15, ["HR", "ANRE"], "None")
  ];

  const tickets: GoodDayTicket[] = [
    { id: "tick_inv_07", title: "Invertor offline - GreenFactory hala 2", type: "IoT", severity: "Critical", status: "Escaladat", slaDueAt: daysFromNow(1), requesterId: "u_client", assigneeId: "u_mihai", projectId: "p_green_500", clientId: "c_greenfactory", equipmentId: "eq_inv_07", taskId: "t_inverter_offline", escalated: true, comments: [], attachments: [], createdAt: now(), updatedAt: now() },
    { id: "tick_pif_missing", title: "Lipseste document PIF semnat", type: "Internal", severity: "High", status: "In lucru", slaDueAt: daysFromNow(2), requesterId: "u_ioana", assigneeId: "u_vlad", projectId: "p_green_500", clientId: "c_greenfactory", taskId: "t_pif_docs", escalated: false, comments: [], attachments: [], createdAt: now(), updatedAt: now() }
  ];

  const approvals: GoodDayApproval[] = [
    { id: "ap_budget", title: "Aprobare buget structura metalica", requesterId: "u_alexandra", approverId: "u_andrei", entityKind: "task", entityId: "t_budget_approval", status: "Pending", history: [baseActivity("t_budget_approval", "task", "u_alexandra", "Approval requested", "Depasire buget 8%")], createdAt: now() }
  ];

  const notifications: GoodDayNotification[] = [
    { id: "n1", title: "Ticket escaladat", body: "Invertor offline are SLA in risc", kind: "ticket_escalated", userId: "u_ioana", read: false, entityKind: "ticket", entityId: "tick_inv_07", createdAt: now() },
    { id: "n2", title: "Aprobare ceruta", body: "Aprobare buget structura metalica", kind: "approval_requested", userId: "u_andrei", read: false, entityKind: "approval", entityId: "ap_budget", createdAt: now() },
    { id: "n3", title: "Task alocat", body: "Raport audit energetic si recomandari consum", kind: "task_assigned", userId: "u_vlad", read: false, entityKind: "task", entityId: "t_audit_report", createdAt: now() }
  ];

  const timeEntries: GoodDayTimeEntry[] = [
    { id: "time1", taskId: "t_audit_report", userId: "u_vlad", date: daysFromNow(0), minutes: 135, note: "Analiza consum + PVGIS", source: "Manual" },
    { id: "time2", taskId: "t_inverter_offline", userId: "u_mihai", date: daysFromNow(0), minutes: 90, note: "Diagnostic remote", source: "Timer" }
  ];

  const savedViews: GoodDaySavedView[] = [
    { id: "sv_my_overdue", name: "My Work urgent/overdue", scope: "tasks", filters: { overdue: true, priority: "Urgent" }, columns: ["task", "project", "status", "assignee", "dueDate"], ownerId: "u_andrei", shared: true },
    { id: "sv_sla", name: "SLA risk tickets", scope: "tickets", filters: { slaRisk: true }, columns: ["ticket", "severity", "sla", "owner"], ownerId: "u_ioana", shared: true }
  ];

  const automations: GoodDayAutomationRule[] = [
    { id: "auto_iot", name: "IoT alarm -> ticket + task", trigger: "iot_alarm", condition: "invertor offline OR productie 0", action: "create_ticket", enabled: true, runs: 1, lastRunAt: now() },
    { id: "auto_stock", name: "Stoc sub minim -> procurement task", trigger: "stock_low", condition: "quantity < minQuantity", action: "create_task", enabled: true, runs: 0 },
    { id: "auto_sla", name: "SLA risk -> notify manager", trigger: "ticket_sla_risk", condition: "slaDueAt < 24h", action: "notify_manager", enabled: true, runs: 1, lastRunAt: now() }
  ];

  const auditLog: GoodDayActivity[] = [
    baseActivity("tick_inv_07", "ticket", "u_mihai", "Ticket escalated", "SLA critic"),
    baseActivity("t_pif_docs", "task", "u_vlad", "Task moved to Review", "Documente incarcate partial")
  ];

  return { users, clients, projects, tasks, tickets, notifications, approvals, timeEntries, savedViews, automations, auditLog };
}

function makeTask(
  taskId: string,
  title: string,
  type: GoodDayTaskType,
  status: GoodDayStatus,
  priority: GoodDayPriority,
  projectId: string,
  ownerId: string,
  assigneeId: string,
  department: GoodDayDepartment,
  dueDate: string,
  estimateMinutes: number,
  progress: number,
  tags: string[],
  approvalState: GoodDayApprovalState,
  relatedEquipmentId?: string
): GoodDayTask {
  return {
    id: taskId,
    title,
    description: `${title} - activitate operationala Servelect legata de proiect, taskuri, documente si raportare.`,
    type,
    status,
    priority,
    projectId,
    department,
    ownerId,
    assigneeId,
    reviewerId: ownerId,
    watcherIds: [ownerId, assigneeId].filter((value, index, array) => array.indexOf(value) === index),
    startDate: daysFromNow(-1),
    dueDate,
    estimateMinutes,
    progress,
    tags,
    customFields: { zona: department, sursa: type, criticitate: priority },
    dependencyIds: [],
    approvalState,
    relatedEquipmentId,
    checklist: [
      { id: `${taskId}_c1`, title: "Date validate", done: progress > 30 },
      { id: `${taskId}_c2`, title: "Documente atasate", done: progress > 60 },
      { id: `${taskId}_c3`, title: "Confirmare manager/client", done: progress >= 100 }
    ],
    comments: [{ id: `${taskId}_com1`, authorId: ownerId, body: "Task generat in seed GoodDay parity core.", createdAt: now() }],
    attachments: [],
    activity: [{ id: `${taskId}_act1`, entityId: taskId, entityKind: "task", actorId: ownerId, action: "Task created", createdAt: now() }],
    recurring: "none",
    createdAt: now(),
    updatedAt: now()
  };
}

export function canUserSeeTask(user: GoodDayUser, task: GoodDayTask, projects: GoodDayProject[]): boolean {
  if (user.role === "Super Admin" || user.role === "Global Admin") return true;
  if (user.role === "Client") return Boolean(user.clientId && (task.clientId === user.clientId || projects.find((project) => project.id === task.projectId)?.clientId === user.clientId));
  if (user.role === "Department Admin") return task.department === user.department;
  if (user.role === "Manager" || user.role === "Project Manager" || user.role === "Team Lead") return task.department === user.department || task.ownerId === user.id || task.assigneeId === user.id || task.watcherIds.includes(user.id);
  return task.ownerId === user.id || task.assigneeId === user.id || task.watcherIds.includes(user.id);
}

export function filterTasks(tasks: GoodDayTask[], filters: GoodDayFilters): GoodDayTask[] {
  const normalizedSearch = filters.search?.trim().toLowerCase();
  return tasks.filter((task) => {
    if (normalizedSearch && !`${task.title} ${task.description} ${task.tags.join(" ")}`.toLowerCase().includes(normalizedSearch)) return false;
    if (filters.status && filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.priority && filters.priority !== "all" && task.priority !== filters.priority) return false;
    if (filters.assigneeId && filters.assigneeId !== "all" && task.assigneeId !== filters.assigneeId) return false;
    if (filters.ownerId && filters.ownerId !== "all" && task.ownerId !== filters.ownerId) return false;
    if (filters.department && filters.department !== "all" && task.department !== filters.department) return false;
    if (filters.projectId && filters.projectId !== "all" && task.projectId !== filters.projectId) return false;
    if (filters.tag && filters.tag !== "all" && !task.tags.includes(filters.tag)) return false;
    if (filters.overdue && !isOverdue(task.dueDate)) return false;
    if (filters.blocked && task.status !== "Blocat") return false;
    if (filters.approvalState && filters.approvalState !== "all" && task.approvalState !== filters.approvalState) return false;
    return true;
  });
}

export function isOverdue(date: string): boolean {
  return new Date(date).getTime() < Date.now() && date !== new Date().toISOString().slice(0, 10);
}

export function minutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function calculateWorkload(users: GoodDayUser[], tasks: GoodDayTask[], timeEntries: GoodDayTimeEntry[]) {
  return users
    .filter((user) => user.capacityHoursPerDay > 0)
    .map((user) => {
      const assigned = tasks.filter((task) => task.assigneeId === user.id && task.status !== "Finalizat" && task.status !== "Anulat");
      const estimated = assigned.reduce((sum, task) => sum + task.estimateMinutes, 0);
      const tracked = timeEntries.filter((entry) => entry.userId === user.id).reduce((sum, entry) => sum + entry.minutes, 0);
      const weeklyCapacity = user.capacityHoursPerDay * 5 * 60;
      const utilization = Math.round((estimated / Math.max(weeklyCapacity, 1)) * 100);
      return { user, assignedCount: assigned.length, estimated, tracked, weeklyCapacity, utilization, overloaded: utilization > 100, underutilized: utilization < 45 };
    });
}

export function buildActivity(entityId: string, entityKind: GoodDayEntityKind, actorId: string, action: string, detail?: string): GoodDayActivity {
  return { id: id("act"), entityId, entityKind, actorId, action, detail, createdAt: now() };
}

export function buildNotification(userId: string, title: string, body: string, entityKind: GoodDayEntityKind, entityId: string, kind: GoodDayNotification["kind"]): GoodDayNotification {
  return { id: id("not"), title, body, userId, entityKind, entityId, kind, read: false, createdAt: now() };
}

export function createTaskFromPartial(partial: Partial<GoodDayTask> & Pick<GoodDayTask, "title" | "projectId" | "assigneeId" | "ownerId" | "department">): GoodDayTask {
  const taskId = id("task");
  return {
    id: taskId,
    title: partial.title,
    description: partial.description ?? "Task creat rapid in GoodDay parity core.",
    type: partial.type ?? "Task",
    status: partial.status ?? "De facut",
    priority: partial.priority ?? "Normal",
    projectId: partial.projectId,
    department: partial.department,
    ownerId: partial.ownerId,
    assigneeId: partial.assigneeId,
    reviewerId: partial.reviewerId,
    watcherIds: partial.watcherIds ?? [partial.ownerId, partial.assigneeId],
    startDate: partial.startDate ?? daysFromNow(0),
    dueDate: partial.dueDate ?? daysFromNow(7),
    estimateMinutes: partial.estimateMinutes ?? 120,
    progress: partial.progress ?? 0,
    tags: partial.tags ?? [],
    customFields: partial.customFields ?? {},
    dependencyIds: partial.dependencyIds ?? [],
    approvalState: partial.approvalState ?? "None",
    relatedEquipmentId: partial.relatedEquipmentId,
    relatedTicketId: partial.relatedTicketId,
    checklist: partial.checklist ?? [{ id: `${taskId}_c1`, title: "Primul pas", done: false }],
    comments: partial.comments ?? [],
    attachments: partial.attachments ?? [],
    activity: partial.activity ?? [buildActivity(taskId, "task", partial.ownerId, "Task created")],
    recurring: partial.recurring ?? "none",
    reminderAt: partial.reminderAt,
    createdAt: now(),
    updatedAt: now()
  };
}

export function exportTasksCsv(tasks: GoodDayTask[], projects: GoodDayProject[], users: GoodDayUser[]): string {
  const header = ["id", "title", "type", "status", "priority", "project", "assignee", "department", "dueDate", "estimateMinutes", "progress"];
  const rows = tasks.map((task) => [
    task.id,
    task.title,
    task.type,
    task.status,
    task.priority,
    projects.find((project) => project.id === task.projectId)?.name ?? task.projectId,
    users.find((user) => user.id === task.assigneeId)?.name ?? task.assigneeId,
    task.department,
    task.dueDate,
    String(task.estimateMinutes),
    String(task.progress)
  ]);
  return [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
}

export function goodDayParityFeatureMatrix() {
  return [
    { feature: "Tasks & Projects", status: "implemented", note: "Interactive task/project records, ownership, due dates, status and progress." },
    { feature: "Task detail", status: "implemented", note: "Drawer-like editing section with comments, checklist, attachments mock, time entries and activity." },
    { feature: "Tickets / Requests", status: "implemented", note: "Create/escalate tickets and convert ticket to task with SLA metadata." },
    { feature: "Notifications", status: "implemented", note: "Unread/read notification center linked to entities." },
    { feature: "Approvals", status: "implemented", note: "Approve/reject with history and linked entity." },
    { feature: "Saved views", status: "implemented", note: "Filters and visible columns persisted in localStorage." },
    { feature: "Workflows", status: "mock-interactive", note: "Status transitions and approval gates are enforced in client state; backend rules pending." },
    { feature: "Workload", status: "implemented", note: "Capacity vs assigned estimates by user/department." },
    { feature: "Time tracking", status: "implemented", note: "Manual entries and timer events stored locally." },
    { feature: "Automations", status: "mock-interactive", note: "Rule model with IoT alarm, stock low, SLA risk and certification expiration examples." },
    { feature: "Reports", status: "mock-interactive", note: "CSV export and summary reports generated client-side." },
    { feature: "Backend persistence", status: "prepared", note: "LocalStorage/mock repository now; DB/API adapter remains next phase." }
  ];
}
