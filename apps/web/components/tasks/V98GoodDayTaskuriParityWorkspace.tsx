"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  createV98SeedTasks,
  createV98SeedTickets,
  getV98GoodDayParitySummary,
  v98Approvals,
  v98Notifications,
  v98Projects,
  v98SavedViews,
  v98Users,
  type V98Approval,
  type V98Notification,
  type V98SavedView,
  type V98Task,
  type V98Ticket,
} from "@/lib/enterprise/work-os-v98-goodday-ui-content-function-parity";

type V98PageMode = "overview" | "my-work" | "tickets" | "board" | "table" | "calendar-gantt" | "workload";
type Density = "compact" | "comfortable";
type TimerState = { taskId: string; startedAt: number } | null;

type WorkspaceState = {
  tasks: V98Task[];
  tickets: V98Ticket[];
  approvals: V98Approval[];
  notifications: V98Notification[];
  savedViews: V98SavedView[];
  activeTaskId: string;
  activeTicketId?: string;
  selectedTaskIds: string[];
  filter: string;
  statusFilter: string;
  departmentFilter: string;
  savedViewName: string;
  timer: TimerState;
  activityToast: string;
  density: Density;
  role: "Manager" | "Technician" | "Viewer";
  commandOpen: boolean;
  validation: string;
};

const STORAGE_KEY = "servelect.v98.taskuri.goodday.parity.state";
const statuses: V98Task["status"][] = ["Backlog", "To do", "In progress", "Review", "Blocked", "Done"];
const routeTabs: Array<{ label: string; href: string; key: V98PageMode }> = [
  { label: "Overview", href: "/taskuri", key: "overview" },
  { label: "My Work", href: "/taskuri/my-work", key: "my-work" },
  { label: "Inbox", href: "/taskuri/tickets-notificari", key: "tickets" },
  { label: "Board", href: "/taskuri/board", key: "board" },
  { label: "Table", href: "/taskuri/tabel", key: "table" },
  { label: "Calendar", href: "/taskuri/calendar-gantt", key: "calendar-gantt" },
  { label: "Gantt", href: "/taskuri/calendar-gantt", key: "calendar-gantt" },
  { label: "Workload", href: "/taskuri/workload-aprobari", key: "workload" },
  { label: "Reports", href: "/taskuri/overview", key: "overview" },
];

function initialState(): WorkspaceState {
  const tasks = createV98SeedTasks();
  const tickets = createV98SeedTickets();
  return {
    tasks,
    tickets,
    approvals: v98Approvals,
    notifications: v98Notifications,
    savedViews: v98SavedViews,
    activeTaskId: tasks[0]?.id ?? "",
    activeTicketId: tickets[0]?.id,
    selectedTaskIds: [],
    filter: "",
    statusFilter: "all",
    departmentFilter: "all",
    savedViewName: "Servelect dense workspace",
    timer: null,
    activityToast: "Workspace încărcat cu date Servelect realiste.",
    density: "compact",
    role: "Manager",
    commandOpen: false,
    validation: "",
  };
}

function loadState(): WorkspaceState {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
    const fallback = initialState();
    return {
      ...fallback,
      ...parsed,
      tasks: parsed.tasks?.length ? parsed.tasks : fallback.tasks,
      tickets: parsed.tickets?.length ? parsed.tickets : fallback.tickets,
      approvals: parsed.approvals?.length ? parsed.approvals : fallback.approvals,
      notifications: parsed.notifications?.length ? parsed.notifications : fallback.notifications,
      savedViews: parsed.savedViews?.length ? parsed.savedViews : fallback.savedViews,
      activeTaskId: parsed.activeTaskId || fallback.activeTaskId,
    };
  } catch {
    return initialState();
  }
}

function saveState(state: WorkspaceState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function statusTone(status: V98Task["status"]) {
  if (status === "Done") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "Blocked") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (status === "Review") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (status === "In progress") return "bg-violet-50 text-violet-700 ring-violet-200";
  return "bg-slate-50 text-slate-700 ring-slate-200";
}

function priorityTone(priority: V98Task["priority"]) {
  if (priority === "Critical") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (priority === "High") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (priority === "Medium") return "bg-blue-50 text-blue-700 ring-blue-200";
  return "bg-slate-50 text-slate-700 ring-slate-200";
}

function ticketTone(status: V98Ticket["status"]) {
  if (status === "Escalated") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (status === "Converted" || status === "Closed") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "Waiting client") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-blue-50 text-blue-700 ring-blue-200";
}

function Badge({ children, tone = "bg-slate-50 text-slate-700 ring-slate-200" }: { children: ReactNode; tone?: string }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${tone}`}>{children}</span>;
}

function SmallButton({ children, onClick, testId, primary = false, disabled = false }: { children: ReactNode; onClick: () => void; testId?: string; primary?: boolean; disabled?: boolean }) {
  return <button data-testid={testId} type="button" disabled={disabled} onClick={onClick} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-black ring-1 transition ${primary ? "bg-slate-950 text-white ring-slate-950 hover:bg-emerald-700" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"} disabled:cursor-not-allowed disabled:opacity-50`}>{children}</button>;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{children}</label>;
}

function sameDay(date: string, day = "2026-06-20") {
  return date === day;
}

function taskMatches(task: V98Task, state: WorkspaceState) {
  const haystack = `${task.title} ${task.project} ${task.assignee} ${task.owner} ${task.department} ${task.tags.join(" ")}`.toLowerCase();
  const filterOk = state.filter.trim() ? haystack.includes(state.filter.toLowerCase()) : true;
  const statusOk = state.statusFilter === "all" ? true : task.status === state.statusFilter;
  const deptOk = state.departmentFilter === "all" ? true : task.department === state.departmentFilter;
  return filterOk && statusOk && deptOk;
}

