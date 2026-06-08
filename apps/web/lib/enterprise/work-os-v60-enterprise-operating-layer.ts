export type V60RoleKey =
  | "super_admin"
  | "admin"
  | "director"
  | "department_manager"
  | "project_manager"
  | "project_responsible"
  | "procurement_specialist"
  | "finance"
  | "technician"
  | "sales"
  | "client"
  | "viewer";

export type V60Presence = "online" | "offline" | "busy" | "away" | "in_meeting" | "on_site" | "on_leave";
export type V60TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "blocked" | "done" | "cancelled";
export type V60Priority = "low" | "medium" | "high" | "urgent" | "critical";
export type V60ApprovalStatus = "pending" | "approved" | "rejected" | "cancelled";

export type V60PermissionKey =
  | "view_all_tasks"
  | "view_team_tasks"
  | "view_department_tasks"
  | "view_own_tasks"
  | "create_task"
  | "edit_task"
  | "delete_task"
  | "assign_task"
  | "reassign_task"
  | "change_task_status"
  | "approve_task"
  | "view_projects"
  | "create_project"
  | "edit_project"
  | "delete_project"
  | "manage_project_members"
  | "view_procurement"
  | "manage_procurement"
  | "approve_procurement"
  | "view_suppliers"
  | "manage_suppliers"
  | "view_inventory"
  | "manage_inventory"
  | "view_invoices"
  | "manage_invoices"
  | "approve_payments"
  | "view_reports"
  | "view_team"
  | "manage_team"
  | "view_users"
  | "manage_users"
  | "manage_roles"
  | "manage_permissions"
  | "manage_workflows"
  | "admin_settings"
  | "impersonate_user"
  | "view_audit_log";

export type V60Permission = {
  id: string;
  key: V60PermissionKey;
  label: string;
  description: string;
  module: "Tasks" | "Projects" | "Procurement" | "Inventory" | "Finance" | "Team" | "Admin" | "Reports" | "Workflow";
  riskLevel: "low" | "medium" | "high" | "critical";
  defaultRoles: V60RoleKey[];
};

export type V60AccountSettings = {
  displayName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  language: "ro" | "en";
  timezone: string;
  dateFormat: "dd.MM.yyyy" | "yyyy-MM-dd";
  timeFormat: "24h" | "12h";
  theme: "light" | "dark" | "system";
  accentColor: string;
  compactMode: boolean;
  defaultHomePage: string;
  defaultTaskView: string;
  sidebarCollapsed: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyDigest: boolean;
  weeklyDigest: boolean;
  taskReminders: boolean;
  mentionNotifications: boolean;
  approvalNotifications: boolean;
};

export type V60User = {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl?: string;
  initials: string;
  roleId: V60RoleKey;
  role: V60RoleKey;
  roleName: string;
  departmentId: string;
  departmentName: string;
  teamId: string;
  teamName: string;
  managerId: string | null;
  jobTitle: string;
  phone: string;
  location: string;
  timezone: string;
  language: "ro" | "en";
  status: "active" | "inactive" | "invited" | "suspended";
  presenceStatus: V60Presence;
  active: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  permissions: V60PermissionKey[];
  settings: V60AccountSettings;
};

export type V60Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  parentTaskId: string | null;
  subtasks: string[];
  status: V60TaskStatus;
  priority: V60Priority;
  assigneeId: string;
  assigneeName: string;
  ownerId: string;
  ownerName: string;
  reviewerId: string | null;
  reviewerName: string | null;
  createdBy: string;
  startDate: string;
  dueDate: string;
  estimateMinutes: number;
  trackedMinutes: number;
  tags: string[];
  checklist: { id: string; label: string; done: boolean }[];
  comments: { id: string; authorId: string; authorName: string; body: string; createdAt: string }[];
  attachments: { id: string; name: string; type: string; size: string; uploadedBy: string; uploadedAt: string }[];
  dependencies: string[];
  activityLog: { id: string; actorId: string; actorName: string; action: string; createdAt: string }[];
  approvalStatus: V60ApprovalStatus | "none";
  customFields: Record<string, string | number | boolean>;
  watchers: string[];
  teamId: string;
  departmentId: string;
  sourceModule: "project" | "procurement" | "inventory" | "invoice" | "iot" | "maintenance" | "document" | "sales";
};

export type V60Notification = {
  id: string;
  userId: string;
  type:
    | "task_assigned"
    | "task_reassigned"
    | "task_due_soon"
    | "task_overdue"
    | "comment_mention"
    | "approval_requested"
    | "approval_decided"
    | "procurement_update"
    | "invoice_due"
    | "order_delayed"
    | "system_alert"
    | "user_invited"
    | "role_changed";
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  read: boolean;
  createdAt: string;
};

export type V60ApprovalRequest = {
  id: string;
  type: "task approval" | "procurement approval" | "offer approval" | "invoice approval" | "payment approval" | "project phase approval" | "budget approval";
  entityType: "task" | "project" | "procurement" | "offer" | "invoice" | "payment" | "budget";
  entityId: string;
  title: string;
  requestedBy: string;
  approverId: string;
  status: V60ApprovalStatus;
  reason: string;
  createdAt: string;
  decidedAt?: string;
  decisionNote?: string;
};

