"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  Archive,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Columns3,
  Download,
  Eye,
  FileText,
  Filter,
  Flag,
  FolderKanban,
  GitBranch,
  Grid2X2,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Settings2,
  ShieldAlert,
  Star,
  Table2,
  Timer,
  Users,
  X
} from "lucide-react";
import {
  v64Approvals,
  v64CanAssignTask,
  v64CanViewTask,
  v64CompletionStatus,
  v64Departments,
  v64Notifications,
  v64ProjectById,
  v64Projects,
  v64Tickets,
  v64UserById,
  v64Users,
  v64Tasks,
  type V64Approval,
  type V64DepartmentId,
  type V64Notification,
  type V64PageId,
  type V64Priority,
  type V64Project,
  type V64Task,
  type V64TaskStatus,
  type V64Ticket,
  type V64TicketStatus,
  type V64User
} from "@/lib/enterprise/work-os-v64-taskuri-functional";

type SavedViewId = "all" | "my-work" | "in-progress" | "blocked" | "today" | "week" | "no-deadline" | "high-priority" | "overdue" | "waiting-approval";
type Density = "compact" | "medium" | "relaxed";
type ModalKind = "task" | "ticket" | "project" | "approval" | "export" | "handover" | "lesson" | null;

const storageKey = "servelect-work-os-v64-taskuri-functional-state";

const pageMeta: Record<V64PageId, { title: string; subtitle: string; action: string }> = {
  overview: { title: "Taskuri / Overview", subtitle: "Privire de ansamblu asupra activităților, proiectelor și sarcinilor.", action: "Task nou" },
  "my-work": { title: "Taskuri / My Work", subtitle: "Centrul tău de lucru. Fii la curent cu ce contează astăzi.", action: "Task nou" },
  inbox: { title: "Taskuri / Inbox", subtitle: "Inbox personal cu mențiuni, delegări, notificări și acțiuni care necesită răspuns.", action: "Creează item" },
  tickets: { title: "Taskuri / Tickets & Notificări", subtitle: "Gestionarea operațională a ticketelor și notificărilor din proiecte, echipamente și procese.", action: "Ticket nou" },
  "active-projects": { title: "Taskuri / Proiecte active", subtitle: "Execuția proiectelor fotovoltaice — monitorizare și control în timp real.", action: "Task nou" },
  "upcoming-projects": { title: "Taskuri / Proiecte viitoare", subtitle: "Pipeline către execuție. Planifică, resursează și pregătește proiectele înainte de lansare.", action: "Proiect nou" },
  "completed-projects": { title: "Taskuri / Proiecte finalizate", subtitle: "Istoric proiecte finalizate, livrări, documentații, feedback și lecții învățate.", action: "Exportă raport" },
  board: { title: "Taskuri / Board", subtitle: "Vizualizează și gestionează taskurile pe board.", action: "Task nou" },
  table: { title: "Taskuri / Tabel", subtitle: "Vizualizează, filtrează și gestionează toate taskurile într-un tabel avansat.", action: "Task nou" },
  calendar: { title: "Taskuri / Calendar & Gantt", subtitle: "Planificare integrată a taskurilor, proiectelor și resurselor.", action: "Task nou" },
  workload: { title: "Taskuri / Workload & Aprobări", subtitle: "Planificare capacitate echipă, alocare taskuri și gestionare aprobări.", action: "Task nou" }
};

const pagePath: Record<V64PageId, string> = {
  overview: "/taskuri",
  "my-work": "/taskuri/my-work",
  inbox: "/taskuri/inbox",
  tickets: "/taskuri/tickets",
  "active-projects": "/taskuri/proiecte-active",
  "upcoming-projects": "/taskuri/proiecte-viitoare",
  "completed-projects": "/taskuri/proiecte-finalizate",
  board: "/taskuri/board",
  table: "/taskuri/tabel",
  calendar: "/taskuri/calendar",
  workload: "/taskuri/workload"
};

const statuses: V64TaskStatus[] = ["Backlog", "De făcut", "În desfășurare", "Review", "Blocat", "Finalizat"];
const priorities: V64Priority[] = ["Scăzut", "Mediu", "Ridicat", "Urgent", "Critic"];
const ticketStatuses: V64TicketStatus[] = ["În deschidere", "În lucru", "Necesită răspuns", "În așteptare", "Rezolvat", "Escaladat"];

function todayIso(): string {
  return "2024-05-17";
}

function isOverdue(task: V64Task): boolean {
  return task.dueDate < todayIso() && task.status !== "Finalizat";
}

function priorityTone(priority: V64Priority): string {
  if (priority === "Critic" || priority === "Urgent") return "bg-red-50 text-red-700 ring-red-100";
  if (priority === "Ridicat") return "bg-orange-50 text-orange-700 ring-orange-100";
  if (priority === "Mediu") return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-emerald-50 text-emerald-700 ring-emerald-100";
}

function statusTone(status: V64TaskStatus | V64TicketStatus): string {
  if (status === "Finalizat" || status === "Rezolvat") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "În desfășurare" || status === "În lucru" || status === "În deschidere") return "bg-blue-50 text-blue-700 ring-blue-100";
  if (status === "Blocat" || status === "Escaladat") return "bg-red-50 text-red-700 ring-red-100";
  if (status === "Review" || status === "În așteptare" || status === "Necesită răspuns") return "bg-violet-50 text-violet-700 ring-violet-100";
  if (status === "Planificat") return "bg-sky-50 text-sky-700 ring-sky-100";
  return "bg-slate-50 text-slate-700 ring-slate-100";
}

function formatRon(value: number): string {
  return new Intl.NumberFormat("ro-RO").format(value);
}

function minToSla(minutes: number): string {
  if (minutes < 0) return `-${Math.abs(Math.floor(minutes / 60))}h ${Math.abs(minutes % 60)}m`;
  if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function useV64TaskuriState() {
  const [currentUserId, setCurrentUserId] = useState("u1");
  const [tasks, setTasks] = useState<V64Task[]>(v64Tasks);
  const [tickets, setTickets] = useState<V64Ticket[]>(v64Tickets);
  const [projects, setProjects] = useState<V64Project[]>(v64Projects);
  const [approvals, setApprovals] = useState<V64Approval[]>(v64Approvals);
  const [notifications, setNotifications] = useState<V64Notification[]>(v64Notifications);
  const [savedViews, setSavedViews] = useState<Array<{ id: string; label: string; filters: FilterState }>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          currentUserId?: string;
          tasks?: V64Task[];
          tickets?: V64Ticket[];
          projects?: V64Project[];
          approvals?: V64Approval[];
          notifications?: V64Notification[];
          savedViews?: Array<{ id: string; label: string; filters: FilterState }>;
        };
        if (parsed.currentUserId) setCurrentUserId(parsed.currentUserId);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.tickets) setTickets(parsed.tickets);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.approvals) setApprovals(parsed.approvals);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.savedViews) setSavedViews(parsed.savedViews);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ currentUserId, tasks, tickets, projects, approvals, notifications, savedViews }));
  }, [loaded, currentUserId, tasks, tickets, projects, approvals, notifications, savedViews]);

  const currentUser = v64UserById(currentUserId) ?? v64Users[0];

  function addNotification(userId: string, title: string, message: string, entityType: V64Notification["entityType"], entityId: string, type: V64Notification["type"] = "system_alert") {
    setNotifications((items) => [
      { id: `N-${Date.now()}`, userId, type, title, message, entityType, entityId, read: false, createdAt: new Date().toISOString() },
      ...items
    ]);
  }

  function addActivity(taskId: string, action: string, detail: string, actorId = currentUser.id) {
    setTasks((items) => items.map((task) => task.id === taskId ? {
      ...task,
      activityLog: [{ id: `act-${Date.now()}`, actorId, action, detail, createdAt: new Date().toISOString() }, ...task.activityLog]
    } : task));
  }

  function updateTask(taskId: string, patch: Partial<V64Task>) {
    setTasks((items) => items.map((task) => {
      if (task.id !== taskId) return task;
      return { ...task, ...patch, activityLog: [{ id: `act-${Date.now()}`, actorId: currentUser.id, action: "update", detail: "Task actualizat din drawer / tabel / board", createdAt: new Date().toISOString() }, ...task.activityLog] };
    }));
  }

  function changeTaskStatus(taskId: string, status: V64TaskStatus) {
    const task = tasks.find((item) => item.id === taskId);
    updateTask(taskId, { status, progress: status === "Finalizat" ? 100 : status === "În desfășurare" ? Math.max(task?.progress ?? 0, 35) : task?.progress ?? 0 });
    if (task) {
      const manager = v64UserById(task.ownerId) ?? currentUser;
      addNotification(manager.id, "Status task modificat", `${task.title} este acum ${status}.`, "task", taskId, status === "Blocat" ? "task_overdue" : "task_assigned");
    }
  }

  function assignTask(taskId: string, assigneeId: string) {
    const task = tasks.find((item) => item.id === taskId);
    const target = v64UserById(assigneeId);
    if (!task || !target || !v64CanAssignTask(currentUser, task, target)) return false;
    updateTask(taskId, { assigneeId, departmentId: target.departmentId, departmentName: target.departmentName });
    addNotification(target.id, "Task asignat", `${currentUser.name} ți-a asignat taskul ${task.title}.`, "task", taskId, "task_assigned");
    return true;
  }

  function addComment(taskId: string, body: string) {
    if (!body.trim()) return;
    setTasks((items) => items.map((task) => task.id === taskId ? {
      ...task,
      comments: [{ id: `c-${Date.now()}`, authorId: currentUser.id, body, createdAt: new Date().toISOString() }, ...task.comments],
      activityLog: [{ id: `act-${Date.now()}`, actorId: currentUser.id, action: "comment", detail: "Comentariu adăugat", createdAt: new Date().toISOString() }, ...task.activityLog]
    } : task));
  }

  function toggleChecklist(taskId: string, checklistId: string) {
    setTasks((items) => items.map((task) => task.id === taskId ? {
      ...task,
      checklist: task.checklist.map((item) => item.id === checklistId ? { ...item, done: !item.done } : item),
      activityLog: [{ id: `act-${Date.now()}`, actorId: currentUser.id, action: "checklist", detail: "Checklist actualizat", createdAt: new Date().toISOString() }, ...task.activityLog]
    } : task));
  }

  function addAttachment(taskId: string) {
    setTasks((items) => items.map((task) => task.id === taskId ? {
      ...task,
      attachments: [{ id: `att-${Date.now()}`, name: "document_mock.pdf", type: "pdf", size: "0.8 MB", uploadedBy: currentUser.id, createdAt: new Date().toISOString() }, ...task.attachments],
      activityLog: [{ id: `act-${Date.now()}`, actorId: currentUser.id, action: "attachment", detail: "Atașament mock adăugat", createdAt: new Date().toISOString() }, ...task.activityLog]
    } : task));
  }

  function createTask(status: V64TaskStatus = "De făcut") {
    const project = projects[0];
    const newTask: V64Task = {
      id: `TASK-${Date.now()}`,
      title: "Task nou Servelect",
      description: "Task creat rapid din Taskuri v6.4.",
      projectId: project.id,
      projectCode: project.code,
      projectName: project.name,
      client: project.client,
      type: "Task",
      status,
      priority: "Mediu",
      assigneeId: currentUser.id,
      ownerId: currentUser.id,
      createdBy: currentUser.id,
      departmentId: currentUser.departmentId,
      departmentName: currentUser.departmentName,
      startDate: todayIso(),
      dueDate: "2024-06-05",
      estimateHours: 2,
      trackedHours: 0,
      progress: 0,
      tags: ["nou"],
      checklist: [],
      subtasks: [],
      comments: [],
      attachments: [],
      dependencies: [],
      watchers: [currentUser.id],
      approvalStatus: "pending",
      customFields: { Sursă: "Quick create" },
      activityLog: [{ id: `act-${Date.now()}`, actorId: currentUser.id, action: "created", detail: "Task creat rapid", createdAt: new Date().toISOString() }]
    };
    setTasks((items) => [newTask, ...items]);
    return newTask.id;
  }

  function deleteTasks(ids: string[]) {
    setTasks((items) => items.filter((task) => !ids.includes(task.id)));
  }

  function bulkUpdate(ids: string[], patch: Partial<V64Task>) {
    setTasks((items) => items.map((task) => ids.includes(task.id) ? { ...task, ...patch, activityLog: [{ id: `act-${Date.now()}`, actorId: currentUser.id, action: "bulk", detail: "Bulk action aplicată", createdAt: new Date().toISOString() }, ...task.activityLog] } : task));
  }

  function updateTicket(ticketId: string, patch: Partial<V64Ticket>) {
    setTickets((items) => items.map((ticket) => ticket.id === ticketId ? { ...ticket, ...patch } : ticket));
  }

  function createTicket() {
    setTickets((items) => [{ id: `T-${Date.now()}`, type: "Sistem", subject: "Ticket nou creat manual", projectId: "p1", projectCode: "P-2024-0187", projectName: "Halo Depot - Cluj", ownerId: currentUser.id, departmentId: currentUser.departmentId, priority: "Mediu", slaMinutes: 480, status: "În deschidere", unread: true, escalated: false, createdAt: new Date().toISOString() }, ...items]);
  }

  function escalateTicket(ticketId: string) {
    const ticket = tickets.find((item) => item.id === ticketId);
    updateTicket(ticketId, { escalated: true, status: "Escaladat", priority: "Critic" });
    if (ticket) addNotification(currentUser.managerId ?? "u1", "Ticket escaladat", `${ticket.subject} a fost escaladat.`, "ticket", ticketId, "ticket_escalated");
  }

  function decideApproval(approvalId: string, status: "approved" | "rejected") {
    setApprovals((items) => items.map((approval) => approval.id === approvalId ? { ...approval, status, decidedAt: new Date().toISOString(), decisionNote: status === "approved" ? "Aprobat din Workload & Aprobări" : "Respins din Workload & Aprobări" } : approval));
    const approval = approvals.find((item) => item.id === approvalId);
    if (approval) addNotification(approval.requestedBy, status === "approved" ? "Aprobare acceptată" : "Aprobare respinsă", approval.title, "approval", approvalId, "approval_decided");
  }

  function toggleKickoff(projectId: string, itemId: string) {
    setProjects((items) => items.map((project) => project.id === projectId ? { ...project, kickoffChecklist: project.kickoffChecklist.map((item) => item.id === itemId ? { ...item, done: !item.done } : item) } : project));
  }

  function markNotificationRead(notificationId: string) {
    setNotifications((items) => items.map((notification) => notification.id === notificationId ? { ...notification, read: true } : notification));
  }

  function markAllNotificationsRead() {
    setNotifications((items) => items.map((notification) => ({ ...notification, read: true })));
  }

  function saveView(label: string, filters: FilterState) {
    setSavedViews((items) => [{ id: `view-${Date.now()}`, label, filters }, ...items]);
  }

  return {
    currentUser,
    setCurrentUserId,
    tasks,
    tickets,
    projects,
    approvals,
    notifications,
    savedViews,
    updateTask,
    changeTaskStatus,
    assignTask,
    addComment,
    toggleChecklist,
    addAttachment,
    createTask,
    deleteTasks,
    bulkUpdate,
    updateTicket,
    createTicket,
    escalateTicket,
    decideApproval,
    toggleKickoff,
    markNotificationRead,
    markAllNotificationsRead,
    saveView
  };
}

