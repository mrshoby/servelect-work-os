export const V98_RELEASE_VERSION = "9.8.0";

export type V98User = {
  id: string;
  name: string;
  role: string;
  department: string;
  capacity: number;
  avatar: string;
};

export type V98Project = {
  id: string;
  code: string;
  name: string;
  client: string;
  folder: string;
  department: string;
  status: "Active" | "At risk" | "Planning" | "Paused" | "Done";
  progress: number;
  budget: number;
  location: string;
};

export type V98Task = {
  id: string;
  code: string;
  title: string;
  type: "Task" | "Ticket" | "Approval" | "Field Work" | "Design" | "Document" | "Procurement";
  projectId: string;
  project: string;
  folder: string;
  status: "Backlog" | "To do" | "In progress" | "Review" | "Blocked" | "Done";
  priority: "Critical" | "High" | "Medium" | "Low";
  assigneeId: string;
  assignee: string;
  ownerId: string;
  owner: string;
  department: string;
  dueDate: string;
  startDate: string;
  estimate: number;
  tracked: number;
  progress: number;
  tags: string[];
  customFields: Record<string, string>;
  comments: V98Comment[];
  activity: V98Activity[];
  attachments: V98Attachment[];
  checklist: V98ChecklistItem[];
  dependencies: string[];
  watchers: string[];
  linkedTickets: string[];
  linkedApprovals: string[];
  reminders: string[];
  automationHistory: string[];
  mentioned: boolean;
  delegatedByMe: boolean;
  createdByMe: boolean;
};

export type V98Comment = {
  id: string;
  author: string;
  text: string;
  at: string;
};

export type V98Activity = {
  id: string;
  actor: string;
  action: string;
  at: string;
};

export type V98Attachment = {
  id: string;
  name: string;
  type: "PDF" | "Photo" | "XLSX" | "Receipt" | "Drawing";
  size: string;
};

export type V98ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type V98Ticket = {
  id: string;
  code: string;
  title: string;
  requester: string;
  client: string;
  projectId: string;
  equipment: string;
  technician: string;
  severity: "S1" | "S2" | "S3" | "S4";
  status: "New" | "Triaged" | "Assigned" | "Waiting client" | "Escalated" | "Converted" | "Closed";
  slaMinutes: number;
  comments: V98Comment[];
  attachments: V98Attachment[];
  convertedTaskId?: string;
};

export type V98Notification = {
  id: string;
  title: string;
  body: string;
  kind: "mention" | "approval" | "sla" | "system" | "ticket";
  read: boolean;
  createdAt: string;
};

export type V98Approval = {
  id: string;
  taskId: string;
  title: string;
  requestedBy: string;
  approver: string;
  status: "Waiting" | "Approved" | "Rejected";
};

export type V98SavedView = {
  id: string;
  name: string;
  filters: string;
  page: string;
};

const departments = ["Producție", "Mentenanță", "Audit energetic", "Comercial", "Automatizări", "Administrativ", "Marketing"];

export const v98Users: V98User[] = [
  { id: "u-andrei", name: "Andrei Popescu", role: "Project Manager", department: "Producție", capacity: 40, avatar: "AP" },
  { id: "u-ioana", name: "Ioana Marinescu", role: "Operations Lead", department: "Comercial", capacity: 38, avatar: "IM" },
  { id: "u-mihai", name: "Mihai Ionescu", role: "Automation Engineer", department: "Automatizări", capacity: 35, avatar: "MI" },
  { id: "u-cristian", name: "Cristian Radu", role: "Technician", department: "Mentenanță", capacity: 40, avatar: "CR" },
  { id: "u-alexandra", name: "Alexandra Rusu", role: "Energy Auditor", department: "Audit energetic", capacity: 36, avatar: "AR" },
  { id: "u-george", name: "George Stan", role: "Procurement", department: "Administrativ", capacity: 40, avatar: "GS" },
  { id: "u-vlad", name: "Vlad Neagu", role: "Solar Design Engineer", department: "Producție", capacity: 40, avatar: "VN" },
  { id: "u-radu", name: "Radu Audit", role: "Compliance", department: "Audit", capacity: 32, avatar: "RA" }
];

