export type V64DepartmentId =
  | "audit"
  | "administrativ"
  | "automatizari"
  | "audit-energetic"
  | "comercial"
  | "marketing"
  | "productie"
  | "management";

export type V64Role =
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
  | "Client"
  | "Viewer";

export type V64TaskStatus = "Backlog" | "De făcut" | "În desfășurare" | "Review" | "Blocat" | "Finalizat" | "Planificat" | "În așteptare";
export type V64Priority = "Scăzut" | "Mediu" | "Ridicat" | "Urgent" | "Critic";
export type V64PageId = "overview" | "my-work" | "inbox" | "tickets" | "active-projects" | "upcoming-projects" | "completed-projects" | "board" | "table" | "calendar" | "workload";
export type V64TicketStatus = "În deschidere" | "În lucru" | "Necesită răspuns" | "În așteptare" | "Rezolvat" | "Escaladat";
export type V64ApprovalStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface V64Department {
  id: V64DepartmentId;
  name: string;
  managerId: string;
  adminId: string;
  color: string;
  scope: string;
}

export interface V64User {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: V64Role;
  title: string;
  departmentId: V64DepartmentId;
  departmentName: string;
  teamId: string;
  managerId?: string;
  presence: "online" | "offline" | "busy" | "away" | "on_site" | "on_leave";
  capacityHours: number;
  avatarUrl?: string;
}

export interface V64Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  client: string;
  type: "Task" | "Milestone" | "Ticket" | "Approval" | "Document" | "Incident";
  status: V64TaskStatus;
  priority: V64Priority;
  assigneeId: string;
  ownerId: string;
  reviewerId?: string;
  createdBy: string;
  departmentId: V64DepartmentId;
  departmentName: string;
  startDate: string;
  dueDate: string;
  estimateHours: number;
  trackedHours: number;
  progress: number;
  tags: string[];
  checklist: Array<{ id: string; label: string; done: boolean }>;
  subtasks: Array<{ id: string; label: string; status: V64TaskStatus }>;
  comments: V64Comment[];
  attachments: V64Attachment[];
  dependencies: string[];
  watchers: string[];
  approvalStatus: V64ApprovalStatus;
  customFields: Record<string, string>;
  activityLog: V64Activity[];
}

export interface V64Ticket {
  id: string;
  type: "IoT Alert" | "Documente" | "Aprobare" | "Procurement" | "Client" | "Mentenanță" | "Financiar" | "Sistem";
  subject: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  ownerId: string;
  departmentId: V64DepartmentId;
  priority: V64Priority;
  slaMinutes: number;
  status: V64TicketStatus;
  unread: boolean;
  escalated: boolean;
  createdAt: string;
  linkedTaskId?: string;
}

export interface V64Project {
  id: string;
  code: string;
  name: string;
  client: string;
  valueRon: number;
  managerId: string;
  departmentId: V64DepartmentId;
  phase: string;
  status: "active" | "upcoming" | "completed";
  progress: number;
  health: "Bună" | "Atenție" | "Risc" | "Finalizat" | "În pregătire" | "Planificat";
  startDate: string;
  deadline: string;
  budgetConsumedPercent: number;
  readyScore: number;
  missingDocuments: string[];
  kickoffChecklist: Array<{ id: string; label: string; done: boolean; date?: string }>;
}

export interface V64Approval {
  id: string;
  type: "Budget" | "Achiziție" | "Factură" | "Task" | "Document" | "Proiect";
  title: string;
  entityType: "project" | "task" | "invoice" | "procurement" | "document";
  entityId: string;
  requestedBy: string;
  approverId: string;
  departmentId: V64DepartmentId;
  status: V64ApprovalStatus;
  reason: string;
  valueRon?: number;
  createdAt: string;
  decidedAt?: string;
  decisionNote?: string;
}