interface FilterState {
  query: string;
  projectId: string;
  status: string;
  priority: string;
  assigneeId: string;
  ownerId: string;
  type: string;
  departmentId: string;
  savedView: SavedViewId;
}

const defaultFilters: FilterState = {
  query: "",
  projectId: "all",
  status: "all",
  priority: "all",
  assigneeId: "all",
  ownerId: "all",
  type: "all",
  departmentId: "all",
  savedView: "all"
};

export function V64TaskuriFunctionalArea({ pageId }: { pageId: V64PageId }) {
  const store = useV64TaskuriState();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [density, setDensity] = useState<Density>("medium");
  const [modal, setModal] = useState<ModalKind>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ kind?: ModalKind }>;
      setModal(custom.detail?.kind ?? "project");
    };
    window.addEventListener("v64-open-action-modal", handler);
    return () => window.removeEventListener("v64-open-action-modal", handler);
  }, []);

  const visibleTasks = useMemo(() => store.tasks.filter((task) => v64CanViewTask(store.currentUser, task)), [store.tasks, store.currentUser]);
  const filteredTasks = useMemo(() => filterTasks(visibleTasks, filters, store.currentUser), [visibleTasks, filters, store.currentUser]);
  const selectedTask = useMemo(() => store.tasks.find((task) => task.id === selectedTaskId) ?? null, [store.tasks, selectedTaskId]);
  const unread = store.notifications.filter((item) => !item.read && item.userId === store.currentUser.id).length;
  const meta = pageMeta[pageId];

  function openTask(taskId: string) {
    setSelectedTaskId(taskId);
  }

  function toast(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2200);
  }

  function handleQuickCreate() {
    if (pageId === "tickets") {
      store.createTicket();
      toast("Ticket nou creat și salvat în localStorage.");
      return;
    }
    const taskId = store.createTask(pageId === "board" ? "Backlog" : "De făcut");
    setSelectedTaskId(taskId);
    toast("Task nou creat și deschis în drawer.");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="mx-auto max-w-[1880px] space-y-5 px-4 py-5 lg:px-7">
        <TaskuriTopbar meta={meta} currentUser={store.currentUser} unread={unread} onCreate={handleQuickCreate} onSearch={(query) => setFilters((state) => ({ ...state, query }))} onMarkAll={store.markAllNotificationsRead} onSwitchUser={store.setCurrentUserId} />
        <KpiStrip pageId={pageId} currentUser={store.currentUser} tasks={visibleTasks} tickets={store.tickets} projects={store.projects} approvals={store.approvals} />
        {pageId === "board" || pageId === "table" ? (
          <FiltersBar filters={filters} setFilters={setFilters} saveView={() => { store.saveView(`Vedere ${store.savedViews.length + 1}`, filters); toast("Vedere salvată în localStorage."); }} savedViews={store.savedViews} />
        ) : null}
        {message ? <div className="fixed right-6 top-6 z-50 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-black text-emerald-700 shadow-2xl">{message}</div> : null}
        {renderPage(pageId, { store, tasks: filteredTasks, visibleTasks, filters, setFilters, selectedRows, setSelectedRows, density, setDensity, openTask, setModal, toast })}
        <TaskuriReferenceFooter />
      </div>
      <TaskDrawer task={selectedTask} currentUser={store.currentUser} onClose={() => setSelectedTaskId(null)} onUpdate={store.updateTask} onAssign={store.assignTask} onStatus={store.changeTaskStatus} onComment={store.addComment} onChecklist={store.toggleChecklist} onAttachment={store.addAttachment} />
      <ActionModal kind={modal} onClose={() => setModal(null)} />
    </div>
  );
}

function filterTasks(tasks: V64Task[], filters: FilterState, currentUser: V64User): V64Task[] {
  return tasks.filter((task) => {
    const query = filters.query.trim().toLowerCase();
    if (query && ![task.title, task.projectCode, task.projectName, task.client, task.departmentName, task.tags.join(" ")].join(" ").toLowerCase().includes(query)) return false;
    if (filters.projectId !== "all" && task.projectId !== filters.projectId) return false;
    if (filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.priority !== "all" && task.priority !== filters.priority) return false;
    if (filters.assigneeId !== "all" && task.assigneeId !== filters.assigneeId) return false;
    if (filters.ownerId !== "all" && task.ownerId !== filters.ownerId) return false;
    if (filters.type !== "all" && task.type !== filters.type) return false;
    if (filters.departmentId !== "all" && task.departmentId !== filters.departmentId) return false;
    if (filters.savedView === "my-work" && task.assigneeId !== currentUser.id) return false;
    if (filters.savedView === "in-progress" && task.status !== "În desfășurare") return false;
    if (filters.savedView === "blocked" && task.status !== "Blocat") return false;
    if (filters.savedView === "today" && task.dueDate !== todayIso()) return false;
    if (filters.savedView === "week" && task.dueDate > "2024-05-24") return false;
    if (filters.savedView === "no-deadline" && task.dueDate) return false;
    if (filters.savedView === "high-priority" && !["Urgent", "Critic", "Ridicat"].includes(task.priority)) return false;
    if (filters.savedView === "overdue" && !isOverdue(task)) return false;
    if (filters.savedView === "waiting-approval" && task.approvalStatus !== "pending") return false;
    return true;
  });
}

interface PageContext {
  store: ReturnType<typeof useV64TaskuriState>;
  tasks: V64Task[];
  visibleTasks: V64Task[];
  filters: FilterState;
  setFilters: (value: FilterState | ((state: FilterState) => FilterState)) => void;
  selectedRows: string[];
  setSelectedRows: (rows: string[] | ((rows: string[]) => string[])) => void;
  density: Density;
  setDensity: (density: Density) => void;
  openTask: (taskId: string) => void;
  setModal: (kind: ModalKind) => void;
  toast: (text: string) => void;
}

function renderPage(pageId: V64PageId, ctx: PageContext): ReactNode {
  if (pageId === "my-work") return <MyWorkPage {...ctx} />;
  if (pageId === "inbox") return <InboxPage {...ctx} />;
  if (pageId === "tickets") return <TicketsPage {...ctx} />;
  if (pageId === "active-projects") return <ActiveProjectsPage {...ctx} />;
  if (pageId === "upcoming-projects") return <UpcomingProjectsPage {...ctx} />;
  if (pageId === "completed-projects") return <CompletedProjectsPage {...ctx} />;
  if (pageId === "board") return <BoardPage {...ctx} />;
  if (pageId === "table") return <TablePage {...ctx} />;
  if (pageId === "calendar") return <CalendarGanttPage {...ctx} />;
  if (pageId === "workload") return <WorkloadApprovalsPage {...ctx} />;
  return <OverviewPage {...ctx} />;
}

function TaskuriTopbar({ meta, currentUser, unread, onCreate, onSearch, onMarkAll, onSwitchUser }: { meta: { title: string; subtitle: string; action: string }; currentUser: V64User; unread: number; onCreate: () => void; onSearch: (query: string) => void; onMarkAll: () => void; onSwitchUser: (id: string) => void }) {
  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-[28px] font-black tracking-tight text-slate-950">{meta.title}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{meta.subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-11 min-w-[360px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input aria-label="Caută" onChange={(event) => onSearch(event.target.value)} className="h-full flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" placeholder="Caută proiecte, taskuri, clienți, activități..." />
          <kbd className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">⌘ K</kbd>
        </div>
        <button onClick={onMarkAll} className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:bg-slate-50" title="Marchează notificările ca citite"><Bell className="h-5 w-5 text-slate-700" />{unread ? <span className="absolute -right-1 -top-1 rounded-full bg-emerald-600 px-1.5 text-[10px] font-black text-white">{unread}</span> : null}</button>
        <select value={currentUser.id} onChange={(event) => onSwitchUser(event.target.value)} className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black shadow-sm">
          {v64Users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.role}</option>)}
        </select>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Avatar user={currentUser} />
          <div className="hidden leading-tight md:block"><div className="text-sm font-black">{currentUser.name}</div><div className="text-[11px] font-bold text-slate-500">{currentUser.role}</div></div>
        </div>
        <button onClick={onCreate} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800"><Plus className="h-4 w-4" />{meta.action}</button>
      </div>
    </header>
  );
}

