export type V62DepartmentId =
  | "audit"
  | "administrativ"
  | "automatizari"
  | "audit-energetic"
  | "comercial"
  | "marketing"
  | "productie"
  | "management";

export type V62AccessScope = "global" | "department" | "team" | "own" | "client" | "readonly";

export type V62ServelectRole =
  | "Super Admin"
  | "Admin Global"
  | "Admin Departament"
  | "Director"
  | "Manager Departament"
  | "Manager Proiect"
  | "Responsabil Proiect"
  | "Specialist Achiziții"
  | "Financiar"
  | "Vânzări"
  | "Auditor"
  | "Tehnician"
  | "Client"
  | "Viewer";

export type V62TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "blocked" | "done" | "cancelled";
export type V62Priority = "low" | "medium" | "high" | "urgent" | "critical";
export type V62PresenceStatus = "online" | "offline" | "busy" | "away" | "in_meeting" | "on_site" | "on_leave";
export type V62ApprovalStatus = "not_required" | "pending" | "approved" | "rejected" | "cancelled";

export interface V62Department {
  id: V62DepartmentId;
  name: string;
  shortName: string;
  description: string;
  managerId: string;
  adminIds: string[];
  color: string;
  accent: string;
  modules: string[];
  taskPrefixes: string[];
  approvalRules: string[];
}

export interface V62DepartmentUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: V62ServelectRole;
  departmentId: V62DepartmentId;
  departmentName: string;
  teamId: string;
  teamName: string;
  managerId: string | null;
  jobTitle: string;
  initials: string;
  avatarUrl?: string;
  presenceStatus: V62PresenceStatus;
  active: boolean;
  accessScope: V62AccessScope;
  permissions: string[];
}

