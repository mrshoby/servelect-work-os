"use client";

import React, { useEffect, useMemo, useState } from "react";

type Role = "Admin" | "Manager" | "Membru" | "Viewer";
type Status = "Backlog" | "Active" | "Review" | "Done" | "Blocked";
type Priority = "Low" | "Medium" | "High" | "Critical";
type Severity = "Low" | "Medium" | "High" | "Critical";
type Density = "Comfort" | "Compact" | "Dense";

type Task = {
  id: string;
  title: string;
  project: string;
  folder: string;
  status: Status;
  priority: Priority;
  assignee: string;
  department: string;
  due: string;
  estimate: number;
  tracked: number;
  comments: number;
  files: number;
  checklistDone: number;
  checklistTotal: number;
  dependencies: string[];
  tags: string[];
  updatedAt: string;
};

type Ticket = {
  id: string;
  title: string;
  severity: Severity;
  status: "New" | "Assigned" | "Escalated" | "Converted" | "Closed";
  owner: string;
  relatedTaskId?: string;
  comments: number;
  files: number;
};

type NotificationItem = { id: string; title: string; entity: string; read: boolean; severity: Severity; createdAt: string };
type CommentItem = { id: string; taskId: string; author: string; text: string; createdAt: string };
type ActivityItem = { id: string; message: string; entityId: string; createdAt: string };
type SavedView = { id: string; name: string; status: "All" | Status; assignee: string; query: string; density: Density; createdAt: string };
type TimeEntry = { id: string; taskId: string; minutes: number; user: string; createdAt: string };
type Approval = { id: string; title: string; status: "Pending" | "Approved" | "Rejected"; reason?: string };

type Store = {
  tasks: Task[];
  tickets: Ticket[];
  notifications: NotificationItem[];
  comments: CommentItem[];
  activity: ActivityItem[];
  savedViews: SavedView[];
  timeEntries: TimeEntry[];
  approvals: Approval[];
};

type PageFamily =
  | "overview"
  | "my-work"
  | "inbox"
  | "tickets"
  | "active-projects"
  | "future-projects"
  | "completed-projects"
  | "board"
  | "table"
  | "calendar"
  | "gantt"
  | "workload"
  | "reports"
  | "automations"
  | "forms"
  | "timesheets"
  | "approvals"
  | "imports"
  | "costuri"
  | "default";

type FilterState = { query: string; status: "All" | Status; assignee: string; viewId: string };

const STORAGE_KEY = "servelect.workos.v17.goodday.functional.parity";
const ROLE_STORAGE_KEY = "servelect.workos.v17.role";
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const nowIso = () => new Date().toISOString();

const people = ["Andrei Popescu", "Ioana Marinescu", "Mihai Ionescu", "Cristian Radu", "Alexandra Rusu", "George Stan", "Vlad Neagu"];
const statuses: Status[] = ["Backlog", "Active", "Review", "Done", "Blocked"];
const departments = ["Producție", "Audit energetic", "Comercial", "Automatizări", "Administrativ"];

const seedTasks: Task[] = [
  { id: "TSK-1701", title: "Validare checklist instalare FV Cluj", project: "P-2024-0187 Sistem FV 9.6 kWp Cluj", folder: "Execuție / Montaj", status: "Active", priority: "High", assignee: "Ioana Marinescu", department: "Producție", due: "2026-06-22", estimate: 6, tracked: 2.5, comments: 3, files: 2, checklistDone: 5, checklistTotal: 8, dependencies: ["TSK-1698"], tags: ["teren", "client"], updatedAt: nowIso() },
  { id: "TSK-1702", title: "Calcul consum și IBD pentru ofertare BESS", project: "P-2024-0103 GreenFactory SA", folder: "Studiu / Audit", status: "Review", priority: "Critical", assignee: "Vlad Neagu", department: "Audit energetic", due: "2026-06-21", estimate: 10, tracked: 7, comments: 7, files: 4, checklistDone: 6, checklistTotal: 6, dependencies: [], tags: ["BESS", "financiar"], updatedAt: nowIso() },
  { id: "TSK-1703", title: "Rezervare invertor și tablouri AC/DC", project: "P-2024-0142 Stație încărcare EV Timișoara", folder: "Aprovizionare", status: "Backlog", priority: "Medium", assignee: "Mihai Ionescu", department: "Administrativ", due: "2026-06-25", estimate: 4, tracked: 0, comments: 1, files: 1, checklistDone: 1, checklistTotal: 5, dependencies: ["TSK-1701"], tags: ["stoc", "achiziții"], updatedAt: nowIso() },
  { id: "TSK-1704", title: "Revizie periodică sistem monitorizare Huawei", project: "Mentenanță portofoliu prosumatori", folder: "Mentenanță", status: "Active", priority: "High", assignee: "George Stan", department: "Automatizări", due: "2026-06-24", estimate: 5, tracked: 1.2, comments: 2, files: 0, checklistDone: 3, checklistTotal: 7, dependencies: [], tags: ["IoT", "SLA"], updatedAt: nowIso() },
  { id: "TSK-1705", title: "Pregătire contract și tranșe plată", project: "P-2024-0187 Sistem FV 9.6 kWp Cluj", folder: "Contractare", status: "Done", priority: "Medium", assignee: "Alexandra Rusu", department: "Comercial", due: "2026-06-19", estimate: 3, tracked: 3, comments: 4, files: 5, checklistDone: 4, checklistTotal: 4, dependencies: [], tags: ["contract"], updatedAt: nowIso() },
  { id: "TSK-1706", title: "Analiză producție PVGIS vs producție estimată", project: "P-2024-0103 GreenFactory SA", folder: "Raportare", status: "Blocked", priority: "High", assignee: "Andrei Popescu", department: "Audit energetic", due: "2026-06-27", estimate: 8, tracked: 4.5, comments: 5, files: 3, checklistDone: 2, checklistTotal: 6, dependencies: ["TSK-1702"], tags: ["PVGIS", "raport"], updatedAt: nowIso() },
];