function KpiStrip({ pageId, currentUser, tasks, tickets, projects, approvals }: { pageId: V64PageId; currentUser: V64User; tasks: V64Task[]; tickets: V64Ticket[]; projects: V64Project[]; approvals: V64Approval[] }) {
  const completedProjects = projects.filter((project) => project.status === "completed");
  const upcomingProjects = projects.filter((project) => project.status === "upcoming");
  const activeProjects = projects.filter((project) => project.status === "active");
  const map: Record<V64PageId, Array<{ label: string; value: string; sub: string; tone: string; icon: ReactNode }>> = {
    overview: [
      { label: "Taskuri totale", value: String(tasks.length), sub: "+12% față de luna trecută", tone: "green", icon: <FolderKanban /> },
      { label: "În lucru", value: String(tasks.filter((t) => t.status === "În desfășurare").length), sub: "48% din total", tone: "blue", icon: <Clock /> },
      { label: "Finalizate", value: String(tasks.filter((t) => t.status === "Finalizat").length), sub: "+20% luna aceasta", tone: "purple", icon: <CheckCircle2 /> },
      { label: "Întârziate", value: String(tasks.filter(isOverdue).length), sub: "necesită acțiune", tone: "red", icon: <AlertCircle /> },
      { label: "Ore planificate", value: `${Math.round(tasks.reduce((s, t) => s + t.estimateHours, 0))} h`, sub: "estimare totală", tone: "green", icon: <Timer /> }
    ],
    "my-work": [
      { label: "Asignate mie", value: String(tasks.filter((t) => t.assigneeId === currentUser.id).length), sub: "din taskuri vizibile", tone: "green", icon: <CalendarDays /> },
      { label: "Create de mine", value: String(tasks.filter((t) => t.createdBy === currentUser.id).length), sub: "din total", tone: "blue", icon: <FileText /> },
      { label: "În review", value: String(tasks.filter((t) => t.status === "Review").length), sub: "în așteptare", tone: "purple", icon: <Settings2 /> },
      { label: "Întârziate", value: String(tasks.filter(isOverdue).length), sub: "azi", tone: "red", icon: <AlertCircle /> },
      { label: "Timp înregistrat", value: `${tasks.reduce((s, t) => s + t.trackedHours, 0).toFixed(1)}h`, sub: "din obiectiv", tone: "orange", icon: <Clock /> }
    ],
    inbox: [
      { label: "Inbox nou", value: String(tickets.filter((t) => t.unread).length), sub: "necitite", tone: "blue", icon: <Bell /> },
      { label: "Mențiuni", value: "6", sub: "comentarii recente", tone: "green", icon: <MessageSquare /> },
      { label: "Delegate", value: String(tasks.filter((t) => t.ownerId === currentUser.id).length), sub: "urmărire", tone: "purple", icon: <Users /> },
      { label: "Aprobări", value: String(approvals.filter((a) => a.status === "pending").length), sub: "pending", tone: "orange", icon: <ListChecks /> },
      { label: "Alerte", value: String(tickets.filter((t) => t.priority === "Critic").length), sub: "critice", tone: "red", icon: <ShieldAlert /> }
    ],
    tickets: [
      { label: "Tickete deschise", value: String(tickets.length), sub: "+18% față de luna trecută", tone: "green", icon: <Users /> },
      { label: "Critice", value: String(tickets.filter((t) => t.priority === "Critic").length), sub: "necesită escaladare", tone: "red", icon: <ShieldAlert /> },
      { label: "Necesită răspuns", value: String(tickets.filter((t) => t.status === "Necesită răspuns").length), sub: "client/furnizor", tone: "orange", icon: <MessageSquare /> },
      { label: "Notificări noi", value: String(tickets.filter((t) => t.unread).length), sub: "necitite", tone: "blue", icon: <Bell /> },
      { label: "SLA în risc", value: String(tickets.filter((t) => t.slaMinutes < 480).length), sub: "sub 8h", tone: "red", icon: <Clock /> }
    ],
    "active-projects": [
      { label: "Proiecte active", value: String(activeProjects.length), sub: "din proiecte", tone: "green", icon: <FolderKanban /> },
      { label: "Milestones active", value: "54", sub: "din 96 totale", tone: "blue", icon: <Flag /> },
      { label: "Taskuri în lucru", value: String(tasks.filter((t) => t.status === "În desfășurare").length), sub: "execuție", tone: "orange", icon: <Clock /> },
      { label: "Taskuri blocate", value: String(tasks.filter((t) => t.status === "Blocat").length), sub: "critice", tone: "red", icon: <AlertCircle /> },
      { label: "Buget consumat", value: "32,4 mil. RON", sub: "din 101,7 mil.", tone: "green", icon: <Archive /> }
    ],
    "upcoming-projects": [
      { label: "Proiecte viitoare", value: String(upcomingProjects.length), sub: "următoarele 90 zile", tone: "green", icon: <FolderKanban /> },
      { label: "În pregătire", value: "12", sub: "proiecte", tone: "orange", icon: <Clock /> },
      { label: "Kickoff săptămâna aceasta", value: "5", sub: "proiecte", tone: "blue", icon: <Users /> },
      { label: "Resurse rezervate", value: "18,6 MWp", sub: "capacitate planificată", tone: "purple", icon: <CalendarDays /> },
      { label: "Riscuri de pornire", value: "3", sub: "proiecte", tone: "red", icon: <ShieldAlert /> }
    ],
    "completed-projects": [
      { label: "Proiecte finalizate", value: String(completedProjects.length), sub: "istoric", tone: "green", icon: <FolderKanban /> },
      { label: "Livrate luna aceasta", value: "12", sub: "proiecte", tone: "blue", icon: <CheckCircle2 /> },
      { label: "Documentații închise", value: "89", sub: "dosare", tone: "purple", icon: <FileText /> },
      { label: "Facturare finală", value: "9,45 mil. RON", sub: "de facturat", tone: "red", icon: <Archive /> },
      { label: "Feedback clienți", value: "4.8 / 5", sub: "64 evaluări", tone: "green", icon: <Star /> }
    ],
    board: [
      { label: "Total taskuri", value: String(tasks.length), sub: "100% din total", tone: "purple", icon: <LayoutDashboard /> },
      { label: "De făcut", value: String(tasks.filter((t) => t.status === "De făcut").length), sub: "în backlog", tone: "slate", icon: <Circle /> },
      { label: "În lucru", value: String(tasks.filter((t) => t.status === "În desfășurare").length), sub: "active", tone: "blue", icon: <Clock /> },
      { label: "Review / QA", value: String(tasks.filter((t) => t.status === "Review").length), sub: "review", tone: "orange", icon: <Eye /> },
      { label: "Finalizate", value: String(tasks.filter((t) => t.status === "Finalizat").length), sub: "done", tone: "green", icon: <CheckCircle2 /> }
    ],
    table: [
      { label: "Toate taskurile", value: String(tasks.length), sub: "în tabel", tone: "green", icon: <Table2 /> },
      { label: "Selectabile", value: "multi", sub: "bulk actions", tone: "blue", icon: <CheckCircle2 /> },
      { label: "Blocate", value: String(tasks.filter((t) => t.status === "Blocat").length), sub: "necesită decizie", tone: "red", icon: <AlertCircle /> },
      { label: "Cu dependențe", value: String(tasks.filter((t) => t.dependencies.length).length), sub: "dependency graph", tone: "purple", icon: <GitBranch /> },
      { label: "High priority", value: String(tasks.filter((t) => ["Urgent", "Critic", "Ridicat"].includes(t.priority)).length), sub: "de urmărit", tone: "orange", icon: <Flag /> }
    ],
    calendar: [
      { label: "Deadline-uri săptămâna aceasta", value: "24", sub: "active", tone: "green", icon: <CalendarDays /> },
      { label: "Milestones", value: "7", sub: "în calendar", tone: "blue", icon: <Flag /> },
      { label: "Evenimente", value: "18", sub: "programate", tone: "purple", icon: <Clock /> },
      { label: "Overdue", value: String(tasks.filter(isOverdue).length), sub: "de rezolvat", tone: "red", icon: <AlertCircle /> },
      { label: "Utilizare echipă", value: "78%", sub: "capacitate", tone: "green", icon: <Users /> }
    ],
    workload: [
      { label: "Capacitate echipă", value: "1.240 h", sub: "din 1.680 disponibile", tone: "green", icon: <Users /> },
      { label: "Supraîncărcați", value: "6", sub: "persoane", tone: "red", icon: <AlertCircle /> },
      { label: "Taskuri nealocate", value: String(tasks.filter((t) => !t.assigneeId).length), sub: "necesită owner", tone: "blue", icon: <Users /> },
      { label: "Aprobări în așteptare", value: String(approvals.filter((a) => a.status === "pending").length), sub: "solicitări", tone: "purple", icon: <ListChecks /> },
      { label: "Timp înregistrat", value: `${Math.round(tasks.reduce((s, t) => s + t.trackedHours, 0))} h`, sub: "săptămâna aceasta", tone: "blue", icon: <Clock /> }
    ]
  };
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{map[pageId].map((kpi) => <Kpi key={kpi.label} {...kpi} />)}</section>;
}

