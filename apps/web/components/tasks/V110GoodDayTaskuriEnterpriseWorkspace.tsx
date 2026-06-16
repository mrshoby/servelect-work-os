"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type Status = "Backlog" | "To do" | "In progress" | "Review" | "Blocked" | "Done";
type Priority = "Critical" | "High" | "Medium" | "Low";
type Role = "Super Admin" | "Manager" | "Technician" | "Viewer";

type User = { id: string; name: string; role: Role; department: string; capacity: number };
type Project = { id: string; name: string; client: string; status: string; health: number; owner: string; budget: string; progress: number; phase: string };
type Comment = { id: string; by: string; text: string; time: string };
type Activity = { id: string; text: string; time: string };
type Attachment = { id: string; name: string; kind: string };
type TimeEntry = { id: string; user: string; minutes: number; day: string };
type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  owner: string;
  watchers: string[];
  projectId: string;
  department: string;
  client: string;
  equipment: string;
  startDate: string;
  dueDate: string;
  estimate: number;
  tracked: number;
  progress: number;
  type: string;
  tags: string[];
  customFields: Record<string, string>;
  checklist: { id: string; text: string; done: boolean }[];
  dependencies: string[];
  comments: Comment[];
  activity: Activity[];
  attachments: Attachment[];
  linkedTicket?: string;
  approval?: string;
  reminders: string[];
  timeEntries: TimeEntry[];
};

type Ticket = {
  id: string;
  title: string;
  severity: Priority;
  requester: string;
  client: string;
  projectId: string;
  equipment: string;
  technician: string;
  status: "New" | "Triaged" | "Assigned" | "Waiting client" | "Escalated" | "Closed";
  slaMinutes: number;
  linkedTask?: string;
  comments: number;
  attachments: number;
};

type Notification = { id: string; title: string; body: string; type: string; read: boolean; relatedId: string };
type Approval = { id: string; title: string; owner: string; status: "Pending" | "Approved" | "Rejected"; taskId: string };
type SavedView = { id: string; name: string; route: string; filter: string; density: "compact" | "comfortable" };
type Automation = { id: string; name: string; trigger: string; lastRun: string; enabled: boolean };

type Store = {
  tasks: Task[];
  tickets: Ticket[];
  projects: Project[];
  users: User[];
  notifications: Notification[];
  approvals: Approval[];
  savedViews: SavedView[];
  automations: Automation[];
};

const storageKey = "servelect-work-os-v110-taskuri-enterprise-workspace";
const statuses: Status[] = ["Backlog", "To do", "In progress", "Review", "Blocked", "Done"];
const priorities: Priority[] = ["Critical", "High", "Medium", "Low"];
const departments = ["Producție", "Audit energetic", "Comercial", "Automatizări", "Administrativ", "Marketing", "Mentenanță"];
const taskTypes = ["Task", "Ticket follow-up", "Document", "Field work", "Approval", "Procurement", "IoT alert"];
const clients = ["GreenFactory SA", "Municipiul Cluj-Napoca", "Otel Inox", "Servelect Intern", "AgroSolar Vest", "Retail Park Baia Mare"];
const equipment = ["Huawei SUN2000", "Fronius Tauro", "Tablou AC", "SmartLogger", "Invertor offline", "Contor bidirectional", "Structură acoperiș"];

function seedUsers(): User[] {
  return [
    ["u1", "Andrei Popescu", "Manager", "Producție", 38],
    ["u2", "Ioana Marinescu", "Manager", "Audit energetic", 36],
    ["u3", "Mihai Ionescu", "Technician", "Mentenanță", 40],
    ["u4", "Cristian Radu", "Technician", "Automatizări", 40],
    ["u5", "Alexandra Rusu", "Manager", "Comercial", 34],
    ["u6", "George Stan", "Technician", "Producție", 40],
    ["u7", "Vlad Neagu", "Super Admin", "Administrativ", 32],
    ["u8", "Elena Dobre", "Viewer", "Marketing", 24],
    ["u9", "Radu Petrescu", "Technician", "Mentenanță", 40],
    ["u10", "Mara Ilie", "Manager", "Financiar", 36],
  ].map(([id, name, role, department, capacity]) => ({ id: String(id), name: String(name), role: role as Role, department: String(department), capacity: Number(capacity) }));
}

function seedProjects(): Project[] {
  const names = [
    "P-2026-0187 Sistem FV 500 kWp GreenFactory SA",
    "P-2026-0211 Stație încărcare EV Timișoara",
    "P-2026-0194 Sistem FV 9.6 kWp Cluj-Napoca",
    "P-2026-0220 Audit energetic ISO 50001",
    "P-2026-0232 Mentenanță invertoare Huawei",
    "P-2026-0240 PIF și documente recepție",
    "P-2026-0251 Automatizare monitorizare IoT",
    "P-2026-0260 Ofertare extindere BESS",
    "P-2026-0270 Achiziții tablouri AC/DC",
    "P-2026-0282 ESG raport producție energie",
    "P-2026-0290 Portal client și facturi",
    "P-2026-0301 Certificări ANRE/SSM echipă",
  ];
  return names.map((name, index) => ({
    id: `p${index + 1}`,
    name,
    client: clients[index % clients.length],
    status: index < 5 ? "Activ" : index < 9 ? "Viitor" : "Finalizat",
    health: 58 + ((index * 7) % 40),
    owner: seedUsers()[index % seedUsers().length].name,
    budget: `${(42 + index * 18).toLocaleString("ro-RO")}k €`,
    progress: index < 5 ? 32 + index * 11 : index < 9 ? 8 + index * 4 : 100,
    phase: ["Design", "Achiziții", "Execuție", "Recepție", "Mentenanță"][index % 5],
  }));
}