export function V98GoodDayTaskuriParityWorkspace({ mode = "overview" }: { mode?: V98PageMode }) {
  const [state, setState] = useState<WorkspaceState>(() => initialState());
  const [commentDraft, setCommentDraft] = useState("Am actualizat taskul și am atașat evidence.");
  const [ticketDraft, setTicketDraft] = useState("Solicitare nouă de intervenție din portal client.");

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const summary = useMemo(() => getV98GoodDayParitySummary(), []);
  const filteredTasks = useMemo(() => state.tasks.filter((task) => taskMatches(task, state)), [state]);
  const activeTask = state.tasks.find((task) => task.id === state.activeTaskId) ?? state.tasks[0];
  const activeTicket = state.tickets.find((ticket) => ticket.id === state.activeTicketId) ?? state.tickets[0];
  const unread = state.notifications.filter((notification) => !notification.read).length;
  const blocked = state.tasks.filter((task) => task.status === "Blocked").length;
  const overdue = state.tasks.filter((task) => task.dueDate < "2026-06-20" && task.status !== "Done").length;
  const dueToday = state.tasks.filter((task) => sameDay(task.dueDate)).length;
  const waitingApprovals = state.approvals.filter((approval) => approval.status === "Waiting").length;
  const selectedTasks = state.tasks.filter((task) => state.selectedTaskIds.includes(task.id));
  const departments = Array.from(new Set(state.tasks.map((task) => task.department)));

  function patchState(mutator: (draft: WorkspaceState) => void) {
    setState((current) => {
      const draft: WorkspaceState = JSON.parse(JSON.stringify(current));
      mutator(draft);
      return draft;
    });
  }

  function patchTask(taskId: string, updater: (task: V98Task) => void, toast: string) {
    patchState((draft) => {
      const task = draft.tasks.find((item) => item.id === taskId);
      if (!task) return;
      updater(task);
      task.activity.unshift({ id: `act-${Date.now()}`, actor: "Vlad Neagu", action: toast, at: new Date().toISOString().slice(0, 16).replace("T", " ") });
      draft.activityToast = toast;
    });
  }

  function openTask(taskId: string) {
    patchState((draft) => {
      draft.activeTaskId = taskId;
      draft.validation = "";
      draft.activityToast = `Drawer deschis pentru ${taskId}`;
    });
  }

  function createTask() {
    patchState((draft) => {
      const project = v98Projects[draft.tasks.length % v98Projects.length];
      const assignee = v98Users[draft.tasks.length % v98Users.length];
      const id = `tsk-${String(draft.tasks.length + 1).padStart(3, "0")}`;
      const newTask: V98Task = {
        ...createV98SeedTasks()[0],
        id,
        code: `SWO-${980 + draft.tasks.length}`,
        title: `Task nou Servelect — ${project.name}`,
        projectId: project.id,
        project: project.name,
        folder: project.folder,
        status: "To do",
        priority: "High",
        assigneeId: assignee.id,
        assignee: assignee.name,
        ownerId: "u-vlad",
        owner: "Vlad Neagu",
        department: project.department,
        dueDate: "2026-06-24",
        comments: [],
        activity: [{ id: `act-${Date.now()}`, actor: "Vlad Neagu", action: "created task", at: new Date().toISOString().slice(0, 16).replace("T", " ") }],
        attachments: [],
        checklist: [{ id: `${id}-cl-1`, text: "Completează datele", done: false }],
        dependencies: [],
        watchers: ["Andrei Popescu"],
        linkedTickets: [],
        linkedApprovals: [],
      };
      draft.tasks.unshift(newTask);
      draft.activeTaskId = id;
      draft.activityToast = "New Task creat și deschis în drawer.";
    });
  }

  function createTicket() {
    patchState((draft) => {
      const id = `tic-${String(draft.tickets.length + 1).padStart(3, "0")}`;
      const project = v98Projects[draft.tickets.length % v98Projects.length];
      const ticket: V98Ticket = {
        ...createV98SeedTickets()[0],
        id,
        code: `TCK-${980 + draft.tickets.length}`,
        title: ticketDraft,
        client: project.client,
        projectId: project.id,
        status: "New",
        severity: "S2",
        comments: [],
        attachments: [],
      };
      draft.tickets.unshift(ticket);
      draft.activeTicketId = id;
      draft.notifications.unshift({ id: `not-${Date.now()}`, title: "Ticket nou", body: ticket.title, kind: "ticket", read: false, createdAt: new Date().toISOString().slice(0, 10) });
      draft.activityToast = "New Ticket creat și notificare generată.";
    });
  }

  function convertTicket(ticketId: string) {
    patchState((draft) => {
      const ticket = draft.tickets.find((item) => item.id === ticketId);
      if (!ticket) return;
      const taskId = `tsk-${String(draft.tasks.length + 1).padStart(3, "0")}`;
      const project = v98Projects.find((item) => item.id === ticket.projectId) ?? v98Projects[0];
      const task: V98Task = {
        ...createV98SeedTasks()[1],
        id: taskId,
        code: `SWO-${980 + draft.tasks.length}`,
        title: `Conversie ticket: ${ticket.title}`,
        type: "Ticket",
        projectId: project.id,
        project: project.name,
        folder: project.folder,
        status: "To do",
        priority: ticket.severity === "S1" ? "Critical" : "High",
        assignee: ticket.technician,
        linkedTickets: [ticket.id],
        comments: ticket.comments,
        attachments: ticket.attachments,
      };
      ticket.status = "Converted";
      ticket.convertedTaskId = taskId;
      draft.tasks.unshift(task);
      draft.activeTaskId = taskId;
      draft.activityToast = "Ticket convertit în task și sincronizat cu Board/Table.";
    });
  }

  function escalateTicket(ticketId: string) {
    patchState((draft) => {
      const ticket = draft.tickets.find((item) => item.id === ticketId);
      if (!ticket) return;
      ticket.status = "Escalated";
      ticket.severity = "S1";
      draft.notifications.unshift({ id: `not-${Date.now()}`, title: "SLA escaladat", body: ticket.title, kind: "sla", read: false, createdAt: new Date().toISOString().slice(0, 10) });
      draft.activityToast = "Ticket escaladat și notificare SLA creată.";
    });
  }

  function addComment(taskId: string) {
    const clean = commentDraft.trim();
    if (!clean) {
      patchState((draft) => { draft.validation = "Comentariul nu poate fi gol."; });
      return;
    }
    patchTask(taskId, (task) => {
      task.comments.unshift({ id: `c-${Date.now()}`, author: "Vlad Neagu", text: clean, at: new Date().toISOString().slice(0, 16).replace("T", " ") });
    }, "comment added");
    setCommentDraft("Am actualizat taskul și am atașat evidence.");
  }

  function toggleChecklist(taskId: string, checklistId: string) {
    patchTask(taskId, (task) => {
      const item = task.checklist.find((entry) => entry.id === checklistId);
      if (item) item.done = !item.done;
      task.progress = Math.round((task.checklist.filter((entry) => entry.done).length / Math.max(1, task.checklist.length)) * 100);
    }, "checklist updated");
  }

  function addDependency(taskId: string) {
    patchTask(taskId, (task) => {
      const dependency = state.tasks.find((item) => item.id !== task.id && !task.dependencies.includes(item.id));
      if (dependency) task.dependencies.push(dependency.id);
    }, "dependency added");
  }

  function attachMockFile(taskId: string) {
    patchTask(taskId, (task) => {
      task.attachments.unshift({ id: `file-${Date.now()}`, name: `evidence_${task.code}.pdf`, type: "PDF", size: "2.4 MB" });
    }, "attachment added");
  }

  function startTimer(taskId: string) {
    patchState((draft) => {
      draft.timer = { taskId, startedAt: Date.now() };
      draft.activityToast = `Timer pornit pentru ${taskId}`;
    });
  }

  function stopTimer() {
    patchState((draft) => {
      if (!draft.timer) return;
      const task = draft.tasks.find((item) => item.id === draft.timer?.taskId);
      if (task) task.tracked += 0.25;
      draft.activityToast = `Timer oprit și 0.25h adăugate.`;
      draft.timer = null;
    });
  }

  function setTaskStatus(taskId: string, status: V98Task["status"]) {
    patchTask(taskId, (task) => { task.status = status; }, `status changed to ${status}`);
  }

  function bulkStatus(status: V98Task["status"]) {
    if (!state.selectedTaskIds.length) {
      patchState((draft) => { draft.validation = "Selectează cel puțin un task pentru bulk action."; });
      return;
    }
    patchState((draft) => {
      draft.tasks.forEach((task) => { if (draft.selectedTaskIds.includes(task.id)) task.status = status; });
      draft.activityToast = `Bulk status schimbat pentru ${draft.selectedTaskIds.length} taskuri.`;
    });
  }

  function bulkAssignee(userName: string) {
    if (!state.selectedTaskIds.length) return;
    patchState((draft) => {
      draft.tasks.forEach((task) => { if (draft.selectedTaskIds.includes(task.id)) task.assignee = userName; });
      draft.activityToast = `Bulk assignee: ${userName}`;
    });
  }

  function exportCsv() {
    const csv = ["ID,Task,Project,Status,Priority,Assignee,Due", ...filteredTasks.map((task) => `${task.code},${task.title},${task.project},${task.status},${task.priority},${task.assignee},${task.dueDate}`)].join("\n");
    if (typeof window !== "undefined") {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "servelect-taskuri-export.csv";
      link.click();
      URL.revokeObjectURL(url);
    }
    patchState((draft) => { draft.activityToast = "CSV export generat din task table."; });
  }

  function saveView() {
    patchState((draft) => {
      const view: V98SavedView = { id: `sv-${Date.now()}`, name: draft.savedViewName || "Saved view", filters: `q=${draft.filter};status=${draft.statusFilter};department=${draft.departmentFilter}`, page: mode };
      draft.savedViews.unshift(view);
      draft.activityToast = "Saved view persistat în localStorage.";
    });
  }

  function resetFilters() {
    patchState((draft) => {
      draft.filter = "";
      draft.statusFilter = "all";
      draft.departmentFilter = "all";
      draft.activityToast = "Filtre resetate.";
    });
  }

  function markNotificationRead(id: string) {
    patchState((draft) => {
      const notification = draft.notifications.find((item) => item.id === id);
      if (notification) notification.read = true;
      draft.activityToast = "Notificare marcată ca citită.";
    });
  }

  function approve(id: string, status: "Approved" | "Rejected") {
    patchState((draft) => {
      const approval = draft.approvals.find((item) => item.id === id);
      if (approval) approval.status = status;
      draft.notifications.unshift({ id: `not-${Date.now()}`, title: `Approval ${status}`, body: approval?.title ?? "Approval", kind: "approval", read: false, createdAt: new Date().toISOString().slice(0, 10) });
      draft.activityToast = `Approval ${status.toLowerCase()}.`;
    });
  }

  function toggleSelected(taskId: string) {
    patchState((draft) => {
      draft.selectedTaskIds = draft.selectedTaskIds.includes(taskId) ? draft.selectedTaskIds.filter((id) => id !== taskId) : [...draft.selectedTaskIds, taskId];
    });
  }

  function quickCommand(command: string) {
    if (!activeTask) return;
    if (command === "assign") patchTask(activeTask.id, (task) => { task.assignee = "Andrei Popescu"; }, "command assign executed");
    if (command === "status") setTaskStatus(activeTask.id, "In progress");
    if (command === "due") patchTask(activeTask.id, (task) => { task.dueDate = "2026-06-28"; }, "command due date changed");
    if (command === "watcher") patchTask(activeTask.id, (task) => { task.watchers.push("Ioana Marinescu"); }, "command watcher added");
    patchState((draft) => { draft.commandOpen = false; });
  }

  return <main className="min-h-screen bg-slate-100 text-slate-900" data-testid="v98-taskuri-workspace" data-version="9.8.0">
    <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_390px]">
      <aside className="border-b border-slate-200 bg-white xl:border-b-0 xl:border-r" data-testid="workspace-hierarchy">
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-600">SERVELECT EMP</div>
          <h1 className="mt-1 text-xl font-black">Taskuri Workspace</h1>
          <p className="text-xs text-slate-500">Canonical Work OS entry · v9.8.0</p>
        </div>
        <div className="space-y-3 p-3">
          <div className="grid gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold">
            {routeTabs.map((tab) => <Link key={`${tab.label}-${tab.href}`} href={tab.href} className={`rounded-xl px-3 py-2 ${mode === tab.key ? "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:bg-white"}`}>{tab.label}</Link>)}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between"><span className="text-xs font-black uppercase text-slate-400">Hierarchy</span><Badge>{v98Projects.length}</Badge></div>
            <div className="space-y-2">
              {v98Projects.map((project) => <button key={project.id} data-action="hierarchy-filter" type="button" onClick={() => patchState((draft) => { draft.filter = project.name; draft.activityToast = `Project filter: ${project.code}`; })} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-emerald-200 hover:bg-emerald-50">
                <div className="flex items-center justify-between gap-2"><span className="truncate text-[11px] font-black text-slate-500">{project.folder}</span><span className="text-[10px] font-black text-emerald-700">{project.code}</span></div>
                <div className="mt-1 line-clamp-1 text-sm font-black text-slate-950">{project.name}</div>
                <div className="mt-2 h-1 rounded-full bg-white"><div className="h-1 rounded-full bg-emerald-500" style={{ width: `${project.progress}%` }} /></div>
              </button>)}
            </div>
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur" data-testid="taskuri-topbar">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">GoodDay reference parity correction · public-reference based</p>
              <h2 className="truncate text-2xl font-black">Taskuri — dense operational workspace</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input data-testid="global-search" value={state.filter} onChange={(event) => patchState((draft) => { draft.filter = event.target.value; })} placeholder="Search tasks, project, client, tag..." className="h-9 w-72 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-emerald-300" />
              <SmallButton testId="new-task" primary onClick={createTask}>New Task</SmallButton>
              <SmallButton testId="new-ticket" onClick={createTicket}>New Ticket</SmallButton>
              <SmallButton testId="open-command" onClick={() => patchState((draft) => { draft.commandOpen = !draft.commandOpen; })}>Ctrl K</SmallButton>
              <button data-testid="notifications-button" onClick={() => patchState((draft) => { draft.activityToast = `${unread} notificări necitite`; })} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white">🔔 {unread}</button>
              <button data-testid="profile-role" onClick={() => patchState((draft) => { draft.role = draft.role === "Manager" ? "Technician" : draft.role === "Technician" ? "Viewer" : "Manager"; draft.activityToast = `Rol schimbat: ${draft.role}`; })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black">{state.role}</button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
              {routeTabs.slice(0, 8).map((tab) => <Link key={tab.label} href={tab.href} className={`rounded-xl px-3 py-1.5 text-[11px] font-black ${mode === tab.key ? "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-950"}`}>{tab.label}</Link>)}
            </div>
            <div className="flex flex-wrap gap-2">
              <select data-testid="status-filter" value={state.statusFilter} onChange={(event) => patchState((draft) => { draft.statusFilter = event.target.value; })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold"><option value="all">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>
              <select data-testid="department-filter" value={state.departmentFilter} onChange={(event) => patchState((draft) => { draft.departmentFilter = event.target.value; })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold"><option value="all">All departments</option>{departments.map((department) => <option key={department} value={department}>{department}</option>)}</select>
              <SmallButton testId="save-view" onClick={saveView}>Save View</SmallButton>
              <SmallButton testId="reset-filter" onClick={resetFilters}>Reset</SmallButton>
              <SmallButton testId="export-csv" onClick={exportCsv}>Export CSV</SmallButton>
              <SmallButton testId="density-switch" onClick={() => patchState((draft) => { draft.density = draft.density === "compact" ? "comfortable" : "compact"; })}>{state.density}</SmallButton>
            </div>
          </div>
          {state.commandOpen ? <div data-testid="command-palette" className="absolute right-4 top-24 z-30 w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="mb-2 text-xs font-black uppercase text-slate-400">Command palette</div>
            <div className="grid gap-2">{[["assign", "Assign to Andrei"], ["status", "Move active task to In progress"], ["due", "Change due date"], ["watcher", "Add watcher"]].map(([cmd, label]) => <button key={cmd} type="button" data-action={`command-${cmd}`} onClick={() => quickCommand(cmd)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-bold hover:bg-emerald-50">{label}</button>)}</div>
          </div> : null}
        </header>

        <div className="p-4">
          <div className="mb-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-6" data-testid="compact-kpis">
            <Kpi label="Tasks" value={String(state.tasks.length)} detail={`${filteredTasks.length} filtered`} />
            <Kpi label="Overdue" value={String(overdue)} detail="need action" danger />
            <Kpi label="Blocked" value={String(blocked)} detail="dependencies" danger={blocked > 0} />
            <Kpi label="Due today" value={String(dueToday)} detail="daily work" />
            <Kpi label="Approvals" value={String(waitingApprovals)} detail="manager gates" />
            <Kpi label="Time" value={`${state.tasks.reduce((s, task) => s + task.tracked, 0).toFixed(1)}h`} detail="tracked" />
          </div>
          <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800" data-testid="state-toast">{state.activityToast} {state.validation ? <span className="text-rose-700"> · {state.validation}</span> : null}</div>
          {mode === "overview" ? <OverviewView tasks={filteredTasks} tickets={state.tickets} notifications={state.notifications} approvals={state.approvals} openTask={openTask} /> : null}
          {mode === "my-work" ? <MyWorkView tasks={filteredTasks} openTask={openTask} startTimer={startTimer} setStatus={setTaskStatus} /> : null}
          {mode === "tickets" ? <TicketsView tickets={state.tickets} activeTicket={activeTicket} setDraft={setTicketDraft} draft={ticketDraft} createTicket={createTicket} escalate={escalateTicket} convert={convertTicket} markNotificationRead={markNotificationRead} notifications={state.notifications} /> : null}
          {mode === "board" ? <BoardView tasks={filteredTasks} openTask={openTask} setStatus={setTaskStatus} /> : null}
          {mode === "table" ? <TableView tasks={filteredTasks} selected={state.selectedTaskIds} toggleSelected={toggleSelected} openTask={openTask} bulkStatus={bulkStatus} bulkAssignee={bulkAssignee} exportCsv={exportCsv} /> : null}
          {mode === "calendar-gantt" ? <CalendarGanttView tasks={filteredTasks} openTask={openTask} changeDue={(taskId, due) => patchTask(taskId, (task) => { task.dueDate = due; }, "due date changed from calendar") } addDependency={addDependency} /> : null}
          {mode === "workload" ? <WorkloadView tasks={filteredTasks} approvals={state.approvals} approve={approve} changeEstimate={(taskId, estimate) => patchTask(taskId, (task) => { task.estimate = estimate; }, "estimate updated and workload recalculated")} /> : null}
        </div>
      </section>

      <TaskDrawer
        task={activeTask}
        users={v98Users}
        tickets={state.tickets}
        timer={state.timer}
        commentDraft={commentDraft}
        setCommentDraft={setCommentDraft}
        updateTask={(updater, toast) => activeTask && patchTask(activeTask.id, updater, toast)}
        setStatus={(status) => activeTask && setTaskStatus(activeTask.id, status)}
        addComment={() => activeTask && addComment(activeTask.id)}
        toggleChecklist={(id) => activeTask && toggleChecklist(activeTask.id, id)}
        addDependency={() => activeTask && addDependency(activeTask.id)}
        attachFile={() => activeTask && attachMockFile(activeTask.id)}
        startTimer={() => activeTask && startTimer(activeTask.id)}
        stopTimer={stopTimer}
      />
    </div>
    <div className="hidden" data-testid="button-functionality-metadata">REAL_LOCAL_PERSISTENT MOCK_INTERACTIVE handlers: new-task,new-ticket,save-view,export,filter,reset,bulk,assign,approve,reject,escalate,mark-read,convert,start-timer,stop-timer,add-comment,add-subtask,attach,open-drawer,save,cancel</div>
  </main>;
}

function Kpi({ label, value, detail, danger = false }: { label: string; value: string; detail: string; danger?: boolean }) {
  return <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</div>
    <div className={`mt-1 text-xl font-black ${danger ? "text-rose-700" : "text-slate-950"}`}>{value}</div>
    <div className="text-[11px] font-semibold text-slate-500">{detail}</div>
  </div>;
}

function OverviewView({ tasks, tickets, notifications, approvals, openTask }: { tasks: V98Task[]; tickets: V98Ticket[]; notifications: V98Notification[]; approvals: V98Approval[]; openTask: (id: string) => void }) {
  return <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_340px]" data-testid="overview-command-center">
    <div className="grid gap-3 xl:grid-cols-2">
      <DensePanel title="My Work / Action Required" subtitle="Assigned, due today, overdue, blocked" actions={<Badge tone="bg-rose-50 text-rose-700 ring-rose-200">{tasks.filter((task) => task.priority === "Critical").length} critical</Badge>}>
        <TaskList tasks={tasks.slice(0, 12)} openTask={openTask} />
      </DensePanel>
      <DensePanel title="Task Inbox" subtitle="Tickets, requests and approvals waiting for owner response">
        <div className="space-y-2">{tickets.slice(0, 7).map((ticket) => <div key={ticket.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2"><div className="flex items-center justify-between gap-2"><b className="text-xs">{ticket.code}</b><Badge tone={ticketTone(ticket.status)}>{ticket.status}</Badge></div><div className="mt-1 line-clamp-1 text-sm font-black">{ticket.title}</div><div className="mt-1 text-[11px] text-slate-500">{ticket.client} · {ticket.technician} · SLA {ticket.slaMinutes}m</div></div>)}</div>
      </DensePanel>
      <DensePanel title="Recent Activity" subtitle="Comments, files, approvals, workflow changes">
        <div className="space-y-2">{tasks.flatMap((task) => task.activity.map((entry) => ({ ...entry, task: task.code }))).slice(0, 10).map((entry) => <div key={`${entry.id}-${entry.task}`} className="flex gap-2 rounded-xl border border-slate-200 bg-white p-2 text-xs"><span className="font-black text-emerald-700">{entry.task}</span><span className="text-slate-600">{entry.actor} {entry.action}</span><span className="ml-auto text-slate-400">{entry.at}</span></div>)}</div>
      </DensePanel>
      <DensePanel title="Workload Mini Panel" subtitle="Capacity risk by department and assignee">
        <WorkloadMini tasks={tasks} />
      </DensePanel>
    </div>
    <RightContext notifications={notifications} approvals={approvals} tasks={tasks} />
  </div>;
}

function MyWorkView({ tasks, openTask, startTimer, setStatus }: { tasks: V98Task[]; openTask: (id: string) => void; startTimer: (id: string) => void; setStatus: (id: string, status: V98Task["status"]) => void }) {
  const sections = [
    ["Assigned to me", tasks.filter((task) => task.assignee.includes("Vlad") || task.assignee.includes("Andrei")).slice(0, 8)],
    ["Created by me", tasks.filter((task) => task.createdByMe).slice(0, 8)],
    ["Delegated by me", tasks.filter((task) => task.delegatedByMe).slice(0, 8)],
    ["Watched / Mentions", tasks.filter((task) => task.mentioned || task.watchers.length > 1).slice(0, 8)],
    ["Due today / overdue", tasks.filter((task) => task.dueDate <= "2026-06-20").slice(0, 8)],
    ["Review", tasks.filter((task) => task.status === "Review").slice(0, 8)],
  ] as const;
  return <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_320px]" data-testid="my-work-real-inbox">
    <div className="grid gap-3 xl:grid-cols-2">{sections.map(([title, rows]) => <DensePanel key={title} title={title} subtitle={`${rows.length} work items`}><TaskList tasks={rows} openTask={openTask} startTimer={startTimer} setStatus={setStatus} /></DensePanel>)}</div>
    <DensePanel title="Agenda / Notifications" subtitle="Today, next actions, unread"><div className="space-y-2">{tasks.slice(0, 10).map((task) => <button key={task.id} type="button" onClick={() => openTask(task.id)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-left text-xs hover:bg-emerald-50"><b>{task.dueDate}</b> · {task.title}</button>)}</div></DensePanel>
  </div>;
}

function TicketsView({ tickets, activeTicket, draft, setDraft, createTicket, escalate, convert, markNotificationRead, notifications }: { tickets: V98Ticket[]; activeTicket: V98Ticket; draft: string; setDraft: (value: string) => void; createTicket: () => void; escalate: (id: string) => void; convert: (id: string) => void; markNotificationRead: (id: string) => void; notifications: V98Notification[] }) {
  return <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_360px]" data-testid="ticket-request-center">
    <DensePanel title="Ticket Center / Request Queue" subtitle="SLA, client, project, equipment, technician, conversion">
      <div className="mb-3 flex gap-2"><input value={draft} onChange={(event) => setDraft(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold" /><SmallButton testId="create-ticket" primary onClick={createTicket}>Create ticket</SmallButton></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-[0.14em] text-slate-400"><tr>{["Ticket", "Severity", "Status", "Client", "Equipment", "Tech", "SLA", "Actions"].map((head) => <th key={head} className="border-b border-slate-200 px-2 py-2">{head}</th>)}</tr></thead><tbody>{tickets.map((ticket) => <tr key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="px-2 py-2"><b>{ticket.code}</b><div className="line-clamp-1 text-slate-500">{ticket.title}</div></td><td className="px-2 py-2"><Badge tone={ticket.severity === "S1" ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-amber-50 text-amber-700 ring-amber-200"}>{ticket.severity}</Badge></td><td className="px-2 py-2"><Badge tone={ticketTone(ticket.status)}>{ticket.status}</Badge></td><td className="px-2 py-2">{ticket.client}</td><td className="px-2 py-2">{ticket.equipment}</td><td className="px-2 py-2">{ticket.technician}</td><td className="px-2 py-2">{ticket.slaMinutes}m</td><td className="px-2 py-2"><div className="flex gap-1"><SmallButton testId={`escalate-${ticket.id}`} onClick={() => escalate(ticket.id)}>Escalate</SmallButton><SmallButton testId={`convert-${ticket.id}`} onClick={() => convert(ticket.id)}>Convert</SmallButton></div></td></tr>)}</tbody></table></div>
    </DensePanel>
    <DensePanel title="SLA Risk / Notifications" subtitle="Urgent, waiting client, generated notifications"><div className="space-y-2">{notifications.slice(0, 10).map((notification) => <button key={notification.id} data-testid={`mark-read-${notification.id}`} type="button" onClick={() => markNotificationRead(notification.id)} className={`w-full rounded-xl border p-2 text-left text-xs ${notification.read ? "border-slate-200 bg-slate-50 text-slate-500" : "border-amber-200 bg-amber-50 text-slate-800"}`}><b>{notification.title}</b><div>{notification.body}</div></button>)}</div><div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs"><b>Active ticket:</b> {activeTicket?.code} · {activeTicket?.title}</div></DensePanel>
  </div>;
}

function BoardView({ tasks, openTask, setStatus }: { tasks: V98Task[]; openTask: (id: string) => void; setStatus: (id: string, status: V98Task["status"]) => void }) {
  return <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_300px]" data-testid="kanban-mature-board">
    <div className="grid gap-2 xl:grid-cols-6">{statuses.map((status) => <div key={status} className="rounded-2xl border border-slate-200 bg-white p-2"><div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-black uppercase text-slate-500">{status}</span><Badge>{tasks.filter((task) => task.status === status).length}</Badge></div><div className="mb-2 rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500">WIP {status === "In progress" ? "5" : "∞"}</div><div className="space-y-2">{tasks.filter((task) => task.status === status).slice(0, 8).map((task) => <article key={task.id} data-testid={`card-${task.id}`} onClick={() => openTask(task.id)} className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-2 hover:border-emerald-300"><div className="flex items-center justify-between"><span className="text-[10px] font-black text-slate-400">{task.code}</span><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></div><h3 className="mt-1 line-clamp-2 text-xs font-black">{task.title}</h3><div className="mt-2 text-[11px] text-slate-500">{task.project}</div><div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-500"><span>{task.assignee.split(" ")[0]}</span><span>💬{task.comments.length} 📎{task.attachments.length} ☑{task.checklist.filter((i) => i.done).length}/{task.checklist.length}</span></div><div className="mt-2 flex gap-1"><SmallButton onClick={() => setStatus(task.id, "In progress")}>Work</SmallButton><SmallButton onClick={() => setStatus(task.id, "Review")}>Review</SmallButton></div></article>)}</div></div>)}</div>
    <DensePanel title="Blocked / SLA / Overdue" subtitle="Risk side panel"><TaskList tasks={tasks.filter((task) => task.status === "Blocked" || task.priority === "Critical").slice(0, 10)} openTask={openTask} /></DensePanel>
  </div>;
}

function TableView({ tasks, selected, toggleSelected, openTask, bulkStatus, bulkAssignee, exportCsv }: { tasks: V98Task[]; selected: string[]; toggleSelected: (id: string) => void; openTask: (id: string) => void; bulkStatus: (status: V98Task["status"]) => void; bulkAssignee: (name: string) => void; exportCsv: () => void }) {
  return <DensePanel title="Enterprise Task Table" subtitle="Multi-select, custom fields, dependencies, comments, attachments, grouping and bulk actions" actions={<div className="flex gap-1"><SmallButton testId="bulk-status" onClick={() => bulkStatus("Review")}>Bulk Review</SmallButton><SmallButton testId="bulk-assignee" onClick={() => bulkAssignee("Ioana Marinescu")}>Bulk Assign</SmallButton><SmallButton testId="table-export" onClick={exportCsv}>Export CSV</SmallButton></div>}>
    <div className="overflow-x-auto" data-testid="enterprise-task-table"><table className="w-full min-w-[1300px] text-left text-xs"><thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400"><tr>{["", "ID", "Task name", "Project", "Type", "Status", "Priority", "Assignee", "Owner", "Due", "Estimate", "Tracked", "Deps", "Tags", "Fields", "💬", "📎", "Actions"].map((head) => <th key={head} className="border-b border-slate-200 px-2 py-2">{head}</th>)}</tr></thead><tbody>{tasks.map((task) => <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="px-2 py-2"><input data-testid={`select-${task.id}`} type="checkbox" checked={selected.includes(task.id)} onChange={() => toggleSelected(task.id)} /></td><td className="px-2 py-2 font-black">{task.code}</td><td className="max-w-[320px] px-2 py-2"><button type="button" onClick={() => openTask(task.id)} className="line-clamp-1 text-left font-black text-slate-950 hover:text-emerald-700">{task.title}</button></td><td className="px-2 py-2">{task.project}</td><td className="px-2 py-2">{task.type}</td><td className="px-2 py-2"><Badge tone={statusTone(task.status)}>{task.status}</Badge></td><td className="px-2 py-2"><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></td><td className="px-2 py-2">{task.assignee}</td><td className="px-2 py-2">{task.owner}</td><td className="px-2 py-2">{task.dueDate}</td><td className="px-2 py-2">{task.estimate}h</td><td className="px-2 py-2">{task.tracked}h</td><td className="px-2 py-2">{task.dependencies.length}</td><td className="px-2 py-2">{task.tags.join(", ")}</td><td className="px-2 py-2">{Object.keys(task.customFields).length}</td><td className="px-2 py-2">{task.comments.length}</td><td className="px-2 py-2">{task.attachments.length}</td><td className="px-2 py-2"><SmallButton onClick={() => openTask(task.id)}>Open</SmallButton></td></tr>)}</tbody></table></div>
  </DensePanel>;
}

function CalendarGanttView({ tasks, openTask, changeDue, addDependency }: { tasks: V98Task[]; openTask: (id: string) => void; changeDue: (id: string, due: string) => void; addDependency: (id: string) => void }) {
  return <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_320px]" data-testid="calendar-gantt-real-planning">
    <DensePanel title="Calendar + Gantt planning" subtitle="Month/week style timeline, milestones, dependencies and critical path preview"><div className="grid gap-2 md:grid-cols-7">{Array.from({ length: 21 }).map((_, index) => <div key={index} className="min-h-32 rounded-xl border border-slate-200 bg-slate-50 p-2"><div className="text-[10px] font-black text-slate-400">Jun {10 + index}</div>{tasks.filter((task) => Number(task.dueDate.slice(-2)) === 10 + index).slice(0, 3).map((task) => <button key={task.id} type="button" onClick={() => openTask(task.id)} className="mt-1 w-full rounded-lg bg-white px-2 py-1 text-left text-[10px] font-bold shadow-sm hover:bg-emerald-50">{task.code} · {task.title}</button>)}</div>)}</div><div className="mt-4 space-y-2">{tasks.slice(0, 14).map((task, index) => <div key={task.id} className="grid grid-cols-[120px_minmax(0,1fr)_170px] items-center gap-2 text-xs"><button onClick={() => openTask(task.id)} className="truncate text-left font-black">{task.code}</button><div className="h-4 rounded-full bg-slate-100"><div className={`h-4 rounded-full ${task.status === "Blocked" ? "bg-rose-400" : "bg-emerald-500"}`} style={{ marginLeft: `${(index % 5) * 9}%`, width: `${Math.max(18, task.progress / 2)}%` }} /></div><div className="flex gap-1"><SmallButton onClick={() => changeDue(task.id, "2026-06-29")}>Move due</SmallButton><SmallButton onClick={() => addDependency(task.id)}>Dep</SmallButton></div></div>)}</div></DensePanel>
    <DensePanel title="Upcoming / blocked / approvals" subtitle="Right planning panel"><TaskList tasks={tasks.filter((task) => task.status === "Blocked" || task.priority === "Critical").slice(0, 12)} openTask={openTask} /></DensePanel>
  </div>;
}

function WorkloadView({ tasks, approvals, approve, changeEstimate }: { tasks: V98Task[]; approvals: V98Approval[]; approve: (id: string, status: "Approved" | "Rejected") => void; changeEstimate: (taskId: string, estimate: number) => void }) {
  const users = v98Users;
  return <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_330px]" data-testid="workload-resource-planning">
    <DensePanel title="Resource planning workload timeline" subtitle="Capacity, allocated hours, overload, leave mock and planned vs tracked"><div className="overflow-x-auto"><table className="w-full min-w-[980px] text-xs"><thead className="bg-slate-50 text-[10px] uppercase text-slate-400"><tr><th className="px-2 py-2 text-left">User</th>{Array.from({ length: 10 }).map((_, index) => <th key={index} className="px-2 py-2">D{index + 1}</th>)}<th className="px-2 py-2">Capacity</th><th className="px-2 py-2">Allocated</th></tr></thead><tbody>{users.map((user) => { const assigned = tasks.filter((task) => task.assigneeId === user.id); const allocated = assigned.reduce((sum, task) => sum + task.estimate, 0); return <tr key={user.id} className="border-b border-slate-100"><td className="px-2 py-2 text-left"><b>{user.name}</b><div className="text-[10px] text-slate-500">{user.department} · {user.role}</div></td>{Array.from({ length: 10 }).map((_, index) => <td key={index} className="px-1 py-2"><div className={`h-7 rounded ${allocated / 10 > user.capacity / 10 ? "bg-rose-100" : index % 3 === 0 ? "bg-emerald-100" : "bg-blue-50"}`} /></td>)}<td className="px-2 py-2">{user.capacity}h</td><td className="px-2 py-2"><Badge tone={allocated > user.capacity ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}>{allocated}h</Badge></td></tr>; })}</tbody></table></div><div className="mt-3 grid gap-2 md:grid-cols-3">{tasks.slice(0, 6).map((task) => <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs"><b>{task.code}</b><div className="text-slate-500">{task.estimate}h estimate</div><SmallButton onClick={() => changeEstimate(task.id, task.estimate + 2)}>+2h estimate</SmallButton></div>)}</div></DensePanel>
    <DensePanel title="Approvals queue" subtitle="Approve/reject affects state and notifications"><div className="space-y-2">{approvals.map((approval) => <div key={approval.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs"><div className="font-black">{approval.title}</div><div className="text-slate-500">{approval.requestedBy} → {approval.approver}</div><div className="mt-2 flex gap-1"><SmallButton testId={`approve-${approval.id}`} onClick={() => approve(approval.id, "Approved")}>Approve</SmallButton><SmallButton testId={`reject-${approval.id}`} onClick={() => approve(approval.id, "Rejected")}>Reject</SmallButton><Badge>{approval.status}</Badge></div></div>)}</div></DensePanel>
  </div>;
}

function TaskDrawer({ task, users, tickets, timer, commentDraft, setCommentDraft, updateTask, setStatus, addComment, toggleChecklist, addDependency, attachFile, startTimer, stopTimer }: { task?: V98Task; users: typeof v98Users; tickets: V98Ticket[]; timer: TimerState; commentDraft: string; setCommentDraft: (value: string) => void; updateTask: (updater: (task: V98Task) => void, toast: string) => void; setStatus: (status: V98Task["status"]) => void; addComment: () => void; toggleChecklist: (id: string) => void; addDependency: () => void; attachFile: () => void; startTimer: () => void; stopTimer: () => void }) {
  if (!task) return <aside className="border-l border-slate-200 bg-white p-4">No task selected</aside>;
  return <aside className="border-l border-slate-200 bg-white" data-testid="task-drawer">
    <div className="sticky top-0 max-h-screen overflow-y-auto p-4">
      <div className="mb-3 flex items-center justify-between"><Badge tone={statusTone(task.status)}>{task.status}</Badge><span className="text-xs font-black text-slate-400">{task.code}</span></div>
      <input data-testid="drawer-title" value={task.title} onChange={(event) => updateTask((draft) => { draft.title = event.target.value; }, "title edited")} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-lg font-black outline-none focus:border-emerald-300" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <DrawerSelect label="Status" value={task.status} options={statuses} onChange={(value) => setStatus(value as V98Task["status"])} />
        <DrawerSelect label="Priority" value={task.priority} options={["Critical", "High", "Medium", "Low"]} onChange={(value) => updateTask((draft) => { draft.priority = value as V98Task["priority"]; }, "priority edited")} />
        <DrawerSelect label="Assignee" value={task.assignee} options={users.map((user) => user.name)} onChange={(value) => updateTask((draft) => { draft.assignee = value; }, "assignee edited")} />
        <DrawerSelect label="Owner" value={task.owner} options={users.map((user) => user.name)} onChange={(value) => updateTask((draft) => { draft.owner = value; }, "owner edited")} />
        <DrawerInput label="Start" value={task.startDate} onChange={(value) => updateTask((draft) => { draft.startDate = value; }, "start date edited")} />
        <DrawerInput label="Due" value={task.dueDate} onChange={(value) => updateTask((draft) => { draft.dueDate = value; }, "due date edited")} />
        <DrawerInput label="Estimate" value={String(task.estimate)} onChange={(value) => updateTask((draft) => { draft.estimate = Number(value) || 0; }, "estimate edited")} />
        <DrawerInput label="Progress" value={String(task.progress)} onChange={(value) => updateTask((draft) => { draft.progress = Number(value) || 0; }, "progress edited")} />
      </div>
      <DrawerSection title="Custom fields / tags"><div className="grid gap-2 text-xs">{Object.entries(task.customFields).map(([key, value]) => <div key={key} className="rounded-xl bg-slate-50 p-2"><b>{key}</b><div>{value}</div></div>)}<div className="flex flex-wrap gap-1">{task.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div></div></DrawerSection>
      <DrawerSection title="Subtasks / checklist"><div className="space-y-2">{task.checklist.map((item) => <label key={item.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold"><input data-testid={`checklist-${item.id}`} type="checkbox" checked={item.done} onChange={() => toggleChecklist(item.id)} />{item.text}</label>)}<SmallButton testId="add-subtask" onClick={() => updateTask((draft) => { draft.checklist.push({ id: `cl-${Date.now()}`, text: "Subtask nou", done: false }); }, "subtask added")}>Add subtask</SmallButton></div></DrawerSection>
      <DrawerSection title="Dependencies / approvals / tickets"><div className="grid gap-2 text-xs"><div>Dependencies: {task.dependencies.join(", ") || "none"}</div><div>Linked tickets: {task.linkedTickets.join(", ") || "none"}</div><div>Approvals: {task.linkedApprovals.join(", ") || "none"}</div><SmallButton testId="add-dependency" onClick={addDependency}>Add dependency</SmallButton></div></DrawerSection>
      <DrawerSection title="Comments"><textarea data-testid="comment-input" value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} className="mb-2 min-h-20 w-full rounded-xl border border-slate-200 p-2 text-xs" /><SmallButton testId="add-comment" primary onClick={addComment}>Add comment</SmallButton><div className="mt-2 space-y-2">{task.comments.map((comment) => <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs"><b>{comment.author}</b><div>{comment.text}</div><div className="text-slate-400">{comment.at}</div></div>)}</div></DrawerSection>
      <DrawerSection title="Files / attachments"><div className="space-y-2">{task.attachments.map((file) => <div key={file.id} className="rounded-xl bg-slate-50 p-2 text-xs"><b>{file.name}</b><div>{file.type} · {file.size}</div></div>)}<SmallButton testId="attach-mock" onClick={attachFile}>Upload/attach mock</SmallButton></div></DrawerSection>
      <DrawerSection title="Time entries / reminders / automation"><div className="grid gap-2 text-xs"><div>Tracked: <b>{task.tracked}h</b> / Estimate: <b>{task.estimate}h</b></div><div>Reminder: {task.reminders.join(", ")}</div><div>Automation: {task.automationHistory.join(", ")}</div><div className="flex gap-2"><SmallButton testId="start-timer" disabled={!!timer} onClick={startTimer}>Start timer</SmallButton><SmallButton testId="stop-timer" disabled={!timer} onClick={stopTimer}>Stop timer</SmallButton></div></div></DrawerSection>
      <DrawerSection title="Activity log"><div className="space-y-1">{task.activity.map((entry) => <div key={entry.id} className="rounded-lg bg-slate-50 px-2 py-1 text-xs"><b>{entry.actor}</b> {entry.action} <span className="text-slate-400">{entry.at}</span></div>)}</div></DrawerSection>
      <div className="sticky bottom-0 mt-3 flex gap-2 border-t border-slate-200 bg-white pt-3"><SmallButton testId="drawer-save" primary onClick={() => updateTask((draft) => { draft.activity.unshift({ id: `save-${Date.now()}`, actor: "Vlad Neagu", action: "drawer saved", at: new Date().toISOString().slice(0, 16).replace("T", " ") }); }, "drawer saved")}>Save</SmallButton><SmallButton testId="drawer-cancel" onClick={() => updateTask(() => {}, "drawer cancel kept current persisted state")}>Cancel</SmallButton></div>
    </div>
  </aside>;
}

function DrawerSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <div><FieldLabel>{label}</FieldLabel><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-bold">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>;
}

function DrawerInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div><FieldLabel>{label}</FieldLabel><input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-bold" /></div>;
}

function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-3"><h3 className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{title}</h3>{children}</section>;
}

function DensePanel({ title, subtitle, children, actions }: { title: string; subtitle: string; children: ReactNode; actions?: ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white shadow-sm" data-density-panel="true"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2"><div><h2 className="text-sm font-black text-slate-950">{title}</h2><p className="text-[11px] font-semibold text-slate-500">{subtitle}</p></div>{actions}</div><div className="p-3">{children}</div></section>;
}

function TaskList({ tasks, openTask, startTimer, setStatus }: { tasks: V98Task[]; openTask: (id: string) => void; startTimer?: (id: string) => void; setStatus?: (id: string, status: V98Task["status"]) => void }) {
  return <div className="space-y-2">{tasks.map((task) => <article key={task.id} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs md:grid-cols-[minmax(0,1fr)_auto]"><button data-testid={`open-${task.id}`} type="button" onClick={() => openTask(task.id)} className="min-w-0 text-left"><div className="flex flex-wrap items-center gap-1"><b>{task.code}</b><Badge tone={statusTone(task.status)}>{task.status}</Badge><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></div><div className="line-clamp-1 font-black text-slate-950">{task.title}</div><div className="line-clamp-1 text-slate-500">{task.project} · {task.assignee} · {task.dueDate} · 💬{task.comments.length} 📎{task.attachments.length}</div></button><div className="flex items-center gap-1">{setStatus ? <SmallButton onClick={() => setStatus(task.id, "In progress")}>Work</SmallButton> : null}{startTimer ? <SmallButton onClick={() => startTimer(task.id)}>Timer</SmallButton> : null}</div></article>)}</div>;
}

function WorkloadMini({ tasks }: { tasks: V98Task[] }) {
  return <div className="space-y-2">{v98Users.slice(0, 6).map((user) => { const assigned = tasks.filter((task) => task.assigneeId === user.id); const hours = assigned.reduce((sum, task) => sum + task.estimate, 0); return <div key={user.id} className="grid grid-cols-[110px_minmax(0,1fr)_52px] items-center gap-2 text-xs"><span className="truncate font-black">{user.name}</span><div className="h-3 rounded-full bg-slate-100"><div className={`h-3 rounded-full ${hours > user.capacity ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, (hours / user.capacity) * 100)}%` }} /></div><span className="text-right font-bold">{hours}h</span></div>; })}</div>;
}

function RightContext({ notifications, approvals, tasks }: { notifications: V98Notification[]; approvals: V98Approval[]; tasks: V98Task[] }) {
  return <div className="grid gap-3"><DensePanel title="Context panel" subtitle="Risks, notifications, saved views"><div className="space-y-2"><div className="rounded-xl bg-rose-50 p-2 text-xs font-bold text-rose-700">{tasks.filter((task) => task.status === "Blocked").length} blocked tasks need dependency decision</div><div className="rounded-xl bg-amber-50 p-2 text-xs font-bold text-amber-700">{approvals.filter((a) => a.status === "Waiting").length} approvals waiting</div>{notifications.slice(0, 6).map((notification) => <div key={notification.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs"><b>{notification.title}</b><div>{notification.body}</div></div>)}</div></DensePanel><DensePanel title="Saved Views" subtitle="Persistent local views"><div className="space-y-1">{v98SavedViews.map((view) => <div key={view.id} className="rounded-lg bg-slate-50 px-2 py-1 text-xs"><b>{view.name}</b><div className="text-slate-500">{view.filters}</div></div>)}</div></DensePanel></div>;
}