function Kpi({ label, value, sub, tone, icon }: { label: string; value: string; sub: string; tone: string; icon: ReactNode }) {
  const toneMap: Record<string, string> = { green: "bg-emerald-50 text-emerald-700", blue: "bg-blue-50 text-blue-700", purple: "bg-violet-50 text-violet-700", orange: "bg-orange-50 text-orange-700", red: "bg-red-50 text-red-700", slate: "bg-slate-50 text-slate-700" };
  const bar = tone === "red" ? "bg-red-500" : tone === "orange" ? "bg-orange-500" : tone === "purple" ? "bg-violet-500" : tone === "blue" ? "bg-blue-500" : "bg-emerald-500";
  return (
    <article className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneMap[tone]}`}>{icon}</div><Sparkline className={bar} /></div>
      <div className="mt-4 text-xs font-black text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
      <div className="mt-2 text-xs font-bold text-emerald-600">↗ {sub}</div>
    </article>
  );
}

function Sparkline({ className }: { className: string }) {
  return <div className="flex h-9 items-end gap-1">{[13, 16, 12, 21, 19, 25, 23, 31].map((h, index) => <span key={`${h}-${index}`} className={`w-1.5 rounded-full opacity-75 ${className}`} style={{ height: h }} />)}</div>;
}

function TaskuriSubnav({ pageId }: { pageId: V64PageId }) {
  const items: Array<{ id: V64PageId; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "my-work", label: "My Work" },
    { id: "inbox", label: "Inbox" },
    { id: "tickets", label: "Tickets" },
    { id: "active-projects", label: "Proiecte active" },
    { id: "upcoming-projects", label: "Proiecte viitoare" },
    { id: "completed-projects", label: "Proiecte finalizate" },
    { id: "board", label: "Board" },
    { id: "table", label: "Tabel" },
    { id: "calendar", label: "Calendar" },
    { id: "workload", label: "Workload" }
  ];
  return <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">{items.map((item) => <Link key={item.id} href={pagePath[item.id]} className={item.id === pageId ? "whitespace-nowrap rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" : "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}>{item.label}</Link>)}</div>;
}

function FiltersBar({ filters, setFilters, saveView, savedViews }: { filters: FilterState; setFilters: (value: FilterState | ((state: FilterState) => FilterState)) => void; saveView: () => void; savedViews: Array<{ id: string; label: string; filters: FilterState }> }) {
  function applySavedView(value: string) {
    const saved = savedViews.find((view) => view.id === value);
    if (saved) {
      setFilters(saved.filters);
      return;
    }
    setFilters((state) => ({ ...state, savedView: value as SavedViewId }));
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Select label="Vederi salvate" value={filters.savedView} onChange={applySavedView} options={[...(["all", "my-work", "in-progress", "blocked", "today", "week", "no-deadline", "high-priority", "overdue", "waiting-approval"] as SavedViewId[]).map((value) => ({ value, label: value === "all" ? "Toate taskurile" : value })), ...savedViews.map((view) => ({ value: view.id, label: view.label }))]} />
        <Select label="Project" value={filters.projectId} onChange={(value) => setFilters((state) => ({ ...state, projectId: value }))} options={[{ value: "all", label: "Toate" }, ...v64Projects.map((project) => ({ value: project.id, label: project.code }))]} />
        <Select label="Status" value={filters.status} onChange={(value) => setFilters((state) => ({ ...state, status: value }))} options={[{ value: "all", label: "Toate" }, ...statuses.map((status) => ({ value: status, label: status }))]} />
        <Select label="Prioritate" value={filters.priority} onChange={(value) => setFilters((state) => ({ ...state, priority: value }))} options={[{ value: "all", label: "Toate" }, ...priorities.map((priority) => ({ value: priority, label: priority }))]} />
        <Select label="Assignee" value={filters.assigneeId} onChange={(value) => setFilters((state) => ({ ...state, assigneeId: value }))} options={[{ value: "all", label: "Toți" }, ...v64Users.map((user) => ({ value: user.id, label: user.name }))]} />
        <Select label="Departament" value={filters.departmentId} onChange={(value) => setFilters((state) => ({ ...state, departmentId: value }))} options={[{ value: "all", label: "Toate" }, ...v64Departments.map((department) => ({ value: department.id, label: department.name }))]} />
        <button onClick={() => setFilters(defaultFilters)} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-500 hover:bg-slate-50"><X className="mr-1 inline h-3.5 w-3.5" />Șterge filtrele</button>
        <button onClick={saveView} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-black text-emerald-700 hover:bg-emerald-50">+ Salvează vedere</button>
        {savedViews.length ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{savedViews.length} vederi salvate</span> : null}
      </div>
    </section>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-500"><span>{label}:</span><select value={value} onChange={(event) => onChange(event.target.value)} className="bg-transparent font-black text-slate-700 outline-none">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function Panel({ title, badge, children, action }: { title: string; badge?: string | number; children: ReactNode; action?: ReactNode }) {
  const defaultAction = (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("v64-open-action-modal", { detail: { kind: "project" } }))}
      className="text-xs font-black text-emerald-700 hover:text-emerald-900"
    >
      Vezi toate
    </button>
  );
  return <section className="rounded-[1.35rem] border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-2"><h2 className="text-base font-black text-slate-950">{title}</h2>{badge !== undefined ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700">{badge}</span> : null}</div>{action ?? defaultAction}</div><div className="p-5">{children}</div></section>;
}

function OverviewPage(ctx: PageContext) {
  const overdue = ctx.tasks.filter(isOverdue);
  return <div className="grid gap-5 xl:grid-cols-[300px_1.1fr_1fr_340px]">
    <Panel title="Tickets & Notificări" badge={ctx.store.tickets.filter((ticket) => ticket.unread).length}><TicketSummary tickets={ctx.store.tickets} onClick={(ticket) => { if (ticket.linkedTaskId) ctx.openTask(ticket.linkedTaskId); }} /></Panel>
    <Panel title="My Tasks / Inbox" badge={ctx.tasks.length}><TaskMiniTable tasks={ctx.tasks.slice(0, 5)} onOpen={ctx.openTask} /></Panel>
    <Panel title="Proiecte active" badge={ctx.store.projects.filter((project) => project.status === "active").length}><ProjectProgressList projects={ctx.store.projects.filter((project) => project.status === "active")} /></Panel>
    <Panel title="Taskuri Întârziate" badge={overdue.length}><AlertList tasks={overdue} onOpen={ctx.openTask} /></Panel>
    <Panel title="Proiecte viitoare" badge="5"><ProjectMiniRows projects={ctx.store.projects.filter((project) => project.status === "upcoming")} /></Panel>
    <Panel title="Proiecte finalizate" badge="5"><ProjectMiniRows projects={ctx.store.projects.filter((project) => project.status === "completed")} /></Panel>
    <Panel title="Activitatea echipei"><ActivityRows tasks={ctx.visibleTasks} /></Panel>
    <Panel title="Workload echipă"><WorkloadMini tasks={ctx.visibleTasks} /></Panel>
    <div className="xl:col-span-4"><Panel title="Ticket-uri prioritare" badge="5"><HorizontalTickets tickets={ctx.store.tickets} onOpen={ctx.store.escalateTicket} /></Panel></div>
  </div>;
}

function MyWorkPage(ctx: PageContext) {
  const mine = ctx.tasks.filter((task) => task.assigneeId === ctx.store.currentUser.id || task.ownerId === ctx.store.currentUser.id || task.watchers.includes(ctx.store.currentUser.id));
  return <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
    <Panel title="My Tasks / Inbox" badge={mine.length} action={<SegmentedFilters setFilters={ctx.setFilters} />}><TaskMiniTable tasks={mine} onOpen={ctx.openTask} /></Panel>
    <div className="space-y-5"><Panel title="Astăzi"><Agenda tasks={mine} onOpen={ctx.openTask} /></Panel><Panel title="Mențiuni recente"><Mentions notifications={ctx.store.notifications} markRead={ctx.store.markNotificationRead} /></Panel><Panel title="Creează rapid"><QuickCreate create={ctx.store.createTask} ticket={ctx.store.createTicket} toast={ctx.toast} /></Panel></div>
    <Panel title="Delegated by me" badge={mine.filter((task) => task.ownerId === ctx.store.currentUser.id).length}><TaskMiniTable compact tasks={mine.filter((task) => task.ownerId === ctx.store.currentUser.id)} onOpen={ctx.openTask} /></Panel>
    <Panel title="Taskuri urmărite" badge={mine.filter((task) => task.watchers.includes(ctx.store.currentUser.id)).length}><TaskMiniTable compact tasks={mine.filter((task) => task.watchers.includes(ctx.store.currentUser.id))} onOpen={ctx.openTask} /></Panel>
    <Panel title="Activitatea mea recentă"><ActivityRows tasks={mine} /></Panel>
  </div>;
}

function InboxPage(ctx: PageContext) {
  const inboxTasks = ctx.tasks.filter((task) => task.assigneeId === ctx.store.currentUser.id || task.approvalStatus === "pending" || task.status === "Review" || isOverdue(task));
  return <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
    <Panel title="Inbox operațional" badge={inboxTasks.length}><TaskMiniTable tasks={inboxTasks} onOpen={ctx.openTask} /></Panel>
    <div className="space-y-5"><Panel title="Notificări necitite"><Mentions notifications={ctx.store.notifications.filter((item) => !item.read)} markRead={ctx.store.markNotificationRead} /></Panel><Panel title="Aprobări care așteaptă"><ApprovalList approvals={ctx.store.approvals} decide={ctx.store.decideApproval} /></Panel></div>
    <Panel title="Mențiuni și comentarii"><ActivityRows tasks={inboxTasks} /></Panel>
    <Panel title="Filtre Inbox"><QuickFilters setFilters={ctx.setFilters} /></Panel>
  </div>;
}

function TicketsPage(ctx: PageContext) {
  return <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
    <Panel title="Coada ticketelor" badge={ctx.store.tickets.length} action={<button onClick={() => { ctx.store.createTicket(); ctx.toast("Ticket creat."); }} className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white">Ticket nou</button>}><TicketsTable tickets={ctx.store.tickets} update={ctx.store.updateTicket} escalate={ctx.store.escalateTicket} openTask={ctx.openTask} /></Panel>
    <div className="space-y-5"><Panel title="Action required" badge={ctx.store.tickets.filter((ticket) => ticket.priority === "Critic" || ticket.slaMinutes < 480).length}><TicketActions tickets={ctx.store.tickets} escalate={ctx.store.escalateTicket} /></Panel><Panel title="Escaladări" badge={ctx.store.tickets.filter((ticket) => ticket.escalated).length}><TicketEscalations tickets={ctx.store.tickets} /></Panel><Panel title="Filtre quick views"><TicketQuickViews /></Panel></div>
    <Panel title="Tickete prioritare"><TicketsTable compact tickets={ctx.store.tickets.filter((ticket) => ticket.priority !== "Scăzut")} update={ctx.store.updateTicket} escalate={ctx.store.escalateTicket} openTask={ctx.openTask} /></Panel>
    <Panel title="Audit / Activitate recentă"><ActivityRows tasks={ctx.visibleTasks} /></Panel>
  </div>;
}

function ActiveProjectsPage(ctx: PageContext) {
  const active = ctx.store.projects.filter((project) => project.status === "active");
  return <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
    <Panel title="Proiecte active" badge={active.length}><ProjectTable projects={active} tasks={ctx.visibleTasks} openTask={ctx.openTask} /></Panel>
    <div className="space-y-5"><Panel title="Taskuri urgente" badge={ctx.tasks.filter((task) => task.priority === "Urgent" || isOverdue(task)).length}><AlertList tasks={ctx.tasks.filter((task) => task.priority === "Urgent" || isOverdue(task))} onOpen={ctx.openTask} /></Panel><Panel title="Aprobări în așteptare" badge={ctx.store.approvals.filter((approval) => approval.status === "pending").length}><ApprovalList approvals={ctx.store.approvals} decide={ctx.store.decideApproval} /></Panel><Panel title="Dependențe / blocaje"><DependencyList tasks={ctx.tasks} openTask={ctx.openTask} /></Panel></div>
    <Panel title="Linii proiecte & inițiative active"><InitiativeLanes projects={active} tasks={ctx.visibleTasks} openTask={ctx.openTask} /></Panel>
    <Panel title="Chat proiecte"><ProjectChat /></Panel>
    <Panel title="Milestones active"><MilestoneList /></Panel>
    <Panel title="Documente recente"><DocumentList setModal={ctx.setModal} /></Panel>
  </div>;
}

function UpcomingProjectsPage(ctx: PageContext) {
  const upcoming = ctx.store.projects.filter((project) => project.status === "upcoming");
  const first = upcoming[0];
  return <div className="grid gap-5 xl:grid-cols-[1fr_350px_340px]">
    <Panel title="Proiecte viitoare" badge={upcoming.length}><ProjectTable projects={upcoming} tasks={ctx.visibleTasks} openTask={ctx.openTask} upcoming /></Panel>
    <Panel title="Checklist kickoff" badge={first ? `${first.kickoffChecklist.filter((item) => item.done).length}/${first.kickoffChecklist.length}` : 0}>{first ? <KickoffChecklist project={first} toggle={ctx.store.toggleKickoff} /> : <EmptyState label="Nu există proiecte viitoare." />}</Panel>
    <div className="space-y-5"><Panel title="Next launches"><LaunchTimeline projects={upcoming} /></Panel><Panel title="Conflicte resurse"><ConflictList /></Panel><Panel title="Documente lipsă"><MissingDocs projects={upcoming} /></Panel><Panel title="Aprobări înainte de start"><ApprovalList approvals={ctx.store.approvals} decide={ctx.store.decideApproval} /></Panel></div>
    <Panel title="Taskuri următoare"><TaskMiniTable tasks={ctx.tasks.slice(0, 5)} onOpen={ctx.openTask} /></Panel>
    <Panel title="Milestone-uri pre-implementare"><PreMilestones /></Panel>
    <Panel title="Note din CRM / ofertare"><NotesList /></Panel>
    <Panel title="Dependențe înainte de start"><DependencyFlow /></Panel>
  </div>;
}

function CompletedProjectsPage(ctx: PageContext) {
  const completed = ctx.store.projects.filter((project) => project.status === "completed");
  return <div className="grid gap-5 xl:grid-cols-[1fr_330px_330px]">
    <Panel title="Proiecte finalizate" badge={completed.length} action={<button onClick={() => ctx.setModal("export")} className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white"><Download className="mr-1 inline h-3.5 w-3.5" />Exportă raport</button>}><ProjectTable projects={completed} tasks={ctx.visibleTasks} openTask={ctx.openTask} completed /></Panel>
    <div className="space-y-5"><Panel title="Complete recent" badge="5"><ProjectMiniRows projects={completed} /></Panel><Panel title="Final approvals" badge="4"><ApprovalList approvals={ctx.store.approvals} decide={ctx.store.decideApproval} /></Panel><Panel title="Lessons learned" badge="5"><LessonsList setModal={ctx.setModal} /></Panel></div>
    <div className="space-y-5"><Panel title="Documente handover"><HandoverList setModal={ctx.setModal} /></Panel><Panel title="Rapoarte finale"><ReportList setModal={ctx.setModal} /></Panel><Panel title="Template-uri & Best practices"><TemplateList /></Panel></div>
    <Panel title="Activitate finalizare"><ActivityRows tasks={ctx.visibleTasks.filter((task) => task.status === "Finalizat")} /></Panel>
  </div>;
}

function BoardPage(ctx: PageContext) {
  const [activeBoard, setActiveBoard] = useState("pv");
  const [savedView, setSavedView] = useState("default");
  function handleBoardChange(value: string) {
    setActiveBoard(value);
    ctx.toast(value === "team" ? "Board echipă activat." : "Board PV Operations activat.");
  }
  function handleSavedView(value: string) {
    setSavedView(value);
    if (value === "blocked") ctx.setFilters((state) => ({ ...state, savedView: "blocked" }));
    if (value === "urgent") ctx.setFilters((state) => ({ ...state, savedView: "high-priority" }));
    if (value === "default") ctx.setFilters((state) => ({ ...state, savedView: "all" }));
    ctx.toast(`Saved view aplicat: ${value}`);
  }
  return <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
    <section className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div className="flex gap-2"><Select label="Active board" value={activeBoard} onChange={handleBoardChange} options={[{ value: "pv", label: "PV Operations" }, { value: "team", label: "Team board" }]} /><Select label="Saved view" value={savedView} onChange={handleSavedView} options={[{ value: "default", label: "Default" }, { value: "blocked", label: "Blocate" }, { value: "urgent", label: "Urgente" }]} /></div><button onClick={() => { const id = ctx.store.createTask("Backlog"); ctx.openTask(id); }} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-emerald-700">+ Add task</button></div><div className="grid gap-3 xl:grid-cols-6">{statuses.map((status) => <BoardColumn key={status} status={status} tasks={ctx.tasks.filter((task) => task.status === status)} openTask={ctx.openTask} move={ctx.store.changeTaskStatus} create={() => { const id = ctx.store.createTask(status); ctx.openTask(id); }} />)}</div></section>
    <div className="space-y-5"><Panel title="Acțiuni necesare" badge="5"><AlertList tasks={ctx.tasks.filter((task) => task.priority === "Urgent" || task.status === "Blocat")} onOpen={ctx.openTask} /></Panel><Panel title="Taskuri întârziate" badge={ctx.tasks.filter(isOverdue).length}><AlertList tasks={ctx.tasks.filter(isOverdue)} onOpen={ctx.openTask} /></Panel><Panel title="Statistici rapide"><QuickStats tasks={ctx.tasks} /></Panel></div>
  </div>;
}

function TablePage(ctx: PageContext) {
  const [grouping, setGrouping] = useState("none");
  const allSelected = ctx.tasks.length > 0 && ctx.tasks.every((task) => ctx.selectedRows.includes(task.id));
  const tableTasks = useMemo(() => grouping === "status" ? [...ctx.tasks].sort((a, b) => a.status.localeCompare(b.status)) : ctx.tasks, [ctx.tasks, grouping]);
  function toggleAll() { ctx.setSelectedRows(allSelected ? [] : ctx.tasks.map((task) => task.id)); }
  function toggle(id: string) { ctx.setSelectedRows((rows) => rows.includes(id) ? rows.filter((row) => row !== id) : [...rows, id]); }
  return <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
    <section className="rounded-[1.35rem] border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="text-base font-black">{ctx.tasks.length} taskuri · <span className="text-emerald-700">Selectate {ctx.selectedRows.length}</span></div><div className="flex gap-2"><Select label="Grupare" value={grouping} onChange={(value) => { setGrouping(value); ctx.toast(value === "status" ? "Tabel grupat după status." : "Gruparea tabelului a fost resetată."); }} options={[{ value: "none", label: "Niciuna" }, { value: "status", label: "Status" }]} /><Select label="Densitate" value={ctx.density} onChange={(value) => ctx.setDensity(value as Density)} options={[{ value: "compact", label: "Compact" }, { value: "medium", label: "Mediu" }, { value: "relaxed", label: "Relaxat" }]} /></div></div><div className="overflow-x-auto"><table className="min-w-[1280px] w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3"><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>{["ID", "Task", "Project", "Tip", "Status", "Prioritate", "Assignee", "Owner", "Deadline", "Progress", "Time tracked", "Dependencies", "Tags", "Custom field"].map((head) => <th key={head} className="px-4 py-3 font-black">{head}</th>)}</tr></thead><tbody>{tableTasks.map((task) => <TaskTableRow key={task.id} task={task} selected={ctx.selectedRows.includes(task.id)} toggle={toggle} openTask={ctx.openTask} changeStatus={ctx.store.changeTaskStatus} assign={ctx.store.assignTask} density={ctx.density} />)}</tbody></table></div></section>
    <div className="space-y-5"><Panel title="Acțiuni în masă" badge={`${ctx.selectedRows.length} selectate`}><BulkActions rows={ctx.selectedRows} users={v64Users} onStatus={(status) => ctx.store.bulkUpdate(ctx.selectedRows, { status })} onPriority={(priority) => ctx.store.bulkUpdate(ctx.selectedRows, { priority })} onAssignee={(assigneeId) => ctx.store.bulkUpdate(ctx.selectedRows, { assigneeId })} onDelete={() => { ctx.store.deleteTasks(ctx.selectedRows); ctx.setSelectedRows([]); }} /></Panel><Panel title="Filtre rapide"><QuickFilters setFilters={ctx.setFilters} /></Panel><Panel title="Setări vedere"><ViewSettings density={ctx.density} setDensity={ctx.setDensity} /></Panel></div>
    <Panel title="Rezumat selecție"><SelectionSummary rows={ctx.selectedRows} tasks={ctx.tasks} /></Panel><Panel title="Modificări recente"><ActivityRows tasks={ctx.visibleTasks} /></Panel><Panel title="Export & Integrări"><ExportIntegrations setModal={ctx.setModal} /></Panel>
  </div>;
}

function DocumentList({ setModal }: { setModal?: (kind: ModalKind) => void }) {
  const rows = [
    { title: "Plan de securitate – P-2024-0187.pdf", owner: "Mihai Ionescu", time: "acum 10m", tone: "text-emerald-700 bg-emerald-50" },
    { title: "Aviz de racordare – P-2024-0192.pdf", owner: "Cristian Radu", time: "acum 32m", tone: "text-red-700 bg-red-50" },
    { title: "Raport testare PIF – P-2024-0185.pdf", owner: "Alex Stan", time: "acum 1h", tone: "text-blue-700 bg-blue-50" },
    { title: "Layout rev.03 – P-2024-0187.dwg", owner: "Andrei Popescu", time: "acum 2h", tone: "text-slate-700 bg-slate-50" }
  ];

  return (
    <div className="divide-y divide-slate-100">
      {rows.map((row) => (
        <button key={row.title} onClick={() => setModal?.("handover")} className="grid w-full grid-cols-[32px_1fr_70px] items-center gap-3 py-3 text-left text-sm hover:bg-slate-50">
          <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${row.tone}`}>
            <FileText className="h-4 w-4" />
          </span>
          <span>
            <span className="block font-black text-slate-800">{row.title}</span>
            <span className="block text-xs font-semibold text-slate-500">{row.owner}</span>
          </span>
          <span className="text-right text-xs font-bold text-slate-400">{row.time}</span>
        </button>
      ))}
    </div>
  );
}

