"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Download,
  FileText,
  Filter,
  FolderKanban,
  GitBranch,
  KanbanSquare,
  Layers3,
  ListChecks,
  MessageSquare,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  StopCircle,
  Timer,
  Trash2,
  Users,
  Workflow,
  Zap
} from "lucide-react";
import {
  GOODDAY_PARITY_STORAGE_KEY,
  buildActivity,
  buildGoodDayParitySeed,
  buildNotification,
  calculateWorkload,
  canUserSeeTask,
  createTaskFromPartial,
  exportTasksCsv,
  filterTasks,
  isOverdue,
  minutesToHours,
  type GoodDayActivity,
  type GoodDayApproval,
  type GoodDayDepartment,
  type GoodDayEntityKind,
  type GoodDayFilters,
  type GoodDayNotification,
  type GoodDayParityState,
  type GoodDayPriority,
  type GoodDayProject,
  type GoodDaySavedView,
  type GoodDayStatus,
  type GoodDayTask,
  type GoodDayTicket,
  type GoodDayTicketStatus,
  type GoodDayTimeEntry,
  type GoodDayUser
} from "@/lib/enterprise/work-os-goodday-parity-core";

type RouteView =
  | "overview"
  | "my-work"
  | "tickets-notificari"
  | "board"
  | "tabel"
  | "calendar-gantt"
  | "workload-aprobari"
  | "proiecte-active"
  | "proiecte-viitoare"
  | "proiecte-finalizate";

type BulkAction = "status-review" | "priority-high" | "assign-current" | "mark-blocked" | "delete";

const ROUTES: Array<{ id: RouteView; label: string; href: string }> = [
  { id: "overview", label: "Overview", href: "/taskuri/overview" },
  { id: "my-work", label: "My Work", href: "/taskuri/my-work" },
  { id: "tickets-notificari", label: "Tickets & Notificari", href: "/taskuri/tickets-notificari" },
  { id: "proiecte-active", label: "Proiecte active", href: "/taskuri/proiecte-active" },
  { id: "proiecte-viitoare", label: "Proiecte viitoare", href: "/taskuri/proiecte-viitoare" },
  { id: "proiecte-finalizate", label: "Proiecte finalizate", href: "/taskuri/proiecte-finalizate" },
  { id: "board", label: "Board", href: "/taskuri/board" },
  { id: "tabel", label: "Tabel", href: "/taskuri/tabel" },
  { id: "calendar-gantt", label: "Calendar & Gantt", href: "/taskuri/calendar-gantt" },
  { id: "workload-aprobari", label: "Workload & Aprobari", href: "/taskuri/workload-aprobari" }
];

const statusOptions: GoodDayStatus[] = ["Backlog", "De facut", "In lucru", "Review", "Blocat", "Aprobare", "Finalizat", "Anulat"];
const boardStatuses: GoodDayStatus[] = ["Backlog", "De facut", "In lucru", "Review", "Blocat", "Aprobare", "Finalizat"];
const priorityOptions: GoodDayPriority[] = ["Low", "Normal", "High", "Urgent", "Critical"];
const ticketStatuses: GoodDayTicketStatus[] = ["Nou", "In triere", "In lucru", "Asteapta client", "Escaladat", "Rezolvat", "Inchis"];
const departments: GoodDayDepartment[] = ["Management", "Audit", "Administrativ", "Automatizari", "Audit energetic", "Comercial", "Marketing", "Productie", "Mentenanta", "Achizitii", "Financiar"];

function cloneState(state: GoodDayParityState): GoodDayParityState {
  if (typeof structuredClone === "function") return structuredClone(state);
  return JSON.parse(JSON.stringify(state)) as GoodDayParityState;
}

function normalizeState(candidate: Partial<GoodDayParityState> | null | undefined): GoodDayParityState {
  const seed = buildGoodDayParitySeed();
  return {
    users: Array.isArray(candidate?.users) ? candidate.users : seed.users,
    clients: Array.isArray(candidate?.clients) ? candidate.clients : seed.clients,
    projects: Array.isArray(candidate?.projects) ? candidate.projects : seed.projects,
    tasks: Array.isArray(candidate?.tasks) ? candidate.tasks.map(normalizeTask) : seed.tasks,
    tickets: Array.isArray(candidate?.tickets) ? candidate.tickets.map(normalizeTicket) : seed.tickets,
    notifications: Array.isArray(candidate?.notifications) ? candidate.notifications : seed.notifications,
    approvals: Array.isArray(candidate?.approvals) ? candidate.approvals : seed.approvals,
    timeEntries: Array.isArray(candidate?.timeEntries) ? candidate.timeEntries : seed.timeEntries,
    savedViews: Array.isArray(candidate?.savedViews) ? candidate.savedViews : seed.savedViews,
    automations: Array.isArray(candidate?.automations) ? candidate.automations : seed.automations,
    auditLog: Array.isArray(candidate?.auditLog) ? candidate.auditLog : seed.auditLog
  };
}

function normalizeTask(task: GoodDayTask): GoodDayTask {
  return {
    ...task,
    watcherIds: Array.isArray(task.watcherIds) ? task.watcherIds : [],
    tags: Array.isArray(task.tags) ? task.tags : [],
    dependencyIds: Array.isArray(task.dependencyIds) ? task.dependencyIds : [],
    checklist: Array.isArray(task.checklist) ? task.checklist : [],
    comments: Array.isArray(task.comments) ? task.comments : [],
    attachments: Array.isArray(task.attachments) ? task.attachments : [],
    activity: Array.isArray(task.activity) ? task.activity : [],
    customFields: task.customFields ?? {},
    approvalState: task.approvalState ?? "None",
    progress: Number.isFinite(task.progress) ? task.progress : 0,
    estimateMinutes: Number.isFinite(task.estimateMinutes) ? task.estimateMinutes : 120
  };
}

function normalizeTicket(ticket: GoodDayTicket): GoodDayTicket {
  return {
    ...ticket,
    comments: Array.isArray(ticket.comments) ? ticket.comments : [],
    attachments: Array.isArray(ticket.attachments) ? ticket.attachments : [],
    escalated: Boolean(ticket.escalated)
  };
}

function loadState(): GoodDayParityState {
  if (typeof window === "undefined") return buildGoodDayParitySeed();
  try {
    const raw = window.localStorage.getItem(GOODDAY_PARITY_STORAGE_KEY);
    if (!raw) return buildGoodDayParitySeed();
    return normalizeState(JSON.parse(raw) as Partial<GoodDayParityState>);
  } catch {
    return buildGoodDayParitySeed();
  }
}

function formatDate(value?: string) {
  if (!value) return "-";
  return value.slice(0, 10);
}

function byId<T extends { id: string }>(items: T[], id?: string) {
  return items.find((item) => item.id === id);
}