export const v98Projects: V98Project[] = [
  { id: "p-cluj-96", code: "P-2026-096", name: "Sistem FV 96 kWp Cluj-Napoca", client: "GreenFactory SA", folder: "Fotovoltaice / Execuție", department: "Producție", status: "Active", progress: 72, budget: 148000, location: "Cluj-Napoca" },
  { id: "p-ev-tm", code: "P-2026-111", name: "Stație încărcare EV Timișoara", client: "Retail Park TM", folder: "EV / Infrastructură", department: "Producție", status: "At risk", progress: 51, budget: 87000, location: "Timișoara" },
  { id: "p-audit-bm", code: "AUD-2026-018", name: "Audit energetic industrial Baia Mare", client: "MetalTech BM", folder: "Audit energetic", department: "Audit energetic", status: "Planning", progress: 34, budget: 24000, location: "Baia Mare" },
  { id: "p-maint-cj", code: "MNT-2026-041", name: "Mentenanță parc FV 500 kWp", client: "SolarFarm CJ", folder: "Mentenanță / SLA", department: "Mentenanță", status: "Active", progress: 63, budget: 36000, location: "Cluj" },
  { id: "p-iot-huawei", code: "IOT-2026-009", name: "Integrare alerte Huawei/Fronius", client: "Servelect", folder: "Automatizări / IoT", department: "Automatizări", status: "Active", progress: 58, budget: 46000, location: "Remote" },
  { id: "p-crm-public", code: "CRM-2026-027", name: "Ofertare prosumatori instituții publice", client: "Primării Transilvania", folder: "CRM / Oferte", department: "Comercial", status: "Active", progress: 49, budget: 120000, location: "Regional" },
  { id: "p-stock-inv", code: "STC-2026-015", name: "Inventar panouri/invertoare Q3", client: "Servelect", folder: "Stocuri / Logistică", department: "Administrativ", status: "Planning", progress: 26, budget: 18000, location: "Depozit" },
  { id: "p-doc-pif", code: "DOC-2026-033", name: "Dosare PIF și recepție finală", client: "Beneficiari FV", folder: "Documente tehnice", department: "Producție", status: "At risk", progress: 44, budget: 16000, location: "Multiple" },
  { id: "p-anre-cert", code: "HR-2026-012", name: "Certificări ANRE și SSM echipe teren", client: "Servelect", folder: "HR / Certificări", department: "Administrativ", status: "Active", progress: 67, budget: 9000, location: "Intern" }
];

const statuses: V98Task["status"][] = ["Backlog", "To do", "In progress", "Review", "Blocked", "Done"];
const priorities: V98Task["priority"][] = ["Critical", "High", "Medium", "Low"];
const types: V98Task["type"][] = ["Task", "Ticket", "Approval", "Field Work", "Design", "Document", "Procurement"];
const tags = ["PIF", "PVGIS", "ANRE", "IoT", "SLA", "stoc", "audit", "client", "teren", "e-Factura", "BESS", "CRM"];
const taskVerbs = [
  "Actualizează planul tehnic",
  "Verifică documentele PIF",
  "Sincronizează alertele IoT",
  "Pregătește ofertarea și BOM",
  "Confirmă disponibilitatea echipei teren",
  "Rezolvă blocajul de aprobare",
  "Atașează pozele de intervenție",
  "Validează consumul și profilul PVGIS",
  "Închide checklistul de recepție",
  "Revizuiește dependențele Gantt"
];

function makeComment(index: number, author: string): V98Comment {
  return { id: `c-${index}`, author, text: ["Am verificat statusul și am adăugat evidence.", "Aștept confirmare de la beneficiar.", "Am actualizat estimarea și dependența."][index % 3], at: `2026-06-${String(10 + (index % 8)).padStart(2, "0")} ${8 + (index % 9)}:30` };
}