export type V60WorkloadRow = {
  userId: string;
  userName: string;
  roleName: string;
  departmentName: string;
  presenceStatus: V60Presence;
  activeTasks: number;
  overdueTasks: number;
  blockedTasks: number;
  completedThisWeek: number;
  estimateMinutes: number;
  trackedMinutes: number;
  workloadPercent: number;
  availability: "available" | "busy" | "overloaded" | "unavailable";
};

export const v60Permissions: V60Permission[] = [
  { id: "p1", key: "view_all_tasks", label: "Vede toate taskurile", description: "Acces complet la taskurile companiei", module: "Tasks", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director"] },
  { id: "p2", key: "view_team_tasks", label: "Vede taskuri echipă", description: "Acces la taskurile subordonaților și echipei", module: "Tasks", riskLevel: "medium", defaultRoles: ["department_manager", "project_manager", "project_responsible"] },
  { id: "p3", key: "view_department_tasks", label: "Vede taskuri departament", description: "Acces la taskuri pe departament", module: "Tasks", riskLevel: "medium", defaultRoles: ["department_manager"] },
  { id: "p4", key: "view_own_tasks", label: "Vede taskurile proprii", description: "Acces standard pentru execuție", module: "Tasks", riskLevel: "low", defaultRoles: ["technician", "sales", "finance", "procurement_specialist", "client", "viewer"] },
  { id: "p5", key: "create_task", label: "Creează task", description: "Poate crea taskuri operaționale", module: "Tasks", riskLevel: "medium", defaultRoles: ["super_admin", "admin", "director", "department_manager", "project_manager", "project_responsible", "procurement_specialist", "finance", "sales"] },
  { id: "p6", key: "edit_task", label: "Editează task", description: "Poate edita taskuri vizibile", module: "Tasks", riskLevel: "medium", defaultRoles: ["super_admin", "admin", "director", "department_manager", "project_manager", "project_responsible"] },
  { id: "p7", key: "delete_task", label: "Șterge task", description: "Operațiune sensibilă auditată", module: "Tasks", riskLevel: "critical", defaultRoles: ["super_admin", "admin"] },
  { id: "p8", key: "assign_task", label: "Asignează task", description: "Poate asigna taskuri către utilizatori eligibili", module: "Tasks", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director", "department_manager", "project_manager", "project_responsible"] },
  { id: "p9", key: "reassign_task", label: "Reasignează task", description: "Mută responsabilitatea între utilizatori", module: "Tasks", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director", "department_manager", "project_manager"] },
  { id: "p10", key: "change_task_status", label: "Schimbă status task", description: "Mută taskuri prin workflow", module: "Tasks", riskLevel: "medium", defaultRoles: ["super_admin", "admin", "director", "department_manager", "project_manager", "project_responsible", "technician", "procurement_specialist", "finance", "sales"] },
  { id: "p11", key: "approve_task", label: "Aprobă task", description: "Poate decide aprobări de taskuri critice", module: "Workflow", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director", "department_manager", "project_manager"] },
  { id: "p12", key: "view_projects", label: "Vede proiecte", description: "Acces proiecte Work OS", module: "Projects", riskLevel: "low", defaultRoles: ["super_admin", "admin", "director", "department_manager", "project_manager", "project_responsible", "technician", "client", "viewer"] },
  { id: "p13", key: "create_project", label: "Creează proiect", description: "Inițiază proiecte noi", module: "Projects", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director", "project_manager"] },
  { id: "p14", key: "edit_project", label: "Editează proiect", description: "Editează proiecte existente", module: "Projects", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director", "project_manager", "project_responsible"] },
  { id: "p15", key: "delete_project", label: "Șterge proiect", description: "Operațiune critică", module: "Projects", riskLevel: "critical", defaultRoles: ["super_admin", "admin"] },
  { id: "p16", key: "manage_project_members", label: "Gestionează membri proiect", description: "Controlează echipa de proiect", module: "Projects", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director", "project_manager"] },
  { id: "p17", key: "view_procurement", label: "Vede achiziții", description: "Acces achiziții/aprovizionare", module: "Procurement", riskLevel: "medium", defaultRoles: ["super_admin", "admin", "director", "department_manager", "procurement_specialist", "project_manager", "finance"] },
  { id: "p18", key: "manage_procurement", label: "Gestionează achiziții", description: "RFQ, oferte, comenzi", module: "Procurement", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director", "procurement_specialist"] },
  { id: "p19", key: "approve_procurement", label: "Aprobă achiziții", description: "Decizii peste prag", module: "Procurement", riskLevel: "critical", defaultRoles: ["super_admin", "admin", "director", "department_manager"] },
  { id: "p20", key: "view_suppliers", label: "Vede furnizori", description: "Acces catalog furnizori", module: "Procurement", riskLevel: "medium", defaultRoles: ["super_admin", "admin", "director", "procurement_specialist", "finance"] },
  { id: "p21", key: "manage_suppliers", label: "Gestionează furnizori", description: "CRUD furnizori", module: "Procurement", riskLevel: "high", defaultRoles: ["super_admin", "admin", "procurement_specialist"] },
  { id: "p22", key: "view_inventory", label: "Vede stoc", description: "Acces inventar/stocuri", module: "Inventory", riskLevel: "medium", defaultRoles: ["super_admin", "admin", "director", "department_manager", "procurement_specialist", "project_manager", "technician"] },
  { id: "p23", key: "manage_inventory", label: "Gestionează stoc", description: "Mișcări, rezervări, seriale", module: "Inventory", riskLevel: "high", defaultRoles: ["super_admin", "admin", "procurement_specialist", "department_manager"] },
  { id: "p24", key: "view_invoices", label: "Vede facturi", description: "Acces facturi și plăți", module: "Finance", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director", "finance"] },
  { id: "p25", key: "manage_invoices", label: "Gestionează facturi", description: "Validează și corectează facturi", module: "Finance", riskLevel: "critical", defaultRoles: ["super_admin", "admin", "finance"] },
  { id: "p26", key: "approve_payments", label: "Aprobă plăți", description: "Control plăți", module: "Finance", riskLevel: "critical", defaultRoles: ["super_admin", "director", "finance"] },
  { id: "p27", key: "view_reports", label: "Vede rapoarte", description: "Acces BI și rapoarte", module: "Reports", riskLevel: "medium", defaultRoles: ["super_admin", "admin", "director", "department_manager", "project_manager", "finance"] },
  { id: "p28", key: "view_team", label: "Vede echipă", description: "Acces membri și status", module: "Team", riskLevel: "medium", defaultRoles: ["super_admin", "admin", "director", "department_manager", "project_manager"] },
  { id: "p29", key: "manage_team", label: "Gestionează echipă", description: "Alocări, manageri, workload", module: "Team", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director", "department_manager"] },
  { id: "p30", key: "view_users", label: "Vede useri", description: "Acces admin utilizatori", module: "Admin", riskLevel: "medium", defaultRoles: ["super_admin", "admin", "director"] },
  { id: "p31", key: "manage_users", label: "Gestionează useri", description: "Invită, activează, suspendă", module: "Admin", riskLevel: "critical", defaultRoles: ["super_admin", "admin"] },
  { id: "p32", key: "manage_roles", label: "Gestionează roluri", description: "Role matrix", module: "Admin", riskLevel: "critical", defaultRoles: ["super_admin", "admin"] },
  { id: "p33", key: "manage_permissions", label: "Gestionează permisiuni", description: "Permission matrix", module: "Admin", riskLevel: "critical", defaultRoles: ["super_admin"] },
  { id: "p34", key: "manage_workflows", label: "Gestionează workflow-uri", description: "Automatizări, approvals, gates", module: "Workflow", riskLevel: "critical", defaultRoles: ["super_admin", "admin", "director"] },
  { id: "p35", key: "admin_settings", label: "Setări admin", description: "Configurare platformă", module: "Admin", riskLevel: "critical", defaultRoles: ["super_admin", "admin"] },
  { id: "p36", key: "impersonate_user", label: "Impersonare demo", description: "Schimbă cont pentru debug/demo", module: "Admin", riskLevel: "critical", defaultRoles: ["super_admin", "admin"] },
  { id: "p37", key: "view_audit_log", label: "Vede audit log", description: "Audit acțiuni sistem", module: "Admin", riskLevel: "high", defaultRoles: ["super_admin", "admin", "director"] }
];

const permissionKeys = v60Permissions.map((permission) => permission.key);
const permissionsFor = (role: V60RoleKey): V60PermissionKey[] => v60Permissions.filter((permission) => permission.defaultRoles.includes(role)).map((permission) => permission.key);

export const v60Users: V60User[] = [
  ["u1", "Andrei Popescu", "andrei.popescu@servelect.ro", "andrei", "super_admin", "Super Admin / Director", "Management", "management", "Leadership", "team-lead", null, "Director Operațional", "online"],
  ["u2", "Ioana Marinescu", "ioana.marinescu@servelect.ro", "ioana", "project_manager", "Manager Proiect", "Proiectare", "design", "Proiectare FV", "team-design", "u1", "Manager proiectare", "busy"],
  ["u3", "Mihai Ionescu", "mihai.ionescu@servelect.ro", "mihai", "department_manager", "Manager Departament", "Execuție", "execution", "Echipa teren", "team-field", "u1", "Coordonator execuție", "on_site"],
  ["u4", "George Stan", "george.stan@servelect.ro", "george", "procurement_specialist", "Specialist Achiziții", "Achiziții", "procurement", "Aprovizionare", "team-procurement", "u1", "Specialist achiziții", "online"],
  ["u5", "Alexandra Rusu", "alexandra.rusu@servelect.ro", "alexandra", "finance", "Financiar / Contabil", "Financiar", "finance", "Financiar", "team-finance", "u1", "Contabil proiecte", "away"],
  ["u6", "Cristian Radu", "cristian.radu@servelect.ro", "cristian", "technician", "Tehnician", "Execuție", "execution", "Echipa teren", "team-field", "u3", "Tehnician senior", "on_site"],
  ["u7", "Vlad Neagu", "vlad.neagu@servelect.ro", "vlad", "technician", "Tehnician", "Execuție", "execution", "Echipa teren", "team-field", "u3", "Electrician", "on_site"],
  ["u8", "Diana Stan", "diana.stan@servelect.ro", "diana", "sales", "Vânzări", "Vânzări", "sales", "Comercial", "team-sales", "u1", "Consultant vânzări", "online"],
  ["u9", "Bogdan Rusu", "bogdan.rusu@servelect.ro", "bogdan", "project_responsible", "Responsabil Proiect", "Execuție", "execution", "Echipa teren", "team-field", "u3", "Responsabil șantier", "busy"],
  ["u10", "Client Demo", "client.demo@firma.ro", "client", "client", "Client", "Client", "client", "Portal client", "team-client", null, "Beneficiar", "online"]
].map(([id, name, email, username, role, roleName, departmentName, departmentId, teamName, teamId, managerId, jobTitle, presenceStatus]) => {
  const safeName = String(name);
  const initials = safeName.split(" ").map((piece) => piece[0]).join("").slice(0, 2).toUpperCase();
  const roleId = role as V60RoleKey;
  return {
    id: String(id),
    name: safeName,
    email: String(email),
    username: String(username),
    initials,
    roleId,
    role: roleId,
    roleName: String(roleName),
    departmentId: String(departmentId),
    departmentName: String(departmentName),
    teamId: String(teamId),
    teamName: String(teamName),
    managerId: managerId ? String(managerId) : null,
    jobTitle: String(jobTitle),
    phone: "+40 700 000 000",
    location: departmentId === "client" ? "Portal client" : "Cluj-Napoca / teren",
    timezone: "Europe/Bucharest",
    language: "ro" as const,
    status: "active" as const,
    presenceStatus: presenceStatus as V60Presence,
    active: true,
    lastLoginAt: "2026-06-08T09:00:00",
    createdAt: "2026-01-01T08:00:00",
    updatedAt: "2026-06-08T09:10:00",
    permissions: roleId === "super_admin" ? permissionKeys : permissionsFor(roleId),
    settings: {
      displayName: safeName,
      email: String(email),
      phone: "+40 700 000 000",
      language: "ro" as const,
      timezone: "Europe/Bucharest",
      dateFormat: "dd.MM.yyyy" as const,
      timeFormat: "24h" as const,
      theme: "system" as const,
      accentColor: "#00843D",
      compactMode: false,
      defaultHomePage: "/my-work",
      defaultTaskView: "table",
      sidebarCollapsed: false,
      emailNotifications: true,
      pushNotifications: true,
      dailyDigest: true,
      weeklyDigest: true,
      taskReminders: true,
      mentionNotifications: true,
      approvalNotifications: true
    }
  } satisfies V60User;
});

export const v60Tasks: V60Task[] = [
  {
    id: "t-5001",
    title: "Configrare invertor și test PIF — GreenFactory SA",
    description: "Task critic din faza PIF pentru sistem FV 500 kWp. Necesită checklist, reviewer și aprobarea managerului.",
    projectId: "P-2024-0103",
    projectName: "Sistem FV 500 kWp — GreenFactory SA",
    parentTaskId: null,
    subtasks: ["Verificare stringuri", "Parametrizare invertor", "Test protecții", "Raport PIF"],
    status: "in_progress",
    priority: "critical",
    assigneeId: "u6",
    assigneeName: "Cristian Radu",
    ownerId: "u3",
    ownerName: "Mihai Ionescu",
    reviewerId: "u2",
    reviewerName: "Ioana Marinescu",
    createdBy: "u3",
    startDate: "2026-06-08",
    dueDate: "2026-06-10",
    estimateMinutes: 480,
    trackedMinutes: 210,
    tags: ["PIF", "teren", "critic", "IoT"],
    checklist: [
      { id: "c1", label: "Invertor online", done: true },
      { id: "c2", label: "Protecții validate", done: false },
      { id: "c3", label: "Raport foto încărcat", done: false }
    ],
    comments: [{ id: "cm1", authorId: "u3", authorName: "Mihai Ionescu", body: "Prioritar pentru recepție. Atașați pozele din teren.", createdAt: "2026-06-08T08:20:00" }],
    attachments: [{ id: "a1", name: "schema-stringuri.pdf", type: "pdf", size: "1.8 MB", uploadedBy: "u2", uploadedAt: "2026-06-07T14:00:00" }],
    dependencies: ["t-5004"],
    activityLog: [{ id: "al1", actorId: "u3", actorName: "Mihai Ionescu", action: "A reasignat taskul către Cristian Radu", createdAt: "2026-06-08T08:05:00" }],
    approvalStatus: "pending",
    customFields: { kWp: 500, slaHours: 24, fieldRequired: true },
    watchers: ["u1", "u2", "u3"],
    teamId: "team-field",
    departmentId: "execution",
    sourceModule: "iot"
  },
  {
    id: "t-5002",
    title: "Centralizare oferte furnizori pentru panouri 585 W",
    description: "Proces de achiziții legat de stoc, proiecte și aprobarea peste prag.",
    projectId: "P-2024-0098",
    projectName: "RetailMax SRL — Ploiești",
    parentTaskId: null,
    subtasks: ["Trimite RFQ", "Compară prețuri", "Verifică termen livrare", "Pregătește aprobare"],
    status: "review",
    priority: "high",
    assigneeId: "u4",
    assigneeName: "George Stan",
    ownerId: "u1",
    ownerName: "Andrei Popescu",
    reviewerId: "u5",
    reviewerName: "Alexandra Rusu",
    createdBy: "u1",
    startDate: "2026-06-06",
    dueDate: "2026-06-09",
    estimateMinutes: 360,
    trackedMinutes: 240,
    tags: ["achiziții", "furnizori", "aprobare"],
    checklist: [
      { id: "c4", label: "Minim 3 oferte", done: true },
      { id: "c5", label: "Analiză tehnică", done: true },
      { id: "c6", label: "Aprobare director", done: false }
    ],
    comments: [{ id: "cm2", authorId: "u4", authorName: "George Stan", body: "Două oferte sunt complete, a treia are termen livrare întârziat.", createdAt: "2026-06-08T07:40:00" }],
    attachments: [{ id: "a2", name: "comparativ-oferte.xlsx", type: "xlsx", size: "420 KB", uploadedBy: "u4", uploadedAt: "2026-06-08T07:35:00" }],
    dependencies: [],
    activityLog: [{ id: "al2", actorId: "u4", actorName: "George Stan", action: "A cerut aprobare pentru achiziție peste prag", createdAt: "2026-06-08T07:50:00" }],
    approvalStatus: "pending",
    customFields: { estimatedValueEur: 18500, supplierCount: 3 },
    watchers: ["u1", "u5"],
    teamId: "team-procurement",
    departmentId: "procurement",
    sourceModule: "procurement"
  },
  {
    id: "t-5003",
    title: "Follow-up ofertă client — stație încărcare EV Timișoara",
    description: "Task comercial cu documente, next step și reminder.",
    projectId: "P-2024-0142",
    projectName: "Stație încărcare EV — Timișoara",
    parentTaskId: null,
    subtasks: ["Trimite revizie ofertă", "Confirmă buget", "Programează call"],
    status: "todo",
    priority: "medium",
    assigneeId: "u8",
    assigneeName: "Diana Stan",
    ownerId: "u1",
    ownerName: "Andrei Popescu",
    reviewerId: null,
    reviewerName: null,
    createdBy: "u8",
    startDate: "2026-06-08",
    dueDate: "2026-06-11",
    estimateMinutes: 180,
    trackedMinutes: 40,
    tags: ["vânzări", "ofertă", "follow-up"],
    checklist: [{ id: "c7", label: "Oferta revizuită", done: false }],
    comments: [],
    attachments: [],
    dependencies: [],
    activityLog: [{ id: "al3", actorId: "u8", actorName: "Diana Stan", action: "A creat reminder de follow-up", createdAt: "2026-06-08T09:00:00" }],
    approvalStatus: "none",
    customFields: { opportunityValueEur: 42000 },
    watchers: ["u1"],
    teamId: "team-sales",
    departmentId: "sales",
    sourceModule: "sales"
  },
  {
    id: "t-5004",
    title: "Verificare documentație tehnică înainte de PIF",
    description: "Documentele lipsă blochează PIF și taskul de configurare invertor.",
    projectId: "P-2024-0103",
    projectName: "Sistem FV 500 kWp — GreenFactory SA",
    parentTaskId: null,
    subtasks: ["Aviz racordare", "Schema monofilară", "PV probe"],
    status: "blocked",
    priority: "urgent",
    assigneeId: "u2",
    assigneeName: "Ioana Marinescu",
    ownerId: "u2",
    ownerName: "Ioana Marinescu",
    reviewerId: "u1",
    reviewerName: "Andrei Popescu",
    createdBy: "u2",
    startDate: "2026-06-07",
    dueDate: "2026-06-08",
    estimateMinutes: 240,
    trackedMinutes: 260,
    tags: ["documente", "blocaj", "PIF"],
    checklist: [{ id: "c8", label: "Aviz încărcat", done: false }],
    comments: [{ id: "cm4", authorId: "u2", authorName: "Ioana Marinescu", body: "Așteptăm confirmarea documentului de la beneficiar.", createdAt: "2026-06-08T08:10:00" }],
    attachments: [],
    dependencies: [],
    activityLog: [{ id: "al4", actorId: "u2", actorName: "Ioana Marinescu", action: "A marcat taskul ca blocat", createdAt: "2026-06-08T08:00:00" }],
    approvalStatus: "none",
    customFields: { missingDocuments: 1 },
    watchers: ["u1", "u3"],
    teamId: "team-design",
    departmentId: "design",
    sourceModule: "document"
  }
];

export const v60Notifications: V60Notification[] = [
  { id: "n1", userId: "u6", type: "task_assigned", title: "Task critic asignat", message: "Ai primit taskul Configurare invertor și test PIF.", entityType: "task", entityId: "t-5001", read: false, createdAt: "2026-06-08T08:06:00" },
  { id: "n2", userId: "u1", type: "approval_requested", title: "Aprobare achiziție peste prag", message: "George Stan solicită aprobare pentru panouri 585 W.", entityType: "approval", entityId: "ap1", read: false, createdAt: "2026-06-08T07:50:00" },
  { id: "n3", userId: "u3", type: "task_overdue", title: "Blocaj proiect GreenFactory", message: "Documentația tehnică blochează PIF.", entityType: "task", entityId: "t-5004", read: false, createdAt: "2026-06-08T09:00:00" },
  { id: "n4", userId: "u5", type: "invoice_due", title: "Factură furnizor scadentă", message: "Factură INV-2026-044 necesită validare.", entityType: "invoice", entityId: "inv-2026-044", read: true, createdAt: "2026-06-08T08:30:00" }
];

export const v60Approvals: V60ApprovalRequest[] = [
  { id: "ap1", type: "procurement approval", entityType: "procurement", entityId: "rfq-585w", title: "Achiziție panouri peste prag", requestedBy: "u4", approverId: "u1", status: "pending", reason: "Valoare estimată peste pragul de 15.000 EUR", createdAt: "2026-06-08T07:50:00" },
  { id: "ap2", type: "task approval", entityType: "task", entityId: "t-5001", title: "Validare PIF GreenFactory", requestedBy: "u3", approverId: "u2", status: "pending", reason: "Task critic înainte de recepție", createdAt: "2026-06-08T08:15:00" },
  { id: "ap3", type: "invoice approval", entityType: "invoice", entityId: "inv-2026-044", title: "Factură furnizor scadentă", requestedBy: "u5", approverId: "u1", status: "pending", reason: "Plată necesară pentru livrare materiale", createdAt: "2026-06-08T08:35:00" }
];

export const rolePermissionMap: Record<V60RoleKey, V60PermissionKey[]> = {
  super_admin: permissionKeys,
  admin: permissionsFor("admin"),
  director: permissionsFor("director"),
  department_manager: permissionsFor("department_manager"),
  project_manager: permissionsFor("project_manager"),
  project_responsible: permissionsFor("project_responsible"),
  procurement_specialist: permissionsFor("procurement_specialist"),
  finance: permissionsFor("finance"),
  technician: permissionsFor("technician"),
  sales: permissionsFor("sales"),
  client: permissionsFor("client"),
  viewer: permissionsFor("viewer")
};

export function getUserById(userId: string): V60User | undefined {
  return v60Users.find((user) => user.id === userId);
}

export function hasPermission(user: V60User, permissionKey: V60PermissionKey): boolean {
  return user.permissions.includes(permissionKey) || rolePermissionMap[user.role]?.includes(permissionKey) === true;
}

export function roleCan(role: V60RoleKey, permissionKey: V60PermissionKey): boolean {
  return rolePermissionMap[role]?.includes(permissionKey) === true;
}

export function getPermissionsForRole(role: V60RoleKey): V60Permission[] {
  const keys = rolePermissionMap[role] ?? [];
  return v60Permissions.filter((permission) => keys.includes(permission.key));
}

export function isAdmin(user: V60User): boolean {
  return ["super_admin", "admin"].includes(user.role);
}

export function isDirector(user: V60User): boolean {
  return user.role === "director" || user.role === "super_admin";
}

export function isManager(user: V60User): boolean {
  return ["super_admin", "admin", "director", "department_manager", "project_manager", "project_responsible"].includes(user.role);
}

export function getDirectReports(userId: string): V60User[] {
  return v60Users.filter((user) => user.managerId === userId);
}

export function getAllReports(userId: string): V60User[] {
  const direct = getDirectReports(userId);
  const nested = direct.flatMap((user) => getAllReports(user.id));
  return [...direct, ...nested];
}

export const getSubordinates = getAllReports;

export function isManagerOf(managerId: string, userId: string): boolean {
  return getAllReports(managerId).some((report) => report.id === userId);
}

export function canViewUser(viewer: V60User, targetUser: V60User): boolean {
  if (isAdmin(viewer) || isDirector(viewer)) return true;
  if (viewer.id === targetUser.id) return true;
  if (viewer.role === "department_manager" && viewer.departmentId === targetUser.departmentId) return true;
  return isManagerOf(viewer.id, targetUser.id);
}

export function canViewTask(user: V60User, task: V60Task): boolean {
  if (hasPermission(user, "view_all_tasks")) return true;
  if (hasPermission(user, "view_department_tasks") && task.departmentId === user.departmentId) return true;
  if (hasPermission(user, "view_team_tasks") && task.teamId === user.teamId) return true;
  if ([task.assigneeId, task.ownerId, task.reviewerId, task.createdBy].includes(user.id)) return true;
  if (task.watchers.includes(user.id)) return true;
  if (user.role === "client") return task.projectId === "P-2024-0142";
  return false;
}

export function canEditTask(user: V60User, task: V60Task): boolean {
  if (hasPermission(user, "edit_task") && canViewTask(user, task)) return true;
  return task.assigneeId === user.id && hasPermission(user, "change_task_status");
}

export function canCreateTask(user: V60User): boolean {
  return hasPermission(user, "create_task");
}

export function canDeleteTask(user: V60User, task: V60Task): boolean {
  return hasPermission(user, "delete_task") && canViewTask(user, task);
}

export function canAssignTask(user: V60User, targetUser: V60User): boolean {
  if (!hasPermission(user, "assign_task")) return false;
  if (isAdmin(user) || isDirector(user)) return true;
  if (user.role === "department_manager") return user.departmentId === targetUser.departmentId;
  return isManagerOf(user.id, targetUser.id) || user.teamId === targetUser.teamId;
}

export function canReassignTask(user: V60User, task: V60Task, targetUser: V60User): boolean {
  return hasPermission(user, "reassign_task") && canViewTask(user, task) && canAssignTask(user, targetUser);
}

export function canViewUserWorkload(user: V60User, targetUser: V60User): boolean {
  return hasPermission(user, "view_team") && canViewUser(user, targetUser);
}

export function canApproveRequest(user: V60User, request: V60ApprovalRequest): boolean {
  if (request.approverId === user.id) return true;
  if (request.type.includes("procurement")) return hasPermission(user, "approve_procurement");
  if (request.type.includes("payment") || request.type.includes("invoice")) return hasPermission(user, "approve_payments");
  return hasPermission(user, "approve_task");
}

export function getVisibleTasksForUser(user: V60User): V60Task[] {
  return v60Tasks.filter((task) => canViewTask(user, task));
}

export function getVisibleUsersForUser(user: V60User): V60User[] {
  return v60Users.filter((target) => canViewUser(user, target));
}

export function getAssignableUsersForUser(user: V60User): V60User[] {
  return v60Users.filter((target) => target.active && canAssignTask(user, target));
}

export function getVisibleProjectsForUser(user: V60User): string[] {
  return Array.from(new Set(getVisibleTasksForUser(user).map((task) => task.projectId)));
}

export function getTeamWorkloadForUser(user: V60User): V60WorkloadRow[] {
  return getVisibleUsersForUser(user).map((member) => {
    const tasks = v60Tasks.filter((task) => canViewTask(user, task) && [task.assigneeId, task.ownerId, task.reviewerId].includes(member.id));
    const estimateMinutes = tasks.reduce((sum, task) => sum + task.estimateMinutes, 0);
    const trackedMinutes = tasks.reduce((sum, task) => sum + task.trackedMinutes, 0);
    const workloadPercent = Math.min(145, Math.round((estimateMinutes / 2400) * 100));
    return {
      userId: member.id,
      userName: member.name,
      roleName: member.roleName,
      departmentName: member.departmentName,
      presenceStatus: member.presenceStatus,
      activeTasks: tasks.filter((task) => !["done", "cancelled"].includes(task.status)).length,
      overdueTasks: tasks.filter((task) => task.dueDate < "2026-06-08" && !["done", "cancelled"].includes(task.status)).length,
      blockedTasks: tasks.filter((task) => task.status === "blocked").length,
      completedThisWeek: tasks.filter((task) => task.status === "done").length,
      estimateMinutes,
      trackedMinutes,
      workloadPercent,
      availability: member.presenceStatus === "on_leave" ? "unavailable" : workloadPercent > 100 ? "overloaded" : workloadPercent > 75 ? "busy" : "available"
    };
  });
}

export function assignTask(taskId: string, targetUserId: string, assignedBy: string): { ok: boolean; task?: V60Task; notification?: V60Notification; error?: string } {
  const actor = getUserById(assignedBy);
  const target = getUserById(targetUserId);
  const task = v60Tasks.find((item) => item.id === taskId);
  if (!actor || !target || !task) return { ok: false, error: "Actor, target sau task inexistent" };
  if (!canAssignTask(actor, target)) return { ok: false, error: "Permisiune insuficientă pentru assign" };
  const updated: V60Task = {
    ...task,
    assigneeId: target.id,
    assigneeName: target.name,
    activityLog: [
      ...task.activityLog,
      { id: `al-${Date.now()}`, actorId: actor.id, actorName: actor.name, action: `A asignat taskul către ${target.name}`, createdAt: new Date().toISOString() }
    ]
  };
  return {
    ok: true,
    task: updated,
    notification: { id: `n-${Date.now()}`, userId: target.id, type: "task_assigned", title: "Task asignat", message: `${actor.name} ți-a asignat taskul ${task.title}.`, entityType: "task", entityId: task.id, read: false, createdAt: new Date().toISOString() }
  };
}

export function reassignTask(taskId: string, fromUserId: string, toUserId: string, changedBy: string): { ok: boolean; task?: V60Task; notification?: V60Notification; error?: string } {
  const actor = getUserById(changedBy);
  const target = getUserById(toUserId);
  const task = v60Tasks.find((item) => item.id === taskId);
  if (!actor || !target || !task) return { ok: false, error: "Actor, target sau task inexistent" };
  if (task.assigneeId !== fromUserId) return { ok: false, error: "Taskul nu este asignat userului sursă" };
  if (!canReassignTask(actor, task, target)) return { ok: false, error: "Permisiune insuficientă pentru reassign" };
  return assignTask(taskId, toUserId, changedBy);
}

export function getRoleAwareDashboard(userId: string) {
  const user = getUserById(userId) ?? v60Users[0];
  const visibleTasks = getVisibleTasksForUser(user);
  const workload = getTeamWorkloadForUser(user);
  const pendingApprovals = v60Approvals.filter((approval) => canApproveRequest(user, approval) && approval.status === "pending");
  const unreadNotifications = v60Notifications.filter((notification) => notification.userId === user.id && !notification.read);
  const roleFocus: Record<V60RoleKey, string[]> = {
    super_admin: ["Sănătate platformă", "Taskuri overdue", "Aprobări", "Audit", "RBAC"],
    admin: ["Utilizatori", "Roluri", "Permisiuni", "Audit", "Workflow-uri"],
    director: ["Departamente", "Aprobări critice", "Achiziții", "Facturi", "Proiecte în risc"],
    department_manager: ["Subordonați", "Workload", "Overdue echipă", "Alocări", "Aprobări"],
    project_manager: ["Proiectele mele", "Milestones", "Riscuri", "Documente lipsă", "Taskuri blocate"],
    project_responsible: ["Taskuri proiect", "Teren", "Checklist", "Materiale", "PIF"],
    procurement_specialist: ["RFQ", "Furnizori", "Comenzi întârziate", "Aprobări", "Stoc sub minim"],
    finance: ["Facturi", "Plăți", "Aprobări", "Scadențe", "Costuri proiect"],
    technician: ["Taskurile mele azi", "Intervenții", "Timer", "Checklist", "Materiale necesare"],
    sales: ["Lead-uri", "Oferte", "Follow-up", "Pipeline", "Taskuri comerciale"],
    client: ["Proiectele mele", "Documente", "Tickete", "Producție energie", "Facturi"],
    viewer: ["Rapoarte", "Status", "Calendar", "Documente", "Citire doar"]
  };
  return {
    user,
    focus: roleFocus[user.role],
    kpis: {
      visibleTasks: visibleTasks.length,
      overdue: visibleTasks.filter((task) => task.dueDate < "2026-06-08" && !["done", "cancelled"].includes(task.status)).length,
      blocked: visibleTasks.filter((task) => task.status === "blocked").length,
      approvals: pendingApprovals.length,
      unreadNotifications: unreadNotifications.length,
      visibleUsers: getVisibleUsersForUser(user).length,
      workloadAverage: workload.length ? Math.round(workload.reduce((sum, row) => sum + row.workloadPercent, 0) / workload.length) : 0
    },
    visibleTasks,
    workload,
    pendingApprovals,
    unreadNotifications
  };
}

export const v60GoodDayCompliance = [
  { feature: "UI/UX", exists: true, quality: 4.4, missing: "polish pe mobile nativ", implemented: "sidebar, topbar, cards, badges, role-aware shell", notes: "Arată ca Work OS enterprise, nu dashboard generic." },
  { feature: "Accounts", exists: true, quality: 4.2, missing: "backend real auth", implemented: "profile/settings/security/notifications demo-persistent", notes: "Suficient pentru demo enterprise." },
  { feature: "RBAC", exists: true, quality: 4.3, missing: "policy DB real", implemented: "12 roluri, 37 permisiuni, helper functions", notes: "Pregătit pentru Prisma/RLS." },
  { feature: "Team hierarchy", exists: true, quality: 4.2, missing: "calendar concedii real", implemented: "manager/subordonat, visibility, workload", notes: "Managerii văd statusul echipei." },
  { feature: "Task Management", exists: true, quality: 4.5, missing: "mutații reale DB", implemented: "assign/reassign, watchers, approvals, activity, dependencies", notes: "Mai aproape de GoodDay/ClickUp." },
  { feature: "Workload", exists: true, quality: 4.1, missing: "capacitate reală din pontaj", implemented: "heatmap, overload, tracked vs estimate", notes: "Conectabil la Pontaj." },
  { feature: "Notifications", exists: true, quality: 4.1, missing: "push/email real", implemented: "notification center, unread, types", notes: "Mock persistent-ready." },
  { feature: "Approvals", exists: true, quality: 4.2, missing: "workflow engine real", implemented: "approval inbox, entity rules, approver logic", notes: "Acoperă procurement/invoice/task." },
  { feature: "Mobile readiness", exists: true, quality: 3.8, missing: "offline sync nativ complet", implemented: "field/mobile preview, role views", notes: "Următorul build poate merge pe mobile offline." }
];

export function getV60EnterpriseOperatingLayer() {
  const defaultDashboard = getRoleAwareDashboard("u1");
  return {
    version: "6.0.0",
    release: "Enterprise Operating Layer, Role-Aware Workflow Engine & GoodDay Parity Expansion",
    users: v60Users,
    permissions: v60Permissions,
    rolePermissionMap,
    tasks: v60Tasks,
    notifications: v60Notifications,
    approvals: v60Approvals,
    dashboards: v60Users.map((user) => getRoleAwareDashboard(user.id)),
    defaultDashboard,
    compliance: v60GoodDayCompliance,
    acceptance: {
      accounts: 4.2,
      rbac: 4.3,
      teamManagement: 4.2,
      taskManager: 4.5,
      enterpriseReadiness: 4.25
    }
  };
}