function priorityTone(priority: GoodDayPriority) {
  if (priority === "Critical") return "bg-red-100 text-red-700 border-red-200";
  if (priority === "Urgent") return "bg-orange-100 text-orange-700 border-orange-200";
  if (priority === "High") return "bg-amber-100 text-amber-700 border-amber-200";
  if (priority === "Normal") return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function statusTone(status: GoodDayStatus | GoodDayTicketStatus | GoodDayApproval["status"]) {
  if (["Finalizat", "Rezolvat", "Inchis", "Approved"].includes(status)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (["Blocat", "Escaladat", "Rejected"].includes(status)) return "bg-red-50 text-red-700 border-red-200";
  if (["Aprobare", "Pending", "Review"].includes(status)) return "bg-purple-50 text-purple-700 border-purple-200";
  if (["In lucru", "In triere"].includes(status)) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function routeTitle(route: RouteView) {
  return ROUTES.find((item) => item.id === route)?.label ?? "Taskuri";
}

export function TaskuriGoodDayIntegrationClient({ route }: { route: RouteView }) {
  const [state, setState] = useState<GoodDayParityState>(() => loadState());
  const [currentUserId, setCurrentUserId] = useState("u_andrei");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [taskDraft, setTaskDraft] = useState("Task nou Servelect din pagina reala Taskuri");
  const [ticketDraft, setTicketDraft] = useState("Ticket nou: verificare alerta client / echipament");
  const [commentDraft, setCommentDraft] = useState("");
  const [timeDraft, setTimeDraft] = useState("45");
  const [timerTaskId, setTimerTaskId] = useState<string | null>(null);
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(null);
  const [lastExport, setLastExport] = useState("");
  const [filters, setFilters] = useState<GoodDayFilters>({ search: "", status: "all", priority: "all", assigneeId: "all", department: "all", projectId: "all" });
  const currentUser = byId(state.users, currentUserId) ?? state.users[0];

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(GOODDAY_PARITY_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const allVisibleTasks = useMemo(() => {
    const roleFiltered = state.tasks.filter((task) => canUserSeeTask(currentUser, task, state.projects));
    return filterTasks(roleFiltered, filters);
  }, [state.tasks, state.projects, filters, currentUser]);

  const myTasks = useMemo(() => allVisibleTasks.filter((task) => task.assigneeId === currentUser.id || task.ownerId === currentUser.id || task.watcherIds.includes(currentUser.id)), [allVisibleTasks, currentUser.id]);
  const overdueTasks = useMemo(() => allVisibleTasks.filter((task) => isOverdue(task.dueDate) && task.status !== "Finalizat"), [allVisibleTasks]);
  const urgentTasks = useMemo(() => allVisibleTasks.filter((task) => task.priority === "Urgent" || task.priority === "Critical" || task.status === "Blocat"), [allVisibleTasks]);
  const unreadNotifications = state.notifications.filter((notification) => notification.userId === currentUser.id && !notification.read);
  const tickets = state.tickets.filter((ticket) => currentUser.role === "Super Admin" || currentUser.role === "Global Admin" || ticket.assigneeId === currentUser.id || ticket.requesterId === currentUser.id || byId(state.projects, ticket.projectId)?.department === currentUser.department);
  const workload = useMemo(() => calculateWorkload(state.users, state.tasks, state.timeEntries), [state.users, state.tasks, state.timeEntries]);
  const selectedTask: GoodDayTask | null = selectedTaskId ? byId(state.tasks, selectedTaskId) ?? null : null;
  const selectedTicket: GoodDayTicket | null = selectedTicketId ? byId(state.tickets, selectedTicketId) ?? null : null;

  const routeTasks = useMemo(() => {
    if (route === "my-work") return myTasks;
    if (route === "proiecte-active") return allVisibleTasks.filter((task) => byId(state.projects, task.projectId)?.status === "Activ");
    if (route === "proiecte-viitoare") return allVisibleTasks.filter((task) => byId(state.projects, task.projectId)?.status === "Viitor");
    if (route === "proiecte-finalizate") return allVisibleTasks.filter((task) => byId(state.projects, task.projectId)?.status === "Finalizat");
    return allVisibleTasks;
  }, [route, myTasks, allVisibleTasks, state.projects]);

  function updateState(mutator: (draft: GoodDayParityState) => void) {
    setState((previous) => {
      const draft = cloneState(previous);
      mutator(draft);
      return normalizeState(draft);
    });
  }

  function pushAudit(draft: GoodDayParityState, entityId: string, entityKind: GoodDayEntityKind, action: string, detail?: string) {
    const activity = buildActivity(entityId, entityKind, currentUser.id, action, detail);
    draft.auditLog.unshift(activity);
    const task = byId(draft.tasks, entityId);
    if (task) task.activity.unshift(activity);
  }

  function notify(draft: GoodDayParityState, userId: string, title: string, body: string, entityKind: GoodDayEntityKind, entityId: string, kind: GoodDayNotification["kind"]) {
    draft.notifications.unshift(buildNotification(userId, title, body, entityKind, entityId, kind));
  }

  function createTask(title = taskDraft) {
    if (!title.trim()) return;
    updateState((draft) => {
      const project = draft.projects[0];
      const task = createTaskFromPartial({
        title: title.trim(),
        projectId: project?.id ?? "p_green_500",
        ownerId: currentUser.id,
        assigneeId: currentUser.id,
        department: currentUser.department,
        priority: "Normal",
        type: "Task",
        tags: ["taskuri-real", route]
      });
      draft.tasks.unshift(task);
      pushAudit(draft, task.id, "task", "Task created from real Taskuri page", route);
      notify(draft, task.assigneeId, "Task nou alocat", task.title, "task", task.id, "task_assigned");
      setSelectedTaskId(task.id);
    });
    setTaskDraft("Task nou Servelect din pagina reala Taskuri");
  }

  function updateTask(taskId: string, patch: Partial<GoodDayTask>, action = "Task updated") {
    updateState((draft) => {
      const index = draft.tasks.findIndex((task) => task.id === taskId);
      if (index < 0) return;
      const before = draft.tasks[index];
      const next = { ...before, ...patch, updatedAt: new Date().toISOString() };
      draft.tasks[index] = next;
      pushAudit(draft, taskId, "task", action, Object.keys(patch).join(", "));
      if (patch.assigneeId && patch.assigneeId !== before.assigneeId) notify(draft, patch.assigneeId, "Task reasignat", next.title, "task", taskId, "task_assigned");
    });
  }

  function deleteTask(taskId: string) {
    updateState((draft) => {
      draft.tasks = draft.tasks.filter((task) => task.id !== taskId);
      pushAudit(draft, taskId, "task", "Task deleted");
    });
    setSelectedTaskId(null);
    setSelectedRows((rows) => rows.filter((id) => id !== taskId));
  }

  function addComment(taskId: string) {
    if (!commentDraft.trim()) return;
    updateState((draft) => {
      const task = byId(draft.tasks, taskId);
      if (!task) return;
      task.comments.unshift({ id: `com_${Date.now()}`, authorId: currentUser.id, body: commentDraft.trim(), createdAt: new Date().toISOString() });
      pushAudit(draft, taskId, "task", "Comment added", commentDraft.trim());
      task.watcherIds.forEach((watcherId) => watcherId !== currentUser.id && notify(draft, watcherId, "Comentariu nou", task.title, "task", task.id, "mention"));
    });
    setCommentDraft("");
  }

  function toggleChecklist(taskId: string, itemId: string) {
    updateState((draft) => {
      const task = byId(draft.tasks, taskId);
      const item = task?.checklist.find((check) => check.id === itemId);
      if (!task || !item) return;
      item.done = !item.done;
      const done = task.checklist.filter((check) => check.done).length;
      task.progress = Math.round((done / Math.max(task.checklist.length, 1)) * 100);
      pushAudit(draft, taskId, "task", "Checklist toggled", item.title);
    });
  }

  function addChecklistItem(taskId: string) {
    updateState((draft) => {
      const task = byId(draft.tasks, taskId);
      if (!task) return;
      const item = { id: `chk_${Date.now()}`, title: "Subtask nou / checklist", done: false };
      task.checklist.unshift(item);
      pushAudit(draft, taskId, "task", "Checklist item added", item.title);
    });
  }

  function addAttachment(taskId: string) {
    updateState((draft) => {
      const task = byId(draft.tasks, taskId);
      if (!task) return;
      task.attachments.unshift({ id: `att_${Date.now()}`, name: "document-mock-servelect.pdf", type: "PDF", url: "#" });
      pushAudit(draft, taskId, "task", "Attachment mock added", "document-mock-servelect.pdf");
    });
  }

  function addTime(taskId: string, minutes = Number.parseInt(timeDraft, 10)) {
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    updateState((draft) => {
      const entry: GoodDayTimeEntry = { id: `time_${Date.now()}`, taskId, userId: currentUser.id, date: new Date().toISOString().slice(0, 10), minutes, note: "Time entry din ruta reala Taskuri", source: "Manual" };
      draft.timeEntries.unshift(entry);
      pushAudit(draft, taskId, "time", "Time entry added", `${minutes} min`);
    });
  }

  function startTimer(taskId: string) {
    setTimerTaskId(taskId);
    setTimerStartedAt(Date.now());
  }

  function stopTimer() {
    if (!timerTaskId || !timerStartedAt) return;
    const elapsed = Math.max(1, Math.round((Date.now() - timerStartedAt) / 60000));
    addTime(timerTaskId, elapsed);
    setTimerTaskId(null);
    setTimerStartedAt(null);
  }

  function createTicket(title = ticketDraft) {
    if (!title.trim()) return;
    updateState((draft) => {
      const project = draft.projects[0];
      const ticket: GoodDayTicket = {
        id: `tick_${Date.now()}`,
        title: title.trim(),
        type: title.toLowerCase().includes("invertor") ? "IoT" : "Internal",
        severity: "High",
        status: "Nou",
        slaDueAt: new Date(Date.now() + 36 * 3600000).toISOString(),
        requesterId: currentUser.id,
        assigneeId: draft.users.find((user) => user.role === "Tehnician")?.id ?? currentUser.id,
        projectId: project?.id,
        clientId: project?.clientId,
        equipmentId: title.toLowerCase().includes("invertor") ? "eq_inv_mock" : undefined,
        escalated: false,
        comments: [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      draft.tickets.unshift(ticket);
      pushAudit(draft, ticket.id, "ticket", "Ticket created", ticket.title);
      notify(draft, ticket.assigneeId, "Ticket nou", ticket.title, "ticket", ticket.id, "sla_risk");
      setSelectedTicketId(ticket.id);
    });
    setTicketDraft("Ticket nou: verificare alerta client / echipament");
  }

  function escalateTicket(ticketId: string) {
    updateState((draft) => {
      const ticket = byId(draft.tickets, ticketId);
      if (!ticket) return;
      ticket.status = "Escaladat";
      ticket.escalated = true;
      ticket.updatedAt = new Date().toISOString();
      pushAudit(draft, ticketId, "ticket", "Ticket escalated", ticket.title);
      const manager = draft.users.find((user) => user.role === "Manager" || user.role === "Super Admin");
      if (manager) notify(draft, manager.id, "Ticket escaladat", ticket.title, "ticket", ticket.id, "ticket_escalated");
    });
  }

  function updateTicket(ticketId: string, patch: Partial<GoodDayTicket>) {
    updateState((draft) => {
      const ticket = byId(draft.tickets, ticketId);
      if (!ticket) return;
      Object.assign(ticket, patch, { updatedAt: new Date().toISOString() });
      pushAudit(draft, ticketId, "ticket", "Ticket updated", Object.keys(patch).join(", "));
    });
  }

  function convertTicketToTask(ticketId: string) {
    updateState((draft) => {
      const ticket = byId(draft.tickets, ticketId);
      if (!ticket) return;
      const assignee = byId(draft.users, ticket.assigneeId) ?? currentUser;
      const task = createTaskFromPartial({
        title: `Task din ticket: ${ticket.title}`,
        description: `Task generat din ticket ${ticket.id}. SLA: ${formatDate(ticket.slaDueAt)}.`,
        type: ticket.type === "IoT" ? "IoT Alert" : "Ticket",
        status: "De facut",
        priority: ticket.severity,
        projectId: ticket.projectId ?? draft.projects[0]?.id ?? "p_green_500",
        ownerId: currentUser.id,
        assigneeId: assignee.id,
        department: assignee.department,
        relatedTicketId: ticket.id,
        relatedEquipmentId: ticket.equipmentId,
        tags: ["ticket", ticket.type.toLowerCase()]
      });
      draft.tasks.unshift(task);
      ticket.taskId = task.id;
      pushAudit(draft, ticket.id, "ticket", "Ticket converted to task", task.title);
      pushAudit(draft, task.id, "task", "Created from ticket", ticket.title);
      notify(draft, task.assigneeId, "Task generat din ticket", task.title, "task", task.id, "task_assigned");
      setSelectedTaskId(task.id);
    });
  }

  function setNotificationRead(notificationId: string) {
    updateState((draft) => {
      const notification = byId(draft.notifications, notificationId);
      if (!notification) return;
      notification.read = true;
      pushAudit(draft, notification.entityId, "notification", "Notification marked read", notification.title);
    });
  }

  function decideApproval(approvalId: string, status: "Approved" | "Rejected") {
    updateState((draft) => {
      const approval = byId(draft.approvals, approvalId);
      if (!approval) return;
      approval.status = status;
      approval.decidedAt = new Date().toISOString();
      approval.comment = status === "Approved" ? "Aprobat din ruta reala Taskuri" : "Respins pentru completari";
      approval.history.unshift(buildActivity(approval.entityId, approval.entityKind, currentUser.id, `Approval ${status}`, approval.comment));
      pushAudit(draft, approval.entityId, approval.entityKind, `Approval ${status}`, approval.title);
      if (approval.entityKind === "task") {
        const task = byId(draft.tasks, approval.entityId);
        if (task) task.approvalState = status;
      }
      notify(draft, approval.requesterId, `Approval ${status}`, approval.title, "approval", approval.id, "approval_requested");
    });
  }

  function saveCurrentView() {
    updateState((draft) => {
      const view: GoodDaySavedView = { id: `sv_${Date.now()}`, name: `View ${routeTitle(route)} ${draft.savedViews.length + 1}`, scope: route === "tickets-notificari" ? "tickets" : route === "workload-aprobari" ? "workload" : "tasks", filters, columns: ["title", "status", "priority", "assignee", "dueDate"], grouping: route, ownerId: currentUser.id, shared: true };
      draft.savedViews.unshift(view);
      pushAudit(draft, view.id, "automation", "Saved view created", view.name);
    });
  }

  function applySavedView(view: GoodDaySavedView) {
    setFilters({ ...view.filters });
  }

  function bulkApply(action: BulkAction) {
    if (selectedRows.length === 0) return;
    updateState((draft) => {
      if (action === "delete") {
        draft.tasks = draft.tasks.filter((task) => !selectedRows.includes(task.id));
        return;
      }
      draft.tasks = draft.tasks.map((task) => {
        if (!selectedRows.includes(task.id)) return task;
        if (action === "status-review") return { ...task, status: "Review", updatedAt: new Date().toISOString() };
        if (action === "priority-high") return { ...task, priority: "High", updatedAt: new Date().toISOString() };
        if (action === "assign-current") return { ...task, assigneeId: currentUser.id, updatedAt: new Date().toISOString() };
        if (action === "mark-blocked") return { ...task, status: "Blocat", updatedAt: new Date().toISOString() };
        return task;
      });
      selectedRows.forEach((taskId) => pushAudit(draft, taskId, "task", `Bulk action ${action}`));
    });
    setSelectedRows([]);
  }

  function exportCurrentCsv() {
    const csv = exportTasksCsv(routeTasks, state.projects, state.users);
    setLastExport(csv.slice(0, 600));
    if (typeof window !== "undefined") {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `servelect-taskuri-${route}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  function runAutomation(kind: "iot" | "stock" | "handover" | "cert") {
    if (kind === "iot") createTicket("IoT alarm: invertor offline detectat automat");
    if (kind === "stock") createTask("Stoc sub minim: creeaza task achizitii cablu solar");
    if (kind === "handover") createTask("Proiect finalizat: checklist handover si documente client");
    if (kind === "cert") createTask("Certificare ANRE expira: task HR pentru reinnoire");
  }

  function resetData() {
    setState(buildGoodDayParitySeed());
    setSelectedRows([]);
    setSelectedTaskId(null);
    setSelectedTicketId(null);
  }

  return (
    <main data-audit-page="taskuri" data-audit-route={route} data-audit-ready="true" className="space-y-5">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
              <FolderKanban className="h-4 w-4" /> SERVELECT Taskuri real core
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{routeTitle(route)}</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
              Rutele reale /taskuri folosesc acelasi GoodDay-like functional core: taskuri, tickete, notificari, approvals, saved views, workload, time tracking si persistenta localStorage.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={currentUserId} onChange={(event) => setCurrentUserId(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-emerald-300">
              {state.users.map((user) => <option key={user.id} value={user.id}>{user.name} - {user.role}</option>)}
            </select>
            {timerTaskId ? <button onClick={stopTimer} className="btn-secondary"><StopCircle className="h-4 w-4" /> Stop timer</button> : null}
            <button onClick={resetData} className="btn-secondary"><RefreshCw className="h-4 w-4" /> Reset</button>
            <button onClick={() => createTask()} className="btn-primary"><Plus className="h-4 w-4" /> Task nou</button>
          </div>
        </div>
        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {ROUTES.map((item) => (
            <Link key={item.id} href={item.href} className={item.id === route ? "whitespace-nowrap rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white" : "whitespace-nowrap rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"}>{item.label}</Link>
          ))}
        </nav>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Metric label="Taskuri vizibile" value={routeTasks.length} icon={<ClipboardList />} />
        <Metric label="Urgente / blocate" value={urgentTasks.length} icon={<AlertTriangle />} tone="red" />
        <Metric label="Tickete" value={tickets.length} icon={<Bell />} tone="orange" />
        <Metric label="Notificari unread" value={unreadNotifications.length} icon={<Bell />} tone="blue" />
        <Metric label="Approvals pending" value={state.approvals.filter((approval) => approval.status === "Pending").length} icon={<ShieldCheck />} tone="purple" />
        <Metric label="Ore pontate" value={minutesToHours(state.timeEntries.reduce((sum, entry) => sum + entry.minutes, 0))} icon={<Timer />} tone="green" />
      </section>

      <section className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_160px_160px_180px_180px_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={filters.search ?? ""} onChange={(event) => setFilters((old) => ({ ...old, search: event.target.value }))} placeholder="Cauta task, tag, document, client..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm font-semibold outline-none focus:border-emerald-300" />
          </label>
          <Select value={filters.status ?? "all"} onChange={(value) => setFilters((old) => ({ ...old, status: value }))} options={["all", ...statusOptions]} />
          <Select value={filters.priority ?? "all"} onChange={(value) => setFilters((old) => ({ ...old, priority: value }))} options={["all", ...priorityOptions]} />
          <Select value={filters.assigneeId ?? "all"} onChange={(value) => setFilters((old) => ({ ...old, assigneeId: value }))} options={["all", ...state.users.map((user) => user.id)]} labels={Object.fromEntries(state.users.map((user) => [user.id, user.name]))} />
          <Select value={filters.department ?? "all"} onChange={(value) => setFilters((old) => ({ ...old, department: value }))} options={["all", ...departments]} />
          <button onClick={saveCurrentView} className="btn-secondary"><Save className="h-4 w-4" /> Salveaza view</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {state.savedViews.slice(0, 6).map((view) => <button key={view.id} onClick={() => applySavedView(view)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 hover:border-emerald-200 hover:bg-emerald-50">{view.name}</button>)}
        </div>
      </section>

      {route === "overview" && <OverviewPanel tasks={routeTasks} projects={state.projects} users={state.users} tickets={tickets} notifications={unreadNotifications} audit={state.auditLog} onTask={setSelectedTaskId} onTicket={setSelectedTicketId} runAutomation={runAutomation} />}
      {route === "my-work" && <MyWorkPanel tasks={myTasks} currentUser={currentUser} users={state.users} projects={state.projects} onTask={setSelectedTaskId} startTimer={startTimer} />}
      {route === "tickets-notificari" && <TicketsPanel tickets={tickets} notifications={state.notifications.filter((item) => item.userId === currentUser.id)} users={state.users} projects={state.projects} ticketDraft={ticketDraft} setTicketDraft={setTicketDraft} createTicket={() => createTicket()} escalateTicket={escalateTicket} updateTicket={updateTicket} convertTicketToTask={convertTicketToTask} markRead={setNotificationRead} onTicket={setSelectedTicketId} />}
      {route === "board" && <BoardPanel tasks={routeTasks} projects={state.projects} users={state.users} onTask={setSelectedTaskId} updateTask={updateTask} />}
      {route === "tabel" && <TablePanel tasks={routeTasks} projects={state.projects} users={state.users} selectedRows={selectedRows} setSelectedRows={setSelectedRows} onTask={setSelectedTaskId} updateTask={updateTask} bulkApply={bulkApply} exportCsv={exportCurrentCsv} lastExport={lastExport} />}
      {route === "calendar-gantt" && <CalendarGanttPanel tasks={routeTasks} projects={state.projects} users={state.users} onTask={setSelectedTaskId} updateTask={updateTask} />}
      {route === "workload-aprobari" && <WorkloadApprovalsPanel workload={workload} approvals={state.approvals} tasks={state.tasks} users={state.users} decideApproval={decideApproval} onTask={setSelectedTaskId} />}
      {route === "proiecte-active" && <ProjectsPanel kind="Activ" projects={state.projects.filter((project) => project.status === "Activ")} tasks={state.tasks} users={state.users} onTask={setSelectedTaskId} />}
      {route === "proiecte-viitoare" && <ProjectsPanel kind="Viitor" projects={state.projects.filter((project) => project.status === "Viitor")} tasks={state.tasks} users={state.users} onTask={setSelectedTaskId} />}
      {route === "proiecte-finalizate" && <ProjectsPanel kind="Finalizat" projects={state.projects.filter((project) => project.status === "Finalizat")} tasks={state.tasks} users={state.users} onTask={setSelectedTaskId} />}

      <TaskDrawer
        task={selectedTask}
        ticket={selectedTicket}
        users={state.users}
        projects={state.projects}
        timeEntries={state.timeEntries.filter((entry) => entry.taskId === selectedTask?.id)}
        commentDraft={commentDraft}
        setCommentDraft={setCommentDraft}
        timeDraft={timeDraft}
        setTimeDraft={setTimeDraft}
        updateTask={updateTask}
        deleteTask={deleteTask}
        addComment={addComment}
        toggleChecklist={toggleChecklist}
        addChecklistItem={addChecklistItem}
        addAttachment={addAttachment}
        addTime={addTime}
        startTimer={startTimer}
        close={() => { setSelectedTaskId(null); setSelectedTicketId(null); }}
      />
    </main>
  );
}

function Metric({ label, value, icon, tone = "slate" }: { label: string; value: ReactNode; icon: ReactNode; tone?: "slate" | "red" | "orange" | "blue" | "purple" | "green" }) {
  const tones = {
    slate: "bg-slate-50 text-slate-700",
    red: "bg-red-50 text-red-700",
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-emerald-50 text-emerald-700"
  };
  return <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}>{icon}</div><div className="text-right"><div className="text-2xl font-black text-slate-950">{value}</div><div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div></div></div></div>;
}

function Select({ value, onChange, options, labels = {} }: { value: string; onChange: (value: string) => void; options: string[]; labels?: Record<string, string> }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-emerald-300">{options.map((option) => <option key={option} value={option}>{labels[option] ?? (option === "all" ? "Toate" : option)}</option>)}</select>;
}

function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black ${className}`}>{children}</span>;
}

function TaskCard({ task, users, projects, onTask, compact = false }: { task: GoodDayTask; users: GoodDayUser[]; projects: GoodDayProject[]; onTask: (id: string) => void; compact?: boolean }) {
  const project = byId(projects, task.projectId);
  const assignee = byId(users, task.assigneeId);
  return (
    <button onClick={() => onTask(task.id)} className="block w-full rounded-[1.2rem] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3"><div><div className="text-xs font-black text-slate-400">{project?.code ?? task.projectId}</div><h3 className="mt-1 line-clamp-2 text-sm font-black text-slate-950">{task.title}</h3></div><Pill className={priorityTone(task.priority)}>{task.priority}</Pill></div>
      {!compact && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><span>{assignee?.name ?? task.assigneeId}</span><span>•</span><span>{formatDate(task.dueDate)}</span><Pill className={statusTone(task.status)}>{task.status}</Pill></div>
    </button>
  );
}

function OverviewPanel({ tasks, projects, users, tickets, notifications, audit, onTask, onTicket, runAutomation }: { tasks: GoodDayTask[]; projects: GoodDayProject[]; users: GoodDayUser[]; tickets: GoodDayTicket[]; notifications: GoodDayNotification[]; audit: GoodDayActivity[]; onTask: (id: string) => void; onTicket: (id: string) => void; runAutomation: (kind: "iot" | "stock" | "handover" | "cert") => void }) {
  return <section className="grid gap-5 xl:grid-cols-[1.35fr_0.8fr]">
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
      <PanelTitle icon={<Layers3 />} title="Command center real" subtitle="Taskuri, tickete, notificari, activitate si automatizari legate de aceeasi stare." />
      <div className="mt-4 grid gap-3 lg:grid-cols-2">{tasks.slice(0, 8).map((task) => <TaskCard key={task.id} task={task} users={users} projects={projects} onTask={onTask} />)}</div>
    </div>
    <aside className="space-y-5">
      <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"><PanelTitle icon={<Zap />} title="Automations Servelect" subtitle="Exemple GoodDay-like adaptate PV/operatiuni." /><div className="mt-4 grid gap-2"><button onClick={() => runAutomation("iot")} className="btn-secondary justify-start">IoT alarm - creeaza ticket</button><button onClick={() => runAutomation("stock")} className="btn-secondary justify-start">Stock low - task achizitii</button><button onClick={() => runAutomation("handover")} className="btn-secondary justify-start">Project done - handover checklist</button><button onClick={() => runAutomation("cert")} className="btn-secondary justify-start">ANRE expira - HR task</button></div></div>
      <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"><PanelTitle icon={<Bell />} title="Tickets & notificari" subtitle="Click pentru detalii." /><div className="mt-4 space-y-2">{tickets.slice(0, 4).map((ticket) => <button key={ticket.id} onClick={() => onTicket(ticket.id)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left"><b className="text-sm text-slate-950">{ticket.title}</b><div className="mt-1 flex gap-2"><Pill className={priorityTone(ticket.severity)}>{ticket.severity}</Pill><Pill className={statusTone(ticket.status)}>{ticket.status}</Pill></div></button>)}{notifications.slice(0, 3).map((notification) => <div key={notification.id} className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"><b>{notification.title}</b><div>{notification.body}</div></div>)}</div></div>
      <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"><PanelTitle icon={<Activity />} title="Activity feed" subtitle="Audit log real localStorage." /><div className="mt-4 space-y-2">{audit.slice(0, 6).map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600"><b className="text-slate-900">{item.action}</b><div>{item.detail ?? item.entityKind} • {new Date(item.createdAt).toLocaleString()}</div></div>)}</div></div>
    </aside>
  </section>;
}

function MyWorkPanel({ tasks, currentUser, users, projects, onTask, startTimer }: { tasks: GoodDayTask[]; currentUser: GoodDayUser; users: GoodDayUser[]; projects: GoodDayProject[]; onTask: (id: string) => void; startTimer: (id: string) => void }) {
  const buckets = [
    { title: "Assigned to me", items: tasks.filter((task) => task.assigneeId === currentUser.id) },
    { title: "Created by me", items: tasks.filter((task) => task.ownerId === currentUser.id) },
    { title: "Watched", items: tasks.filter((task) => task.watcherIds.includes(currentUser.id)) },
    { title: "Overdue / urgent", items: tasks.filter((task) => isOverdue(task.dueDate) || task.priority === "Urgent" || task.priority === "Critical") }
  ];
  return <section className="grid gap-5 xl:grid-cols-4">{buckets.map((bucket) => <div key={bucket.title} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><h2 className="font-black text-slate-950">{bucket.title}</h2><Pill className="border-slate-200 bg-white text-slate-700">{bucket.items.length}</Pill></div><div className="space-y-3">{bucket.items.slice(0, 8).map((task) => <div key={task.id} className="space-y-2"><TaskCard task={task} users={users} projects={projects} onTask={onTask} compact /><button onClick={() => startTimer(task.id)} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700"><Play className="mr-1 inline h-3 w-3" /> Start timer</button></div>)}{bucket.items.length === 0 && <EmptyState text="Nu exista item-uri in bucket." />}</div></div>)}</section>;
}

function TicketsPanel(props: { tickets: GoodDayTicket[]; notifications: GoodDayNotification[]; users: GoodDayUser[]; projects: GoodDayProject[]; ticketDraft: string; setTicketDraft: (value: string) => void; createTicket: () => void; escalateTicket: (id: string) => void; updateTicket: (id: string, patch: Partial<GoodDayTicket>) => void; convertTicketToTask: (id: string) => void; markRead: (id: string) => void; onTicket: (id: string) => void }) {
  const { tickets, notifications, users, projects, ticketDraft, setTicketDraft, createTicket, escalateTicket, updateTicket, convertTicketToTask, markRead, onTicket } = props;
  return <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"><PanelTitle icon={<Bell />} title="Tickets / requests real" subtitle="Create, status, SLA, escalate, convert to task." /><div className="mt-4 flex gap-2"><input value={ticketDraft} onChange={(event) => setTicketDraft(event.target.value)} className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold outline-none focus:border-emerald-300" /><button onClick={createTicket} className="btn-primary"><Plus className="h-4 w-4" /> Ticket</button></div><div className="mt-4 space-y-3">{tickets.map((ticket) => <div key={ticket.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"><button onClick={() => onTicket(ticket.id)} className="block w-full text-left"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black text-slate-950">{ticket.title}</h3><p className="mt-1 text-xs font-semibold text-slate-500">{byId(projects, ticket.projectId)?.name ?? "Fara proiect"} • {byId(users, ticket.assigneeId)?.name ?? ticket.assigneeId}</p></div><div className="flex gap-2"><Pill className={priorityTone(ticket.severity)}>{ticket.severity}</Pill><Pill className={statusTone(ticket.status)}>{ticket.status}</Pill></div></div></button><div className="mt-3 flex flex-wrap gap-2"><Select value={ticket.status} onChange={(value) => updateTicket(ticket.id, { status: value as GoodDayTicketStatus })} options={ticketStatuses} /><button onClick={() => escalateTicket(ticket.id)} className="btn-secondary">Escaladeaza</button><button onClick={() => convertTicketToTask(ticket.id)} className="btn-secondary">Convert to task</button></div></div>)}</div></div>
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"><PanelTitle icon={<MessageSquare />} title="Notification center" subtitle="Unread/read, linked entity." /><div className="mt-4 space-y-3">{notifications.map((notification) => <div key={notification.id} className={notification.read ? "rounded-2xl border border-slate-200 bg-white p-3" : "rounded-2xl border border-blue-200 bg-blue-50 p-3"}><div className="flex items-start justify-between gap-3"><div><b className="text-sm text-slate-950">{notification.title}</b><p className="text-xs text-slate-600">{notification.body}</p><p className="mt-1 text-[11px] font-bold uppercase text-slate-400">{notification.entityKind} • {notification.entityId}</p></div>{!notification.read && <button onClick={() => markRead(notification.id)} className="rounded-xl bg-blue-600 px-3 py-1 text-xs font-black text-white">Citit</button>}</div></div>)}</div></div>
  </section>;
}

function BoardPanel({ tasks, projects, users, onTask, updateTask }: { tasks: GoodDayTask[]; projects: GoodDayProject[]; users: GoodDayUser[]; onTask: (id: string) => void; updateTask: (id: string, patch: Partial<GoodDayTask>, action?: string) => void }) {
  return <section className="overflow-x-auto rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm"><div className="grid min-w-[1280px] gap-3" style={{ gridTemplateColumns: `repeat(${boardStatuses.length}, minmax(170px, 1fr))` }}>{boardStatuses.map((status) => { const column = tasks.filter((task) => task.status === status); return <div key={status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const id = event.dataTransfer.getData("text/task-id"); if (id) updateTask(id, { status }, "Board status changed"); }} className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-3"><div className="mb-3 flex items-center justify-between"><b className="text-sm text-slate-950">{status}</b><Pill className={statusTone(status)}>{column.length}</Pill></div><div className="space-y-3">{column.map((task) => <div key={task.id} draggable onDragStart={(event) => event.dataTransfer.setData("text/task-id", task.id)}><TaskCard task={task} users={users} projects={projects} onTask={onTask} compact /></div>)}</div></div>; })}</div></section>;
}

function TablePanel(props: { tasks: GoodDayTask[]; projects: GoodDayProject[]; users: GoodDayUser[]; selectedRows: string[]; setSelectedRows: (ids: string[]) => void; onTask: (id: string) => void; updateTask: (id: string, patch: Partial<GoodDayTask>, action?: string) => void; bulkApply: (action: BulkAction) => void; exportCsv: () => void; lastExport: string }) {
  const { tasks, projects, users, selectedRows, setSelectedRows, onTask, updateTask, bulkApply, exportCsv, lastExport } = props;
  function toggle(id: string) { setSelectedRows(selectedRows.includes(id) ? selectedRows.filter((item) => item !== id) : [...selectedRows, id]); }
  return <section className="rounded-[1.6rem] border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div className="flex flex-wrap items-center gap-2"><Pill className="border-slate-200 bg-slate-50 text-slate-700">selectate: {selectedRows.length}</Pill><button onClick={() => bulkApply("status-review")} className="btn-secondary">Review</button><button onClick={() => bulkApply("priority-high")} className="btn-secondary">High priority</button><button onClick={() => bulkApply("assign-current")} className="btn-secondary">Assign current</button><button onClick={() => bulkApply("mark-blocked")} className="btn-secondary">Blocheaza</button><button onClick={() => bulkApply("delete")} className="btn-secondary"><Trash2 className="h-4 w-4" /> Sterge</button></div><button onClick={exportCsv} className="btn-primary"><Download className="h-4 w-4" /> Export CSV</button></div><div className="overflow-x-auto"><table className="min-w-[1160px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Sel</th><th className="p-3">Task</th><th className="p-3">Project</th><th className="p-3">Assignee</th><th className="p-3">Status</th><th className="p-3">Priority</th><th className="p-3">Due</th><th className="p-3">Estimate</th><th className="p-3">Progress</th></tr></thead><tbody className="divide-y divide-slate-100">{tasks.map((task) => <tr key={task.id} className="hover:bg-emerald-50/40"><td className="p-3"><input type="checkbox" checked={selectedRows.includes(task.id)} onChange={() => toggle(task.id)} /></td><td className="min-w-[280px] p-3"><button onClick={() => onTask(task.id)} className="text-left font-black text-slate-950 hover:text-emerald-700">{task.title}</button><div className="text-xs text-slate-500">{task.type} • {task.department}</div></td><td className="p-3 text-slate-600">{byId(projects, task.projectId)?.code}</td><td className="p-3 text-slate-600">{byId(users, task.assigneeId)?.name}</td><td className="p-3"><Select value={task.status} onChange={(value) => updateTask(task.id, { status: value as GoodDayStatus }, "Table status changed")} options={statusOptions} /></td><td className="p-3"><Select value={task.priority} onChange={(value) => updateTask(task.id, { priority: value as GoodDayPriority }, "Table priority changed")} options={priorityOptions} /></td><td className="p-3"><input type="date" value={formatDate(task.dueDate)} onChange={(event) => updateTask(task.id, { dueDate: event.target.value }, "Deadline changed") } className="rounded-xl border border-slate-200 px-2 py-1" /></td><td className="p-3">{minutesToHours(task.estimateMinutes)}</td><td className="p-3"><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(task.progress, 100)}%` }} /></div></td></tr>)}</tbody></table></div>{lastExport && <pre className="m-4 max-h-40 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-emerald-100">{lastExport}</pre>}</section>;
}

function CalendarGanttPanel({ tasks, projects, users, onTask, updateTask }: { tasks: GoodDayTask[]; projects: GoodDayProject[]; users: GoodDayUser[]; onTask: (id: string) => void; updateTask: (id: string, patch: Partial<GoodDayTask>, action?: string) => void }) {
  const days = Array.from({ length: 21 }).map((_, index) => new Date(Date.now() + (index - 5) * 86400000).toISOString().slice(0, 10));
  return <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"><div className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm"><PanelTitle icon={<CalendarDays />} title="Calendar real" subtitle="Click pe task, update deadline." /><div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-7">{days.map((day) => { const dayTasks = tasks.filter((task) => formatDate(task.dueDate) === day); return <div key={day} className="min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50 p-2"><div className="text-[11px] font-black text-slate-500">{day.slice(5)}</div><div className="mt-2 space-y-1">{dayTasks.slice(0, 2).map((task) => <button key={task.id} onClick={() => onTask(task.id)} className="w-full rounded-xl bg-emerald-50 p-2 text-left text-[11px] font-bold text-emerald-900">{task.title}</button>)}</div></div>; })}</div></div><div className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm"><PanelTitle icon={<GitBranch />} title="Gantt / timeline" subtitle="Start/end, dependencies si schimbare deadline." /><div className="mt-4 space-y-3">{tasks.slice(0, 12).map((task, index) => <div key={task.id} className="grid grid-cols-[180px_1fr_160px] items-center gap-3"><button onClick={() => onTask(task.id)} className="truncate text-left text-sm font-black text-slate-950">{task.title}</button><div className="h-7 rounded-full bg-slate-100"><div className="h-7 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ marginLeft: `${(index % 5) * 8}%`, width: `${Math.max(12, Math.min(70, task.progress))}%` }} /></div><input type="date" value={formatDate(task.dueDate)} onChange={(event) => updateTask(task.id, { dueDate: event.target.value }, "Gantt deadline changed")} className="rounded-xl border border-slate-200 px-2 py-1 text-xs" /></div>)}</div></div></section>;
}

function WorkloadApprovalsPanel({ workload, approvals, tasks, users, decideApproval, onTask }: { workload: ReturnType<typeof calculateWorkload>; approvals: GoodDayApproval[]; tasks: GoodDayTask[]; users: GoodDayUser[]; decideApproval: (id: string, status: "Approved" | "Rejected") => void; onTask: (id: string) => void }) {
  return <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]"><div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"><PanelTitle icon={<Users />} title="Workload real" subtitle="Estimate/tracked/capacity by user." /><div className="mt-4 space-y-3">{workload.map((item) => <div key={item.user.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><div><b className="text-slate-950">{item.user.name}</b><div className="text-xs text-slate-500">{item.user.department} • {item.assignedCount} taskuri • tracked {minutesToHours(item.tracked)}</div></div><Pill className={item.overloaded ? "border-red-200 bg-red-50 text-red-700" : item.underutilized ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>{item.utilization}%</Pill></div><div className="mt-3 h-3 rounded-full bg-white"><div className={item.overloaded ? "h-3 rounded-full bg-red-500" : "h-3 rounded-full bg-emerald-500"} style={{ width: `${Math.min(item.utilization, 100)}%` }} /></div></div>)}</div></div><div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"><PanelTitle icon={<ShieldCheck />} title="Approvals reale" subtitle="Approve/reject cu history si link la task." /><div className="mt-4 space-y-3">{approvals.map((approval) => { const task = approval.entityKind === "task" ? byId(tasks, approval.entityId) : undefined; return <div key={approval.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><b className="text-slate-950">{approval.title}</b><p className="text-xs text-slate-500">Requester: {byId(users, approval.requesterId)?.name} • Approver: {byId(users, approval.approverId)?.name}</p></div><Pill className={statusTone(approval.status)}>{approval.status}</Pill></div>{task && <button onClick={() => onTask(task.id)} className="mt-3 text-sm font-black text-emerald-700">Deschide task <ChevronRight className="inline h-4 w-4" /></button>}<div className="mt-3 flex gap-2"><button onClick={() => decideApproval(approval.id, "Approved")} className="btn-primary">Approve</button><button onClick={() => decideApproval(approval.id, "Rejected")} className="btn-secondary">Reject</button></div></div>; })}</div></div></section>;
}

function ProjectsPanel({ kind, projects, tasks, users, onTask }: { kind: GoodDayProject["status"]; projects: GoodDayProject[]; tasks: GoodDayTask[]; users: GoodDayUser[]; onTask: (id: string) => void }) {
  return <section className="grid gap-5 xl:grid-cols-2">{projects.map((project) => { const projectTasks = tasks.filter((task) => task.projectId === project.id); const blockers = projectTasks.filter((task) => task.status === "Blocat" || task.priority === "Critical"); return <div key={project.id} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-black text-slate-400">{project.code} • {kind}</div><h2 className="mt-1 text-xl font-black text-slate-950">{project.name}</h2><p className="mt-1 text-sm text-slate-500">{project.phase} • buget {project.budgetUsed.toLocaleString()} / {project.budget.toLocaleString()} EUR</p></div><Pill className={project.health === "At risk" ? "border-amber-200 bg-amber-50 text-amber-700" : project.health === "Delayed" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>{project.health}</Pill></div><div className="mt-4 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-500" style={{ width: `${project.progress}%` }} /></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><Mini label="Taskuri" value={projectTasks.length} /><Mini label="Blockers" value={blockers.length} /><Mini label={kind === "Viitor" ? "Readiness" : kind === "Finalizat" ? "Handover" : "Progress"} value={`${project.progress}%`} /></div><div className="mt-4 space-y-2">{projectTasks.slice(0, 5).map((task) => <TaskCard key={task.id} task={task} users={users} projects={[project]} onTask={onTask} compact />)}</div>{kind === "Viitor" && <ChecklistBox items={["Kickoff checklist", "Documente lipsa", "Resource conflict", "Pre-start procurement"]} />}{kind === "Finalizat" && <ChecklistBox items={["Final approval", "Raport client", "Lessons learned", "Archive/close flow"]} />}</div>; })}</section>;
}

function TaskDrawer(props: { task: GoodDayTask | null; ticket: GoodDayTicket | null; users: GoodDayUser[]; projects: GoodDayProject[]; timeEntries: GoodDayTimeEntry[]; commentDraft: string; setCommentDraft: (value: string) => void; timeDraft: string; setTimeDraft: (value: string) => void; updateTask: (id: string, patch: Partial<GoodDayTask>, action?: string) => void; deleteTask: (id: string) => void; addComment: (id: string) => void; toggleChecklist: (taskId: string, itemId: string) => void; addChecklistItem: (id: string) => void; addAttachment: (id: string) => void; addTime: (id: string) => void; startTimer: (id: string) => void; close: () => void }) {
  const { task, ticket, users, projects, timeEntries, commentDraft, setCommentDraft, timeDraft, setTimeDraft, updateTask, deleteTask, addComment, toggleChecklist, addChecklistItem, addAttachment, addTime, startTimer, close } = props;
  if (!task && !ticket) return null;
  return <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" onClick={close}><aside onClick={(event) => event.stopPropagation()} className="ml-auto h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl"><button onClick={close} className="mb-4 rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-600">Inchide</button>{ticket && !task && <div><h2 className="text-2xl font-black text-slate-950">{ticket.title}</h2><p className="mt-2 text-sm text-slate-500">Ticket {ticket.type} • SLA {formatDate(ticket.slaDueAt)} • {ticket.status}</p></div>}{task && <div className="space-y-5"><div><div className="flex flex-wrap gap-2"><Pill className={priorityTone(task.priority)}>{task.priority}</Pill><Pill className={statusTone(task.status)}>{task.status}</Pill><Pill className="border-slate-200 bg-slate-50 text-slate-700">{task.type}</Pill></div><h2 className="mt-3 text-2xl font-black text-slate-950">{task.title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{task.description}</p></div><div className="grid gap-3 sm:grid-cols-2"><Select value={task.status} onChange={(value) => updateTask(task.id, { status: value as GoodDayStatus }, "Drawer status changed")} options={statusOptions} /><Select value={task.priority} onChange={(value) => updateTask(task.id, { priority: value as GoodDayPriority }, "Drawer priority changed")} options={priorityOptions} /><Select value={task.assigneeId} onChange={(value) => updateTask(task.id, { assigneeId: value }, "Drawer assignee changed")} options={users.map((user) => user.id)} labels={Object.fromEntries(users.map((user) => [user.id, user.name]))} /><input type="date" value={formatDate(task.dueDate)} onChange={(event) => updateTask(task.id, { dueDate: event.target.value }, "Drawer deadline changed")} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold" /></div><div className="flex flex-wrap gap-2"><button onClick={() => startTimer(task.id)} className="btn-primary"><Play className="h-4 w-4" /> Start timer</button><button onClick={() => addAttachment(task.id)} className="btn-secondary"><FileText className="h-4 w-4" /> Attachment mock</button><button onClick={() => deleteTask(task.id)} className="btn-secondary"><Trash2 className="h-4 w-4" /> Sterge</button></div><DrawerSection title="Checklist / subtasks" action={<button onClick={() => addChecklistItem(task.id)} className="text-xs font-black text-emerald-700">+ Subtask</button>}>{task.checklist.map((item) => <label key={item.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700"><input type="checkbox" checked={item.done} onChange={() => toggleChecklist(task.id, item.id)} /> {item.title}</label>)}</DrawerSection><DrawerSection title="Comments"><div className="flex gap-2"><input value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm" placeholder="Adauga comentariu..." /><button onClick={() => addComment(task.id)} className="btn-primary">Trimite</button></div>{task.comments.map((comment) => <div key={comment.id} className="mt-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600"><b>{byId(users, comment.authorId)?.name ?? comment.authorId}</b><div>{comment.body}</div></div>)}</DrawerSection><DrawerSection title="Time entries"><div className="flex gap-2"><input value={timeDraft} onChange={(event) => setTimeDraft(event.target.value)} className="w-28 rounded-2xl border border-slate-200 px-3 py-2 text-sm" /><button onClick={() => addTime(task.id)} className="btn-secondary"><Clock3 className="h-4 w-4" /> Adauga minute</button></div>{timeEntries.map((entry) => <div key={entry.id} className="mt-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">{minutesToHours(entry.minutes)} • {entry.note} • {entry.source}</div>)}</DrawerSection><DrawerSection title="Activity log">{task.activity.slice(0, 10).map((activity) => <div key={activity.id} className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600"><b>{activity.action}</b><div>{activity.detail ?? "-"} • {new Date(activity.createdAt).toLocaleString()}</div></div>)}</DrawerSection><DrawerSection title="Links"><div className="grid gap-2 text-sm text-slate-600"><div>Project: {byId(projects, task.projectId)?.name}</div><div>Related ticket: {task.relatedTicketId ?? "-"}</div><div>Equipment: {task.relatedEquipmentId ?? "-"}</div><div>Dependencies: {task.dependencyIds.join(", ") || "-"}</div></div></DrawerSection></div>}</aside></div>;
}

function PanelTitle({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) { return <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{icon}</div><div><h2 className="text-lg font-black text-slate-950">{title}</h2><p className="text-sm text-slate-500">{subtitle}</p></div></div>; }
function Mini({ label, value }: { label: string; value: ReactNode }) { return <div className="rounded-2xl bg-slate-50 p-3 text-center"><div className="text-xl font-black text-slate-950">{value}</div><div className="text-xs font-bold text-slate-400">{label}</div></div>; }
function ChecklistBox({ items }: { items: string[] }) { return <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3"><div className="mb-2 text-xs font-black uppercase text-emerald-700">Flow checklist</div><div className="grid gap-2 sm:grid-cols-2">{items.map((item) => <label key={item} className="flex items-center gap-2 text-xs font-bold text-emerald-900"><input type="checkbox" /> {item}</label>)}</div></div>; }
function DrawerSection({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) { return <section className="rounded-[1.3rem] border border-slate-200 bg-white p-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-black text-slate-950">{title}</h3>{action}</div><div className="space-y-2">{children}</div></section>; }
function EmptyState({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm font-bold text-slate-400">{text}</div>; }