function makeActivity(index: number, actor: string): V98Activity {
  return { id: `a-${index}`, actor, action: ["changed status", "added file", "updated due date", "started timer", "requested approval"][index % 5], at: `2026-06-${String(11 + (index % 9)).padStart(2, "0")} ${9 + (index % 8)}:10` };
}

function makeAttachment(index: number): V98Attachment {
  const fileTypes: V98Attachment["type"][] = ["PDF", "Photo", "XLSX", "Receipt", "Drawing"];
  return { id: `f-${index}`, name: [`PV_receptie_${index}.pdf`, `foto_teren_${index}.jpg`, `BOM_invertoare_${index}.xlsx`, `receipt_provider_${index}.pdf`, `schema_electrica_${index}.dwg`][index % 5], type: fileTypes[index % fileTypes.length], size: `${2 + (index % 9)}.${index % 9} MB` };
}

export function createV98SeedTasks(): V98Task[] {
  return Array.from({ length: 52 }).map((_, index) => {
    const project = v98Projects[index % v98Projects.length];
    const assignee = v98Users[index % v98Users.length];
    const owner = v98Users[(index + 2) % v98Users.length];
    const status = statuses[index % statuses.length];
    const estimate = 2 + (index % 18);
    const tracked = Math.max(0, estimate - 1 - (index % 5));
    return {
      id: `tsk-${String(index + 1).padStart(3, "0")}`,
      code: `SWO-${980 + index}`,
      title: `${taskVerbs[index % taskVerbs.length]} — ${project.name}`,
      type: types[index % types.length],
      projectId: project.id,
      project: project.name,
      folder: project.folder,
      status,
      priority: priorities[index % priorities.length],
      assigneeId: assignee.id,
      assignee: assignee.name,
      ownerId: owner.id,
      owner: owner.name,
      department: departments[index % departments.length],
      dueDate: `2026-06-${String(16 + (index % 12)).padStart(2, "0")}`,
      startDate: `2026-06-${String(10 + (index % 9)).padStart(2, "0")}`,
      estimate,
      tracked,
      progress: status === "Done" ? 100 : Math.min(95, 20 + (index * 7) % 74),
      tags: [tags[index % tags.length], tags[(index + 3) % tags.length]],
      customFields: {
        Beneficiar: project.client,
        Modul: ["Taskuri", "Pontaj", "Stocuri", "CRM", "IoT", "Documente"][index % 6],
        Risc: ["SLA", "Buget", "Teren", "Aprobare", "Tehnic"][index % 5],
        Locatie: project.location
      },
      comments: [makeComment(index, assignee.name), makeComment(index + 1, owner.name)],
      activity: [makeActivity(index, owner.name), makeActivity(index + 1, assignee.name)],
      attachments: [makeAttachment(index), makeAttachment(index + 1)],
      checklist: [
        { id: `cl-${index}-1`, text: "Verificare date proiect", done: index % 3 !== 0 },
        { id: `cl-${index}-2`, text: "Atașare evidence / document", done: index % 4 === 0 },
        { id: `cl-${index}-3`, text: "Confirmare manager / client", done: index % 5 === 0 }
      ],
      dependencies: index > 2 ? [`tsk-${String(index - 1).padStart(3, "0")}`] : [],
      watchers: [v98Users[(index + 1) % v98Users.length].name, v98Users[(index + 3) % v98Users.length].name],
      linkedTickets: index % 4 === 0 ? [`tic-${String(index + 1).padStart(3, "0")}`] : [],
      linkedApprovals: index % 5 === 0 ? [`apr-${String(index + 1).padStart(3, "0")}`] : [],
      reminders: [`Reminder ${index % 2 === 0 ? "azi" : "mâine"} 09:00`],
      automationHistory: [`Rule: notify ${assignee.department} on SLA risk`],
      mentioned: index % 7 === 0,
      delegatedByMe: index % 6 === 0,
      createdByMe: index % 5 === 0
    };
  });
}