function QuickStats({ tasks }: { tasks: V64Task[] }) {
  const activeProjects = new Set(tasks.map((task) => task.projectId)).size;
  const completed = tasks.filter((task) => task.status === "Finalizat").length;
  const blockedOrLate = tasks.filter((task) => task.status === "Blocat" || isOverdue(task)).length;
  const averageProgress = Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / Math.max(tasks.length, 1));
  const trackedHours = Math.round(tasks.reduce((sum, task) => sum + task.trackedHours, 0));
  const rows = [
    { label: "Proiecte active", value: activeProjects, trend: "+12%", tone: "text-blue-700 bg-blue-50" },
    { label: "Productivitate echipă", value: `${averageProgress}%`, trend: "+8%", tone: "text-emerald-700 bg-emerald-50" },
    { label: "Taskuri finalizate", value: completed, trend: "+16%", tone: "text-emerald-700 bg-emerald-50" },
    { label: "Blocaje / întârzieri", value: blockedOrLate, trend: "atenție", tone: "text-red-700 bg-red-50" },
    { label: "Timp urmărit", value: `${trackedHours}h`, trend: "săptămâna curentă", tone: "text-orange-700 bg-orange-50" }
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm">
          <div>
            <div className="text-sm font-black text-slate-800">{row.label}</div>
            <div className="mt-0.5 text-xs font-semibold text-slate-500">{row.trend}</div>
          </div>
          <span className={`rounded-xl px-3 py-1 text-sm font-black ${row.tone}`}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function CalendarGanttPage(ctx: PageContext) {
  const [calendarMode, setCalendarMode] = useState<"Lună" | "Săptămână" | "Zi" | "Listă">("Lună");
  const [monthOffset, setMonthOffset] = useState(0);
  const monthLabel = monthOffset === 0 ? "Mai 2024" : monthOffset < 0 ? "Aprilie 2024" : "Iunie 2024";
  const modeButton = (mode: "Lună" | "Săptămână" | "Zi" | "Listă") => (
    <button
      type="button"
      onClick={() => { setCalendarMode(mode); ctx.toast(`Calendar: vedere ${mode}`); }}
      className={calendarMode === mode ? "rounded-lg bg-blue-50 px-3 py-1 text-xs font-black text-blue-700" : "rounded-lg border px-3 py-1 text-xs font-black"}
    >
      {mode}
    </button>
  );
  return <div className="grid gap-5 xl:grid-cols-[1.1fr_1.2fr_300px]">
    <Panel title={monthLabel} action={<div className="flex gap-2"><button type="button" onClick={() => setMonthOffset((value) => value - 1)} className="rounded-lg border px-2 py-1"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => setMonthOffset((value) => value + 1)} className="rounded-lg border px-2 py-1"><ChevronRight className="h-4 w-4" /></button><button type="button" onClick={() => { setMonthOffset(0); ctx.toast("Calendar revenit la luna curentă."); }} className="rounded-lg border px-3 py-1 text-xs font-black">Astăzi</button>{modeButton("Lună")}{modeButton("Săptămână")}{modeButton("Zi")}{modeButton("Listă")}</div>}><MonthCalendar tasks={ctx.tasks} openTask={ctx.openTask} /></Panel>
    <Panel title="Gantt proiecte"><Gantt tasks={ctx.tasks} openTask={ctx.openTask} /></Panel>
    <div className="space-y-5"><Panel title="Agenda zilei"><Agenda tasks={ctx.tasks} onOpen={ctx.openTask} /></Panel><Panel title="Upcoming deadlines"><AlertList tasks={ctx.tasks.filter((task) => task.dueDate <= "2024-06-03")} onOpen={ctx.openTask} /></Panel><Panel title="Filtre calendar"><CalendarFilters setFilters={ctx.setFilters} toast={ctx.toast} /></Panel></div>
    <Panel title="Milestones"><MilestoneList /></Panel><Panel title="Evenimente"><EventsList /></Panel><Panel title="Dependency alerts"><DependencyList tasks={ctx.tasks} openTask={ctx.openTask} /></Panel><Panel title="Tickets due"><TicketsDue tickets={ctx.store.tickets} /></Panel><Panel title="Aprobări în așteptare"><ApprovalList approvals={ctx.store.approvals} decide={ctx.store.decideApproval} /></Panel>
  </div>;
}

function WorkloadApprovalsPage(ctx: PageContext) {
  const [workloadMode, setWorkloadMode] = useState<"Zi" | "Săptămână" | "Lună">("Săptămână");
  const workloadButton = (mode: "Zi" | "Săptămână" | "Lună") => (
    <button
      type="button"
      onClick={() => { setWorkloadMode(mode); ctx.toast(`Workload: vedere ${mode}`); }}
      className={workloadMode === mode ? "rounded-lg bg-blue-50 px-3 py-1 text-xs font-black text-blue-700" : "rounded-lg border px-3 py-1 text-xs font-black"}
    >
      {mode}
    </button>
  );
  return <div className="grid gap-5 xl:grid-cols-[1fr_1fr_320px]">
    <Panel title="Workload echipă" action={<div className="flex gap-2">{workloadButton("Zi")}{workloadButton("Săptămână")}{workloadButton("Lună")}</div>}><WorkloadHeatmap tasks={ctx.visibleTasks} openTask={ctx.openTask} /></Panel>
    <Panel title="Aprobări în așteptare" badge={ctx.store.approvals.filter((approval) => approval.status === "pending").length}><ApprovalList approvals={ctx.store.approvals} decide={ctx.store.decideApproval} detailed /></Panel>
    <div className="space-y-5"><Panel title="Alerte manager"><ManagerAlerts tasks={ctx.visibleTasks} /></Panel><Panel title="Resurse subutilizate"><UnderusedResources /></Panel><Panel title="Escaladări & Blocaje"><DependencyList tasks={ctx.tasks} openTask={ctx.openTask} /></Panel></div>
    <Panel title="Taskuri echipă (după responsabil)"><TeamTasksSummary tasks={ctx.visibleTasks} /></Panel><Panel title="Certificări & Roluri"><Certifications /></Panel><Panel title="Activitate aprobări"><ApprovalActivity approvals={ctx.store.approvals} /></Panel>
  </div>;
}

function Avatar({ user, size = "md" }: { user: V64User | undefined; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-xs";
  return <div className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-emerald-100 font-black text-slate-800 ring-2 ring-white ${sizeClass}`}>{user?.initials ?? "?"}</div>;
}

function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-black ring-1 ${className}`}>{children}</span>;
}

function TaskMiniTable({ tasks, onOpen, compact = false }: { tasks: V64Task[]; onOpen: (taskId: string) => void; compact?: boolean }) {
  if (!tasks.length) return <EmptyState label="Nu există taskuri pentru filtrul curent." />;
  return <div className="divide-y divide-slate-100">{tasks.slice(0, compact ? 5 : 8).map((task) => <button key={task.id} onClick={() => onOpen(task.id)} className="grid w-full grid-cols-[24px_1fr_170px_90px_120px] items-center gap-3 py-3 text-left text-sm hover:bg-slate-50"><Circle className="h-4 w-4 text-slate-300" /><div><div className="font-black text-slate-900">{task.title}</div><div className="mt-0.5 text-xs font-semibold text-slate-500">{task.projectCode} · {task.projectName}</div></div><Badge className={priorityTone(task.priority)}>{task.priority}</Badge><Badge className={statusTone(task.status)}>{task.status}</Badge><div className="flex items-center gap-2"><Avatar user={v64UserById(task.assigneeId)} size="sm" /><span className="text-xs font-bold text-slate-500">{v64UserById(task.assigneeId)?.name.split(" ")[0]}</span></div></button>)}</div>;
}