function dateFromOffset(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function seedTasks(): Task[] {
  const users = seedUsers();
  const projects = seedProjects();
  const verbs = ["Validează", "Pregătește", "Actualizează", "Verifică", "Închide", "Planifică", "Montează", "Revizuiește", "Aprobă", "Documentează"];
  const objects = ["PIF", "aviz ATR", "seriale echipamente", "poze teren", "ofertă furnizor", "ticket invertor", "raport audit", "plan montaj", "Gantt execuție", "pontaj echipă"];
  return Array.from({ length: 54 }, (_, index) => {
    const project = projects[index % projects.length];
    const assignee = users[(index + 2) % users.length];
    const owner = users[index % users.length];
    const status = statuses[index % statuses.length];
    const priority = priorities[index % priorities.length];
    return {
      id: `T-${String(index + 1).padStart(4, "0")}`,
      title: `${verbs[index % verbs.length]} ${objects[index % objects.length]} — ${project.name.split(" ").slice(0, 3).join(" ")}`,
      description: "Activitate operațională Servelect legată de proiecte fotovoltaice, mentenanță, audit energetic, documente tehnice, achiziții și coordonare teren.",
      status,
      priority,
      assignee: assignee.name,
      owner: owner.name,
      watchers: [users[(index + 1) % users.length].name, users[(index + 3) % users.length].name],
      projectId: project.id,
      department: departments[index % departments.length],
      client: project.client,
      equipment: equipment[index % equipment.length],
      startDate: dateFromOffset(-8 + (index % 10)),
      dueDate: dateFromOffset(-4 + (index % 22)),
      estimate: 2 + (index % 12),
      tracked: index % 7,
      progress: status === "Done" ? 100 : Math.min(90, 12 + (index * 9) % 85),
      type: taskTypes[index % taskTypes.length],
      tags: [departments[index % departments.length], priority, taskTypes[index % taskTypes.length]],
      customFields: {
        ROI: `${84 + (index % 9)}%`,
        "Cod ANRE": index % 3 === 0 ? "necesar" : "validat",
        "Risc SLA": priority === "Critical" ? "ridicat" : "normal",
        "Tip lucrare": ["PV", "BESS", "Audit", "Mentenanță"][index % 4],
        "Locație": ["Cluj", "Timișoara", "Baia Mare", "București"][index % 4],
        "Sursă": ["CRM", "Pontaj", "IoT", "Stocuri", "Documente"][index % 5],
      },
      checklist: [
        { id: `c-${index}-1`, text: "Confirmă date proiect și client", done: index % 2 === 0 },
        { id: `c-${index}-2`, text: "Atașează document tehnic / poză teren", done: index % 3 === 0 },
        { id: `c-${index}-3`, text: "Trimite spre aprobare manager", done: index % 5 === 0 },
      ],
      dependencies: index > 4 ? [`T-${String(index - 3).padStart(4, "0")}`] : [],
      comments: [
        { id: `cm-${index}-1`, by: owner.name, text: "Am verificat contextul și am actualizat statusul operațional.", time: "09:20" },
        ...(index % 2 === 0 ? [{ id: `cm-${index}-2`, by: assignee.name, text: "Necesită confirmare de pe teren înainte de închidere.", time: "14:05" }] : []),
      ],
      activity: [
        { id: `ac-${index}-1`, text: `${owner.name} a creat taskul`, time: "ieri" },
        { id: `ac-${index}-2`, text: `${assignee.name} a actualizat estimarea`, time: "azi" },
      ],
      attachments: [
        { id: `f-${index}-1`, name: `PV_receptie_${index + 1}.pdf`, kind: "PDF" },
        ...(index % 3 === 0 ? [{ id: `f-${index}-2`, name: `foto_teren_${index + 1}.jpg`, kind: "Imagine" }] : []),
      ],
      linkedTicket: index % 5 === 0 ? `TK-${String(index + 1).padStart(3, "0")}` : undefined,
      approval: index % 4 === 0 ? `APR-${String(index + 1).padStart(3, "0")}` : undefined,
      reminders: ["T-24h înainte de termen", "Escaladare dacă rămâne blocat"],
      timeEntries: [{ id: `te-${index}-1`, user: assignee.name, minutes: (index % 6) * 30, day: dateFromOffset(-1) }],
    };
  });
}

function seedTickets(): Ticket[] {
  const users = seedUsers();
  const projects = seedProjects();
  return Array.from({ length: 16 }, (_, index) => ({
    id: `TK-${String(index + 1).padStart(3, "0")}`,
    title: ["Invertor offline", "Client cere status PIF", "Lipsă serial panou", "Întârziere furnizor", "Alertă producție scăzută", "Document ANRE lipsă"][index % 6],
    severity: priorities[index % priorities.length],
    requester: ["Client", "IoT", "Tehnician", "Manager", "CRM"][index % 5],
    client: clients[index % clients.length],
    projectId: projects[index % projects.length].id,
    equipment: equipment[index % equipment.length],
    technician: users[(index + 3) % users.length].name,
    status: ["New", "Triaged", "Assigned", "Waiting client", "Escalated", "Closed"][index % 6] as Ticket["status"],
    slaMinutes: 40 + index * 33,
    linkedTask: index % 2 === 0 ? `T-${String(index + 1).padStart(4, "0")}` : undefined,
    comments: 1 + (index % 5),
    attachments: index % 4,
  }));
}

function initialStore(): Store {
  const tasks = seedTasks();
  return {
    tasks,
    tickets: seedTickets(),
    projects: seedProjects(),
    users: seedUsers(),
    notifications: Array.from({ length: 18 }, (_, index) => ({
      id: `N-${index + 1}`,
      title: ["Mențiune nouă", "Aprobare necesară", "Ticket escaladat", "Deadline modificat", "SLA risk", "Comentariu client"][index % 6],
      body: `Actualizare operațională pentru ${tasks[index % tasks.length].id}`,
      type: ["mention", "approval", "ticket", "deadline", "sla", "client"][index % 6],
      read: index % 3 === 0,
      relatedId: tasks[index % tasks.length].id,
    })),
    approvals: Array.from({ length: 12 }, (_, index) => ({
      id: `APR-${String(index + 1).padStart(3, "0")}`,
      title: ["Aprobare achiziție", "Aprobare raport PIF", "Aprobare ore teren", "Aprobare ofertă", "Aprobare checklist recepție"][index % 5],
      owner: seedUsers()[index % seedUsers().length].name,
      status: index % 3 === 0 ? "Approved" : "Pending",
      taskId: tasks[(index * 3) % tasks.length].id,
    })),
    savedViews: ["My overdue", "Manager blocked", "Audit energetic", "Teren astăzi", "SLA urgent", "Documente lipsă", "Producție", "Mentenanță", "Aprobări"].map((name, index) => ({ id: `SV-${index + 1}`, name, route: "/taskuri", filter: index % 2 ? "Critical" : "all", density: "compact" })),
    automations: Array.from({ length: 7 }, (_, index) => ({ id: `AUT-${index + 1}`, name: ["Escaladează SLA", "Cere poză teren", "Notifică manager", "Creează checklist PIF", "Actualizează workload", "Generează raport", "Reminder ANRE"][index], trigger: ["SLA < 2h", "Status Blocked", "Due today", "Ticket converted", "Estimate changed", "Friday 16:00", "Certification expires"][index], lastRun: index % 2 ? "azi" : "ieri", enabled: index !== 5 })),
  };
}

function loadStore(): Store {
  if (typeof window === "undefined") return initialStore();
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return initialStore();
    const parsed = JSON.parse(raw) as Store;
    if (!parsed.tasks?.length || !parsed.projects?.length) return initialStore();
    return parsed;
  } catch {
    return initialStore();
  }
}

function viewFromRoute(route: string) {
  if (route.includes("my-work")) return "my-work";
  if (route.includes("inbox")) return "inbox";
  if (route.includes("tickets")) return "tickets";
  if (route.includes("proiecte-active")) return "projects-active";
  if (route.includes("proiecte-viitoare")) return "projects-future";
  if (route.includes("proiecte-finalizate")) return "projects-done";
  if (route.includes("board")) return "board";
  if (route.includes("tabel") || route.includes("table")) return "table";
  if (route.includes("calendar")) return "calendar";
  if (route.includes("workload")) return "workload";
  if (route.includes("forms")) return "forms";
  if (route.includes("timesheets")) return "timesheets";
  if (route.includes("reports")) return "reports";
  if (route.includes("automations")) return "automations";
  return "overview";
}