export interface V64Notification {
  id: string;
  userId: string;
  type: "task_assigned" | "task_reassigned" | "task_due_soon" | "task_overdue" | "comment_mention" | "approval_requested" | "approval_decided" | "procurement_update" | "invoice_due" | "order_delayed" | "system_alert" | "ticket_escalated";
  title: string;
  message: string;
  entityType: "task" | "ticket" | "project" | "approval" | "document" | "system";
  entityId: string;
  read: boolean;
  createdAt: string;
}

export interface V64Comment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface V64Attachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "doc" | "dwg" | "xlsx";
  size: string;
  uploadedBy: string;
  createdAt: string;
}

export interface V64Activity {
  id: string;
  actorId: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface V64CompletionStatus {
  label: string;
  percent: number;
  notes: string;
}

export const v64Departments: V64Department[] = [
  { id: "management", name: "Management", managerId: "u1", adminId: "u1", color: "emerald", scope: "Direcție, guvernanță, aprobări globale" },
  { id: "audit", name: "Audit", managerId: "u10", adminId: "u10", color: "violet", scope: "Audit intern, conformitate, verificări procedurale" },
  { id: "administrativ", name: "Administrativ", managerId: "u4", adminId: "u4", color: "slate", scope: "Achiziții, documente, logistică, furnizori" },
  { id: "automatizari", name: "Automatizări", managerId: "u11", adminId: "u11", color: "blue", scope: "IoT, SCADA, monitorizare, automatizări" },
  { id: "audit-energetic", name: "Audit energetic", managerId: "u12", adminId: "u12", color: "amber", scope: "Audit energetic, analize consum, rapoarte eficiență" },
  { id: "comercial", name: "Comercial", managerId: "u8", adminId: "u8", color: "pink", scope: "CRM, vânzări, oferte, follow-up client" },
  { id: "marketing", name: "Marketing", managerId: "u13", adminId: "u13", color: "indigo", scope: "Campanii, materiale, comunicare" },
  { id: "productie", name: "Producție", managerId: "u3", adminId: "u3", color: "green", scope: "Execuție, șantier, PIF, intervenții" }
];

export const v64Users: V64User[] = [
  { id: "u1", name: "Andrei Popescu", initials: "AP", email: "andrei.popescu@servelect.ro", role: "Super Admin", title: "Director / Administrator", departmentId: "management", departmentName: "Management", teamId: "management-core", presence: "online", capacityHours: 40 },
  { id: "u2", name: "Ioana Marinescu", initials: "IM", email: "ioana.marinescu@servelect.ro", role: "Project Manager", title: "Manager Proiect", departmentId: "productie", departmentName: "Producție", teamId: "pv-execution", managerId: "u3", presence: "busy", capacityHours: 40 },
  { id: "u3", name: "Mihai Ionescu", initials: "MI", email: "mihai.ionescu@servelect.ro", role: "Department Admin", title: "Manager Producție", departmentId: "productie", departmentName: "Producție", teamId: "pv-execution", managerId: "u1", presence: "online", capacityHours: 40 },
  { id: "u4", name: "George Stan", initials: "GS", email: "george.stan@servelect.ro", role: "Procurement", title: "Specialist Achiziții", departmentId: "administrativ", departmentName: "Administrativ", teamId: "procurement", managerId: "u1", presence: "away", capacityHours: 40 },
  { id: "u5", name: "Alexandra Rusu", initials: "AR", email: "alexandra.rusu@servelect.ro", role: "Finance", title: "Financiar / Contabil", departmentId: "administrativ", departmentName: "Administrativ", teamId: "finance", managerId: "u1", presence: "online", capacityHours: 40 },
  { id: "u6", name: "Cristian Radu", initials: "CR", email: "cristian.radu@servelect.ro", role: "Tehnician", title: "Tehnician senior", departmentId: "productie", departmentName: "Producție", teamId: "field-team", managerId: "u3", presence: "on_site", capacityHours: 40 },
  { id: "u7", name: "Vlad Neagu", initials: "VN", email: "vlad.neagu@servelect.ro", role: "Tehnician", title: "Electrician", departmentId: "productie", departmentName: "Producție", teamId: "field-team", managerId: "u3", presence: "on_site", capacityHours: 40 },
  { id: "u8", name: "Diana Stan", initials: "DS", email: "diana.stan@servelect.ro", role: "Manager", title: "Manager Comercial", departmentId: "comercial", departmentName: "Comercial", teamId: "sales", managerId: "u1", presence: "online", capacityHours: 40 },
  { id: "u9", name: "Bogdan Rusu", initials: "BR", email: "bogdan.rusu@servelect.ro", role: "Team Lead", title: "Responsabil Proiect", departmentId: "productie", departmentName: "Producție", teamId: "field-team", managerId: "u3", presence: "busy", capacityHours: 40 },
  { id: "u10", name: "Elena Vasilescu", initials: "EV", email: "elena.vasilescu@servelect.ro", role: "Department Admin", title: "Manager Audit", departmentId: "audit", departmentName: "Audit", teamId: "audit-core", managerId: "u1", presence: "online", capacityHours: 40 },
  { id: "u11", name: "Radu Enache", initials: "RE", email: "radu.enache@servelect.ro", role: "Department Admin", title: "Manager Automatizări", departmentId: "automatizari", departmentName: "Automatizări", teamId: "automation", managerId: "u1", presence: "busy", capacityHours: 40 },
  { id: "u12", name: "Sorin Pavel", initials: "SP", email: "sorin.pavel@servelect.ro", role: "Department Admin", title: "Manager Audit energetic", departmentId: "audit-energetic", departmentName: "Audit energetic", teamId: "energy-audit", managerId: "u1", presence: "online", capacityHours: 40 },
  { id: "u13", name: "Mara Dumitru", initials: "MD", email: "mara.dumitru@servelect.ro", role: "Department Admin", title: "Manager Marketing", departmentId: "marketing", departmentName: "Marketing", teamId: "marketing", managerId: "u1", presence: "away", capacityHours: 40 },
  { id: "u14", name: "Client Demo", initials: "CD", email: "client.demo@firma.ro", role: "Client", title: "Client extern", departmentId: "comercial", departmentName: "Comercial", teamId: "client", managerId: "u8", presence: "offline", capacityHours: 0 }
];

const activity = (actorId: string, action: string, detail: string, index: number): V64Activity => ({ id: `act-${actorId}-${index}`, actorId, action, detail, createdAt: `2026-06-08T0${Math.min(index + 1, 9)}:1${index}:00` });
const comment = (authorId: string, body: string, index: number): V64Comment => ({ id: `c-${authorId}-${index}`, authorId, body, createdAt: `2026-06-08T0${Math.min(index + 1, 9)}:2${index}:00` });

export const v64Projects: V64Project[] = [
  { id: "p1", code: "P-2024-0187", name: "Sistem FV 9.6 kWp", client: "Halo Retail SRL", valueRon: 72000, managerId: "u1", departmentId: "productie", phase: "Montaj structură", status: "active", progress: 72, health: "Bună", startDate: "2024-05-01", deadline: "2024-05-30", budgetConsumedPercent: 32, readyScore: 100, missingDocuments: [], kickoffChecklist: [] },
  { id: "p2", code: "P-2024-0192", name: "Fermă solară – Bistrița", client: "AgroTransilvania SRL", valueRon: 2154000, managerId: "u6", departmentId: "productie", phase: "Instalare panouri", status: "active", progress: 48, health: "Atenție", startDate: "2024-05-04", deadline: "2024-06-02", budgetConsumedPercent: 48, readyScore: 78, missingDocuments: ["Aviz mediu"], kickoffChecklist: [] },
  { id: "p3", code: "P-2024-0185", name: "Rooftop Oradea", client: "ElectroNord SA", valueRon: 5480000, managerId: "u3", departmentId: "productie", phase: "Testare & PIF", status: "active", progress: 90, health: "Bună", startDate: "2024-04-10", deadline: "2024-06-09", budgetConsumedPercent: 65, readyScore: 95, missingDocuments: [], kickoffChecklist: [] },
  { id: "p4", code: "P-2024-0210", name: "Parc fotovoltaic 5 MWp", client: "AgroSol Farm SRL", valueRon: 21450000, managerId: "u1", departmentId: "productie", phase: "Pre-start", status: "upcoming", progress: 0, health: "În pregătire", startDate: "2024-05-27", deadline: "2024-09-30", budgetConsumedPercent: 0, readyScore: 78, missingDocuments: ["Plan de situație", "Aviz distribuitor"], kickoffChecklist: [
    { id: "k1", label: "Contract semnat", done: true, date: "18 Mai 2024" },
    { id: "k2", label: "Avans facturat / încasat", done: true, date: "17 Mai 2024" },
    { id: "k3", label: "Documentație tehnică primită", done: true, date: "16 Mai 2024" },
    { id: "k4", label: "Autorizații inițiate", done: false },
    { id: "k5", label: "Resurse alocate", done: false }
  ] },
  { id: "p5", code: "P-2024-0202", name: "Stație încărcare EV 6x120 kW", client: "GreenRetail SA", valueRon: 1250000, managerId: "u6", departmentId: "automatizari", phase: "Pre-start", status: "upcoming", progress: 0, health: "Planificat", startDate: "2024-06-03", deadline: "2024-07-30", budgetConsumedPercent: 0, readyScore: 62, missingDocuments: ["Studiu geotehnic"], kickoffChecklist: [] },
  { id: "p6", code: "P-2024-0103", name: "GreenFactory SA", client: "GreenFactory SA", valueRon: 156000, managerId: "u3", departmentId: "productie", phase: "Handover", status: "completed", progress: 100, health: "Finalizat", startDate: "2024-03-01", deadline: "2024-06-02", budgetConsumedPercent: 98, readyScore: 100, missingDocuments: [], kickoffChecklist: [] },
  { id: "p7", code: "P-2024-0142", name: "Stație încărcare EV", client: "Stație EV Solutions", valueRon: 128500, managerId: "u6", departmentId: "automatizari", phase: "Handover", status: "completed", progress: 100, health: "Finalizat", startDate: "2024-04-01", deadline: "2024-05-31", budgetConsumedPercent: 96, readyScore: 100, missingDocuments: [], kickoffChecklist: [] },
  { id: "p8", code: "P-2024-0098", name: "RetailMax SRL", client: "RetailMax SRL", valueRon: 98700, managerId: "u2", departmentId: "comercial", phase: "Finalizare", status: "completed", progress: 100, health: "Finalizat", startDate: "2024-03-10", deadline: "2024-05-17", budgetConsumedPercent: 92, readyScore: 100, missingDocuments: [], kickoffChecklist: [] }
];

export const v64Tasks: V64Task[] = [
  { id: "P-2024-0187-T1", title: "Verificare amplasament și acces", description: "Verifică accesul echipei, zonele de montaj și condițiile de siguranță.", projectId: "p1", projectCode: "P-2024-0187", projectName: "Sistem FV 9.6 kWp", client: "Halo Retail SRL", type: "Task", status: "De făcut", priority: "Urgent", assigneeId: "u3", ownerId: "u6", reviewerId: "u1", createdBy: "u1", departmentId: "productie", departmentName: "Producție", startDate: "2024-05-17", dueDate: "2024-05-30", estimateHours: 4, trackedHours: 2.75, progress: 72, tags: ["teren", "verificare"], checklist: [{ id: "cl1", label: "Acces verificat", done: false }, { id: "cl2", label: "Poze încărcate", done: false }, { id: "cl3", label: "Client informat", done: true }], subtasks: [{ id: "s1", label: "Confirmare acces camion", status: "De făcut" }], comments: [comment("u6", "Am nevoie de confirmarea paznicului pentru acces lateral.", 1)], attachments: [{ id: "att1", name: "plan_situatie.pdf", type: "pdf", size: "1.2 MB", uploadedBy: "u2", createdAt: "2026-06-08T08:10:00" }], dependencies: [], watchers: ["u1", "u2"], approvalStatus: "pending", customFields: { Locație: "Cluj-Napoca", Echipă: "Montaj 2" }, activityLog: [activity("u1", "created", "Task creat din planul proiectului", 1)] },
  { id: "P-2024-0142-T2", title: "Montaj structură suport panouri", description: "Montează structura suport și verifică strângeri conform fișei tehnice.", projectId: "p2", projectCode: "P-2024-0192", projectName: "Fermă solară – Bistrița", client: "AgroTransilvania SRL", type: "Task", status: "În desfășurare", priority: "Urgent", assigneeId: "u3", ownerId: "u6", reviewerId: "u1", createdBy: "u2", departmentId: "productie", departmentName: "Producție", startDate: "2024-05-20", dueDate: "2024-05-31", estimateHours: 3, trackedHours: 1.5, progress: 48, tags: ["montaj", "structură"], checklist: [{ id: "cl1", label: "Structură poziționată", done: true }, { id: "cl2", label: "Șuruburi verificate", done: false }], subtasks: [], comments: [comment("u3", "Structura este montată 48%, avem nevoie de șuruburi suplimentare.", 2)], attachments: [], dependencies: ["P-2024-0187-T1"], watchers: ["u1", "u4"], approvalStatus: "pending", customFields: { Echipă: "Montaj 2", Suprafață: "1.200 m²" }, activityLog: [activity("u3", "status", "Status schimbat în În desfășurare", 2)] },
  { id: "P-2024-0103-T3", title: "Instalare panouri", description: "Instalează panourile pe șirul B și actualizează checklistul de calitate.", projectId: "p6", projectCode: "P-2024-0103", projectName: "GreenFactory SA", client: "GreenFactory SA", type: "Task", status: "Review", priority: "Ridicat", assigneeId: "u3", ownerId: "u6", reviewerId: "u2", createdBy: "u2", departmentId: "productie", departmentName: "Producție", startDate: "2024-05-15", dueDate: "2024-06-02", estimateHours: 7, trackedHours: 6.25, progress: 90, tags: ["panouri", "instalare"], checklist: [{ id: "cl1", label: "Șir B finalizat", done: true }, { id: "cl2", label: "QC verificat", done: true }], subtasks: [], comments: [], attachments: [], dependencies: ["P-2024-0142-T2"], watchers: ["u1"], approvalStatus: "pending", customFields: { Tip: "Comisionare" }, activityLog: [activity("u2", "review", "Trimis la review", 3)] },
  { id: "P-2024-0098-T4", title: "Revizie invertor central", description: "Revizie parametri invertor și salvare raport de mentenanță.", projectId: "p8", projectCode: "P-2024-0098", projectName: "RetailMax SRL", client: "RetailMax SRL", type: "Incident", status: "Blocat", priority: "Mediu", assigneeId: "u7", ownerId: "u1", reviewerId: "u11", createdBy: "u11", departmentId: "automatizari", departmentName: "Automatizări", startDate: "2024-05-16", dueDate: "2024-05-17", estimateHours: 3.5, trackedHours: 2.1, progress: 65, tags: ["invertor", "revizie"], checklist: [{ id: "cl1", label: "Parametri descărcați", done: true }, { id: "cl2", label: "Raport încărcat", done: false }], subtasks: [], comments: [comment("u11", "Blocaj: acces restricționat în camera tehnică.", 4)], attachments: [], dependencies: [], watchers: ["u1", "u11"], approvalStatus: "pending", customFields: { Model: "Huawei SUN2000", Interval: "1 oră" }, activityLog: [activity("u11", "blocked", "Task blocat din cauza accesului restricționat", 4)] },
  { id: "P-2024-0179-T5", title: "Predare amplasament", description: "Predare către beneficiar și confirmare semnătură recepție.", projectId: "p3", projectCode: "P-2024-0179", projectName: "Parc fotovoltaic Arad", client: "GreenEnergy SA", type: "Task", status: "Planificat", priority: "Mediu", assigneeId: "u2", ownerId: "u2", reviewerId: "u1", createdBy: "u2", departmentId: "productie", departmentName: "Producție", startDate: "2024-05-28", dueDate: "2024-04-30", estimateHours: 1, trackedHours: 0, progress: 0, tags: ["predare", "teren"], checklist: [], subtasks: [], comments: [], attachments: [], dependencies: ["P-2024-0103-T3"], watchers: ["u1"], approvalStatus: "pending", customFields: { Destinație: "Producție" }, activityLog: [activity("u2", "planned", "Programat pentru predare", 5)] },
  { id: "P-2024-0185-T6", title: "Testare protecții DC", description: "Testare protecții DC și completare raport PIF.", projectId: "p3", projectCode: "P-2024-0185", projectName: "Rooftop Oradea", client: "ElectroNord SA", type: "Task", status: "În desfășurare", priority: "Ridicat", assigneeId: "u6", ownerId: "u2", reviewerId: "u1", createdBy: "u2", departmentId: "productie", departmentName: "Producție", startDate: "2024-05-21", dueDate: "2024-05-22", estimateHours: 3, trackedHours: 1.1, progress: 35, tags: ["protecții", "testare"], checklist: [], subtasks: [], comments: [], attachments: [], dependencies: [], watchers: ["u2", "u3"], approvalStatus: "pending", customFields: { Standard: "IEC 62446" }, activityLog: [activity("u6", "timer", "A pornit timerul de testare", 6)] },
  { id: "P-2024-0192-T8", title: "Obținere avize de racordare", description: "Obținere avize de racordare și urmărire status operator distribuție.", projectId: "p2", projectCode: "P-2024-0192", projectName: "Fermă solară – Bistrița", client: "AgroTransilvania SRL", type: "Approval", status: "În așteptare", priority: "Urgent", assigneeId: "u2", ownerId: "u1", reviewerId: "u8", createdBy: "u8", departmentId: "comercial", departmentName: "Comercial", startDate: "2024-05-10", dueDate: "2024-05-15", estimateHours: 5, trackedHours: 0.75, progress: 10, tags: ["avize", "racordare"], checklist: [], subtasks: [], comments: [], attachments: [], dependencies: [], watchers: ["u1", "u8"], approvalStatus: "pending", customFields: { Operator: "Distribuție" }, activityLog: [activity("u8", "approval", "Trimis spre aprobare Comercial", 7)] },
  { id: "P-2024-0183-T9", title: "Documentație finală", description: "Închidere documentație finală și atașare raport PDF.", projectId: "p8", projectCode: "P-2024-0183", projectName: "Stație încărcare EV – TM", client: "ChargePoint SRL", type: "Document", status: "De făcut", priority: "Mediu", assigneeId: "u1", ownerId: "u5", reviewerId: "u5", createdBy: "u5", departmentId: "administrativ", departmentName: "Administrativ", startDate: "2024-05-22", dueDate: "2024-05-28", estimateHours: 2, trackedHours: 0, progress: 0, tags: ["documentație"], checklist: [], subtasks: [], comments: [], attachments: [], dependencies: ["P-2024-0185-T6"], watchers: ["u5"], approvalStatus: "pending", customFields: { Format: "PDF" }, activityLog: [activity("u5", "document", "Solicitare document final", 8)] },
  { id: "MKT-2024-002", title: "Publicare studiu de caz proiect finalizat", description: "Pregătește material marketing pentru proiectul finalizat RetailMax.", projectId: "p8", projectCode: "P-2024-0098", projectName: "RetailMax SRL", client: "RetailMax SRL", type: "Task", status: "De făcut", priority: "Scăzut", assigneeId: "u13", ownerId: "u13", createdBy: "u13", departmentId: "marketing", departmentName: "Marketing", startDate: "2024-06-01", dueDate: "2024-06-12", estimateHours: 4, trackedHours: 0, progress: 0, tags: ["marketing", "client"], checklist: [], subtasks: [], comments: [], attachments: [], dependencies: [], watchers: ["u8"], approvalStatus: "pending", customFields: { Canal: "LinkedIn" }, activityLog: [activity("u13", "created", "Task creat pentru campanie", 9)] }
];

export const v64Tickets: V64Ticket[] = [
  { id: "T-2024-0192", type: "IoT Alert", subject: "Invertor offline - P-2024-0187 (Halo Depot - Cluj)", projectId: "p1", projectCode: "P-2024-0187", projectName: "Halo Depot - Cluj", ownerId: "u3", departmentId: "automatizari", priority: "Critic", slaMinutes: -80, status: "În deschidere", unread: true, escalated: false, createdAt: "2026-06-08T08:00:00", linkedTaskId: "P-2024-0098-T4" },
  { id: "T-2024-0191", type: "Documente", subject: "Documente PIF întârziate", projectId: "p3", projectCode: "P-2024-0179", projectName: "Parc fotovoltaic Arad", ownerId: "u2", departmentId: "administrativ", priority: "Ridicat", slaMinutes: 400, status: "Necesită răspuns", unread: true, escalated: false, createdAt: "2026-06-08T08:10:00", linkedTaskId: "P-2024-0183-T9" },
  { id: "T-2024-0190", type: "Aprobare", subject: "Cerere avize de racordare", projectId: "p2", projectCode: "P-2024-0185", projectName: "Farma solară – Bistrița", ownerId: "u6", departmentId: "comercial", priority: "Ridicat", slaMinutes: 495, status: "În așteptare", unread: false, escalated: false, createdAt: "2026-06-08T08:15:00", linkedTaskId: "P-2024-0192-T8" },
  { id: "T-2024-0189", type: "Procurement", subject: "Comandă furnizor blocată", projectId: "p7", projectCode: "P-2024-0172", projectName: "Stație EV - Timișoara", ownerId: "u4", departmentId: "administrativ", priority: "Mediu", slaMinutes: 1580, status: "În deschidere", unread: false, escalated: false, createdAt: "2026-06-08T08:20:00" },
  { id: "T-2024-0188", type: "Client", subject: "Client follow-up - clarificări contract", projectId: "p8", projectCode: "P-2024-0183", projectName: "Hotel Opera SRL", ownerId: "u8", departmentId: "comercial", priority: "Mediu", slaMinutes: 1800, status: "Necesită răspuns", unread: true, escalated: false, createdAt: "2026-06-08T08:30:00" }
];

export const v64Approvals: V64Approval[] = [
  { id: "AP-001", type: "Budget", title: "Extindere buget P-2024-0187", entityType: "project", entityId: "p1", requestedBy: "u2", approverId: "u1", departmentId: "productie", status: "pending", reason: "Materiale suplimentare pentru structură", valueRon: 120000, createdAt: "2026-06-08T08:20:00" },
  { id: "AP-002", type: "Achiziție", title: "Invertor Huawei 100KTL-M1", entityType: "procurement", entityId: "rfq-104", requestedBy: "u3", approverId: "u1", departmentId: "administrativ", status: "pending", reason: "Achiziție peste prag", valueRon: 38450, createdAt: "2026-06-08T08:25:00" },
  { id: "AP-003", type: "Factură", title: "FACT-2024-0876 – ElectroTotal", entityType: "invoice", entityId: "inv-0876", requestedBy: "u5", approverId: "u1", departmentId: "administrativ", status: "pending", reason: "Factură trebuie validată înainte de plată", valueRon: 18750, createdAt: "2026-06-08T08:30:00" },
  { id: "AP-004", type: "Task", title: "Testare & PIF – P-2024-0187", entityType: "task", entityId: "P-2024-0185-T6", requestedBy: "u2", approverId: "u3", departmentId: "productie", status: "pending", reason: "Necesită confirmare PIF", createdAt: "2026-06-08T08:35:00" }
];

export const v64Notifications: V64Notification[] = [
  { id: "N-001", userId: "u1", type: "task_overdue", title: "Task întârziat", message: "Obținere avize de racordare este întârziat și necesită decizie.", entityType: "task", entityId: "P-2024-0192-T8", read: false, createdAt: "2026-06-08T08:40:00" },
  { id: "N-002", userId: "u3", type: "ticket_escalated", title: "Ticket IoT critic", message: "Invertor offline a intrat în SLA risc.", entityType: "ticket", entityId: "T-2024-0192", read: false, createdAt: "2026-06-08T08:42:00" },
  { id: "N-003", userId: "u4", type: "procurement_update", title: "Comandă blocată", message: "Comanda furnizorului este blocată și necesită follow-up.", entityType: "ticket", entityId: "T-2024-0189", read: true, createdAt: "2026-06-08T08:45:00" }
];

export const v64CompletionStatus: V64CompletionStatus[] = [
  { label: "Website/Web App", percent: 98, notes: "Taskuri pages are redesigned against the provided ground-truth references." },
  { label: "Task & Project Core", percent: 97, notes: "Functional board, table, drawer, filters, saved views and bulk operations are modeled." },
  { label: "Taskuri 1:1 UI", percent: 91, notes: "Layout follows the 10 reference screenshots with the current Servelect shell." },
  { label: "Auth/RBAC/Departments", percent: 94, notes: "Department-aware visibility rules are represented in task data and filters." },
  { label: "Notifications/Approvals", percent: 94, notes: "Tickets, escalation, approval decision and notification read states are functional in local demo state." },
  { label: "GoodDay Parity", percent: 92, notes: "Task experience is closer to GoodDay in density, views and operational depth." },
  { label: "Backend/API", percent: 90, notes: "Mock API routes expose functional state model; production persistence remains adapter-controlled." },
  { label: "Database/Prisma/Seed", percent: 83, notes: "Real database cutover remains controlled via adapter switchboard." },
  { label: "IoT/Ops Integration", percent: 79, notes: "IoT alerts can generate tickets/task flows in the task center." },
  { label: "Mobile App", percent: 61, notes: "Mobile app still needs equivalent task 1:1 execution screens." }
];

export function v64UserById(id: string | undefined): V64User | undefined {
  return v64Users.find((user) => user.id === id);
}

export function v64ProjectById(id: string | undefined): V64Project | undefined {
  return v64Projects.find((project) => project.id === id);
}

export function v64DepartmentById(id: V64DepartmentId | undefined): V64Department | undefined {
  return v64Departments.find((department) => department.id === id);
}

export function v64CanViewTask(user: V64User, task: V64Task): boolean {
  if (user.role === "Super Admin" || user.role === "Global Admin") return true;
  if (user.role === "Department Admin") return user.departmentId === task.departmentId;
  if (user.role === "Manager" || user.role === "Team Lead" || user.role === "Project Manager") {
    const reports = v64Users.filter((candidate) => candidate.managerId === user.id).map((candidate) => candidate.id);
    return user.departmentId === task.departmentId || reports.includes(task.assigneeId) || task.ownerId === user.id;
  }
  if (user.role === "Client") return task.client.toLowerCase().includes("client") || task.watchers.includes(user.id);
  return task.assigneeId === user.id || task.ownerId === user.id || task.createdBy === user.id || task.watchers.includes(user.id);
}

export function v64CanAssignTask(user: V64User, task: V64Task, targetUser: V64User): boolean {
  if (user.role === "Super Admin" || user.role === "Global Admin") return true;
  if (user.role === "Department Admin") return user.departmentId === task.departmentId && targetUser.departmentId === user.departmentId;
  if (user.role === "Manager" || user.role === "Team Lead" || user.role === "Project Manager") return targetUser.managerId === user.id || task.ownerId === user.id;
  return false;
}