function TicketSummary({ tickets, onClick }: { tickets: V64Ticket[]; onClick: (ticket: V64Ticket) => void }) {
  const rows = [
    { label: "Prioritate ridicată", count: tickets.filter((ticket) => ticket.priority === "Critic" || ticket.priority === "Ridicat").length, tone: "bg-red-50 text-red-700" },
    { label: "Necesită răspuns", count: tickets.filter((ticket) => ticket.status === "Necesită răspuns").length, tone: "bg-orange-50 text-orange-700" },
    { label: "Informații", count: tickets.filter((ticket) => ticket.unread).length, tone: "bg-blue-50 text-blue-700" }
  ];
  return <div className="space-y-3">{rows.map((row) => <button key={row.label} onClick={() => onClick(tickets[0])} className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left shadow-sm hover:bg-slate-50"><span className="font-bold text-slate-700">{row.label}</span><span className={`rounded-xl px-2 py-1 text-xs font-black ${row.tone}`}>{row.count}</span></button>)}</div>;
}

function ProjectProgressList({ projects }: { projects: V64Project[] }) {
  return <div className="divide-y divide-slate-100">{projects.map((project) => <div key={project.id} className="grid grid-cols-[1fr_90px_90px] items-center gap-3 py-3 text-sm"><div><div className="font-black">{project.code}</div><div className="text-xs font-semibold text-slate-500">{project.name}</div></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${project.progress}%` }} /></div><Badge className={statusTone(project.health as V64TaskStatus)}>{project.health}</Badge></div>)}</div>;
}

function AlertList({ tasks, onOpen }: { tasks: V64Task[]; onOpen: (taskId: string) => void }) {
  return <div className="space-y-3">{tasks.slice(0, 6).map((task) => <button key={task.id} onClick={() => onOpen(task.id)} className="flex w-full items-center justify-between gap-3 rounded-xl p-2 text-left hover:bg-slate-50"><div><div className="font-black text-slate-800">{task.title}</div><div className="text-xs font-semibold text-slate-500">{task.projectCode}</div></div><Badge className={isOverdue(task) ? "bg-red-50 text-red-700 ring-red-100" : priorityTone(task.priority)}>{isOverdue(task) ? "Overdue" : task.priority}</Badge></button>)}</div>;
}

function ProjectMiniRows({ projects }: { projects: V64Project[] }) {
  return <div className="divide-y divide-slate-100">{projects.slice(0, 5).map((project) => <div key={project.id} className="grid grid-cols-[1fr_120px_100px] gap-3 py-3 text-sm"><div><b>{project.code}</b><div className="text-xs text-slate-500">{project.name}</div></div><span>{project.deadline}</span><span className="font-black text-slate-700">{formatRon(project.valueRon)}</span></div>)}</div>;
}

function WorkloadMini({ tasks }: { tasks: V64Task[] }) {
  return <div className="space-y-3">{v64Users.slice(0, 5).map((user) => { const userTasks = tasks.filter((task) => task.assigneeId === user.id); const used = Math.round(userTasks.reduce((sum, task) => sum + task.estimateHours, 0) / Math.max(user.capacityHours, 1) * 100); return <div key={user.id} className="grid grid-cols-[170px_1fr_70px] items-center gap-3"><div className="flex items-center gap-2"><Avatar user={user} size="sm" /><span className="text-sm font-black">{user.name}</span></div><div className="h-2 rounded-full bg-slate-100"><div className={used > 100 ? "h-full rounded-full bg-red-500" : "h-full rounded-full bg-emerald-600"} style={{ width: `${Math.min(used, 130)}%` }} /></div><span className={used > 100 ? "text-sm font-black text-red-600" : "text-sm font-black text-slate-700"}>{used}%</span></div>; })}</div>;
}

function ActivityRows({ tasks }: { tasks: V64Task[] }) {
  const items = tasks.flatMap((task) => task.activityLog.map((activity) => ({ task, activity }))).slice(0, 7);
  return <div className="space-y-3">{items.map(({ task, activity }) => <div key={`${task.id}-${activity.id}`} className="flex items-start gap-3"><Avatar user={v64UserById(activity.actorId)} size="sm" /><div><div className="text-sm font-bold text-slate-700">{v64UserById(activity.actorId)?.name ?? "Sistem"} <span className="font-semibold text-slate-500">{activity.detail}</span></div><div className="text-xs font-semibold text-slate-400">{task.projectCode} · {task.title}</div></div></div>)}</div>;
}

function HorizontalTickets({ tickets, onOpen }: { tickets: V64Ticket[]; onOpen: (ticketId: string) => void }) {
  return <div className="grid gap-3 xl:grid-cols-5">{tickets.slice(0, 5).map((ticket) => <button key={ticket.id} onClick={() => onOpen(ticket.id)} className="rounded-2xl border border-slate-200 p-4 text-left hover:border-red-200 hover:bg-red-50"><div className="text-xs font-black text-blue-700">#{ticket.id}</div><div className="mt-1 font-black">{ticket.subject}</div><div className="mt-2 flex items-center justify-between"><span className="text-xs text-slate-500">{ticket.projectCode}</span><Badge className={priorityTone(ticket.priority)}>{ticket.priority}</Badge></div></button>)}</div>;
}

function SegmentedFilters({ setFilters }: { setFilters: PageContext["setFilters"] }) {
  const items: Array<{ label: string; view: SavedViewId; count: number }> = [
    { label: "Toate", view: "all", count: 24 }, { label: "Azi", view: "today", count: 7 }, { label: "Urgente", view: "high-priority", count: 5 }, { label: "Review", view: "waiting-approval", count: 8 }, { label: "Delegate", view: "my-work", count: 4 }, { label: "Watched", view: "all", count: 6 }
  ];
  return <div className="flex gap-2">{items.map((item) => <button key={item.label} onClick={() => setFilters((state) => ({ ...state, savedView: item.view }))} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-black hover:bg-emerald-50">{item.label} <span className="text-emerald-700">{item.count}</span></button>)}</div>;
}

function Agenda({ tasks, onOpen }: { tasks: V64Task[]; onOpen: (taskId: string) => void }) {
  const agenda = tasks.slice(0, 4);
  return <div className="space-y-3">{agenda.map((task, index) => <button key={task.id} onClick={() => onOpen(task.id)} className="grid w-full grid-cols-[55px_1fr_60px] items-center gap-3 text-left"><span className="text-sm font-black text-slate-600">{10 + index * 2}:00</span><span className="font-bold">{task.title}</span><span className="text-xs text-slate-500">{index + 1}h</span></button>)}</div>;
}

function Mentions({ notifications, markRead }: { notifications: V64Notification[]; markRead: (id: string) => void }) {
  return <div className="space-y-3">{notifications.slice(0, 5).map((notification) => <button key={notification.id} onClick={() => markRead(notification.id)} className="flex w-full items-start gap-3 rounded-xl p-2 text-left hover:bg-slate-50"><Bell className={notification.read ? "h-4 w-4 text-slate-300" : "h-4 w-4 text-emerald-600"} /><div><div className="font-bold">{notification.title}</div><div className="text-xs text-slate-500">{notification.message}</div></div></button>)}</div>;
}

function QuickCreate({ create, ticket, toast }: { create: () => string; ticket: () => void; toast: (text: string) => void }) {
  return <div className="grid grid-cols-3 gap-2">{["Task", "Meeting", "Notiță", "Incident", "Decizie", "Document"].map((item) => <button key={item} onClick={() => { if (item === "Incident") ticket(); else create(); toast(`${item} creat în mock store.`); }} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black hover:bg-emerald-50">{item}</button>)}</div>;
}

function QuickFilters({ setFilters }: { setFilters?: PageContext["setFilters"] }) {
  const items: Array<{ label: string; view: SavedViewId; count: number }> = [{ label: "Azi", view: "today", count: 9 }, { label: "Săptămâna curentă", view: "week", count: 24 }, { label: "Întârziate", view: "overdue", count: 18 }, { label: "Fără assignee", view: "no-deadline", count: 11 }, { label: "Blocate", view: "blocked", count: 12 }, { label: "Cu dependențe", view: "all", count: 36 }];
  return <div className="space-y-2">{items.map((item) => <button key={item.label} onClick={() => setFilters?.((state) => ({ ...state, savedView: item.view }))} className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm font-bold hover:bg-slate-50"><span>{item.label}</span><span className="text-slate-500">{item.count}</span></button>)}</div>;
}

function TicketsTable({ tickets, update, escalate, openTask, compact = false }: { tickets: V64Ticket[]; update: (id: string, patch: Partial<V64Ticket>) => void; escalate: (id: string) => void; openTask: (taskId: string) => void; compact?: boolean }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="text-[11px] uppercase text-slate-500"><tr>{["ID", "Tip", "Subiect", "Project", "Prioritate", "SLA", "Status", "Owner", "Acțiuni"].map((head) => <th key={head} className="px-3 py-2 font-black">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{tickets.slice(0, compact ? 6 : 9).map((ticket) => <tr key={ticket.id} className="hover:bg-slate-50"><td className="px-3 py-3 font-black text-blue-700">{ticket.id}</td><td className="px-3 py-3">{ticket.type}</td><td className="px-3 py-3 font-bold">{ticket.subject}</td><td className="px-3 py-3">{ticket.projectCode}</td><td className="px-3 py-3"><Badge className={priorityTone(ticket.priority)}>{ticket.priority}</Badge></td><td className={ticket.slaMinutes < 0 ? "px-3 py-3 font-black text-red-600" : "px-3 py-3 font-black text-emerald-700"}>{minToSla(ticket.slaMinutes)}</td><td className="px-3 py-3"><select value={ticket.status} onChange={(event) => update(ticket.id, { status: event.target.value as V64TicketStatus, unread: false })} className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusTone(ticket.status)}`}>{ticketStatuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-3 py-3"><Avatar user={v64UserById(ticket.ownerId)} size="sm" /></td><td className="px-3 py-3"><button onClick={() => ticket.linkedTaskId ? openTask(ticket.linkedTaskId) : escalate(ticket.id)} className="rounded-lg border px-2 py-1 text-xs font-black text-emerald-700">{ticket.linkedTaskId ? "Task" : "Escaladează"}</button></td></tr>)}</tbody></table></div>;
}

function TicketActions({ tickets, escalate }: { tickets: V64Ticket[]; escalate: (id: string) => void }) {
  return <div className="space-y-3">{tickets.filter((ticket) => ticket.priority === "Critic" || ticket.slaMinutes < 480).slice(0, 5).map((ticket) => <button key={ticket.id} onClick={() => escalate(ticket.id)} className="flex w-full items-center justify-between rounded-xl p-2 text-left hover:bg-red-50"><div><div className="font-black">{ticket.subject}</div><div className="text-xs text-slate-500">{ticket.projectCode}</div></div><Badge className={priorityTone(ticket.priority)}>{ticket.priority}</Badge></button>)}</div>;
}

function TicketEscalations({ tickets }: { tickets: V64Ticket[] }) {
  return <div className="space-y-2">{tickets.filter((ticket) => ticket.escalated || ticket.slaMinutes < 600).map((ticket) => <div key={ticket.id} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"><span>{ticket.id} · {ticket.subject.slice(0, 30)}</span><b>{ticket.escalated ? "Nivel 2" : "Nivel 1"}</b></div>)}</div>;
}

function TicketQuickViews() {
  return <div className="space-y-2">{["Tickete critice", "Necesită răspuns", "SLA în risc", "Atribuite mie", "IoT Alerts", "Procurement", "Aprobări în așteptare"].map((item, index) => <div key={item} className="flex justify-between rounded-xl px-2 py-2 text-sm font-bold hover:bg-slate-50"><span>{item}</span><span>{[18, 37, 15, 24, 31, 16, 12][index]}</span></div>)}</div>;
}

function ProjectTable({ projects, tasks, openTask, upcoming = false, completed = false }: { projects: V64Project[]; tasks: V64Task[]; openTask: (taskId: string) => void; upcoming?: boolean; completed?: boolean }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="text-[11px] uppercase text-slate-500"><tr>{["Project", upcoming ? "Start planificat" : completed ? "Finalizat" : "Client", "Client", "Valoare (RON)", "Responsabil", upcoming ? "Ready score" : completed ? "Documentație" : "Sănătate"].map((head) => <th key={head} className="px-3 py-2 font-black">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{projects.map((project) => { const projectTasks = tasks.filter((task) => task.projectId === project.id); return <tr key={project.id} className="hover:bg-slate-50"><td className="px-3 py-3"><b>{project.code}</b><div className="text-xs text-slate-500">{project.name}</div></td><td className="px-3 py-3">{upcoming ? project.startDate : completed ? project.deadline : project.client}</td><td className="px-3 py-3">{project.client}</td><td className="px-3 py-3">{formatRon(project.valueRon)}</td><td className="px-3 py-3"><div className="flex items-center gap-2"><Avatar user={v64UserById(project.managerId)} size="sm" />{v64UserById(project.managerId)?.name}</div></td><td className="px-3 py-3"><button onClick={() => projectTasks[0] && openTask(projectTasks[0].id)} className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">{upcoming ? `${project.readyScore}%` : completed ? "Completă" : project.health}</button></td></tr>; })}</tbody></table></div>;
}

function InitiativeLanes({ projects, tasks, openTask }: { projects: V64Project[]; tasks: V64Task[]; openTask: (taskId: string) => void }) {
  return <div className="grid gap-3 xl:grid-cols-5">{projects.slice(0, 5).map((project) => <div key={project.id} className="rounded-2xl border border-slate-200 p-3"><div className="flex justify-between"><b>{project.code}</b><span className="font-black text-blue-700">{project.progress}%</span></div><div className="mt-2 space-y-2">{tasks.filter((task) => task.projectId === project.id).slice(0, 4).map((task) => <button key={task.id} onClick={() => openTask(task.id)} className="flex w-full justify-between rounded-lg bg-slate-50 p-2 text-xs font-bold"><span>{task.title.slice(0, 22)}</span><span>{task.progress}%</span></button>)}</div></div>)}</div>;
}

function ProjectChat() {
  return <div className="space-y-3">{["@echipa Vă rog status pentru testările critice.", "Montaj structură – 60% finalizat.", "Instalare panouri începe mâine dimineață."].map((msg, index) => <div key={msg} className="flex gap-3"><Avatar user={v64Users[index]} size="sm" /><div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold">{msg}</div></div>)}<input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" placeholder="Scrie un mesaj..." /></div>;
}

function DependencyList({ tasks, openTask }: { tasks: V64Task[]; openTask: (taskId: string) => void }) {
  const items = tasks.filter((task) => task.dependencies.length || task.status === "Blocat");
  return <div className="space-y-2">{items.slice(0, 5).map((task) => <button key={task.id} onClick={() => openTask(task.id)} className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left hover:bg-slate-50"><span className="font-bold">{task.title}</span><Badge className={task.status === "Blocat" ? "bg-red-50 text-red-700 ring-red-100" : "bg-orange-50 text-orange-700 ring-orange-100"}>{task.status === "Blocat" ? "Blocat" : "Depinde"}</Badge></button>)}</div>;
}

function KickoffChecklist({ project, toggle }: { project: V64Project; toggle: (projectId: string, itemId: string) => void }) {
  return <div className="space-y-3">{project.kickoffChecklist.map((item) => <button key={item.id} onClick={() => toggle(project.id, item.id)} className="flex w-full items-center justify-between rounded-xl p-2 hover:bg-slate-50"><span className="flex items-center gap-2"><CheckCircle2 className={item.done ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-slate-300"} /> <b>{item.label}</b></span><span className="text-xs text-slate-500">{item.date ?? "—"}</span></button>)}</div>;
}

function LaunchTimeline({ projects }: { projects: V64Project[] }) {
  return <div className="space-y-4 border-l-2 border-slate-100 pl-4">{projects.map((project) => <div key={project.id} className="relative"><span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-50" /><b>{project.startDate}</b><div className="text-sm font-semibold text-slate-600">{project.code} · {project.name}</div></div>)}</div>;
}

function ConflictList() { return <SmallRows rows={["Mihai Ionescu · dublu alocat", "Macara 50t · suprapus", "Echipă electrică · capacitate 110%"]} tone="red" />; }
function MissingDocs({ projects }: { projects: V64Project[] }) { return <SmallRows rows={projects.flatMap((p) => p.missingDocuments.map((doc) => `${p.code} · ${doc}`)).slice(0, 5)} tone="orange" />; }
function PreMilestones() { return <SmallRows rows={["Documentație completă", "Autorizații obținute", "Resurse confirmate", "Plan execuție finalizat", "Kickoff & handover"]} />; }
function NotesList() { return <SmallRows rows={["Client interesat de extindere viitoare la 8 MWp.", "Buget aprobat. Se dorește finalizare înainte de Q3.", "Așteptăm aviz de racordare. Termen estimat 10 zile.", "Clauze speciale în contract: penalități stricte."]} />; }
function DependencyFlow() { return <div className="grid gap-3"><div className="rounded-xl border p-3 text-sm font-black">Aviz distribuitor <Badge className="ml-2 bg-emerald-50 text-emerald-700 ring-emerald-100">OK</Badge></div><div className="rounded-xl border p-3 text-sm font-black">Autorizație construire <Badge className="ml-2 bg-orange-50 text-orange-700 ring-orange-100">În curs</Badge></div><div className="rounded-xl border p-3 text-sm font-black">Kickoff meeting <Badge className="ml-2 bg-blue-50 text-blue-700 ring-blue-100">Programat</Badge></div></div>; }
function HandoverList({ setModal }: { setModal: (kind: ModalKind) => void }) { return <SmallActionRows rows={["Manuale echipamente", "Scheme & planuri finale", "Certificate & conformități", "Procese verbale recepție", "Training & instruire"]} onClick={() => setModal("handover")} />; }
function ReportList({ setModal }: { setModal: (kind: ModalKind) => void }) { return <SmallActionRows rows={["Raport final P-2024-0187 · PDF 1.2 MB", "Raport final P-2024-0142 · PDF 2.4 MB", "Raport final P-2024-0103 · PDF 3.1 MB"]} onClick={() => setModal("export")} />; }
function LessonsList({ setModal }: { setModal: (kind: ModalKind) => void }) { return <SmallActionRows rows={["Optimizare layout panouri", "Management termene furnizori", "Integrare inverter multi-brand", "Proces handover client C&I", "Documentație foto standardizată"]} onClick={() => setModal("lesson")} />; }
function TemplateList() { return <SmallRows rows={["Checklist recepție finală (C&I)", "Template raport final proiect", "Proces handover echipamente", "Template post-mortem", "Best practices instalare FV"]} tone="green" />; }

function SmallRows({ rows, tone = "slate" }: { rows: string[]; tone?: "red" | "orange" | "green" | "slate" }) {
  const cls = tone === "red" ? "text-red-700" : tone === "orange" ? "text-orange-700" : tone === "green" ? "text-emerald-700" : "text-slate-700";
  return <div className="space-y-2">{rows.map((row) => <div key={row} className={`rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold ${cls}`}>{row}</div>)}</div>;
}
function SmallActionRows({ rows, onClick }: { rows: string[]; onClick: () => void }) { return <div className="space-y-2">{rows.map((row) => <button key={row} onClick={onClick} className="flex w-full justify-between rounded-xl bg-slate-50 px-3 py-2 text-left text-sm font-bold hover:bg-emerald-50"><span>{row}</span><ChevronRight className="h-4 w-4 text-emerald-700" /></button>)}</div>; }

function BoardColumn({ status, tasks, openTask, move, create }: { status: V64TaskStatus; tasks: V64Task[]; openTask: (id: string) => void; move: (id: string, status: V64TaskStatus) => void; create: () => void }) {
  return <div className="min-w-[190px] rounded-2xl bg-slate-50 p-3"><div className="mb-3 flex items-center justify-between"><h3 className="font-black">{status}</h3><span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">{tasks.length}</span></div><div className="space-y-3">{tasks.map((task) => <div key={task.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><button onClick={() => openTask(task.id)} className="text-left"><div className="font-black leading-snug">{task.title}</div><div className="mt-1 text-xs font-semibold text-slate-500">{task.projectCode} · {task.projectName}</div></button><div className="mt-3 flex items-center justify-between"><Avatar user={v64UserById(task.assigneeId)} size="sm" /><Badge className={priorityTone(task.priority)}>{task.priority}</Badge></div><div className="mt-3 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${task.progress}%` }} /></div><div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500"><span>{task.checklist.filter((item) => item.done).length}/{task.checklist.length}</span><span>{task.dueDate}</span><select value={task.status} onChange={(event) => move(task.id, event.target.value as V64TaskStatus)} className="rounded-lg border px-1 py-0.5 text-[10px]">{statuses.map((item) => <option key={item}>{item}</option>)}</select></div></div>)}<button onClick={create} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-sm font-black text-slate-500 hover:bg-white">+ Add task</button></div></div>;
}

function TaskTableRow({ task, selected, toggle, openTask, changeStatus, assign, density }: { task: V64Task; selected: boolean; toggle: (id: string) => void; openTask: (id: string) => void; changeStatus: (id: string, status: V64TaskStatus) => void; assign: (id: string, assigneeId: string) => boolean; density: Density }) {
  const pad = density === "compact" ? "py-2" : density === "relaxed" ? "py-5" : "py-3";
  return <tr className="border-t border-slate-100 hover:bg-slate-50"><td className={`px-4 ${pad}`}><input type="checkbox" checked={selected} onChange={() => toggle(task.id)} /></td><td className="px-4 font-black text-blue-700">{task.id}</td><td className="px-4"><button onClick={() => openTask(task.id)} className="text-left font-black hover:text-emerald-700">{task.title}</button></td><td className="px-4"><b>{task.projectCode}</b><div className="text-xs text-slate-500">{task.projectName}</div></td><td className="px-4">{task.type}</td><td className="px-4"><select value={task.status} onChange={(event) => changeStatus(task.id, event.target.value as V64TaskStatus)} className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusTone(task.status)}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-4"><Badge className={priorityTone(task.priority)}>{task.priority}</Badge></td><td className="px-4"><select value={task.assigneeId} onChange={(event) => assign(task.id, event.target.value)} className="rounded-lg border px-2 py-1 text-xs font-bold">{v64Users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></td><td className="px-4"><Avatar user={v64UserById(task.ownerId)} size="sm" /></td><td className="px-4"><span className={isOverdue(task) ? "font-black text-red-600" : "font-bold"}>{task.dueDate}</span></td><td className="px-4"><div className="flex items-center gap-2"><div className="h-1.5 w-16 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${task.progress}%` }} /></div><span className="text-xs font-black">{task.progress}%</span></div></td><td className="px-4">{task.trackedHours.toFixed(2)} / {task.estimateHours.toFixed(2)}</td><td className="px-4">{task.dependencies.length ? task.dependencies.join(", ") : "—"}</td><td className="px-4"><div className="flex gap-1">{task.tags.slice(0, 2).map((tag) => <Badge key={tag} className="bg-blue-50 text-blue-700 ring-blue-100">{tag}</Badge>)}</div></td><td className="px-4 text-xs">{Object.entries(task.customFields)[0]?.join(": ") ?? "—"}</td></tr>;
}

function BulkActions({ rows, users, onStatus, onPriority, onAssignee, onDelete }: { rows: string[]; users: V64User[]; onStatus: (status: V64TaskStatus) => void; onPriority: (priority: V64Priority) => void; onAssignee: (assigneeId: string) => void; onDelete: () => void }) {
  return <div className="space-y-3"><button disabled={!rows.length} onClick={() => onStatus("În desfășurare")} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-black hover:bg-slate-50 disabled:opacity-40">Schimbă statusul</button><button disabled={!rows.length} onClick={() => onPriority("Urgent")} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-black hover:bg-slate-50 disabled:opacity-40">Schimbă prioritatea</button><select disabled={!rows.length} onChange={(event) => onAssignee(event.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm font-bold"><option>Schimbă assignee</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select><button disabled={!rows.length} onClick={onDelete} className="w-full rounded-xl border border-red-100 px-3 py-2 text-left text-sm font-black text-red-600 hover:bg-red-50 disabled:opacity-40">Șterge taskuri</button></div>;
}

function ViewSettings({ density, setDensity }: { density: Density; setDensity: (density: Density) => void }) { return <div className="space-y-3">{(["compact", "medium", "relaxed"] as Density[]).map((item) => <button key={item} onClick={() => setDensity(item)} className={density === item ? "w-full rounded-xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700" : "w-full rounded-xl border px-3 py-2 text-sm font-bold"}>{item}</button>)}<label className="flex items-center justify-between text-sm font-bold">Fixează coloane <input type="checkbox" /></label></div>; }
function SelectionSummary({ rows, tasks }: { rows: string[]; tasks: V64Task[] }) { const selected = tasks.filter((task) => rows.includes(task.id)); return <div className="grid grid-cols-4 gap-4"><Summary label="Proiecte" value={new Set(selected.map((task) => task.projectId)).size} /><Summary label="Taskuri" value={selected.length} /><Summary label="Progress mediu" value={`${Math.round(selected.reduce((s, t) => s + t.progress, 0) / Math.max(selected.length, 1))}%`} /><Summary label="Timp urmărit" value={`${selected.reduce((s, t) => s + t.trackedHours, 0).toFixed(1)}h`} /></div>; }
function Summary({ label, value }: { label: string; value: ReactNode }) { return <div><div className="text-xs font-bold text-slate-500">{label}</div><div className="mt-1 text-2xl font-black">{value}</div></div>; }
function ExportIntegrations({ setModal }: { setModal: (kind: ModalKind) => void }) { return <div className="space-y-2">{["Exportă tabel (CSV)", "Exportă tabel (XLSX)", "Integrare Power BI", "Sincronizare Google Sheets", "Creează automatizare nouă"].map((row) => <button key={row} onClick={() => setModal("export")} className="w-full rounded-xl bg-slate-50 px-3 py-2 text-left text-sm font-bold hover:bg-emerald-50">{row}</button>)}</div>; }

function MonthCalendar({ tasks, openTask }: { tasks: V64Task[]; openTask: (taskId: string) => void }) {
  const days = Array.from({ length: 35 }, (_, index) => index + 1);
  return <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-slate-200 text-sm">{["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"].map((day) => <div key={day} className="bg-slate-50 p-2 text-center text-xs font-black text-slate-500">{day}</div>)}{days.map((day) => { const matches = tasks.filter((task) => Number(task.dueDate.slice(-2)) === day).slice(0, 2); return <div key={day} className="min-h-[92px] border-t border-slate-100 p-2"><div className="font-black text-slate-500">{day}</div><div className="mt-2 space-y-1">{matches.map((task) => <button key={task.id} onClick={() => openTask(task.id)} className="w-full truncate rounded bg-emerald-50 px-2 py-1 text-left text-[11px] font-black text-emerald-700">{task.title}</button>)}</div></div>; })}</div>;
}

function Gantt({ tasks, openTask }: { tasks: V64Task[]; openTask: (taskId: string) => void }) {
  return <div className="space-y-3">{tasks.slice(0, 8).map((task, index) => <button key={task.id} onClick={() => openTask(task.id)} className="grid w-full grid-cols-[180px_1fr_50px] items-center gap-3 text-left"><div><b>{task.projectCode}</b><div className="text-xs text-slate-500">{task.title}</div></div><div className="h-8 rounded-xl bg-slate-100 p-1"><div className={(task.status === "Blocat" ? "bg-red-500" : task.status === "Review" ? "bg-violet-500" : "bg-emerald-600") + " h-full rounded-lg text-right text-[10px] font-black text-white"} style={{ width: `${Math.max(15, task.progress)}%`, marginLeft: `${(index % 4) * 8}%` }}>{task.progress}%</div></div><span className="text-xs font-black">{task.dueDate.slice(5)}</span></button>)}</div>;
}

function CalendarFilters({ setFilters, toast }: { setFilters: PageContext["setFilters"]; toast: (text: string) => void }) {
  const [teamFilter, setTeamFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  return <div className="grid grid-cols-2 gap-2"><Select label="Proiecte" value="all" onChange={(value) => { setFilters((state) => ({ ...state, projectId: value })); toast("Filtru proiect calendar aplicat."); }} options={[{ value: "all", label: "Toate" }, ...v64Projects.map((project) => ({ value: project.id, label: project.code }))]} /><Select label="Echipă" value={teamFilter} onChange={(value) => { setTeamFilter(value); toast("Filtru echipă calendar aplicat."); }} options={[{ value: "all", label: "Toți" }, ...v64Departments.map((department) => ({ value: department.id, label: department.name }))]} /><Select label="Tip" value={typeFilter} onChange={(value) => { setTypeFilter(value); setFilters((state) => ({ ...state, type: value })); toast("Filtru tip task aplicat."); }} options={[{ value: "all", label: "Toate" }, { value: "Task", label: "Task" }, { value: "Milestone", label: "Milestone" }, { value: "Ticket", label: "Ticket" }]} /><Select label="Status" value="all" onChange={(value) => { setFilters((state) => ({ ...state, status: value })); toast("Filtru status calendar aplicat."); }} options={[{ value: "all", label: "Toate" }, ...statuses.map((status) => ({ value: status, label: status }))]} /></div>;
}
function MilestoneList() { return <SmallRows rows={["PIF – P-2024-0187 · 09 Mai", "Recepție – P-2024-0185 · 17 Mai", "Predare – P-2024-0179 · 30 Mai", "Recepție – P-2024-0203 · 25 Mai"]} tone="green" />; }
function EventsList() { return <SmallRows rows={["Standup echipă · Zilnic 09:00", "Review săptămânal · Vin 11:00", "Comitet proiecte · Lun 10:00", "Demo client · One-time"]} />; }
function TicketsDue({ tickets }: { tickets: V64Ticket[] }) { return <SmallRows rows={tickets.slice(0, 5).map((ticket) => `${ticket.subject} · ${minToSla(ticket.slaMinutes)}`)} tone="orange" />; }

function WorkloadHeatmap({ tasks, openTask }: { tasks: V64Task[]; openTask: (taskId: string) => void }) {
  const days = ["Lun 20", "Mar 21", "Mie 22", "Joi 23", "Vin 24", "Sâm 25", "Dum 26"];
  return <div className="overflow-x-auto"><table className="w-full min-w-[840px] text-left text-sm"><thead><tr><th className="p-2">Persoană</th><th className="p-2">Rol</th>{days.map((day) => <th key={day} className="p-2 text-center">{day}</th>)}</tr></thead><tbody>{v64Users.filter((user) => user.capacityHours > 0).slice(0, 7).map((user, userIndex) => { const userTasks = tasks.filter((task) => task.assigneeId === user.id); const daily = [9.2, 8.6, 10, 8, 7.6, 2, 0].map((value) => Math.max(0, value - userIndex * 0.7)); const util = Math.round(userTasks.reduce((s, t) => s + t.estimateHours, 0) / Math.max(user.capacityHours, 1) * 100); return <tr key={user.id} className="border-t"><td className="p-2"><div className="flex items-center gap-2"><Avatar user={user} size="sm" /><b>{user.name}</b></div></td><td className={util > 100 ? "p-2 font-black text-red-600" : "p-2 font-black text-emerald-700"}>{util}%</td>{daily.map((hours, index) => <td key={`${user.id}-${index}`} className="p-1"><button onClick={() => userTasks[0] && openTask(userTasks[0].id)} className={(hours > 9 ? "bg-red-100 text-red-700" : hours > 7 ? "bg-orange-50 text-orange-700" : "bg-emerald-50 text-emerald-700") + " w-full rounded-lg px-2 py-3 text-center text-xs font-black"}>{hours.toFixed(1)}h</button></td>)}</tr>; })}</tbody></table></div>;
}

function ApprovalList({ approvals, decide, detailed = false }: { approvals: V64Approval[]; decide: (id: string, status: "approved" | "rejected") => void; detailed?: boolean }) {
  return <div className="space-y-2">{approvals.slice(0, detailed ? 8 : 5).map((approval) => <div key={approval.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-xl p-2 hover:bg-slate-50"><div><div className="font-black">{approval.title}</div><div className="text-xs text-slate-500">{approval.type} · {v64UserById(approval.requestedBy)?.name} {approval.valueRon ? `· ${formatRon(approval.valueRon)} RON` : ""}</div></div><div className="flex gap-1"><button onClick={() => decide(approval.id, "approved")} className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">Aprobă</button><button onClick={() => decide(approval.id, "rejected")} className="rounded-lg bg-red-50 px-2 py-1 text-xs font-black text-red-700">Respinge</button></div></div>)}</div>;
}

function ManagerAlerts({ tasks }: { tasks: V64Task[] }) { const alerts = [`${tasks.filter((task) => isOverdue(task)).length} taskuri întârziate`, `${tasks.filter((task) => task.status === "Blocat").length} taskuri blocate`, "6 persoane supraîncărcate", "2 facturi în întârziere la aprobare"]; return <SmallRows rows={alerts} tone="red" />; }
function UnderusedResources() { return <SmallRows rows={["Elena Vasilescu · 20%", "Radu Enache · 30%", "Cristian Radu · 45%"]} tone="green" />; }
function TeamTasksSummary({ tasks }: { tasks: V64Task[] }) { return <div className="divide-y divide-slate-100">{v64Users.slice(0, 5).map((user) => { const mine = tasks.filter((task) => task.assigneeId === user.id); return <div key={user.id} className="grid grid-cols-5 py-3 text-sm"><b className="col-span-2">{user.name}</b><span>În lucru {mine.filter((task) => task.status === "În desfășurare").length}</span><span>Review {mine.filter((task) => task.status === "Review").length}</span><span>Total {mine.length}</span></div>; })}</div>; }
function Certifications() { return <SmallRows rows={["Mihai Ionescu · ANRE Grad II · SSM · Lucru la înălțime", "Ioana Marinescu · PMP · PRINCE2 · ISO 9001", "Cristian Radu · Autocad · PVsyst · ZWCAD", "George Stan · ANRE Grad I · Instalații electrice", "Andrei Popescu · ISO 27001 · Manager Energie · Auditor intern"]} />; }
function ApprovalActivity({ approvals }: { approvals: V64Approval[] }) { return <SmallRows rows={approvals.map((approval) => `${approval.status} · ${approval.title} · ${v64UserById(approval.approverId)?.name}`)} />; }

function TaskDrawer({ task, currentUser, onClose, onUpdate, onAssign, onStatus, onComment, onChecklist, onAttachment }: { task: V64Task | null; currentUser: V64User; onClose: () => void; onUpdate: (taskId: string, patch: Partial<V64Task>) => void; onAssign: (taskId: string, assigneeId: string) => boolean; onStatus: (taskId: string, status: V64TaskStatus) => void; onComment: (taskId: string, body: string) => void; onChecklist: (taskId: string, checklistId: string) => void; onAttachment: (taskId: string) => void }) {
  const [commentText, setCommentText] = useState("");
  useEffect(() => setCommentText(""), [task?.id]);
  if (!task) return null;
  return <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[560px] overflow-y-auto border-l border-slate-200 bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 p-5 backdrop-blur"><div><div className="text-xs font-black text-emerald-700">{task.projectCode} · {task.departmentName}</div><input value={task.title} onChange={(event) => onUpdate(task.id, { title: event.target.value })} className="mt-1 w-full text-xl font-black outline-none" /></div><button onClick={onClose} className="rounded-xl border p-2"><X className="h-4 w-4" /></button></div><div className="space-y-5 p-5"><textarea value={task.description} onChange={(event) => onUpdate(task.id, { description: event.target.value })} className="min-h-[90px] w-full rounded-2xl border border-slate-200 p-3 text-sm font-semibold outline-none" /><div className="grid grid-cols-2 gap-3"><DrawerSelect label="Status" value={task.status} onChange={(value) => onStatus(task.id, value as V64TaskStatus)} options={statuses} /><DrawerSelect label="Prioritate" value={task.priority} onChange={(value) => onUpdate(task.id, { priority: value as V64Priority })} options={priorities} /><DrawerSelect label="Assignee" value={task.assigneeId} onChange={(value) => onAssign(task.id, value)} options={v64Users.map((user) => user.id)} labelFor={(id) => v64UserById(id)?.name ?? id} /><DrawerSelect label="Owner" value={task.ownerId} onChange={(value) => onUpdate(task.id, { ownerId: value })} options={v64Users.map((user) => user.id)} labelFor={(id) => v64UserById(id)?.name ?? id} /><label className="text-xs font-black text-slate-500">Deadline<input type="date" value={task.dueDate} onChange={(event) => onUpdate(task.id, { dueDate: event.target.value })} className="mt-1 w-full rounded-xl border p-2 text-sm text-slate-700" /></label><label className="text-xs font-black text-slate-500">Estimare ore<input type="number" value={task.estimateHours} min={0} onChange={(event) => onUpdate(task.id, { estimateHours: Number(event.target.value) })} className="mt-1 w-full rounded-xl border p-2 text-sm text-slate-700" /></label></div><Panel title="Checklist / Subtaskuri"><div className="space-y-2">{task.checklist.length ? task.checklist.map((item) => <button key={item.id} onClick={() => onChecklist(task.id, item.id)} className="flex w-full items-center gap-2 rounded-xl p-2 text-left hover:bg-slate-50"><CheckCircle2 className={item.done ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-slate-300"} /><span className="font-bold">{item.label}</span></button>) : <EmptyState label="Nu există checklist pentru acest task." />}</div></Panel><Panel title="Comentarii"><div className="space-y-3">{task.comments.map((commentItem) => <div key={commentItem.id} className="flex gap-3"><Avatar user={v64UserById(commentItem.authorId)} size="sm" /><div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold">{commentItem.body}</div></div>)}<div className="flex gap-2"><input value={commentText} onChange={(event) => setCommentText(event.target.value)} className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none" placeholder="Adaugă comentariu..." /><button onClick={() => { onComment(task.id, commentText); setCommentText(""); }} className="rounded-xl bg-emerald-700 px-3 text-sm font-black text-white">Trimite</button></div></div></Panel><Panel title="Atașamente"><div className="space-y-2">{task.attachments.map((att) => <div key={att.id} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 text-sm font-bold"><Paperclip className="h-4 w-4" />{att.name}<span className="ml-auto text-xs text-slate-500">{att.size}</span></div>)}<button onClick={() => onAttachment(task.id)} className="rounded-xl border border-dashed px-3 py-2 text-sm font-black text-emerald-700">+ Atașează fișier mock</button></div></Panel><Panel title="Activity log"><ActivityRows tasks={[task]} /></Panel><div className="rounded-2xl bg-slate-50 p-3 text-xs font-semibold text-slate-500">Vizibil pentru {currentUser.role}. Modificările se salvează în localStorage și sunt pregătite pentru mock API / backend real.</div></div></aside>;
}

function DrawerSelect({ label, value, options, onChange, labelFor }: { label: string; value: string; options: string[]; onChange: (value: string) => void; labelFor?: (value: string) => string }) { return <label className="text-xs font-black text-slate-500">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border p-2 text-sm text-slate-700">{options.map((option) => <option key={option} value={option}>{labelFor ? labelFor(option) : option}</option>)}</select></label>; }

function EmptyState({ label }: { label: string }) { return <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm font-bold text-slate-400">{label}</div>; }
function ActionModal({ kind, onClose }: { kind: ModalKind; onClose: () => void }) { if (!kind) return null; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-xl font-black">Acțiune {kind}</h3><button onClick={onClose}><X className="h-5 w-5" /></button></div><p className="mt-3 text-sm font-semibold text-slate-500">Acțiune deschisă din UI. În demo salvează/confirmă local; în backend real acest flux va apela adapterul API/Prisma/R2 corespunzător.</p><button onClick={onClose} className="mt-5 rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-black text-white">Confirmă</button></div></div>; }
function TaskuriReferenceFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 text-xs font-semibold text-slate-400">
      <span>© 2024 SERVELECT SRL. Toate drepturile rezervate.</span>
      <span className="flex items-center gap-3"><span>v6.4.5</span><span>·</span><span>Politica de confidențialitate</span><span>·</span><span>Termeni și condiții</span></span>
    </footer>
  );
}