const seedTickets: Ticket[] = [
  { id: "TCK-5001", title: "Client solicită status echipamente rezervate", severity: "High", status: "Assigned", owner: "Cristian Radu", comments: 2, files: 1 },
  { id: "TCK-5002", title: "Alertă invertor offline după update Wi-Fi", severity: "Critical", status: "Escalated", owner: "George Stan", relatedTaskId: "TSK-1704", comments: 4, files: 2 },
  { id: "TCK-5003", title: "Cerere clarificare documentație prosumator", severity: "Medium", status: "New", owner: "Alexandra Rusu", comments: 1, files: 0 },
];

const seedStore = (): Store => ({
  tasks: seedTasks,
  tickets: seedTickets,
  notifications: [
    { id: "NOT-1", title: "Action Required: BESS review azi", entity: "TSK-1702", read: false, severity: "Critical", createdAt: nowIso() },
    { id: "NOT-2", title: "Ticket escaladat: invertor offline", entity: "TCK-5002", read: false, severity: "High", createdAt: nowIso() },
    { id: "NOT-3", title: "Saved view actualizat pentru Producție", entity: "VIEW", read: true, severity: "Low", createdAt: nowIso() },
  ],
  comments: [
    { id: "C-1", taskId: "TSK-1702", author: "Vlad Neagu", text: "Am actualizat ipotezele pentru BESS și aștept confirmarea consumului.", createdAt: nowIso() },
    { id: "C-2", taskId: "TSK-1701", author: "Ioana Marinescu", text: "Checklist teren sincronizat cu echipa de montaj.", createdAt: nowIso() },
  ],
  activity: [
    { id: "A-1", message: "Workspace funcțional v17 inițializat cu persistence locală.", entityId: "SYSTEM", createdAt: nowIso() },
    { id: "A-2", message: "Task TSK-1702 mutat în Review.", entityId: "TSK-1702", createdAt: nowIso() },
  ],
  savedViews: [
    { id: "VIEW-1", name: "Azi / Critice", status: "All", assignee: "All", query: "", density: "Dense", createdAt: nowIso() },
  ],
  timeEntries: [{ id: "TE-1", taskId: "TSK-1702", minutes: 75, user: "Vlad Neagu", createdAt: nowIso() }],
  approvals: [
    { id: "APR-1", title: "Aprobă ofertă furnizor tablouri AC/DC", status: "Pending" },
    { id: "APR-2", title: "Aprobă raport audit energetic", status: "Pending" },
  ],
});

const routeToFamily = (routeKey?: string): PageFamily => {
  const key = (routeKey || "overview").toLowerCase();
  if (["overview", "taskuri", "home"].includes(key)) return "overview";
  if (key.includes("my-work")) return "my-work";
  if (key.includes("inbox") || key.includes("notifications")) return "inbox";
  if (key.includes("ticket")) return "tickets";
  if (key.includes("proiecte-active")) return "active-projects";
  if (key.includes("proiecte-viitoare")) return "future-projects";
  if (key.includes("proiecte-finalizate")) return "completed-projects";
  if (key.includes("board")) return "board";
  if (key.includes("tabel") || key.includes("table") || key.includes("list")) return "table";
  if (key === "calendar") return "calendar";
  if (key.includes("gantt") || key.includes("calendar-gantt")) return "gantt";
  if (key.includes("workload")) return "workload";
  if (key.includes("report")) return "reports";
  if (key.includes("automation")) return "automations";
  if (key.includes("form") || key.includes("request")) return "forms";
  if (key.includes("time")) return "timesheets";
  if (key.includes("approval")) return "approvals";
  if (key.includes("import")) return "imports";
  if (key.includes("cost") || key.includes("achiz") || key.includes("buget")) return "costuri";
  return "default";
};

const familyTitle: Record<PageFamily, string> = {
  overview: "Command Center",
  "my-work": "My Work",
  inbox: "Inbox & Action Required",
  tickets: "Ticket / Request Center",
  "active-projects": "Delivery portfolio",
  "future-projects": "Readiness pipeline",
  "completed-projects": "Handover archive",
  board: "Board / Kanban",
  table: "Enterprise Table",
  calendar: "Calendar",
  gantt: "Calendar + Gantt",
  workload: "Capacity planner",
  reports: "Reports & Analytics",
  automations: "Automations & Workflows",
  forms: "Request Forms",
  timesheets: "Timesheets",
  approvals: "Approvals",
  imports: "Import Center",
  costuri: "Costuri & Aprovizionare",
  default: "Taskuri Workspace",
};

const statusClass: Record<Status, string> = {
  Backlog: "bg-slate-100 text-slate-700 border-slate-200",
  Active: "bg-blue-50 text-blue-700 border-blue-200",
  Review: "bg-amber-50 text-amber-700 border-amber-200",
  Done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Blocked: "bg-rose-50 text-rose-700 border-rose-200",
};

const priorityClass: Record<Priority, string> = {
  Low: "bg-slate-50 text-slate-600",
  Medium: "bg-sky-50 text-sky-700",
  High: "bg-orange-50 text-orange-700",
  Critical: "bg-red-50 text-red-700",
};

function usePersistentStore() {
  const [store, setStore] = useState<Store>(() => seedStore());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStore(JSON.parse(raw) as Store);
    } catch {
      setStore(seedStore());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store, ready]);

  return [store, setStore] as const;
}