export interface V62DepartmentTask {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  departmentId: V62DepartmentId;
  departmentName: string;
  module: string;
  status: V62TaskStatus;
  priority: V62Priority;
  assigneeId: string;
  assigneeName: string;
  ownerId: string;
  ownerName: string;
  reviewerId: string;
  dueDate: string;
  estimateHours: number;
  trackedHours: number;
  visibilityScope: V62AccessScope;
  approvalStatus: V62ApprovalStatus;
  approvalRequired: boolean;
  watchers: string[];
  routingReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface V62DepartmentApproval {
  id: string;
  departmentId: V62DepartmentId;
  departmentName: string;
  entityType: "task" | "project" | "procurement" | "invoice" | "offer" | "budget" | "document";
  entityId: string;
  title: string;
  requestedBy: string;
  approverId: string;
  approverName: string;
  status: Exclude<V62ApprovalStatus, "not_required">;
  reason: string;
  createdAt: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface V62DepartmentNotificationRule {
  id: string;
  departmentId: V62DepartmentId;
  trigger: string;
  recipients: string[];
  channel: "in_app" | "email" | "push" | "digest";
  severity: "info" | "warning" | "critical";
  example: string;
}

export interface V62CompletionStatus {
  category: string;
  percent: number;
  trend: "up" | "stable" | "needs_work";
  evidence: string;
}

export interface V62VisibilityResult {
  userId: string;
  userName: string;
  role: V62ServelectRole;
  departmentName: string;
  visibleTaskIds: string[];
  visibleDepartmentIds: V62DepartmentId[];
  assignableUserIds: string[];
  canSeeAll: boolean;
  notes: string[];
}

export const servelectDepartmentsV62: V62Department[] = [
  {
    id: "audit",
    name: "Audit",
    shortName: "AUD",
    description: "Departament intern pentru verificări, control operațional, conformitate și audit de procese.",
    managerId: "u11",
    adminIds: ["u11"],
    color: "#7C3AED",
    accent: "bg-purple-50 text-purple-700 border-purple-200",
    modules: ["Audit intern", "Conformitate", "Evidence review", "Procese"],
    taskPrefixes: ["AUD", "CTRL", "CONF"],
    approvalRules: ["Raport audit intern", "Neconformitate critică", "Control documente"]
  },
  {
    id: "administrativ",
    name: "Administrativ",
    shortName: "ADM",
    description: "Administrativ, logistică internă, documente generale, suport operațional și evidențe.",
    managerId: "u12",
    adminIds: ["u12"],
    color: "#2563EB",
    accent: "bg-blue-50 text-blue-700 border-blue-200",
    modules: ["Documente", "Administrare", "Suport intern", "Evidențe"],
    taskPrefixes: ["ADM", "DOC", "INT"],
    approvalRules: ["Document administrativ", "Modificare date companie", "Acces intern"]
  },
  {
    id: "automatizari",
    name: "Automatizări",
    shortName: "AUT",
    description: "Automatizări, integrare IoT/EMS, monitorizare, scripturi, alarme și sisteme tehnice.",
    managerId: "u13",
    adminIds: ["u13"],
    color: "#0EA5E9",
    accent: "bg-sky-50 text-sky-700 border-sky-200",
    modules: ["IoT", "Monitorizare", "EMS", "Integrări", "Automatizări"],
    taskPrefixes: ["AUT", "IOT", "EMS"],
    approvalRules: ["Integrare nouă", "Alarmă critică", "Schimbare automatizare"]
  },
  {
    id: "audit-energetic",
    name: "Audit energetic",
    shortName: "AEN",
    description: "Audituri energetice, consumuri, rapoarte, ISO 50001, măsuri de eficiență și ESG tehnic.",
    managerId: "u14",
    adminIds: ["u14"],
    color: "#059669",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    modules: ["Audit energetic", "ESG", "Rapoarte", "Consum", "ISO 50001"],
    taskPrefixes: ["AEN", "ESG", "ISO"],
    approvalRules: ["Raport audit energetic", "Măsură eficiență", "Raport ESG"]
  },
  {
    id: "comercial",
    name: "Comercial",
    shortName: "COM",
    description: "Vânzări, CRM, oferte, follow-up clienți, contracte, pipeline și comunicare comercială.",
    managerId: "u15",
    adminIds: ["u15"],
    color: "#F59E0B",
    accent: "bg-amber-50 text-amber-700 border-amber-200",
    modules: ["CRM", "Oferte", "Contracte", "Follow-up", "Pipeline"],
    taskPrefixes: ["COM", "CRM", "OFR"],
    approvalRules: ["Ofertă peste prag", "Discount comercial", "Contract client"]
  },
  {
    id: "marketing",
    name: "Marketing",
    shortName: "MKT",
    description: "Marketing, campanii, materiale vizuale, comunicare, website, studii de caz și promovare.",
    managerId: "u16",
    adminIds: ["u16"],
    color: "#EC4899",
    accent: "bg-pink-50 text-pink-700 border-pink-200",
    modules: ["Campanii", "Website", "Materiale", "Comunicare", "Brand"],
    taskPrefixes: ["MKT", "WEB", "SOC"],
    approvalRules: ["Campanie externă", "Material public", "Buget marketing"]
  },
  {
    id: "productie",
    name: "Producție",
    shortName: "PRD",
    description: "Execuție, montaj, PIF, intervenții teren, tehnicieni, lucrări și recepții.",
    managerId: "u3",
    adminIds: ["u3"],
    color: "#00843D",
    accent: "bg-green-50 text-green-700 border-green-200",
    modules: ["Proiecte", "Execuție", "Mentenanță", "Teren", "Pontaj"],
    taskPrefixes: ["PRD", "FV", "PIF"],
    approvalRules: ["PIF", "Recepție lucrare", "Intervenție critică"]
  },
  {
    id: "management",
    name: "Management",
    shortName: "MNG",
    description: "Conducere, super admin, guvernanță, obiective, raportare executivă și decizii globale.",
    managerId: "u1",
    adminIds: ["u1"],
    color: "#0B1F2A",
    accent: "bg-slate-100 text-slate-800 border-slate-300",
    modules: ["Governance", "BI", "Admin", "Strategie"],
    taskPrefixes: ["MNG", "CEO", "GOV"],
    approvalRules: ["Aprobare globală", "Schimbare rol", "Buget major"]
  }
];

export const servelectDepartmentUsersV62: V62DepartmentUser[] = [
  { id: "u1", name: "Andrei Popescu", email: "andrei.popescu@servelect.ro", username: "andrei", role: "Super Admin", departmentId: "management", departmentName: "Management", teamId: "team-management", teamName: "Conducere", managerId: null, jobTitle: "Director / Super Admin", initials: "AP", presenceStatus: "online", active: true, accessScope: "global", permissions: ["*"] },
  { id: "u2", name: "Ioana Marinescu", email: "ioana.marinescu@servelect.ro", username: "ioana", role: "Manager Proiect", departmentId: "productie", departmentName: "Producție", teamId: "team-projects", teamName: "Project Delivery", managerId: "u1", jobTitle: "Manager proiect", initials: "IM", presenceStatus: "busy", active: true, accessScope: "department", permissions: ["view_department_tasks", "assign_task", "approve_task", "view_projects"] },
  { id: "u3", name: "Mihai Ionescu", email: "mihai.ionescu@servelect.ro", username: "mihai", role: "Manager Departament", departmentId: "productie", departmentName: "Producție", teamId: "team-field", teamName: "Teren & execuție", managerId: "u1", jobTitle: "Manager Producție", initials: "MI", presenceStatus: "on_site", active: true, accessScope: "department", permissions: ["view_department_tasks", "manage_team", "assign_task", "reassign_task", "approve_task"] },
  { id: "u4", name: "George Stan", email: "george.stan@servelect.ro", username: "george", role: "Specialist Achiziții", departmentId: "administrativ", departmentName: "Administrativ", teamId: "team-procurement", teamName: "Achiziții & logistică", managerId: "u12", jobTitle: "Specialist achiziții", initials: "GS", presenceStatus: "online", active: true, accessScope: "department", permissions: ["view_procurement", "manage_procurement", "view_suppliers"] },
  { id: "u5", name: "Alexandra Rusu", email: "alexandra.rusu@servelect.ro", username: "alexandra", role: "Financiar", departmentId: "administrativ", departmentName: "Administrativ", teamId: "team-finance", teamName: "Financiar", managerId: "u12", jobTitle: "Financiar / contabil", initials: "AR", presenceStatus: "online", active: true, accessScope: "department", permissions: ["view_invoices", "manage_invoices", "approve_payments"] },
  { id: "u6", name: "Cristian Radu", email: "cristian.radu@servelect.ro", username: "cristian", role: "Tehnician", departmentId: "productie", departmentName: "Producție", teamId: "team-field", teamName: "Teren & execuție", managerId: "u3", jobTitle: "Tehnician", initials: "CR", presenceStatus: "on_site", active: true, accessScope: "own", permissions: ["view_own_tasks", "change_task_status"] },
  { id: "u7", name: "Vlad Neagu", email: "vlad.neagu@servelect.ro", username: "vlad", role: "Tehnician", departmentId: "productie", departmentName: "Producție", teamId: "team-field", teamName: "Teren & execuție", managerId: "u3", jobTitle: "Electrician", initials: "VN", presenceStatus: "away", active: true, accessScope: "own", permissions: ["view_own_tasks", "change_task_status"] },
  { id: "u11", name: "Radu Audit", email: "radu.audit@servelect.ro", username: "radu.audit", role: "Admin Departament", departmentId: "audit", departmentName: "Audit", teamId: "team-audit", teamName: "Audit intern", managerId: "u1", jobTitle: "Admin departament Audit", initials: "RA", presenceStatus: "online", active: true, accessScope: "department", permissions: ["view_department_tasks", "manage_team", "view_audit_log"] },
  { id: "u12", name: "Elena Administrativ", email: "elena.admin@servelect.ro", username: "elena.admin", role: "Admin Departament", departmentId: "administrativ", departmentName: "Administrativ", teamId: "team-admin", teamName: "Administrativ", managerId: "u1", jobTitle: "Admin departament Administrativ", initials: "EA", presenceStatus: "online", active: true, accessScope: "department", permissions: ["view_department_tasks", "manage_team", "view_reports"] },
  { id: "u13", name: "Sorin Automatizări", email: "sorin.automatizari@servelect.ro", username: "sorin.auto", role: "Manager Departament", departmentId: "automatizari", departmentName: "Automatizări", teamId: "team-automation", teamName: "Automatizări & IoT", managerId: "u1", jobTitle: "Manager Automatizări", initials: "SA", presenceStatus: "busy", active: true, accessScope: "department", permissions: ["view_department_tasks", "manage_team", "assign_task"] },
  { id: "u14", name: "Diana Audit Energetic", email: "diana.audit.energetic@servelect.ro", username: "diana.audit", role: "Auditor", departmentId: "audit-energetic", departmentName: "Audit energetic", teamId: "team-energy-audit", teamName: "Audit energetic", managerId: "u1", jobTitle: "Auditor energetic", initials: "DA", presenceStatus: "in_meeting", active: true, accessScope: "department", permissions: ["view_department_tasks", "view_reports", "approve_task"] },
  { id: "u15", name: "Diana Stan", email: "diana.stan@servelect.ro", username: "diana", role: "Vânzări", departmentId: "comercial", departmentName: "Comercial", teamId: "team-sales", teamName: "Comercial", managerId: "u1", jobTitle: "Responsabil comercial", initials: "DS", presenceStatus: "online", active: true, accessScope: "department", permissions: ["view_department_tasks", "create_task", "view_projects"] },
  { id: "u16", name: "Maria Marketing", email: "maria.marketing@servelect.ro", username: "maria.mkt", role: "Admin Departament", departmentId: "marketing", departmentName: "Marketing", teamId: "team-marketing", teamName: "Marketing", managerId: "u1", jobTitle: "Marketing lead", initials: "MM", presenceStatus: "online", active: true, accessScope: "department", permissions: ["view_department_tasks", "create_task", "manage_team"] },
  { id: "u99", name: "Client Demo", email: "client.demo@firma.ro", username: "client", role: "Client", departmentId: "comercial", departmentName: "Comercial", teamId: "team-client", teamName: "Portal client", managerId: "u15", jobTitle: "Client", initials: "CD", presenceStatus: "online", active: true, accessScope: "client", permissions: ["view_own_tasks"] }
];

export const departmentTasksV62: V62DepartmentTask[] = [
  { id: "T-AUD-001", title: "Verificare procedură aprobare taskuri critice", description: "Audit intern pentru reguli de aprobare și trasabilitate schimbări status.", projectId: "P-AUD-2026", projectName: "Control operațional Work OS", departmentId: "audit", departmentName: "Audit", module: "Audit intern", status: "in_progress", priority: "high", assigneeId: "u11", assigneeName: "Radu Audit", ownerId: "u11", ownerName: "Radu Audit", reviewerId: "u1", dueDate: "2026-06-14", estimateHours: 12, trackedHours: 5, visibilityScope: "department", approvalStatus: "pending", approvalRequired: true, watchers: ["u1", "u11"], routingReason: "Task generat din audit log / governance workflow", createdAt: "2026-06-08T08:30:00", updatedAt: "2026-06-08T09:10:00" },
  { id: "T-ADM-002", title: "Centralizare documente contract furnizor", description: "Pregătire dosar administrativ pentru contract și aprobări interne.", projectId: "P-ADM-2026", projectName: "Administrativ contracte", departmentId: "administrativ", departmentName: "Administrativ", module: "Documente", status: "todo", priority: "medium", assigneeId: "u4", assigneeName: "George Stan", ownerId: "u12", ownerName: "Elena Administrativ", reviewerId: "u12", dueDate: "2026-06-12", estimateHours: 6, trackedHours: 1, visibilityScope: "department", approvalStatus: "not_required", approvalRequired: false, watchers: ["u12", "u5"], routingReason: "Document administrativ și achiziții", createdAt: "2026-06-08T08:40:00", updatedAt: "2026-06-08T08:55:00" },
  { id: "T-AUT-003", title: "Integrare alarmă invertor offline în task factory", description: "Când un invertor devine offline se creează task automat pentru Automatizări și Mentenanță.", projectId: "P-IOT-2026", projectName: "Monitorizare IoT Servelect", departmentId: "automatizari", departmentName: "Automatizări", module: "IoT/Ops", status: "review", priority: "urgent", assigneeId: "u13", assigneeName: "Sorin Automatizări", ownerId: "u13", ownerName: "Sorin Automatizări", reviewerId: "u1", dueDate: "2026-06-10", estimateHours: 16, trackedHours: 14, visibilityScope: "department", approvalStatus: "pending", approvalRequired: true, watchers: ["u1", "u3", "u13"], routingReason: "Automatizare critică legată de IoT", createdAt: "2026-06-08T08:55:00", updatedAt: "2026-06-08T09:25:00" },
  { id: "T-AEN-004", title: "Raport audit energetic client industrial", description: "Analiză consum, recomandări eficiență și anexă ESG pentru beneficiar.", projectId: "P-2024-0103", projectName: "Sistem FV 500 kWp GreenFactory SA", departmentId: "audit-energetic", departmentName: "Audit energetic", module: "Audit energetic", status: "blocked", priority: "high", assigneeId: "u14", assigneeName: "Diana Audit Energetic", ownerId: "u14", ownerName: "Diana Audit Energetic", reviewerId: "u1", dueDate: "2026-06-18", estimateHours: 20, trackedHours: 7, visibilityScope: "department", approvalStatus: "pending", approvalRequired: true, watchers: ["u1", "u14"], routingReason: "Audit energetic este departament separat de Audit intern", createdAt: "2026-06-08T09:00:00", updatedAt: "2026-06-08T09:30:00" },
  { id: "T-COM-005", title: "Follow-up ofertă sistem FV 9.6 kWp", description: "Contact client, actualizare CRM și trimitere revizie ofertă.", projectId: "P-2024-0187", projectName: "Sistem FV 9.6 kWp Cluj-Napoca", departmentId: "comercial", departmentName: "Comercial", module: "CRM/Oferte", status: "in_progress", priority: "medium", assigneeId: "u15", assigneeName: "Diana Stan", ownerId: "u15", ownerName: "Diana Stan", reviewerId: "u1", dueDate: "2026-06-09", estimateHours: 3, trackedHours: 1.5, visibilityScope: "department", approvalStatus: "not_required", approvalRequired: false, watchers: ["u1", "u15"], routingReason: "Task comercial asociat pipeline CRM", createdAt: "2026-06-08T09:10:00", updatedAt: "2026-06-08T09:35:00" },
  { id: "T-MKT-006", title: "Studiu de caz proiect finalizat", description: "Material marketing pentru proiect cu fotografii, rezultate și aprobare publicare.", projectId: "P-2024-0098", projectName: "RetailMax SRL Ploiești", departmentId: "marketing", departmentName: "Marketing", module: "Marketing", status: "todo", priority: "medium", assigneeId: "u16", assigneeName: "Maria Marketing", ownerId: "u16", ownerName: "Maria Marketing", reviewerId: "u1", dueDate: "2026-06-20", estimateHours: 10, trackedHours: 0, visibilityScope: "department", approvalStatus: "pending", approvalRequired: true, watchers: ["u1", "u16"], routingReason: "Publicare externă necesită aprobare", createdAt: "2026-06-08T09:20:00", updatedAt: "2026-06-08T09:36:00" },
  { id: "T-PRD-007", title: "Montaj structură și cablare DC", description: "Task teren pentru echipa de producție, vizibil managerului de producție și tehnicienilor alocați.", projectId: "P-2024-0142", projectName: "Stație încărcare EV Timișoara", departmentId: "productie", departmentName: "Producție", module: "Execuție", status: "in_progress", priority: "urgent", assigneeId: "u6", assigneeName: "Cristian Radu", ownerId: "u3", ownerName: "Mihai Ionescu", reviewerId: "u3", dueDate: "2026-06-11", estimateHours: 24, trackedHours: 11, visibilityScope: "team", approvalStatus: "not_required", approvalRequired: false, watchers: ["u3", "u6", "u7"], routingReason: "Task de producție alocat echipei teren", createdAt: "2026-06-08T09:25:00", updatedAt: "2026-06-08T09:40:00" }
];

export const departmentApprovalsV62: V62DepartmentApproval[] = departmentTasksV62
  .filter((task) => task.approvalRequired)
  .map((task) => ({
    id: `APR-${task.id}`,
    departmentId: task.departmentId,
    departmentName: task.departmentName,
    entityType: "task",
    entityId: task.id,
    title: `Aprobare: ${task.title}`,
    requestedBy: task.ownerId,
    approverId: task.reviewerId,
    approverName: task.reviewerId === "u1" ? "Andrei Popescu" : task.ownerName,
    status: "pending",
    reason: task.routingReason,
    createdAt: task.updatedAt,
    riskLevel: task.priority === "critical" || task.priority === "urgent" ? "critical" : task.priority === "high" ? "high" : "medium"
  }));

export const departmentNotificationRulesV62: V62DepartmentNotificationRule[] = [
  { id: "rule-status-manager", departmentId: "productie", trigger: "task.status.changed", recipients: ["manager", "watchers"], channel: "in_app", severity: "info", example: "Cristian a mutat Montaj structură în Review → Mihai primește notificare." },
  { id: "rule-overdue-dept-admin", departmentId: "administrativ", trigger: "task.overdue", recipients: ["department_admin", "assignee"], channel: "email", severity: "warning", example: "Document administrativ depășit → Elena primește alertă." },
  { id: "rule-iot-critical", departmentId: "automatizari", trigger: "iot.alarm.critical", recipients: ["department_manager", "super_admin", "production_manager"], channel: "push", severity: "critical", example: "Invertor offline → Sorin, Mihai și Andrei primesc alertă." },
  { id: "rule-audit-finding", departmentId: "audit", trigger: "audit.finding.created", recipients: ["department_admin", "super_admin"], channel: "in_app", severity: "warning", example: "Neconformitate audit intern → Radu și Andrei primesc notificare." },
  { id: "rule-energy-audit-approval", departmentId: "audit-energetic", trigger: "energy.audit.report.ready", recipients: ["approver", "department_manager"], channel: "in_app", severity: "info", example: "Raport audit energetic gata → aprobatorul primește task." },
  { id: "rule-commercial-discount", departmentId: "comercial", trigger: "offer.discount.requires_approval", recipients: ["department_manager", "super_admin"], channel: "in_app", severity: "warning", example: "Discount ofertă peste prag → Manager Comercial + Andrei." },
  { id: "rule-marketing-publish", departmentId: "marketing", trigger: "marketing.publication.requested", recipients: ["department_admin", "super_admin"], channel: "digest", severity: "info", example: "Material public nou → Maria și Andrei aprobă publicarea." }
];

export const completionStatusV62: V62CompletionStatus[] = [
  { category: "Website/Web App", percent: 97, trend: "up", evidence: "Next.js app are layout enterprise, rute Work OS, admin, account, team și dashboards." },
  { category: "Task & Project Core", percent: 95, trend: "up", evidence: "Taskuri, proiecte, drawer, assign/reassign, approvals, workflow automation și routing pe departament." },
  { category: "Backend/API", percent: 88, trend: "up", evidence: "API routes pentru accounts, RBAC, workflow, switchboard, departments și command centers." },
  { category: "Database/Prisma/Seed", percent: 81, trend: "stable", evidence: "Prisma cutover și seed parity există ca layer controlat, real writes încă protejate." },
  { category: "Auth/RBAC", percent: 91, trend: "up", evidence: "Roluri enterprise + admin departament + visibility helper + permissions matrix." },
  { category: "Department-aware RBAC", percent: 86, trend: "up", evidence: "Departamente Servelect reale, task routing, visibility și approvals per departament." },
  { category: "Notifications/Approvals", percent: 91, trend: "up", evidence: "Reguli pe status, overdue, IoT, audit, ofertă și publicare marketing." },
  { category: "GoodDay Parity", percent: 86, trend: "up", evidence: "My Work, team tasks, manager view, dashboards pe rol, approvals și workload." },
  { category: "IoT/Ops Integration", percent: 73, trend: "up", evidence: "Alarme IoT pot genera taskuri și notificări către automatizări/producție." },
  { category: "Mobile App", percent: 58, trend: "needs_work", evidence: "Mobile field preview există, dar offline real/QR/photo sync rămâne următorul salt major." }
];

export function getDepartmentById(departmentId: V62DepartmentId): V62Department {
  const department = servelectDepartmentsV62.find((item) => item.id === departmentId);
  return department ?? servelectDepartmentsV62[0];
}

export function getUserById(userId: string): V62DepartmentUser | undefined {
  return servelectDepartmentUsersV62.find((user) => user.id === userId);
}

export function isSuperAdmin(user: V62DepartmentUser): boolean {
  return user.role === "Super Admin" || user.permissions.includes("*");
}

export function isDepartmentAdmin(user: V62DepartmentUser): boolean {
  return user.role === "Admin Departament" || user.role === "Manager Departament";
}

export function isManagerOf(managerId: string, userId: string): boolean {
  const user = getUserById(userId);
  if (!user) return false;
  if (user.managerId === managerId) return true;
  if (!user.managerId) return false;
  return isManagerOf(managerId, user.managerId);
}

export function getDirectReports(userId: string): V62DepartmentUser[] {
  return servelectDepartmentUsersV62.filter((user) => user.managerId === userId);
}

export function getAllReports(userId: string): V62DepartmentUser[] {
  const directReports = getDirectReports(userId);
  const nestedReports = directReports.flatMap((user) => getAllReports(user.id));
  return [...directReports, ...nestedReports];
}

export function canViewUser(viewer: V62DepartmentUser, target: V62DepartmentUser): boolean {
  if (isSuperAdmin(viewer)) return true;
  if (viewer.id === target.id) return true;
  if (viewer.accessScope === "department" && viewer.departmentId === target.departmentId) return true;
  return isManagerOf(viewer.id, target.id);
}

export function canViewTask(user: V62DepartmentUser, task: V62DepartmentTask): boolean {
  if (isSuperAdmin(user)) return true;
  if (task.assigneeId === user.id || task.ownerId === user.id || task.reviewerId === user.id || task.watchers.includes(user.id)) return true;
  if (user.accessScope === "department" && user.departmentId === task.departmentId) return true;
  const assignee = getUserById(task.assigneeId);
  return Boolean(assignee && isManagerOf(user.id, assignee.id));
}

export function canAssignTask(user: V62DepartmentUser, task: V62DepartmentTask, targetUser: V62DepartmentUser): boolean {
  if (isSuperAdmin(user)) return true;
  if (!canViewTask(user, task)) return false;
  if (isDepartmentAdmin(user) && user.departmentId === targetUser.departmentId && task.departmentId === user.departmentId) return true;
  return isManagerOf(user.id, targetUser.id);
}

export function getVisibleTasksForUser(userId: string): V62DepartmentTask[] {
  const user = getUserById(userId);
  if (!user) return [];
  return departmentTasksV62.filter((task) => canViewTask(user, task));
}

export function getVisibleUsersForUser(userId: string): V62DepartmentUser[] {
  const viewer = getUserById(userId);
  if (!viewer) return [];
  return servelectDepartmentUsersV62.filter((target) => canViewUser(viewer, target));
}

export function getAssignableUsersForTask(userId: string, taskId: string): V62DepartmentUser[] {
  const user = getUserById(userId);
  const task = departmentTasksV62.find((item) => item.id === taskId);
  if (!user || !task) return [];
  return servelectDepartmentUsersV62.filter((target) => canAssignTask(user, task, target));
}

export function getVisibilityForUser(userId: string): V62VisibilityResult {
  const user = getUserById(userId) ?? servelectDepartmentUsersV62[0];
  const visibleTasks = getVisibleTasksForUser(user.id);
  const visibleUsers = getVisibleUsersForUser(user.id);
  const visibleDepartments = Array.from(new Set(visibleTasks.map((task) => task.departmentId)));

  return {
    userId: user.id,
    userName: user.name,
    role: user.role,
    departmentName: user.departmentName,
    visibleTaskIds: visibleTasks.map((task) => task.id),
    visibleDepartmentIds: isSuperAdmin(user) ? servelectDepartmentsV62.map((department) => department.id) : visibleDepartments,
    assignableUserIds: visibleUsers.filter((target) => target.active && target.id !== user.id).map((target) => target.id),
    canSeeAll: isSuperAdmin(user),
    notes: buildVisibilityNotes(user, visibleTasks.length, visibleUsers.length)
  };
}

function buildVisibilityNotes(user: V62DepartmentUser, taskCount: number, userCount: number): string[] {
  if (isSuperAdmin(user)) {
    return ["Super Admin vede toate departamentele, toate taskurile, toți userii și toate aprobările."];
  }
  if (user.accessScope === "department") {
    return [`${user.role} vede în principal departamentul ${user.departmentName}, plus taskurile unde este owner/reviewer/watcher.`, `Taskuri vizibile: ${taskCount}. Useri vizibili: ${userCount}.`];
  }
  if (user.accessScope === "client") {
    return ["Clientul vede doar proiectele, documentele și ticketele lui. Nu vede date interne Servelect."];
  }
  return [`Utilizatorul vede taskurile proprii și taskurile unde este implicat. Taskuri vizibile: ${taskCount}.`];
}

export function getDepartmentDashboard(departmentId: V62DepartmentId) {
  const department = getDepartmentById(departmentId);
  const tasks = departmentTasksV62.filter((task) => task.departmentId === departmentId);
  const users = servelectDepartmentUsersV62.filter((user) => user.departmentId === departmentId);
  const approvals = departmentApprovalsV62.filter((approval) => approval.departmentId === departmentId);
  const overdueTasks = tasks.filter((task) => new Date(task.dueDate).getTime() < new Date("2026-06-15").getTime() && task.status !== "done");
  const blockedTasks = tasks.filter((task) => task.status === "blocked");
  const workload = users.map((user) => {
    const userTasks = tasks.filter((task) => task.assigneeId === user.id);
    const estimateHours = userTasks.reduce((sum, task) => sum + task.estimateHours, 0);
    const trackedHours = userTasks.reduce((sum, task) => sum + task.trackedHours, 0);
    const workloadPercent = Math.min(140, Math.round((estimateHours / 40) * 100));
    return { userId: user.id, userName: user.name, initials: user.initials, role: user.role, presenceStatus: user.presenceStatus, activeTasks: userTasks.length, estimateHours, trackedHours, workloadPercent };
  });

  return {
    department,
    tasks,
    users,
    approvals,
    overdueTasks,
    blockedTasks,
    workload,
    metrics: {
      activeTasks: tasks.filter((task) => task.status !== "done" && task.status !== "cancelled").length,
      pendingApprovals: approvals.filter((approval) => approval.status === "pending").length,
      blockedTasks: blockedTasks.length,
      overdueTasks: overdueTasks.length,
      avgWorkload: workload.length ? Math.round(workload.reduce((sum, item) => sum + item.workloadPercent, 0) / workload.length) : 0
    }
  };
}

export function getAllDepartmentDashboards() {
  return servelectDepartmentsV62.map((department) => getDepartmentDashboard(department.id));
}

export function explainAuditConcepts() {
  return {
    auditLog: "Audit log = jurnal tehnic al sistemului: cine a schimbat status, roluri, permisiuni, aprobări, taskuri sau sesiuni.",
    auditDepartment: "Departamentul Audit = echipă reală Servelect pentru verificări interne, control operațional și conformitate.",
    energyAuditDepartment: "Departamentul Audit energetic = echipă reală separată pentru audituri energetice, consum, eficiență, ESG și rapoarte tehnice.",
    rule: "Aceste concepte trebuie să rămână separate în UI, RBAC, task routing și rapoarte."
  };
}