function badgeClass(value: string) {
  if (["Critical", "Blocked", "Escalated"].includes(value)) return "bg-red-50 text-red-700 border-red-200";
  if (["High", "Review", "Waiting client"].includes(value)) return "bg-amber-50 text-amber-700 border-amber-200";
  if (["Done", "Approved", "Closed"].includes(value)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

function minutesLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function Button({ children, onClick, tone = "light", title }: { children: ReactNode; onClick: () => void; tone?: "dark" | "green" | "light" | "danger"; title?: string }) {
  const cls = tone === "dark" ? "bg-slate-900 text-white hover:bg-slate-700" : tone === "green" ? "bg-emerald-600 text-white hover:bg-emerald-700" : tone === "danger" ? "bg-red-600 text-white hover:bg-red-700" : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200";
  return <button title={title} onClick={onClick} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-sm transition ${cls}`}>{children}</button>;
}

export function V110GoodDayTaskuriEnterpriseWorkspace({ route = "/taskuri" }: { route?: string }) {
  const [store, setStore] = useState<Store>(() => loadStore());
  const [activeView, setActiveView] = useState(() => viewFromRoute(route));
  const [selectedTaskId, setSelectedTaskId] = useState<string>("T-0001");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [role, setRole] = useState<Role>("Manager");
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [toast, setToast] = useState("Workspace loaded with shared local state");
  const [commentDraft, setCommentDraft] = useState("");
  const [activeTimer, setActiveTimer] = useState<string | null>(null);

  useEffect(() => setActiveView(viewFromRoute(route)), [route]);
  useEffect(() => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(store)); } catch {}
  }, [store]);

  const projectMap = useMemo(() => new Map(store.projects.map((p) => [p.id, p])), [store.projects]);
  const selectedTask = store.tasks.find((task) => task.id === selectedTaskId) ?? store.tasks[0];
  const visibleTasks = useMemo(() => {
    return store.tasks.filter((task) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term || `${task.id} ${task.title} ${task.projectId} ${task.assignee} ${task.client} ${task.tags.join(" ")}`.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || task.status === statusFilter || task.priority === statusFilter || task.department === statusFilter;
      const roleDepartment = role === "Technician" ? "Mentenanță" : role === "Manager" ? "Producție" : role === "Viewer" ? task.department : task.department;
      const matchesRole = role === "Super Admin" || role === "Viewer" || task.department === roleDepartment || task.assignee.includes(role === "Technician" ? "Mihai" : "Andrei");
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [store.tasks, store.users, search, statusFilter, role]);

  const unreadCount = store.notifications.filter((n) => !n.read).length;
  const overdueCount = store.tasks.filter((task) => new Date(task.dueDate) < new Date() && task.status !== "Done").length;
  const blockedCount = store.tasks.filter((task) => task.status === "Blocked").length;
  const workloadByUser = useMemo(() => {
    return store.users.map((user) => {
      const assigned = store.tasks.filter((task) => task.assignee === user.name);
      const allocated = assigned.reduce((sum, task) => sum + task.estimate, 0);
      const tracked = assigned.reduce((sum, task) => sum + task.tracked, 0);
      return { user, assigned, allocated, tracked, load: Math.round((allocated / Math.max(user.capacity, 1)) * 100) };
    });
  }, [store.tasks, store.users]);

  function updateTask(id: string, patch: Partial<Task>) {
    setStore((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === id ? { ...task, ...patch, activity: [{ id: `ac-${Date.now()}`, text: "Actualizare salvată în workspace", time: "acum" }, ...task.activity] } : task),
    }));
    setToast(`Task ${id} updated`);
  }

  function addNotification(title: string, body: string, relatedId: string) {
    setStore((current) => ({
      ...current,
      notifications: [{ id: `N-${Date.now()}`, title, body, type: "system", read: false, relatedId }, ...current.notifications],
    }));
  }

  function createTask(seedTitle = "Task nou operațional") {
    const project = store.projects[0];
    const user = store.users[0];
    const newTask: Task = {
      ...seedTasks()[0],
      id: `T-${String(store.tasks.length + 1).padStart(4, "0")}`,
      title: `${seedTitle} — ${new Date().toLocaleTimeString("ro-RO")}`,
      status: "To do",
      priority: "High",
      assignee: user.name,
      owner: user.name,
      projectId: project.id,
      client: project.client,
      dueDate: dateFromOffset(3),
      comments: [],
      activity: [{ id: `ac-${Date.now()}`, text: "Task creat din Quick Create", time: "acum" }],
      attachments: [],
      checklist: [{ id: `c-${Date.now()}`, text: "Definește cerința", done: false }],
      dependencies: [],
      timeEntries: [],
    };
    setStore((current) => ({ ...current, tasks: [newTask, ...current.tasks] }));
    setSelectedTaskId(newTask.id);
    setToast("New Task created and drawer opened");
  }

  function createTicket() {
    const ticket: Ticket = {
      id: `TK-${String(store.tickets.length + 1).padStart(3, "0")}`,
      title: "Cerere nouă client / teren",
      severity: "High",
      requester: "Client",
      client: clients[0],
      projectId: store.projects[0].id,
      equipment: equipment[0],
      technician: store.users[2].name,
      status: "New",
      slaMinutes: 120,
      comments: 0,
      attachments: 0,
    };
    setStore((current) => ({ ...current, tickets: [ticket, ...current.tickets] }));
    addNotification("Ticket nou", `${ticket.id} creat`, ticket.id);
    setToast("New Ticket created");
  }

  function createRequest() {
    createTicket();
    setToast("Request submitted and routed to ticket queue");
  }

  function saveView() {
    const view: SavedView = { id: `SV-${Date.now()}`, name: `${activeView} · ${statusFilter} · ${search || "all"}`, route, filter: statusFilter, density };
    setStore((current) => ({ ...current, savedViews: [view, ...current.savedViews] }));
    setToast("Saved View persisted locally");
  }

  function exportCsv() {
    const header = "ID,Title,Project,Status,Priority,Assignee,Due,Estimate,Tracked\n";
    const rows = visibleTasks.map((task) => [task.id, task.title, projectMap.get(task.projectId)?.name ?? task.projectId, task.status, task.priority, task.assignee, task.dueDate, task.estimate, task.tracked].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `servelect-taskuri-${activeView}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setToast("CSV exported from current filtered view");
  }

  function bulkUpdate(patch: Partial<Task>) {
    if (!selectedIds.length) {
      setToast("Selectează cel puțin un task pentru bulk action");
      return;
    }
    setStore((current) => ({ ...current, tasks: current.tasks.map((task) => selectedIds.includes(task.id) ? { ...task, ...patch } : task) }));
    setToast(`${selectedIds.length} tasks updated by bulk action`);
  }

  function addComment() {
    if (!selectedTask || !commentDraft.trim()) return;
    const comment = { id: `cm-${Date.now()}`, by: "Current user", text: commentDraft.trim(), time: "acum" };
    updateTask(selectedTask.id, { comments: [comment, ...selectedTask.comments] });
    setCommentDraft("");
  }

  function toggleChecklist(task: Task, itemId: string) {
    updateTask(task.id, { checklist: task.checklist.map((item) => item.id === itemId ? { ...item, done: !item.done } : item) });
  }

  function addDependency() {
    if (!selectedTask) return;
    const candidate = store.tasks.find((task) => task.id !== selectedTask.id && !selectedTask.dependencies.includes(task.id));
    if (candidate) updateTask(selectedTask.id, { dependencies: [candidate.id, ...selectedTask.dependencies] });
  }

  function attachFile() {
    if (!selectedTask) return;
    updateTask(selectedTask.id, { attachments: [{ id: `f-${Date.now()}`, name: `evidence_${Date.now()}.pdf`, kind: "PDF" }, ...selectedTask.attachments] });
  }

  function startStopTimer(task: Task) {
    if (activeTimer === task.id) {
      setActiveTimer(null);
      updateTask(task.id, { tracked: task.tracked + 1, timeEntries: [{ id: `te-${Date.now()}`, user: task.assignee, minutes: 60, day: dateFromOffset(0) }, ...task.timeEntries] });
      setToast("Timer stopped and tracked time updated");
    } else {
      setActiveTimer(task.id);
      setToast(`Timer started for ${task.id}`);
    }
  }

  function convertTicket(ticket: Ticket) {
    createTask(`Follow-up ${ticket.id}: ${ticket.title}`);
    setStore((current) => ({ ...current, tickets: current.tickets.map((item) => item.id === ticket.id ? { ...item, linkedTask: current.tasks[0]?.id ?? "new", status: "Assigned" } : item) }));
    addNotification("Ticket converted", `${ticket.id} transformat în task`, ticket.id);
  }

  function approve(id: string, status: Approval["status"]) {
    setStore((current) => ({ ...current, approvals: current.approvals.map((approval) => approval.id === id ? { ...approval, status } : approval) }));
    setToast(`Approval ${id}: ${status}`);
  }

  function setNotificationRead(id: string, read: boolean) {
    setStore((current) => ({ ...current, notifications: current.notifications.map((item) => item.id === id ? { ...item, read } : item) }));
  }

  function archiveNotification(id: string) {
    setStore((current) => ({ ...current, notifications: current.notifications.filter((item) => item.id !== id) }));
    setToast("Notification archived");
  }

  function createAutomation() {
    setStore((current) => ({ ...current, automations: [{ id: `AUT-${Date.now()}`, name: "Regulă nouă SLA / documente", trigger: "Status Blocked + Critical", lastRun: "neexecutat", enabled: true }, ...current.automations] }));
    setToast("Automation created");
  }

  function testAutomation(id: string) {
    setStore((current) => ({ ...current, automations: current.automations.map((rule) => rule.id === id ? { ...rule, lastRun: "acum" } : rule) }));
    addNotification("Automation tested", `Rule ${id} executed`, id);
  }

  const navItems = [
    ["Overview", "/taskuri/overview"], ["My Work", "/taskuri/my-work"], ["Inbox", "/taskuri/inbox"], ["Tickets", "/taskuri/tickets"], ["Board", "/taskuri/board"], ["Table", "/taskuri/tabel"], ["Calendar", "/taskuri/calendar"], ["Gantt", "/taskuri/calendar-gantt"], ["Workload", "/taskuri/workload"], ["Forms", "/taskuri/forms"], ["Timesheets", "/taskuri/timesheets"], ["Reports", "/taskuri/reports"], ["Automations", "/taskuri/automations"],
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 flex-col bg-slate-950 text-slate-100 xl:flex">
          <div className="border-b border-slate-800 p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-emerald-300">SERVELECT</div>
            <div className="mt-1 text-lg font-bold">Work OS · Taskuri</div>
            <div className="mt-2 rounded-xl bg-slate-900 p-2 text-[11px] text-slate-400">v11.0.0 · dense shared workspace · writes gated</div>
          </div>
          <div className="space-y-1 p-3 text-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Workspace hierarchy</div>
            {navItems.map(([label, path]) => (
              <button key={path} onClick={() => { setActiveView(viewFromRoute(path)); setToast(`${label} opened`); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${activeView === viewFromRoute(path) ? "bg-emerald-500 text-white" : "text-slate-300 hover:bg-slate-900"}`}>
                <span>{label}</span><span className="text-[10px] opacity-70">{path.includes("taskuri") ? "•" : ""}</span>
              </button>
            ))}
          </div>
          <div className="mt-auto border-t border-slate-800 p-4 text-xs text-slate-400">
            <div className="font-semibold text-slate-200">Folders / projects</div>
            {store.projects.slice(0, 6).map((project) => <button key={project.id} onClick={() => { setSearch(project.name.split(" ")[0]); setActiveView("overview"); }} className="mt-2 block w-full truncate rounded-md px-2 py-1 text-left hover:bg-slate-900">▸ {project.name}</button>)}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-3 min-w-[220px]">
                <div className="text-xs text-slate-500">Taskuri / {activeView}</div>
                <div className="text-xl font-bold">Enterprise Work Command Center</div>
              </div>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks, clients, equipment, tags..." className="h-9 min-w-[260px] flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500" />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-sm">
                <option value="all">All filters</option>
                {[...statuses, ...priorities, ...departments].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select value={role} onChange={(event) => { setRole(event.target.value as Role); setToast(`Role switched to ${event.target.value}`); }} className="h-9 rounded-lg border border-slate-200 px-2 text-sm">
                {(["Super Admin", "Manager", "Technician", "Viewer"] as Role[]).map((item) => <option key={item}>{item}</option>)}
              </select>
              <Button tone="green" onClick={() => createTask()}>New Task</Button>
              <Button onClick={createTicket}>New Ticket</Button>
              <Button onClick={createRequest}>New Request</Button>
              <Button onClick={saveView}>Save View</Button>
              <Button onClick={exportCsv}>Export</Button>
              <button onClick={() => setActiveView("inbox")} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white">Notifications {unreadCount}</button>
            </div>
            <div className="mt-3 flex gap-1 overflow-x-auto">
              {navItems.slice(0, 12).map(([label, path]) => <button key={path} onClick={() => setActiveView(viewFromRoute(path))} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${activeView === viewFromRoute(path) ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>{label}</button>)}
            </div>
          </header>

          <div className="grid flex-1 grid-cols-1 gap-4 p-4 2xl:grid-cols-[1fr_380px]">
            <div className="min-w-0 space-y-4">
              <KpiStrip tasks={store.tasks} tickets={store.tickets} approvals={store.approvals} overdueCount={overdueCount} blockedCount={blockedCount} />
              <Toolbar density={density} setDensity={setDensity} selectedIds={selectedIds} bulkUpdate={bulkUpdate} reset={() => { setSearch(""); setStatusFilter("all"); setSelectedIds([]); setToast("Filters reset"); }} saveView={saveView} />
              {renderView()}
            </div>
            <TaskDrawer task={selectedTask} store={store} updateTask={updateTask} addComment={addComment} commentDraft={commentDraft} setCommentDraft={setCommentDraft} toggleChecklist={toggleChecklist} addDependency={addDependency} attachFile={attachFile} startStopTimer={startStopTimer} activeTimer={activeTimer} close={() => setSelectedTaskId("")} />
          </div>
        </section>
      </div>
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-xl">{toast}</div>
    </main>
  );

  function renderView() {
    if (activeView === "board") return <BoardView tasks={visibleTasks} setSelectedTaskId={setSelectedTaskId} updateTask={updateTask} createTask={createTask} />;
    if (activeView === "table") return <TableView tasks={visibleTasks} projects={projectMap} selectedIds={selectedIds} setSelectedIds={setSelectedIds} setSelectedTaskId={setSelectedTaskId} updateTask={updateTask} density={density} />;
    if (activeView === "inbox") return <InboxView notifications={store.notifications} tasks={store.tasks} setSelectedTaskId={setSelectedTaskId} markRead={setNotificationRead} archive={archiveNotification} convert={(id) => createTask(`Converted update ${id}`)} />;
    if (activeView === "tickets") return <TicketsView tickets={store.tickets} projects={projectMap} createTicket={createTicket} convertTicket={convertTicket} escalate={(ticket) => { setStore((current) => ({ ...current, tickets: current.tickets.map((item) => item.id === ticket.id ? { ...item, status: "Escalated", severity: "Critical" } : item) })); addNotification("Ticket escalated", ticket.title, ticket.id); }} />;
    if (activeView.startsWith("projects")) return <ProjectsView projects={store.projects} tasks={store.tasks} view={activeView} setSelectedTaskId={setSelectedTaskId} exportCsv={exportCsv} />;
    if (activeView === "calendar") return <CalendarGanttView tasks={visibleTasks} updateTask={updateTask} setSelectedTaskId={setSelectedTaskId} />;
    if (activeView === "workload") return <WorkloadView workload={workloadByUser} approvals={store.approvals} approve={approve} />;
    if (activeView === "forms") return <FormsView createRequest={createRequest} />;
    if (activeView === "timesheets") return <TimesheetsView tasks={visibleTasks} startStopTimer={startStopTimer} activeTimer={activeTimer} />;
    if (activeView === "reports") return <ReportsView store={store} exportCsv={exportCsv} />;
    if (activeView === "automations") return <AutomationsView automations={store.automations} createAutomation={createAutomation} testAutomation={testAutomation} />;
    return <OverviewView tasks={visibleTasks} tickets={store.tickets} approvals={store.approvals} savedViews={store.savedViews} notifications={store.notifications} workload={workloadByUser} setSelectedTaskId={setSelectedTaskId} setActiveView={setActiveView} />;
  }
}

function KpiStrip({ tasks, tickets, approvals, overdueCount, blockedCount }: { tasks: Task[]; tickets: Ticket[]; approvals: Approval[]; overdueCount: number; blockedCount: number }) {
  const rows = [
    ["Total tasks", tasks.length, "shared state"], ["Overdue", overdueCount, "deadlines"], ["Blocked", blockedCount, "risk"], ["Tickets", tickets.length, "SLA queue"], ["Approvals", approvals.filter((a) => a.status === "Pending").length, "waiting"], ["Done", tasks.filter((t) => t.status === "Done").length, "closed"],
  ];
  return <div className="grid grid-cols-2 gap-2 lg:grid-cols-6">{rows.map(([label, value, note]) => <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="text-[11px] uppercase text-slate-400">{label}</div><div className="mt-1 text-2xl font-black">{value}</div><div className="text-xs text-slate-500">{note}</div></div>)}</div>;
}

function Toolbar({ density, setDensity, selectedIds, bulkUpdate, reset, saveView }: { density: "compact" | "comfortable"; setDensity: (v: "compact" | "comfortable") => void; selectedIds: string[]; bulkUpdate: (patch: Partial<Task>) => void; reset: () => void; saveView: () => void }) {
  return <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
    <span className="text-xs font-bold text-slate-500">{selectedIds.length} selected</span>
    <Button onClick={() => bulkUpdate({ status: "In progress" })}>Bulk status</Button>
    <Button onClick={() => bulkUpdate({ priority: "Critical" })}>Bulk priority</Button>
    <Button onClick={() => bulkUpdate({ assignee: "Andrei Popescu" })}>Bulk assign</Button>
    <Button onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}>Density: {density}</Button>
    <Button onClick={saveView}>Persist view</Button>
    <Button onClick={reset}>Reset filters</Button>
  </div>;
}

function OverviewView({ tasks, tickets, approvals, savedViews, notifications, workload, setSelectedTaskId, setActiveView }: { tasks: Task[]; tickets: Ticket[]; approvals: Approval[]; savedViews: SavedView[]; notifications: Notification[]; workload: { user: User; allocated: number; tracked: number; load: number }[]; setSelectedTaskId: (id: string) => void; setActiveView: (view: string) => void }) {
  return <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <PanelHeader title="My Work / Action Required" action="dense inbox" onClick={() => setActiveView("my-work")} />
      <DenseTaskRows tasks={tasks.slice(0, 12)} setSelectedTaskId={setSelectedTaskId} />
    </section>
    <section className="space-y-4">
      <MiniPanel title="Ticket SLA risk" rows={tickets.slice(0, 7).map((t) => [t.id, t.title, `${t.slaMinutes}m`, t.severity])} onClick={() => setActiveView("tickets")} />
      <MiniPanel title="Approvals waiting" rows={approvals.slice(0, 7).map((a) => [a.id, a.title, a.owner, a.status])} onClick={() => setActiveView("workload")} />
      <MiniPanel title="Saved views" rows={savedViews.slice(0, 7).map((v) => [v.id, v.name, v.filter, v.density])} onClick={() => setActiveView("table")} />
      <MiniPanel title="Workload mini timeline" rows={workload.slice(0, 7).map((w) => [w.user.name, `${w.allocated}h`, `${w.tracked}h tracked`, `${w.load}%`])} onClick={() => setActiveView("workload")} />
      <MiniPanel title="Recent activity / notifications" rows={notifications.slice(0, 7).map((n) => [n.id, n.title, n.read ? "read" : "unread", n.relatedId])} onClick={() => setActiveView("inbox")} />
    </section>
  </div>;
}

function DenseTaskRows({ tasks, setSelectedTaskId }: { tasks: Task[]; setSelectedTaskId: (id: string) => void }) {
  return <div className="divide-y divide-slate-100">{tasks.map((task) => <button key={task.id} onClick={() => setSelectedTaskId(task.id)} className="grid w-full grid-cols-[72px_1fr_110px_110px_120px_80px] items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50">
    <span className="font-mono text-slate-500">{task.id}</span><span className="truncate font-semibold">{task.title}</span><span className={`rounded-md border px-2 py-1 text-center ${badgeClass(task.status)}`}>{task.status}</span><span className={`rounded-md border px-2 py-1 text-center ${badgeClass(task.priority)}`}>{task.priority}</span><span className="truncate text-slate-600">{task.assignee}</span><span className="text-right text-slate-500">{task.dueDate.slice(5)}</span>
  </button>)}</div>;
}

function PanelHeader({ title, action, onClick }: { title: string; action: string; onClick: () => void }) {
  return <div className="flex items-center justify-between border-b border-slate-100 p-3"><div><h2 className="font-bold">{title}</h2><p className="text-xs text-slate-500">shared state, filters and drawer actions</p></div><Button onClick={onClick}>{action}</Button></div>;
}

function MiniPanel({ title, rows, onClick }: { title: string; rows: (string | number)[][]; onClick: () => void }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="mb-2 flex items-center justify-between"><h3 className="font-bold">{title}</h3><Button onClick={onClick}>Open</Button></div><div className="space-y-1">{rows.map((row, i) => <div key={i} className="grid grid-cols-4 gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-xs"><span className="truncate font-semibold">{row[0]}</span><span className="truncate">{row[1]}</span><span className="truncate text-slate-500">{row[2]}</span><span className="truncate text-right text-slate-500">{row[3]}</span></div>)}</div></section>;
}

function BoardView({ tasks, setSelectedTaskId, updateTask, createTask }: { tasks: Task[]; setSelectedTaskId: (id: string) => void; updateTask: (id: string, patch: Partial<Task>) => void; createTask: (title?: string) => void }) {
  return <div className="grid gap-3 overflow-x-auto xl:grid-cols-6">{statuses.map((status) => {
    const columnTasks = tasks.filter((task) => task.status === status).slice(0, 10);
    return <section key={status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const id = event.dataTransfer.getData("text/plain"); if (id) updateTask(id, { status }); }} className="min-h-[620px] rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between"><div className="font-bold">{status}</div><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{tasks.filter((task) => task.status === status).length}</span></div>
      <div className="mb-2 rounded-lg border border-dashed border-slate-300 p-2 text-center text-xs text-slate-500">WIP limit {status === "In progress" ? 8 : 12}</div>
      <Button onClick={() => createTask(`Quick card ${status}`)}>+ Card</Button>
      <div className="mt-2 space-y-2">{columnTasks.map((task) => <article key={task.id} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)} onClick={() => setSelectedTaskId(task.id)} className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs hover:border-emerald-400">
        <div className="flex justify-between"><span className="font-mono text-slate-500">{task.id}</span><span className={`rounded-md border px-1.5 ${badgeClass(task.priority)}`}>{task.priority}</span></div>
        <div className="mt-2 font-bold leading-snug">{task.title}</div>
        <div className="mt-2 grid grid-cols-2 gap-1 text-slate-500"><span>{task.assignee}</span><span className="text-right">{task.dueDate}</span><span>{task.comments.length} comments</span><span className="text-right">{task.attachments.length} files</span></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-emerald-500" style={{ width: `${task.progress}%` }} /></div>
      </article>)}</div>
    </section>;
  })}</div>;
}

function TableView({ tasks, projects, selectedIds, setSelectedIds, setSelectedTaskId, updateTask, density }: { tasks: Task[]; projects: Map<string, Project>; selectedIds: string[]; setSelectedIds: (ids: string[]) => void; setSelectedTaskId: (id: string) => void; updateTask: (id: string, patch: Partial<Task>) => void; density: string }) {
  const rowPad = density === "compact" ? "py-1.5" : "py-3";
  function toggle(id: string) { setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]); }
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-[1320px] w-full text-xs"><thead className="bg-slate-50 text-left text-[11px] uppercase text-slate-500"><tr>{["", "ID", "Task", "Project", "Type", "Status", "Priority", "Assignee", "Owner", "Due", "Estimate", "Tracked", "Deps", "Tags", "Comments", "Files", "Actions"].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{tasks.slice(0, 38).map((task) => <tr key={task.id} className="hover:bg-emerald-50/40"><td className="px-2"><input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => toggle(task.id)} /></td><td className="px-2 font-mono text-slate-500">{task.id}</td><td className={`max-w-[320px] px-2 ${rowPad}`}><button onClick={() => setSelectedTaskId(task.id)} className="truncate text-left font-semibold hover:text-emerald-700">{task.title}</button></td><td className="px-2 text-slate-600">{projects.get(task.projectId)?.name.slice(0, 34)}</td><td className="px-2">{task.type}</td><td className="px-2"><select value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value as Status })} className="rounded border border-slate-200 bg-white px-1 py-1">{statuses.map((s) => <option key={s}>{s}</option>)}</select></td><td className="px-2"><span className={`rounded-md border px-1.5 py-1 ${badgeClass(task.priority)}`}>{task.priority}</span></td><td className="px-2">{task.assignee}</td><td className="px-2">{task.owner}</td><td className="px-2">{task.dueDate}</td><td className="px-2">{task.estimate}h</td><td className="px-2">{task.tracked}h</td><td className="px-2">{task.dependencies.length}</td><td className="px-2">{task.tags.slice(0, 2).join(", ")}</td><td className="px-2">{task.comments.length}</td><td className="px-2">{task.attachments.length}</td><td className="px-2"><Button onClick={() => setSelectedTaskId(task.id)}>Open</Button></td></tr>)}</tbody></table></div></section>;
}

function InboxView({ notifications, tasks, setSelectedTaskId, markRead, archive, convert }: { notifications: Notification[]; tasks: Task[]; setSelectedTaskId: (id: string) => void; markRead: (id: string, read: boolean) => void; archive: (id: string) => void; convert: (id: string) => void }) {
  return <div className="grid gap-4 xl:grid-cols-[1fr_340px]"><section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><PanelHeader title="Inbox / Action Required" action="Schedule today" onClick={() => convert("scheduled")} />{notifications.map((n) => <div key={n.id} className={`grid grid-cols-[1fr_80px_220px] gap-3 border-b border-slate-100 p-3 text-sm ${n.read ? "bg-white" : "bg-emerald-50/50"}`}><button onClick={() => { const task = tasks.find((t) => t.id === n.relatedId); if (task) setSelectedTaskId(task.id); }} className="text-left"><div className="font-bold">{n.title}</div><div className="text-xs text-slate-500">{n.body}</div></button><span className="text-xs text-slate-500">{n.read ? "read" : "unread"}</span><div className="flex flex-wrap justify-end gap-1"><Button onClick={() => markRead(n.id, !n.read)}>{n.read ? "Unread" : "Read"}</Button><Button onClick={() => convert(n.id)}>To task</Button><Button onClick={() => archive(n.id)}>Archive</Button></div></div>)}</section><MiniPanel title="Inbox lanes" rows={[["Mentions", 6, "owner", "live"], ["Assigned", 12, "tasks", "live"], ["Approvals", 8, "queue", "live"], ["Warnings", 5, "SLA", "live"]]} onClick={() => convert("lane")} /></div>;
}

function TicketsView({ tickets, projects, createTicket, convertTicket, escalate }: { tickets: Ticket[]; projects: Map<string, Project>; createTicket: () => void; convertTicket: (ticket: Ticket) => void; escalate: (ticket: Ticket) => void }) {
  return <div className="grid gap-4 xl:grid-cols-[1fr_340px]"><section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><PanelHeader title="Ticket / Request Center" action="New Ticket" onClick={createTicket} />{tickets.map((ticket) => <div key={ticket.id} className="grid grid-cols-[80px_1fr_110px_150px_220px] gap-3 border-b border-slate-100 p-3 text-xs"><span className="font-mono text-slate-500">{ticket.id}</span><div><div className="font-bold">{ticket.title}</div><div className="text-slate-500">{ticket.client} · {projects.get(ticket.projectId)?.name}</div></div><span className={`rounded-md border px-2 py-1 text-center ${badgeClass(ticket.severity)}`}>{ticket.severity}</span><span>{ticket.status} · SLA {ticket.slaMinutes}m</span><div className="flex justify-end gap-1"><Button onClick={() => escalate(ticket)}>Escalate</Button><Button onClick={() => convertTicket(ticket)}>Convert</Button></div></div>)}</section><MiniPanel title="Right SLA risk panel" rows={tickets.slice(0, 8).map((t) => [t.id, t.severity, `${t.slaMinutes}m`, t.status])} onClick={createTicket} /></div>;
}

function ProjectsView({ projects, tasks, view, setSelectedTaskId, exportCsv }: { projects: Project[]; tasks: Task[]; view: string; setSelectedTaskId: (id: string) => void; exportCsv: () => void }) {
  const wanted = view === "projects-active" ? "Activ" : view === "projects-future" ? "Viitor" : "Finalizat";
  const list = projects.filter((p) => p.status === wanted);
  return <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><PanelHeader title={`Proiecte ${wanted}`} action="Export report" onClick={exportCsv} /><div className="grid gap-3 p-3 lg:grid-cols-2">{list.map((project) => { const linked = tasks.filter((t) => t.projectId === project.id); return <article key={project.id} className="rounded-xl border border-slate-200 p-3"><div className="flex justify-between"><div><div className="font-bold">{project.name}</div><div className="text-xs text-slate-500">{project.client} · {project.phase} · {project.budget}</div></div><span className={`rounded-md border px-2 py-1 text-xs ${project.health < 70 ? badgeClass("Critical") : badgeClass("Done")}`}>Health {project.health}%</span></div><div className="mt-3 grid grid-cols-4 gap-2 text-xs"><span>Progress {project.progress}%</span><span>Tasks {linked.length}</span><span>Owner {project.owner}</span><span>Docs {linked.reduce((s, t) => s + t.attachments.length, 0)}</span></div><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${project.progress}%` }} /></div><div className="mt-3 flex gap-1"><Button onClick={() => linked[0] && setSelectedTaskId(linked[0].id)}>Open task</Button><Button onClick={() => alert(`Checklist updated for ${project.id}`)}>Update checklist</Button></div></article>; })}</div></section>;
}

function CalendarGanttView({ tasks, updateTask, setSelectedTaskId }: { tasks: Task[]; updateTask: (id: string, patch: Partial<Task>) => void; setSelectedTaskId: (id: string) => void }) {
  return <div className="grid gap-4 xl:grid-cols-[1fr_340px]"><section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="mb-3 flex justify-between"><h2 className="font-bold">Calendar / Gantt planning</h2><span className="text-xs text-slate-500">deadlines, dependencies, critical path</span></div><div className="space-y-2">{tasks.slice(0, 18).map((task, index) => <div key={task.id} className="grid grid-cols-[90px_1fr_140px_140px_90px] items-center gap-2 rounded-lg bg-slate-50 p-2 text-xs"><button onClick={() => setSelectedTaskId(task.id)} className="font-mono text-left text-slate-500">{task.id}</button><span className="truncate font-semibold">{task.title}</span><div className="h-3 rounded-full bg-slate-200"><div className="h-3 rounded-full bg-emerald-500" style={{ width: `${20 + ((index * 7) % 72)}%` }} /></div><input type="date" value={task.dueDate} onChange={(e) => updateTask(task.id, { dueDate: e.target.value })} className="rounded border border-slate-200 px-1 py-1" /><span>{task.dependencies.join(", ") || "no deps"}</span></div>)}</div></section><MiniPanel title="Planning risks" rows={tasks.filter((t) => t.status === "Blocked" || t.priority === "Critical").slice(0, 9).map((t) => [t.id, t.status, t.priority, t.dueDate])} onClick={() => setSelectedTaskId(tasks[0].id)} /></div>;
}

function WorkloadView({ workload, approvals, approve }: { workload: { user: User; assigned: Task[]; allocated: number; tracked: number; load: number }[]; approvals: Approval[]; approve: (id: string, status: Approval["status"]) => void }) {
  return <div className="grid gap-4 xl:grid-cols-[1fr_360px]"><section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><h2 className="mb-3 font-bold">Resource Planning / Workload</h2>{workload.map((row) => <div key={row.user.id} className="grid grid-cols-[170px_90px_1fr_80px] items-center gap-3 border-b border-slate-100 py-2 text-xs"><div><div className="font-bold">{row.user.name}</div><div className="text-slate-500">{row.user.department} · {row.user.role}</div></div><span>{row.allocated}h / {row.user.capacity}h</span><div className="h-3 rounded-full bg-slate-100"><div className={`h-3 rounded-full ${row.load > 100 ? "bg-red-500" : row.load > 85 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(row.load, 130)}%` }} /></div><span className="text-right">{row.load}%</span></div>)}</section><section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><h3 className="mb-3 font-bold">Approvals queue</h3>{approvals.slice(0, 9).map((item) => <div key={item.id} className="mb-2 rounded-lg bg-slate-50 p-2 text-xs"><div className="font-bold">{item.title}</div><div className="text-slate-500">{item.owner} · {item.status}</div><div className="mt-2 flex gap-1"><Button onClick={() => approve(item.id, "Approved")}>Approve</Button><Button onClick={() => approve(item.id, "Rejected")} tone="danger">Reject</Button></div></div>)}</section></div>;
}

function FormsView({ createRequest }: { createRequest: () => void }) {
  const forms = ["Solicitare mentenanță", "Cerere document PIF", "Request ofertare", "Ticket IoT alert", "Cerere achiziții", "Aprobare pontaj teren"];
  return <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><h2 className="mb-3 font-bold">Request Forms / Intake</h2><div className="grid gap-3 md:grid-cols-3">{forms.map((form) => <article key={form} className="rounded-xl border border-slate-200 p-3 text-sm"><div className="font-bold">{form}</div><p className="mt-2 text-xs text-slate-500">Fields: client, project, SLA, assignee, files, approval route.</p><Button onClick={createRequest}>Submit request</Button></article>)}</div></section>;
}

function TimesheetsView({ tasks, startStopTimer, activeTimer }: { tasks: Task[]; startStopTimer: (task: Task) => void; activeTimer: string | null }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><h2 className="mb-3 font-bold">Timesheets / Timers</h2>{tasks.slice(0, 16).map((task) => <div key={task.id} className="grid grid-cols-[90px_1fr_130px_110px] gap-2 border-b border-slate-100 py-2 text-xs"><span className="font-mono">{task.id}</span><span className="truncate font-semibold">{task.title}</span><span>{task.tracked}h tracked</span><Button onClick={() => startStopTimer(task)}>{activeTimer === task.id ? "Stop timer" : "Start timer"}</Button></div>)}</section>;
}

function ReportsView({ store, exportCsv }: { store: Store; exportCsv: () => void }) {
  const rows = [["SLA", store.tickets.filter((t) => t.severity === "Critical").length, "urgent"], ["Workload", store.tasks.reduce((s, t) => s + t.estimate, 0), "hours"], ["Evidence", store.tasks.reduce((s, t) => s + t.attachments.length, 0), "files"], ["Approvals", store.approvals.filter((a) => a.status === "Pending").length, "waiting"]];
  return <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><PanelHeader title="Reporting command layer" action="Export CSV" onClick={exportCsv} /><div className="grid gap-3 md:grid-cols-4">{rows.map((row) => <div key={row[0]} className="rounded-xl bg-slate-50 p-4"><div className="text-xs uppercase text-slate-400">{row[0]}</div><div className="text-3xl font-black">{row[1]}</div><div className="text-xs text-slate-500">{row[2]}</div></div>)}</div></section>;
}

function AutomationsView({ automations, createAutomation, testAutomation }: { automations: Automation[]; createAutomation: () => void; testAutomation: (id: string) => void }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><PanelHeader title="Workflow automations" action="Create automation" onClick={createAutomation} />{automations.map((rule) => <div key={rule.id} className="grid grid-cols-[90px_1fr_190px_120px_120px] items-center gap-2 border-b border-slate-100 py-2 text-xs"><span className="font-mono">{rule.id}</span><span className="font-bold">{rule.name}</span><span>{rule.trigger}</span><span>{rule.enabled ? "enabled" : "disabled"}</span><Button onClick={() => testAutomation(rule.id)}>Test automation</Button></div>)}</section>;
}

function TaskDrawer({ task, store, updateTask, addComment, commentDraft, setCommentDraft, toggleChecklist, addDependency, attachFile, startStopTimer, activeTimer, close }: { task?: Task; store: Store; updateTask: (id: string, patch: Partial<Task>) => void; addComment: () => void; commentDraft: string; setCommentDraft: (text: string) => void; toggleChecklist: (task: Task, itemId: string) => void; addDependency: () => void; attachFile: () => void; startStopTimer: (task: Task) => void; activeTimer: string | null; close: () => void }) {
  if (!task) return <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">Select a task</aside>;
  return <aside className="max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="sticky top-0 z-10 border-b border-slate-100 bg-white p-3"><div className="flex justify-between gap-2"><div><div className="font-mono text-xs text-slate-400">{task.id}</div><input value={task.title} onChange={(e) => updateTask(task.id, { title: e.target.value })} className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm font-bold" /></div><Button onClick={close}>Close</Button></div></div><div className="space-y-4 p-3 text-xs"><textarea value={task.description} onChange={(e) => updateTask(task.id, { description: e.target.value })} className="min-h-20 w-full rounded-lg border border-slate-200 p-2" /><div className="grid grid-cols-2 gap-2"> <Field label="Status"><select value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Priority"><select value={task.priority} onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}>{priorities.map((p) => <option key={p}>{p}</option>)}</select></Field><Field label="Assignee"><select value={task.assignee} onChange={(e) => updateTask(task.id, { assignee: e.target.value })}>{store.users.map((u) => <option key={u.id}>{u.name}</option>)}</select></Field><Field label="Owner"><select value={task.owner} onChange={(e) => updateTask(task.id, { owner: e.target.value })}>{store.users.map((u) => <option key={u.id}>{u.name}</option>)}</select></Field><Field label="Start"><input type="date" value={task.startDate} onChange={(e) => updateTask(task.id, { startDate: e.target.value })} /></Field><Field label="Due"><input type="date" value={task.dueDate} onChange={(e) => updateTask(task.id, { dueDate: e.target.value })} /></Field><Field label="Estimate"><input type="number" value={task.estimate} onChange={(e) => updateTask(task.id, { estimate: Number(e.target.value) })} /></Field><Field label="Progress"><input type="number" value={task.progress} onChange={(e) => updateTask(task.id, { progress: Number(e.target.value) })} /></Field></div><div className="grid grid-cols-2 gap-2 text-slate-600"><div>Project: {store.projects.find((p) => p.id === task.projectId)?.name}</div><div>Client: {task.client}</div><div>Department: {task.department}</div><div>Equipment: {task.equipment}</div><div>Watchers: {task.watchers.join(", ")}</div><div>Tracked: {task.tracked}h</div></div><div><h4 className="font-bold">Custom fields</h4><div className="mt-2 grid grid-cols-2 gap-1">{Object.entries(task.customFields).map(([key, value]) => <div key={key} className="rounded bg-slate-50 p-2"><span className="text-slate-400">{key}</span><div className="font-semibold">{value}</div></div>)}</div></div><div><div className="flex items-center justify-between"><h4 className="font-bold">Checklist / subtasks</h4><Button onClick={() => updateTask(task.id, { checklist: [{ id: `c-${Date.now()}`, text: "Subtask nou", done: false }, ...task.checklist] })}>Add subtask</Button></div>{task.checklist.map((item) => <label key={item.id} className="mt-2 flex gap-2 rounded bg-slate-50 p-2"><input type="checkbox" checked={item.done} onChange={() => toggleChecklist(task, item.id)} /><span className={item.done ? "line-through text-slate-400" : ""}>{item.text}</span></label>)}</div><div><div className="flex items-center justify-between"><h4 className="font-bold">Dependencies</h4><Button onClick={addDependency}>Add dependency</Button></div><div className="mt-2 flex flex-wrap gap-1">{task.dependencies.map((dep) => <span key={dep} className="rounded bg-slate-100 px-2 py-1">{dep}</span>)}</div></div><div><div className="flex items-center justify-between"><h4 className="font-bold">Attachments / files</h4><Button onClick={attachFile}>Attach file</Button></div>{task.attachments.map((file) => <div key={file.id} className="mt-1 rounded bg-slate-50 p-2">{file.kind} · {file.name}</div>)}</div><div><h4 className="font-bold">Comments</h4><div className="mt-2 flex gap-2"><input value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} placeholder="Add comment..." className="flex-1 rounded border border-slate-200 px-2 py-1" /><Button onClick={addComment}>Add comment</Button></div>{task.comments.map((comment) => <div key={comment.id} className="mt-2 rounded bg-slate-50 p-2"><b>{comment.by}</b> · {comment.time}<div>{comment.text}</div></div>)}</div><div><h4 className="font-bold">Activity log</h4>{task.activity.map((a) => <div key={a.id} className="mt-1 text-slate-500">• {a.text} · {a.time}</div>)}</div><div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3"><Button tone="green" onClick={() => updateTask(task.id, { status: "Done", progress: 100 })}>Save / Done</Button><Button onClick={() => startStopTimer(task)}>{activeTimer === task.id ? "Stop timer" : "Start timer"}</Button><Button onClick={() => updateTask(task.id, { status: "Blocked" })}>Block</Button><Button onClick={() => updateTask(task.id, { priority: "Critical" })}>Escalate priority</Button><Button onClick={close}>Cancel</Button></div></div></aside>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="space-y-1"><span className="block text-[11px] font-bold uppercase text-slate-400">{label}</span><div className="[&_input]:w-full [&_input]:rounded [&_input]:border [&_input]:border-slate-200 [&_input]:px-2 [&_input]:py-1 [&_select]:w-full [&_select]:rounded [&_select]:border [&_select]:border-slate-200 [&_select]:px-2 [&_select]:py-1">{children}</div></label>;
}

export default V110GoodDayTaskuriEnterpriseWorkspace;