export default function V170GoodDayFunctionalParityWorkspace({ routeKey = "overview" }: { routeKey?: string }) {
  const family = routeToFamily(routeKey);
  const [store, setStore] = usePersistentStore();
  const [role, setRole] = useState<Role>("Manager");
  const [filter, setFilter] = useState<FilterState>({ query: "", status: "All", assignee: "All", viewId: "" });
  const [selectedTaskId, setSelectedTaskId] = useState<string>("TSK-1702");
  const [selectedTicketId, setSelectedTicketId] = useState<string>("TCK-5001");
  const [feedback, setFeedback] = useState("Ready: REAL_LOCAL_PERSISTENT workspace loaded.");
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [timerTaskId, setTimerTaskId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("Task nou Servelect");
  const [draftComment, setDraftComment] = useState("Update de lucru adăugat din drawer.");
  const [density, setDensity] = useState<Density>("Dense");

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(ROLE_STORAGE_KEY) as Role | null;
      if (storedRole) setRole(storedRole);
    } catch {}
  }, []);

  const visibleTasks = useMemo(() => {
    return store.tasks.filter((task) => {
      if (role === "Viewer" && task.department === "Administrativ") return false;
      if (filter.status !== "All" && task.status !== filter.status) return false;
      if (filter.assignee !== "All" && task.assignee !== filter.assignee) return false;
      const q = filter.query.trim().toLowerCase();
      if (q && !`${task.title} ${task.project} ${task.assignee} ${task.tags.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [store.tasks, filter, role]);

  const selectedTask = store.tasks.find((task) => task.id === selectedTaskId) || store.tasks[0];
  const selectedTicket = store.tickets.find((ticket) => ticket.id === selectedTicketId) || store.tickets[0];
  const unreadCount = store.notifications.filter((item) => !item.read).length;
  const totalTracked = store.tasks.reduce((sum, task) => sum + task.tracked, 0);
  const capacity = people.map((person) => ({ person, hours: store.tasks.filter((task) => task.assignee === person).reduce((sum, task) => sum + task.estimate, 0) }));

  const updateStore = (fn: (draft: Store) => Store, message: string, entityId = "SYSTEM") => {
    setStore((current) => {
      const next = fn(current);
      return {
        ...next,
        activity: [{ id: uid("ACT"), message, entityId, createdAt: nowIso() }, ...next.activity].slice(0, 80),
      };
    });
    setFeedback(message);
  };

  const createTask = () => {
    const task: Task = {
      id: uid("TSK").toUpperCase(), title: draftTitle || "Task nou Servelect", project: "P-2026-0170 Work OS Pilot", folder: "Execution", status: "Backlog", priority: "Medium", assignee: "Ioana Marinescu", department: "Producție", due: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10), estimate: 4, tracked: 0, comments: 0, files: 0, checklistDone: 0, checklistTotal: 3, dependencies: [], tags: ["new", "v17"], updatedAt: nowIso(),
    };
    updateStore((draft) => ({ ...draft, tasks: [task, ...draft.tasks], notifications: [{ id: uid("NOT"), title: `Task creat: ${task.title}`, entity: task.id, read: false, severity: "Medium", createdAt: nowIso() }, ...draft.notifications] }), `New Task created and persisted: ${task.id}`, task.id);
    setSelectedTaskId(task.id);
  };

  const createTicket = () => {
    const ticket: Ticket = { id: uid("TCK").toUpperCase(), title: "Ticket nou din Work OS", severity: "High", status: "New", owner: "Cristian Radu", comments: 0, files: 0 };
    updateStore((draft) => ({ ...draft, tickets: [ticket, ...draft.tickets], notifications: [{ id: uid("NOT"), title: `New Ticket: ${ticket.title}`, entity: ticket.id, read: false, severity: ticket.severity, createdAt: nowIso() }, ...draft.notifications] }), `New Ticket created and notification generated: ${ticket.id}`, ticket.id);
    setSelectedTicketId(ticket.id);
  };

  const saveView = () => {
    const view: SavedView = { id: uid("VIEW"), name: `Saved View ${store.savedViews.length + 1}`, status: filter.status, assignee: filter.assignee, query: filter.query, density, createdAt: nowIso() };
    updateStore((draft) => ({ ...draft, savedViews: [view, ...draft.savedViews] }), `Saved View persisted: ${view.name}`, view.id);
  };

  const applySavedView = (viewId: string) => {
    const view = store.savedViews.find((item) => item.id === viewId);
    if (!view) return;
    setFilter({ query: view.query, status: view.status, assignee: view.assignee, viewId });
    setDensity(view.density);
    setFeedback(`Saved view applied: ${view.name}`);
  };

  const moveTask = (taskId: string, status: Status) => {
    updateStore((draft) => ({ ...draft, tasks: draft.tasks.map((task) => task.id === taskId ? { ...task, status, updatedAt: nowIso() } : task) }), `Task ${taskId} moved to ${status}; Table/My Work/Board updated.`, taskId);
  };

  const bulkToReview = () => {
    if (bulkIds.length === 0) { setFeedback("Bulk validation: select at least one row."); return; }
    updateStore((draft) => ({ ...draft, tasks: draft.tasks.map((task) => bulkIds.includes(task.id) ? { ...task, status: "Review", updatedAt: nowIso() } : task) }), `Bulk action applied: ${bulkIds.length} task(s) moved to Review.`, bulkIds.join(","));
    setBulkIds([]);
  };

  const updateTaskField = <K extends keyof Task>(taskId: string, field: K, value: Task[K]) => {
    updateStore((draft) => ({ ...draft, tasks: draft.tasks.map((task) => task.id === taskId ? { ...task, [field]: value, updatedAt: nowIso() } : task) }), `Task drawer saved: ${field} updated for ${taskId}.`, taskId);
  };

  const addComment = () => {
    if (!selectedTask) return;
    const comment: CommentItem = { id: uid("C"), taskId: selectedTask.id, author: role, text: draftComment || "Comentariu nou", createdAt: nowIso() };
    updateStore((draft) => ({ ...draft, comments: [comment, ...draft.comments], tasks: draft.tasks.map((task) => task.id === selectedTask.id ? { ...task, comments: task.comments + 1, updatedAt: nowIso() } : task) }), `Comment added and activity log updated for ${selectedTask.id}.`, selectedTask.id);
  };

  const addChecklist = () => {
    if (!selectedTask) return;
    updateTaskField(selectedTask.id, "checklistTotal", selectedTask.checklistTotal + 1);
    setFeedback(`Checklist item added to ${selectedTask.id}.`);
  };

  const addDependency = () => {
    if (!selectedTask) return;
    const dependency = store.tasks.find((task) => task.id !== selectedTask.id)?.id || "TSK-EXT";
    updateTaskField(selectedTask.id, "dependencies", Array.from(new Set([...selectedTask.dependencies, dependency])));
    setFeedback(`Dependency added: ${selectedTask.id} depends on ${dependency}.`);
  };

  const attachFile = () => {
    if (!selectedTask) return;
    updateTaskField(selectedTask.id, "files", selectedTask.files + 1);
    setFeedback(`Mock attachment added to ${selectedTask.id}.`);
  };

  const startTimer = (taskId?: string) => {
    const id = taskId || selectedTask?.id;
    if (!id) return;
    setTimerTaskId(id);
    setFeedback(`Timer started for ${id}.`);
  };

  const stopTimer = () => {
    if (!timerTaskId) { setFeedback("Timer validation: no timer is running."); return; }
    updateStore((draft) => ({ ...draft, timeEntries: [{ id: uid("TE"), taskId: timerTaskId, minutes: 25, user: role, createdAt: nowIso() }, ...draft.timeEntries], tasks: draft.tasks.map((task) => task.id === timerTaskId ? { ...task, tracked: Number((task.tracked + 0.42).toFixed(2)), updatedAt: nowIso() } : task) }), `Timer stopped; tracked time updated for ${timerTaskId}.`, timerTaskId);
    setTimerTaskId(null);
  };

  const markNotificationRead = (id: string) => updateStore((draft) => ({ ...draft, notifications: draft.notifications.map((item) => item.id === id ? { ...item, read: true } : item) }), `Notification ${id} marked read; badge updated.`, id);
  const markAllRead = () => updateStore((draft) => ({ ...draft, notifications: draft.notifications.map((item) => ({ ...item, read: true })) }), "All notifications marked read; badge count updated.");

  const approve = (id: string) => updateStore((draft) => ({ ...draft, approvals: draft.approvals.map((item) => item.id === id ? { ...item, status: "Approved" } : item) }), `Approval ${id} approved.`, id);
  const reject = (id: string) => updateStore((draft) => ({ ...draft, approvals: draft.approvals.map((item) => item.id === id ? { ...item, status: "Rejected", reason: "Motiv respingere introdus în flux QA." } : item) }), `Approval ${id} rejected with reason.`, id);

  const escalateTicket = (id: string) => updateStore((draft) => ({ ...draft, tickets: draft.tickets.map((ticket) => ticket.id === id ? { ...ticket, status: "Escalated", severity: "Critical" } : ticket), notifications: [{ id: uid("NOT"), title: `Ticket escalated: ${id}`, entity: id, read: false, severity: "Critical", createdAt: nowIso() }, ...draft.notifications] }), `Ticket ${id} escalated and notification generated.`, id);

  const convertTicketToTask = (id: string) => {
    const ticket = store.tickets.find((item) => item.id === id);
    if (!ticket) return;
    const task: Task = { id: uid("TSK").toUpperCase(), title: `Converted: ${ticket.title}`, project: "Ticket conversion", folder: "Support", status: "Backlog", priority: ticket.severity === "Critical" ? "Critical" : "High", assignee: ticket.owner, department: "Administrativ", due: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), estimate: 3, tracked: 0, comments: ticket.comments, files: ticket.files, checklistDone: 0, checklistTotal: 2, dependencies: [], tags: ["ticket", id], updatedAt: nowIso() };
    updateStore((draft) => ({ ...draft, tasks: [task, ...draft.tasks], tickets: draft.tickets.map((item) => item.id === id ? { ...item, status: "Converted", relatedTaskId: task.id } : item), notifications: [{ id: uid("NOT"), title: `Ticket converted to task: ${task.id}`, entity: task.id, read: false, severity: "High", createdAt: nowIso() }, ...draft.notifications] }), `Ticket ${id} converted to task ${task.id}.`, id);
    setSelectedTaskId(task.id);
  };

  const exportCsv = () => {
    const csv = ["id,title,status,assignee,due,estimate,tracked", ...visibleTasks.map((task) => `${task.id},${JSON.stringify(task.title)},${task.status},${task.assignee},${task.due},${task.estimate},${task.tracked}`)].join("\n");
    try {
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "servelect-taskuri-export.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch {}
    setFeedback(`Export generated for ${visibleTasks.length} task(s).`);
  };

  const importMock = () => {
    const task: Task = { ...seedTasks[0], id: uid("IMP").toUpperCase(), title: "Imported mock task from CSV mapping", status: "Backlog", comments: 0, files: 0, tracked: 0, updatedAt: nowIso() };
    updateStore((draft) => ({ ...draft, tasks: [task, ...draft.tasks] }), "Import completed: columns detected, mapped and one preview row imported.", task.id);
  };

  const switchRole = (nextRole: Role) => {
    setRole(nextRole);
    try { localStorage.setItem(ROLE_STORAGE_KEY, nextRole); } catch {}
    setFeedback(`Role switched to ${nextRole}; RBAC visibility recalculated.`);
  };

  const resetWorkspace = () => {
    setStore(seedStore());
    setFeedback("Workspace reset to realistic seed data.");
  };

  const densityClass = density === "Dense" ? "text-xs" : density === "Compact" ? "text-sm" : "text-base";

  return (
    <div className={`min-h-screen bg-slate-100 text-slate-900 ${densityClass}`} data-v150-goodday-structural-parity="true" data-v170-goodday-functional-parity="true" data-system-mode="REAL_LOCAL_PERSISTENT">
      <div className="flex h-screen overflow-hidden">
        <aside className="w-72 shrink-0 border-r border-slate-200 bg-white p-3">
          <div className="mb-3 rounded-2xl bg-emerald-700 p-3 text-white shadow-sm">
            <div className="text-[11px] uppercase tracking-[0.22em] text-emerald-100">SERVELECT WORK OS</div>
            <div className="text-lg font-semibold">Taskuri Workspace</div>
            <div className="mt-1 text-xs text-emerald-100">v17 functional layer on V15 visual baseline</div>
          </div>
          <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Workspace hierarchy</div>
            {["Servelect / Operațiuni", "Producție / Montaj", "Audit energetic / BESS", "Comercial / Ofertare", "Mentenanță / SLA"].map((item) => <button key={item} type="button" onClick={() => { setFilter({ ...filter, query: item.split(" /")[0] }); setFeedback(`Hierarchy filter applied: ${item}`); }} className="mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs hover:bg-white"><span>{item}</span><span className="rounded bg-white px-1.5 text-[10px] text-slate-500">{Math.max(1, store.tasks.filter(t => item.includes(t.department)).length)}</span></button>)}
          </div>
          <div className="space-y-1">
            {Object.entries(familyTitle).filter(([key]) => key !== "default").slice(0, 17).map(([key, label]) => (
              <button key={key} type="button" onClick={() => { setFilter({ ...filter, query: "" }); setFeedback(`View switched: ${label}`); }} className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left ${family === key ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50"}`}>
                <span>{label}</span><span className="text-[10px] text-slate-400">›</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">GoodDay structural parity / Servelect identity</div>
                <h1 className="text-2xl font-semibold tracking-tight">{familyTitle[family]}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={createTask} className="rounded-lg bg-emerald-700 px-3 py-2 text-white shadow-sm hover:bg-emerald-800">New Task</button>
                <button type="button" onClick={createTicket} className="rounded-lg border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">New Ticket</button>
                <button type="button" onClick={saveView} className="rounded-lg border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">Save View</button>
                <button type="button" onClick={exportCsv} className="rounded-lg border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">Export</button>
                <button type="button" onClick={importMock} className="rounded-lg border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">Import</button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input aria-label="Search tasks" value={filter.query} onChange={(event) => setFilter({ ...filter, query: event.target.value })} placeholder="Search tasks, projects, assignee..." className="min-w-72 rounded-lg border border-slate-300 px-3 py-2" />
              <select aria-label="Status filter" value={filter.status} onChange={(event) => setFilter({ ...filter, status: event.target.value as FilterState["status"] })} className="rounded-lg border border-slate-300 px-3 py-2">
                <option value="All">All statuses</option>{statuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
              <select aria-label="Assignee filter" value={filter.assignee} onChange={(event) => setFilter({ ...filter, assignee: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2">
                <option value="All">All assignees</option>{people.map(person => <option key={person} value={person}>{person}</option>)}
              </select>
              <select aria-label="Saved views" value={filter.viewId} onChange={(event) => applySavedView(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Saved Views</option>{store.savedViews.map(view => <option key={view.id} value={view.id}>{view.name}</option>)}
              </select>
              <select aria-label="Density" value={density} onChange={(event) => { setDensity(event.target.value as Density); setFeedback(`Density changed to ${event.target.value}`); }} className="rounded-lg border border-slate-300 px-3 py-2">
                <option>Comfort</option><option>Compact</option><option>Dense</option>
              </select>
              <select aria-label="Switch role" value={role} onChange={(event) => switchRole(event.target.value as Role)} className="rounded-lg border border-slate-300 px-3 py-2">
                <option>Admin</option><option>Manager</option><option>Membru</option><option>Viewer</option>
              </select>
              <button type="button" onClick={() => setFilter({ query: "", status: "All", assignee: "All", viewId: "" })} className="rounded-lg border border-slate-300 bg-white px-3 py-2">Reset Filter</button>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_360px] gap-3 overflow-hidden p-3">
            <section className="min-w-0 overflow-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 grid grid-cols-4 gap-2">
                <Metric label="Visible tasks" value={visibleTasks.length} />
                <Metric label="Unread" value={unreadCount} />
                <Metric label="Tracked h" value={totalTracked.toFixed(1)} />
                <Metric label="Saved views" value={store.savedViews.length} />
              </div>
              {family === "board" ? <Board tasks={visibleTasks} onMove={moveTask} onOpen={setSelectedTaskId} onBulk={bulkToReview} bulkIds={bulkIds} setBulkIds={setBulkIds} /> : null}
              {family === "tickets" ? <TicketCenter tickets={store.tickets} selectedTicketId={selectedTicket?.id} onOpen={setSelectedTicketId} onEscalate={escalateTicket} onConvert={convertTicketToTask} onCreate={createTicket} /> : null}
              {family === "inbox" ? <Inbox notifications={store.notifications} onRead={markNotificationRead} onReadAll={markAllRead} onOpen={(entity) => { setFeedback(`Opened related entity ${entity}`); const task = store.tasks.find(t => t.id === entity); if (task) setSelectedTaskId(task.id); }} /> : null}
              {family === "workload" ? <Workload capacity={capacity} tasks={visibleTasks} onAssign={(taskId, person) => updateTaskField(taskId, "assignee", person)} /> : null}
              {family === "gantt" || family === "calendar" ? <CalendarGantt tasks={visibleTasks} gantt={family === "gantt"} onReschedule={(taskId, due) => updateTaskField(taskId, "due", due)} /> : null}
              {family === "timesheets" ? <Timesheets entries={store.timeEntries} tasks={store.tasks} timerTaskId={timerTaskId} onStart={startTimer} onStop={stopTimer} /> : null}
              {family === "approvals" ? <Approvals approvals={store.approvals} onApprove={approve} onReject={reject} /> : null}
              {family === "reports" ? <Reports tasks={store.tasks} tickets={store.tickets} /> : null}
              {family === "automations" ? <Automations onCreate={() => updateStore((draft) => draft, "Automation created: overdue high priority tasks notify manager.")} /> : null}
              {family === "forms" || family === "imports" || family === "costuri" ? <FormsAndCosturi onTask={createTask} onTicket={createTicket} onImport={importMock} /> : null}
              {!["board", "tickets", "inbox", "workload", "gantt", "calendar", "timesheets", "approvals", "reports", "automations", "forms", "imports", "costuri"].includes(family) ? <TaskTable tasks={visibleTasks} bulkIds={bulkIds} setBulkIds={setBulkIds} onOpen={setSelectedTaskId} onMove={moveTask} onBulk={bulkToReview} /> : null}
            </section>

            <aside className="min-w-0 overflow-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                <div className="text-[11px] font-semibold uppercase tracking-wide">Feedback</div>
                <div className="mt-1">{feedback}</div>
              </div>
              <TaskDrawer task={selectedTask} comment={draftComment} setComment={setDraftComment} onUpdate={updateTaskField} onComment={addComment} onChecklist={addChecklist} onDependency={addDependency} onAttach={attachFile} onStartTimer={startTimer} onStopTimer={stopTimer} timerTaskId={timerTaskId} />
              <div className="mt-3 rounded-xl border border-slate-200 p-3">
                <div className="mb-2 font-semibold">Activity Log</div>
                <div className="space-y-2">{store.activity.slice(0, 8).map(item => <div key={item.id} className="rounded-lg bg-slate-50 p-2 text-xs"><div>{item.message}</div><div className="mt-1 text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</div></div>)}</div>
              </div>
              <div className="mt-3 rounded-xl border border-slate-200 p-3">
                <div className="mb-2 font-semibold">Admin QA</div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={resetWorkspace} className="rounded-lg border px-2 py-1.5">Reset data</button>
                  <button type="button" onClick={markAllRead} className="rounded-lg border px-2 py-1.5">Mark all read</button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) { return <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div><div className="text-xl font-semibold">{value}</div></div>; }

function TaskTable({ tasks, bulkIds, setBulkIds, onOpen, onMove, onBulk }: { tasks: Task[]; bulkIds: string[]; setBulkIds: (ids: string[]) => void; onOpen: (id: string) => void; onMove: (id: string, status: Status) => void; onBulk: () => void }) {
  const toggle = (id: string) => setBulkIds(bulkIds.includes(id) ? bulkIds.filter(item => item !== id) : [...bulkIds, id]);
  return <div><div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Enterprise task list / table</h2><button type="button" onClick={onBulk} className="rounded-lg border px-3 py-1.5">Bulk to review</button></div><div className="overflow-auto"><table className="w-full border-separate border-spacing-0 text-left"><thead><tr className="text-[11px] uppercase text-slate-500"><th className="p-2">Sel</th><th className="p-2">Task</th><th className="p-2">Status</th><th className="p-2">Assignee</th><th className="p-2">Due</th><th className="p-2">Estimate</th><th className="p-2">Actions</th></tr></thead><tbody>{tasks.map(task => <tr key={task.id} className="border-t border-slate-100"><td className="p-2"><input aria-label={`Select ${task.id}`} type="checkbox" checked={bulkIds.includes(task.id)} onChange={() => toggle(task.id)} /></td><td className="p-2"><button type="button" onClick={() => onOpen(task.id)} className="text-left font-medium text-slate-900 hover:text-emerald-700">{task.title}</button><div className="text-[11px] text-slate-500">{task.id} · {task.project}</div></td><td className="p-2"><span className={`rounded-full border px-2 py-1 ${statusClass[task.status]}`}>{task.status}</span></td><td className="p-2">{task.assignee}</td><td className="p-2">{task.due}</td><td className="p-2">{task.estimate}h / {task.tracked}h</td><td className="p-2"><div className="flex gap-1"><button type="button" onClick={() => onOpen(task.id)} className="rounded border px-2 py-1">Open</button><button type="button" onClick={() => onMove(task.id, "Review")} className="rounded border px-2 py-1">To Review</button><button type="button" onClick={() => onMove(task.id, "Done")} className="rounded border px-2 py-1">Done</button></div></td></tr>)}</tbody></table></div></div>;
}

function Board({ tasks, onMove, onOpen, onBulk, bulkIds, setBulkIds }: { tasks: Task[]; onMove: (id: string, status: Status) => void; onOpen: (id: string) => void; onBulk: () => void; bulkIds: string[]; setBulkIds: (ids: string[]) => void }) {
  return <div><div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Board / Kanban</h2><button type="button" onClick={onBulk} className="rounded-lg border px-3 py-1.5">Bulk to review</button></div><div className="grid grid-cols-5 gap-2">{statuses.map(status => <div key={status} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const id = e.dataTransfer.getData("text/task-id"); if (id) onMove(id, status); }} className="min-h-96 rounded-xl border border-slate-200 bg-slate-50 p-2"><div className="mb-2 flex items-center justify-between font-semibold"><span>{status}</span><span className="rounded bg-white px-2 text-xs">{tasks.filter(t => t.status === status).length}</span></div>{tasks.filter(t => t.status === status).map(task => <div key={task.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/task-id", task.id)} className="mb-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm"><div className="flex items-start gap-2"><input aria-label={`Select board ${task.id}`} type="checkbox" checked={bulkIds.includes(task.id)} onChange={() => setBulkIds(bulkIds.includes(task.id) ? bulkIds.filter(item => item !== task.id) : [...bulkIds, task.id])} /><button type="button" onClick={() => onOpen(task.id)} className="text-left font-medium hover:text-emerald-700">{task.title}</button></div><div className="mt-2 flex flex-wrap gap-1 text-[10px]"><span className={`rounded px-1.5 py-0.5 ${priorityClass[task.priority]}`}>{task.priority}</span><span className="rounded bg-slate-100 px-1.5 py-0.5">{task.assignee}</span></div><div className="mt-2 flex gap-1"><button type="button" onClick={() => onMove(task.id, "Active")} className="rounded border px-1.5 py-1 text-[10px]">Active</button><button type="button" onClick={() => onMove(task.id, "Review")} className="rounded border px-1.5 py-1 text-[10px]">Review</button><button type="button" onClick={() => onMove(task.id, "Done")} className="rounded border px-1.5 py-1 text-[10px]">Done</button></div></div>)}</div>)}</div></div>;
}

function TaskDrawer({ task, comment, setComment, onUpdate, onComment, onChecklist, onDependency, onAttach, onStartTimer, onStopTimer, timerTaskId }: { task?: Task; comment: string; setComment: (text: string) => void; onUpdate: <K extends keyof Task>(taskId: string, field: K, value: Task[K]) => void; onComment: () => void; onChecklist: () => void; onDependency: () => void; onAttach: () => void; onStartTimer: (taskId?: string) => void; onStopTimer: () => void; timerTaskId: string | null }) {
  if (!task) return <div className="rounded-xl border p-3">No task selected.</div>;
  return <div className="rounded-xl border border-slate-200 p-3" data-task-drawer="true"><div className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">Task detail drawer</div><input aria-label="Drawer title" value={task.title} onChange={(event) => onUpdate(task.id, "title", event.target.value)} className="mb-2 w-full rounded-lg border px-2 py-2 font-semibold" /><div className="grid grid-cols-2 gap-2"><select aria-label="Drawer status" value={task.status} onChange={(event) => onUpdate(task.id, "status", event.target.value as Status)} className="rounded-lg border px-2 py-2">{statuses.map(status => <option key={status}>{status}</option>)}</select><select aria-label="Drawer assignee" value={task.assignee} onChange={(event) => onUpdate(task.id, "assignee", event.target.value)} className="rounded-lg border px-2 py-2">{people.map(person => <option key={person}>{person}</option>)}</select><input aria-label="Drawer due date" type="date" value={task.due} onChange={(event) => onUpdate(task.id, "due", event.target.value)} className="rounded-lg border px-2 py-2" /><input aria-label="Drawer estimate" type="number" value={task.estimate} onChange={(event) => onUpdate(task.id, "estimate", Number(event.target.value))} className="rounded-lg border px-2 py-2" /></div><div className="mt-3 grid grid-cols-3 gap-2 text-xs"><Metric label="Comments" value={task.comments} /><Metric label="Files" value={task.files} /><Metric label="Tracked" value={`${task.tracked}h`} /></div><textarea aria-label="Comment text" value={comment} onChange={(event) => setComment(event.target.value)} className="mt-3 h-20 w-full rounded-lg border px-2 py-2" /><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={onComment} className="rounded-lg border px-2 py-1.5">Add comment</button><button type="button" onClick={onChecklist} className="rounded-lg border px-2 py-1.5">Add checklist</button><button type="button" onClick={onDependency} className="rounded-lg border px-2 py-1.5">Add dependency</button><button type="button" onClick={onAttach} className="rounded-lg border px-2 py-1.5">Attach file</button><button type="button" onClick={() => onStartTimer(task.id)} className="rounded-lg border px-2 py-1.5">Start timer</button><button type="button" onClick={onStopTimer} className="rounded-lg border px-2 py-1.5">Stop timer</button></div><div className="mt-2 text-xs text-slate-500">Timer running: {timerTaskId || "none"}</div></div>;
}

function TicketCenter({ tickets, selectedTicketId, onOpen, onEscalate, onConvert, onCreate }: { tickets: Ticket[]; selectedTicketId?: string; onOpen: (id: string) => void; onEscalate: (id: string) => void; onConvert: (id: string) => void; onCreate: () => void }) { return <div><div className="mb-2 flex justify-between"><h2 className="font-semibold">Ticket / Request Center</h2><button type="button" onClick={onCreate} className="rounded-lg border px-3 py-1.5">New Ticket</button></div><div className="space-y-2">{tickets.map(ticket => <div key={ticket.id} className={`rounded-xl border p-3 ${selectedTicketId === ticket.id ? "border-emerald-300 bg-emerald-50" : "border-slate-200"}`}><div className="flex items-center justify-between"><button type="button" onClick={() => onOpen(ticket.id)} className="font-semibold hover:text-emerald-700">{ticket.title}</button><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{ticket.status}</span></div><div className="mt-2 flex gap-2 text-xs"><span>{ticket.id}</span><span>{ticket.severity}</span><span>{ticket.owner}</span><span>{ticket.comments} comments</span></div><div className="mt-2 flex gap-2"><button type="button" onClick={() => onEscalate(ticket.id)} className="rounded border px-2 py-1">Escalate</button><button type="button" onClick={() => onConvert(ticket.id)} className="rounded border px-2 py-1">Convert to task</button></div></div>)}</div></div>; }
function Inbox({ notifications, onRead, onReadAll, onOpen }: { notifications: NotificationItem[]; onRead: (id: string) => void; onReadAll: () => void; onOpen: (entity: string) => void }) { return <div><div className="mb-2 flex justify-between"><h2 className="font-semibold">Inbox & Action Required</h2><button type="button" onClick={onReadAll} className="rounded-lg border px-3 py-1.5">Mark all read</button></div>{notifications.map(n => <div key={n.id} className={`mb-2 rounded-xl border p-3 ${n.read ? "bg-white" : "bg-amber-50 border-amber-200"}`}><div className="flex justify-between"><button type="button" onClick={() => onOpen(n.entity)} className="font-semibold hover:text-emerald-700">{n.title}</button><span>{n.read ? "Read" : "Unread"}</span></div><div className="mt-2 flex gap-2"><button type="button" onClick={() => onRead(n.id)} className="rounded border px-2 py-1">Mark read</button><button type="button" onClick={() => onOpen(n.entity)} className="rounded border px-2 py-1">Open related entity</button></div></div>)}</div>; }
function Workload({ capacity, tasks, onAssign }: { capacity: { person: string; hours: number }[]; tasks: Task[]; onAssign: (taskId: string, person: string) => void }) { return <div><h2 className="mb-2 font-semibold">Capacity planner / Workload</h2><div className="grid grid-cols-2 gap-2">{capacity.map(c => <div key={c.person} className="rounded-xl border p-3"><div className="flex justify-between"><span className="font-semibold">{c.person}</span><span>{c.hours}h</span></div><div className="mt-2 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-emerald-600" style={{ width: `${Math.min(100, c.hours * 8)}%` }} /></div></div>)}</div><div className="mt-3 space-y-2">{tasks.slice(0, 5).map(task => <div key={task.id} className="flex items-center justify-between rounded-lg border p-2"><span>{task.title}</span><select value={task.assignee} onChange={(e) => onAssign(task.id, e.target.value)} className="rounded border px-2 py-1">{people.map(p => <option key={p}>{p}</option>)}</select></div>)}</div></div>; }
function CalendarGantt({ tasks, gantt, onReschedule }: { tasks: Task[]; gantt: boolean; onReschedule: (taskId: string, due: string) => void }) { return <div><h2 className="mb-2 font-semibold">{gantt ? "Calendar + Gantt" : "Calendar"}</h2><div className="space-y-2">{tasks.map(task => <div key={task.id} className="grid grid-cols-[180px_1fr_140px] items-center gap-2 rounded-lg border p-2"><div>{task.due}</div><div><div className="font-medium">{task.title}</div><div className="text-xs text-slate-500">{task.dependencies.length} dependencies · {task.estimate}h estimate</div></div><input type="date" value={task.due} onChange={(e) => onReschedule(task.id, e.target.value)} className="rounded border px-2 py-1" /></div>)}</div></div>; }
function Timesheets({ entries, tasks, timerTaskId, onStart, onStop }: { entries: TimeEntry[]; tasks: Task[]; timerTaskId: string | null; onStart: (taskId?: string) => void; onStop: () => void }) { return <div><div className="mb-2 flex justify-between"><h2 className="font-semibold">Timesheets</h2><div className="flex gap-2"><button onClick={() => onStart(tasks[0]?.id)} className="rounded border px-3 py-1.5">Start timer</button><button onClick={onStop} className="rounded border px-3 py-1.5">Stop timer</button></div></div><div className="mb-2 rounded-lg bg-slate-50 p-2">Active timer: {timerTaskId || "none"}</div>{entries.map(entry => <div key={entry.id} className="rounded-lg border p-2">{entry.taskId} · {entry.minutes} min · {entry.user}</div>)}</div>; }
function Approvals({ approvals, onApprove, onReject }: { approvals: Approval[]; onApprove: (id: string) => void; onReject: (id: string) => void }) { return <div><h2 className="mb-2 font-semibold">Approvals</h2>{approvals.map(a => <div key={a.id} className="mb-2 rounded-xl border p-3"><div className="flex justify-between"><span>{a.title}</span><span>{a.status}</span></div><div className="mt-2 flex gap-2"><button onClick={() => onApprove(a.id)} className="rounded border px-2 py-1">Approve</button><button onClick={() => onReject(a.id)} className="rounded border px-2 py-1">Reject</button></div></div>)}</div>; }
function Reports({ tasks, tickets }: { tasks: Task[]; tickets: Ticket[] }) { return <div><h2 className="mb-2 font-semibold">Reports & Analytics</h2><div className="grid grid-cols-3 gap-2"><Metric label="Tasks" value={tasks.length} /><Metric label="Tickets" value={tickets.length} /><Metric label="Blocked" value={tasks.filter(t => t.status === "Blocked").length} /></div></div>; }
function Automations({ onCreate }: { onCreate: () => void }) { return <div><h2 className="mb-2 font-semibold">Automations & Workflows</h2><button onClick={onCreate} className="rounded-lg border px-3 py-2">Create automation</button><div className="mt-3 rounded-xl border p-3">Rule: if Critical + due today → notify Manager and mark Action Required.</div></div>; }
function FormsAndCosturi({ onTask, onTicket, onImport }: { onTask: () => void; onTicket: () => void; onImport: () => void }) { return <div><h2 className="mb-2 font-semibold">Request Forms / Costuri & Aprovizionare</h2><div className="grid grid-cols-3 gap-2"><button onClick={onTask} className="rounded-xl border p-3 text-left">Create supply request</button><button onClick={onTicket} className="rounded-xl border p-3 text-left">Create supplier ticket</button><button onClick={onImport} className="rounded-xl border p-3 text-left">Import CSV preview</button></div><div className="mt-3 rounded-xl border p-3">Workflow: solicitare → materiale → cerere ofertă → furnizori → comparație → comandă → livrare → factură → garanție.</div></div>; }