export function createV98SeedTickets(): V98Ticket[] {
  return Array.from({ length: 15 }).map((_, index) => {
    const project = v98Projects[index % v98Projects.length];
    const technician = v98Users[(index + 3) % v98Users.length];
    return {
      id: `tic-${String(index + 1).padStart(3, "0")}`,
      code: `TCK-${980 + index}`,
      title: ["Invertor offline", "Cerere document PIF", "Alertă producție scăzută", "Solicitare ofertă extindere", "Înlocuire contor / CT"][index % 5] + ` — ${project.client}`,
      requester: ["Client", "Manager proiect", "Tehnician teren", "Sistem IoT"][index % 4],
      client: project.client,
      projectId: project.id,
      equipment: ["Huawei SUN2000", "Fronius Symo", "SmartLogger", "Panouri Jinko", "Tablou AC/DC"][index % 5],
      technician: technician.name,
      severity: (["S1", "S2", "S3", "S4"] as V98Ticket["severity"][])[index % 4],
      status: (["New", "Triaged", "Assigned", "Waiting client", "Escalated"] as V98Ticket["status"][])[index % 5],
      slaMinutes: 45 + index * 25,
      comments: [makeComment(index, technician.name)],
      attachments: [makeAttachment(index + 10)]
    };
  });
}

export const v98Notifications: V98Notification[] = Array.from({ length: 14 }).map((_, index) => ({
  id: `not-${index + 1}`,
  title: ["Mențiune în task", "Aprobare așteaptă", "SLA risc", "Ticket nou", "Policy update"][index % 5],
  body: ["Ai fost menționat în comentariul tehnic.", "Managerul trebuie să aprobe schimbarea de deadline.", "Ticketul trece de pragul SLA.", "Cerere nouă din portal client.", "Saved view policy a fost modificată."][index % 5],
  kind: (["mention", "approval", "sla", "ticket", "system"] as V98Notification["kind"][])[index % 5],
  read: index % 3 === 0,
  createdAt: `2026-06-${String(14 + (index % 9)).padStart(2, "0")}`
}));

export const v98Approvals: V98Approval[] = Array.from({ length: 10 }).map((_, index) => ({
  id: `apr-${index + 1}`,
  taskId: `tsk-${String(index * 4 + 1).padStart(3, "0")}`,
  title: ["Schimbare deadline", "Aprobare cost materiale", "Escaladare SLA", "Închidere recepție", "Replanificare echipă"][index % 5],
  requestedBy: v98Users[index % v98Users.length].name,
  approver: v98Users[(index + 2) % v98Users.length].name,
  status: "Waiting"
}));

export const v98SavedViews: V98SavedView[] = [
  { id: "sv-my-risk", name: "My SLA Risk", filters: "assignee=me;priority=critical;status!=Done", page: "My Work" },
  { id: "sv-prod-field", name: "Producție teren", filters: "department=Producție;type=Field Work", page: "Board" },
  { id: "sv-audit-docs", name: "Audit + documente", filters: "tags=audit,PIF;attachments>0", page: "Table" }
];

export function getV98GoodDayParitySummary() {
  const tasks = createV98SeedTasks();
  const tickets = createV98SeedTickets();
  const overdue = tasks.filter((task) => task.dueDate < "2026-06-20" && task.status !== "Done").length;
  const blocked = tasks.filter((task) => task.status === "Blocked").length;
  const approvals = v98Approvals.filter((approval) => approval.status === "Waiting").length;
  const unread = v98Notifications.filter((notification) => !notification.read).length;
  const tracked = tasks.reduce((sum, task) => sum + task.tracked, 0);
  const estimate = tasks.reduce((sum, task) => sum + task.estimate, 0);
  return {
    version: V98_RELEASE_VERSION,
    productionWrites: "OFF / pilot gated",
    tasksCount: tasks.length,
    ticketsCount: tickets.length,
    projectsCount: v98Projects.length,
    usersCount: v98Users.length,
    approvals,
    unread,
    overdue,
    blocked,
    tracked,
    estimate,
    visualSimilarityTarget: 72,
    functionalParityTarget: 68,
    tasks,
    tickets,
    projects: v98Projects,
    users: v98Users,
    approvalsList: v98Approvals,
    notifications: v98Notifications,
    savedViews: v98SavedViews
  };
}
