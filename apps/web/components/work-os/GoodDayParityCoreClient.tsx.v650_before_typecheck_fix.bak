"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  FileText,
  Filter,
  GitBranch,
  KanbanSquare,
  Layers3,
  ListChecks,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  StopCircle,
  Timer,
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
  goodDayParityFeatureMatrix,
  isOverdue,
  minutesToHours,
  type GoodDayApproval,
  type GoodDayAutomationRule,
  type GoodDayDepartment,
  type GoodDayFilters,
  type GoodDayNotification,
  type GoodDayParityState,
  type GoodDayPriority,
  type GoodDayStatus,
  type GoodDayTask,
  type GoodDayTicket,
  type GoodDayTicketStatus,
  type GoodDayTimeEntry,
  type GoodDayUser
} from "@/lib/enterprise/work-os-goodday-parity-core";

type Section = "command" | "tasks" | "tickets" | "approvals" | "time" | "automations" | "reports";

const statusOptions: GoodDayStatus[] = ["Backlog", "De facut", "In lucru", "Review", "Blocat", "Aprobare", "Finalizat", "Anulat"];
const priorityOptions: GoodDayPriority[] = ["Low", "Normal", "High", "Urgent", "Critical"];
const ticketStatusOptions: GoodDayTicketStatus[] = ["Nou", "In triere", "In lucru", "Asteapta client", "Escaladat", "Rezolvat", "Inchis"];
const departmentOptions: GoodDayDepartment[] = ["Management", "Audit", "Administrativ", "Automatizari", "Audit energetic", "Comercial", "Marketing", "Productie", "Mentenanta", "Achizitii", "Financiar"];

function loadState(): GoodDayParityState {
  if (typeof window === "undefined") return buildGoodDayParitySeed();
  try {
    const raw = window.localStorage.getItem(GOODDAY_PARITY_STORAGE_KEY);
    if (!raw) return buildGoodDayParitySeed();
    const parsed = JSON.parse(raw) as Partial<GoodDayParityState>;
    const seed = buildGoodDayParitySeed();
    return {
      users: Array.isArray(parsed.users) ? parsed.users : seed.users,
      clients: Array.isArray(parsed.clients) ? parsed.clients : seed.clients,
      projects: Array.isArray(parsed.projects) ? parsed.projects : seed.projects,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks.map(normalizeTask) : seed.tasks,
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets.map(normalizeTicket) : seed.tickets,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : seed.notifications,
      approvals: Array.isArray(parsed.approvals) ? parsed.approvals : seed.approvals,
      timeEntries: Array.isArray(parsed.timeEntries) ? parsed.timeEntries : seed.timeEntries,
      savedViews: Array.isArray(parsed.savedViews) ? parsed.savedViews : seed.savedViews,
      automations: Array.isArray(parsed.automations) ? parsed.automations : seed.automations,
      auditLog: Array.isArray(parsed.auditLog) ? parsed.auditLog : seed.auditLog
    };
  } catch {
    return buildGoodDayParitySeed();
  }
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
    customFields: task.customFields ?? {}
  };
}

function normalizeTicket(ticket: GoodDayTicket): GoodDayTicket {
  return {
    ...ticket,
    comments: Array.isArray(ticket.comments) ? ticket.comments : [],
    attachments: Array.isArray(ticket.attachments) ? ticket.attachments : []
  };
}

export function GoodDayParityCoreClient() {
  const [state, setState] = useState<GoodDayParityState>(() => loadState());
  const [currentUserId, setCurrentUserId] = useState("u_andrei");
  const [section, setSection] = useState<Section>("command");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(state.tasks[0]?.id ?? null);
  const [filters, setFilters] = useState<GoodDayFilters>({ search: "", status: "all", priority: "all", assigneeId: "all", department: "all", projectId: "all" });
  const [ticketDraft, setTicketDraft] = useState("Invertor cu randament scazut detectat la client");
  const [taskDraft, setTaskDraft] = useState("Task nou Servelect");
  const [commentDraft, setCommentDraft] = useState("");
  const [timeDraft, setTimeDraft] = useState("45");
  const [timerTaskId, setTimerTaskId] = useState<string | null>(null);
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(null);
  const [lastExport, setLastExport] = useState<string>("");
  const currentUser = state.users.find((user) => user.id === currentUserId) ?? state.users[0];

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(GOODDAY_PARITY_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const visibleTasks = useMemo(() => {
    const roleFiltered = state.tasks.filter((task) => canUserSeeTask(currentUser, task, state.projects));
    return filterTasks(roleFiltered, filters);
  }, [state.tasks, state.projects, filters, currentUser]);

  const selectedTask = state.tasks.find((task) => task.id === selectedTaskId) ?? visibleTasks[0] ?? state.tasks[0];
  const workload = useMemo(() => calculateWorkload(state.users, state.tasks, state.timeEntries), [state.users, state.tasks, state.timeEntries]);
  const unreadNotifications = state.notifications.filter((notification) => notification.userId === currentUser.id && !notification.read);
  const overdueTasks = visibleTasks.filter((task) => isOverdue(task.dueDate));
  const blockedTasks = visibleTasks.filter((task) => task.status === "Blocat");
  const pendingApprovals = state.approvals.filter((approval) => approval.status === "Pending" && (approval.approverId === currentUser.id || currentUser.role === "Super Admin"));

  function updateState(mutator: (draft: GoodDayParityState) => GoodDayParityState) {
    setState((previous) => mutator(structuredClone(previous)));
  }

  function pushAudit(draft: GoodDayParityState, entityId: string, entityKind: "task" | "ticket" | "approval" | "notification" | "time" | "automation", action: string, detail?: string) {
    const activity = buildActivity(entityId, entityKind, currentUser.id, action, detail);
    draft.auditLog.unshift(activity);
    const task = draft.tasks.find((item) => item.id === entityId);
    if (task) task.activity.unshift(activity);
  }

  function addNotification(draft: GoodDayParityState, userId: string, title: string, body: string, entityKind: "task" | "ticket" | "approval" | "notification" | "time" | "automation", entityId: string, kind: GoodDayNotification["kind"]) {
    draft.notifications.unshift(buildNotification(userId, title, body, entityKind, entityId, kind));
  }

  function createTask() {
    if (!taskDraft.trim()) return;
    updateState((draft) => {
      const task = createTaskFromPartial({
        title: taskDraft.trim(),
        projectId: draft.projects[0]?.id ?? "p_green_500",
        ownerId: currentUser.id,
        assigneeId: currentUser.id,
        department: currentUser.department,
        priority: "Normal",
        tags: ["manual"],
        type: "Task"
      });
      draft.tasks.unshift(task);
      pushAudit(draft, task.id, "task", "Task created", task.title);
      addNotification(draft, task.assigneeId, "Task nou alocat", task.title, "task", task.id, "task_assigned");
      setSelectedTaskId(task.id);
      return draft;
    });
    setTaskDraft("Task nou Servelect");
  }

  function updateTask(taskId: string, patch: Partial<GoodDayTask>, action = "Task updated") {
    updateState((draft) => {
      const index = draft.tasks.findIndex((task) => task.id === taskId);
      if (index < 0) return draft;
      const before = draft.tasks[index];
      const next = { ...before, ...patch, updatedAt: new Date().toISOString() };
      draft.tasks[index] = next;
      pushAudit(draft, taskId, "task", action, Object.keys(patch).join(", "));
      if (patch.assigneeId && patch.assigneeId !== before.assigneeId) addNotification(draft, patch.assigneeId, "Task reasignat", next.title, "task", taskId, "task_assigned");
      return draft;
    });
  }

  function deleteTask(taskId: string) {
    updateState((draft) => {
      draft.tasks = draft.tasks.filter((task) => task.id !== taskId);
      pushAudit(draft, taskId, "task", "Task deleted");
      return draft;
    });
    setSelectedTaskId(null);
  }

  function addComment(taskId: string) {
    if (!commentDraft.trim()) return;
    updateState((draft) => {
      const task = draft.tasks.find((item) => item.id === taskId);
      if (!task) return draft;
      task.comments.unshift({ id: `com_${Date.now()}`, authorId: currentUser.id, body: commentDraft.trim(), createdAt: new Date().toISOString() });
      pushAudit(draft, taskId, "task", "Comment added", commentDraft.trim());
      task.watcherIds.forEach((watcherId) => watcherId !== currentUser.id && addNotification(draft, watcherId, "Comentariu nou", task.title, "task", task.id, "mention"));
      return draft;
    });
    setCommentDraft("");
  }

  function toggleChecklist(taskId: string, itemId: string) {
    updateState((draft) => {
      const task = draft.tasks.find((item) => item.id === taskId);
      const item = task?.checklist.find((check) => check.id === itemId);
      if (!task || !item) return draft;
      item.done = !item.done;
      const done = task.checklist.filter((check) => check.done).length;
      task.progress = Math.round((done / Math.max(task.checklist.length, 1)) * 100);
      pushAudit(draft, taskId, "task", "Checklist updated", item.title);
      return draft;
    });
  }

  function addChecklistItem(taskId: string) {
    updateState((draft) => {
      const task = draft.tasks.find((item) => item.id === taskId);
      if (!task) return draft;
      task.checklist.push({ id: `check_${Date.now()}`, title: "Subtask nou", done: false });
      pushAudit(draft, taskId, "task", "Checklist item added");
      return draft;
    });
  }

  function addAttachment(taskId: string) {
    updateState((draft) => {
      const task = draft.tasks.find((item) => item.id === taskId);
      if (!task) return draft;
      task.attachments.push({ id: `att_${Date.now()}`, name: "Raport mock Servelect.pdf", type: "PDF", url: "#" });
      pushAudit(draft, taskId, "task", "Attachment added", "Raport mock Servelect.pdf");
      return draft;
    });
  }

  function addTime(taskId: string, minutes: number, source: GoodDayTimeEntry["source"] = "Manual") {
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    updateState((draft) => {
      draft.timeEntries.unshift({ id: `time_${Date.now()}`, taskId, userId: currentUser.id, date: new Date().toISOString().slice(0, 10), minutes, note: source === "Timer" ? "Timer task" : "Adaugat manual", source });
      pushAudit(draft, taskId, "time", "Time entry added", `${minutes} minute`);
      return draft;
    });
  }

  function startTimer(taskId: string) {
    setTimerTaskId(taskId);
    setTimerStartedAt(Date.now());
  }

  function stopTimer() {
    if (!timerTaskId || !timerStartedAt) return;
    const minutes = Math.max(1, Math.round((Date.now() - timerStartedAt) / 60000));
    addTime(timerTaskId, minutes, "Timer");
    setTimerTaskId(null);
    setTimerStartedAt(null);
  }

  function updateTicketStatus(ticketId: string, status: GoodDayTicketStatus) {
    updateState((draft) => {
      const ticket = draft.tickets.find((item) => item.id === ticketId);
      if (!ticket) return draft;
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
      pushAudit(draft, ticketId, "ticket", "Ticket status changed", status);
      return draft;
    });
  }

  function createTicket() {
    if (!ticketDraft.trim()) return;
    updateState((draft) => {
      const ticket: GoodDayTicket = {
        id: `ticket_${Date.now()}`,
        title: ticketDraft.trim(),
        type: "Internal",
        severity: "High",
        status: "Nou",
        slaDueAt: new Date(Date.now() + 48 * 3600000).toISOString(),
        requesterId: currentUser.id,
        assigneeId: draft.users.find((user) => user.role === "Manager")?.id ?? currentUser.id,
        projectId: draft.projects[0]?.id,
        clientId: draft.projects[0]?.clientId,
        escalated: false,
        comments: [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      draft.tickets.unshift(ticket);
      pushAudit(draft, ticket.id, "ticket", "Ticket created", ticket.title);
      addNotification(draft, ticket.assigneeId, "Ticket nou", ticket.title, "ticket", ticket.id, "sla_risk");
      return draft;
    });
    setTicketDraft("Invertor cu randament scazut detectat la client");
  }

  function escalateTicket(ticketId: string) {
    updateState((draft) => {
      const ticket = draft.tickets.find((item) => item.id === ticketId);
      if (!ticket) return draft;
      ticket.status = "Escaladat";
      ticket.escalated = true;
      ticket.updatedAt = new Date().toISOString();
      pushAudit(draft, ticketId, "ticket", "Ticket escalated", ticket.title);
      draft.users.filter((user) => user.role === "Manager" || user.role === "Super Admin").forEach((user) => addNotification(draft, user.id, "Ticket escaladat", ticket.title, "ticket", ticket.id, "ticket_escalated"));
      return draft;
    });
  }

  function convertTicketToTask(ticket: GoodDayTicket) {
    updateState((draft) => {
      const project = draft.projects.find((item) => item.id === ticket.projectId) ?? draft.projects[0];
      const task = createTaskFromPartial({
        title: `Task din ticket: ${ticket.title}`,
        type: "Ticket",
        priority: ticket.severity,
        projectId: project.id,
        ownerId: currentUser.id,
        assigneeId: ticket.assigneeId,
        department: project.department,
        relatedTicketId: ticket.id,
        clientId: ticket.clientId,
        tags: ["ticket", ticket.type]
      });
      draft.tasks.unshift(task);
      ticket.taskId = task.id;
      pushAudit(draft, ticket.id, "ticket", "Ticket converted to task", task.title);
      addNotification(draft, task.assigneeId, "Task creat din ticket", task.title, "task", task.id, "task_assigned");
      setSelectedTaskId(task.id);
      return draft;
    });
  }

  function decideApproval(approvalId: string, status: GoodDayApproval["status"]) {
    updateState((draft) => {
      const approval = draft.approvals.find((item) => item.id === approvalId);
      if (!approval) return draft;
      approval.status = status;
      approval.decidedAt = new Date().toISOString();
      approval.comment = status === "Approved" ? "Aprobat in GoodDay parity core" : "Respins pentru completari";
      approval.history.unshift(buildActivity(approval.entityId, approval.entityKind, currentUser.id, `Approval ${status}`, approval.comment));
      pushAudit(draft, approval.entityId, approval.entityKind, `Approval ${status}`, approval.title);
      if (approval.entityKind === "task") {
        const task = draft.tasks.find((item) => item.id === approval.entityId);
        if (task) task.approvalState = status === "Approved" ? "Approved" : "Rejected";
      }
      addNotification(draft, approval.requesterId, `Approval ${status}`, approval.title, "approval", approval.id, "approval_requested");
      return draft;
    });
  }

  function markNotificationRead(notificationId: string) {
    updateState((draft) => {
      const notification = draft.notifications.find((item) => item.id === notificationId);
      if (notification) notification.read = true;
      return draft;
    });
  }

  function saveCurrentView() {
    updateState((draft) => {
      draft.savedViews.unshift({
        id: `view_${Date.now()}`,
        name: `Vedere ${new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}`,
        scope: "tasks",
        filters,
        columns: ["task", "project", "status", "priority", "assignee", "deadline"],
        grouping: filters.status !== "all" ? "status" : "none",
        ownerId: currentUser.id,
        shared: false
      });
      return draft;
    });
  }

  function applySavedView(viewId: string) {
    const view = state.savedViews.find((item) => item.id === viewId);
    if (view) setFilters({ ...view.filters });
  }

  function runAutomation(ruleId: string) {
    updateState((draft) => {
      const rule = draft.automations.find((item) => item.id === ruleId);
      if (!rule) return draft;
      rule.runs += 1;
      rule.lastRunAt = new Date().toISOString();
      pushAudit(draft, rule.id, "automation", "Automation executed", `${rule.trigger} -> ${rule.action}`);
      if (rule.action === "create_ticket") {
        const ticket: GoodDayTicket = {
          id: `ticket_auto_${Date.now()}`,
          title: "Ticket automat: alerta operationala Servelect",
          type: rule.trigger === "iot_alarm" ? "IoT" : "Internal",
          severity: rule.trigger === "iot_alarm" ? "Critical" : "High",
          status: "Nou",
          slaDueAt: new Date(Date.now() + 24 * 3600000).toISOString(),
          requesterId: currentUser.id,
          assigneeId: draft.users.find((user) => user.role === "Manager")?.id ?? currentUser.id,
          projectId: draft.projects[0]?.id,
          clientId: draft.projects[0]?.clientId,
          escalated: false,
          comments: [],
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        draft.tickets.unshift(ticket);
      }
      if (rule.action === "create_task") {
        draft.tasks.unshift(createTaskFromPartial({ title: "Task automat: verificare operationala", projectId: draft.projects[0]?.id ?? "p_green_500", ownerId: currentUser.id, assigneeId: currentUser.id, department: currentUser.department, type: "Task", priority: "High", tags: ["automation"] }));
      }
      return draft;
    });
  }

  function exportCsv() {
    const csv = exportTasksCsv(visibleTasks, state.projects, state.users);
    setLastExport(csv);
  }

  function resetDemo() {
    const seed = buildGoodDayParitySeed();
    setState(seed);
    setSelectedTaskId(seed.tasks[0]?.id ?? null);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-5 text-slate-950" data-audit-page="goodday-parity" data-audit-ready="true">
      <header className="mb-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700"><Zap className="h-3.5 w-3.5" /> SERVELECT WORK OS · GoodDay parity functional core</div>
            <h1 className="text-2xl font-black tracking-tight">Work management real: taskuri, tickete, approvals, timp, workload, automatizari</h1>
            <p className="mt-2 max-w-4xl text-sm text-slate-600">Implementare functionala inspirata de modelul GoodDay, adaptata pentru proiecte fotovoltaice, IoT, mentenanta, stoc, CRM, finantari, HR si departamente Servelect. Nu include branding GoodDay.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={currentUserId} onChange={(event) => setCurrentUserId(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm">
              {state.users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.role}</option>)}
            </select>
            <button onClick={resetDemo} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"><RefreshCw className="mr-1 inline h-4 w-4" /> Reset demo</button>
          </div>
        </div>
      </header>

      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Metric icon={<ClipboardList />} label="Taskuri vizibile" value={visibleTasks.length} sub={`${overdueTasks.length} intarziate`} />
        <Metric icon={<AlertTriangle />} label="Blocate / risc" value={blockedTasks.length} sub="status Blocat" tone="amber" />
        <Metric icon={<Bell />} label="Notificari necitite" value={unreadNotifications.length} sub="pentru user curent" tone="blue" />
        <Metric icon={<ShieldCheck />} label="Aprobari" value={pendingApprovals.length} sub="in asteptare" tone="purple" />
        <Metric icon={<Timer />} label="Timp logat" value={minutesToHours(state.timeEntries.reduce((sum, entry) => sum + entry.minutes, 0))} sub="mock persistent" tone="emerald" />
        <Metric icon={<Workflow />} label="Automatizari" value={state.automations.length} sub={`${state.automations.filter((rule) => rule.enabled).length} active`} tone="slate" />
      </div>

      <nav className="mb-5 flex flex-wrap gap-2 rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm">
        {([
          { id: "command", label: "Command Center", icon: Activity },
          { id: "tasks", label: "Tasks", icon: ClipboardList },
          { id: "tickets", label: "Tickets/Requests", icon: AlertTriangle },
          { id: "approvals", label: "Approvals", icon: ShieldCheck },
          { id: "time", label: "Time & Workload", icon: Clock3 },
          { id: "automations", label: "Automations", icon: Workflow },
          { id: "reports", label: "Reports", icon: FileText }
        ] satisfies Array<{ id: Section; label: string; icon: typeof Activity }>).map((item) => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => setSection(item.id)} className={`rounded-2xl px-3 py-2 text-sm font-bold transition ${section === item.id ? "bg-emerald-600 text-white shadow" : "text-slate-600 hover:bg-slate-50"}`}><Icon className="mr-1 inline h-4 w-4" /> {item.label}</button>;
        })}
      </nav>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="space-y-5">
          {section === "command" ? <CommandCenter state={state} visibleTasks={visibleTasks} setSection={setSection} setSelectedTaskId={setSelectedTaskId} /> : null}
          {section === "tasks" ? <TasksSection state={state} currentUser={currentUser} visibleTasks={visibleTasks} selectedTask={selectedTask} filters={filters} setFilters={setFilters} createTask={createTask} taskDraft={taskDraft} setTaskDraft={setTaskDraft} setSelectedTaskId={setSelectedTaskId} updateTask={updateTask} saveCurrentView={saveCurrentView} applySavedView={applySavedView} deleteTask={deleteTask} /> : null}
          {section === "tickets" ? <TicketsSection state={state} ticketDraft={ticketDraft} setTicketDraft={setTicketDraft} createTicket={createTicket} escalateTicket={escalateTicket} convertTicketToTask={convertTicketToTask} updateTicketStatus={updateTicketStatus} /> : null}
          {section === "approvals" ? <ApprovalsSection state={state} approvals={pendingApprovals.length ? pendingApprovals : state.approvals} decideApproval={decideApproval} /> : null}
          {section === "time" ? <TimeWorkloadSection state={state} workload={workload} timerTaskId={timerTaskId} startTimer={startTimer} stopTimer={stopTimer} addTime={addTime} /> : null}
          {section === "automations" ? <AutomationsSection state={state} runAutomation={runAutomation} /> : null}
          {section === "reports" ? <ReportsSection state={state} visibleTasks={visibleTasks} exportCsv={exportCsv} lastExport={lastExport} /> : null}
        </main>
        <aside className="space-y-5">
          <TaskDetailPanel state={state} task={selectedTask} users={state.users} updateTask={updateTask} addComment={addComment} commentDraft={commentDraft} setCommentDraft={setCommentDraft} toggleChecklist={toggleChecklist} addChecklistItem={addChecklistItem} addAttachment={addAttachment} addTime={() => addTime(selectedTask.id, Number(timeDraft), "Manual")} timeDraft={timeDraft} setTimeDraft={setTimeDraft} startTimer={startTimer} stopTimer={stopTimer} timerTaskId={timerTaskId} />
          <NotificationsPanel notifications={state.notifications.filter((notification) => notification.userId === currentUser.id)} markNotificationRead={markNotificationRead} />
          <ActivityPanel state={state} />
        </aside>
      </div>
    </div>
  );
}

function Metric({ icon, label, value, sub, tone = "emerald" }: { icon: ReactNode; label: string; value: number | string; sub: string; tone?: "emerald" | "amber" | "blue" | "purple" | "slate" }) {
  const tones = { emerald: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", blue: "bg-blue-50 text-blue-700", purple: "bg-violet-50 text-violet-700", slate: "bg-slate-100 text-slate-700" };
  return <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"><div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-2xl ${tones[tone]}`}>{icon}</div><div className="text-2xl font-black tracking-tight">{value}</div><div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-xs text-slate-500">{sub}</div></div>;
}

function Panel({ title, icon, children, action }: { title: string; icon?: ReactNode; children: ReactNode; action?: ReactNode }) {
  return <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-base font-black tracking-tight text-slate-950">{icon}<span>{title}</span></h2>{action}</div>{children}</section>;
}

function CommandCenter({ state, visibleTasks, setSection, setSelectedTaskId }: { state: GoodDayParityState; visibleTasks: GoodDayTask[]; setSection: (section: Section) => void; setSelectedTaskId: (id: string) => void }) {
  return <div className="grid gap-5 xl:grid-cols-2">
    <Panel title="Action required" icon={<Zap className="h-4 w-4 text-emerald-600" />} action={<button onClick={() => setSection("tasks")} className="text-xs font-bold text-emerald-700">Deschide Tasks</button>}>
      <TaskMiniList tasks={visibleTasks.filter((task) => task.status === "Blocat" || task.priority === "Urgent" || task.priority === "Critical").slice(0, 6)} state={state} onOpen={setSelectedTaskId} />
    </Panel>
    <Panel title="Cross-module Servelect triggers" icon={<GitBranch className="h-4 w-4 text-emerald-600" />}>
      <div className="grid gap-3 md:grid-cols-2">
        {["alerta invertor offline -> ticket", "stoc sub minim -> procurement task", "document PIF lipsa -> task documente", "buget depasit -> approval", "client follow-up -> CRM task", "certificare ANRE expira -> HR task"].map((item) => <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700">{item}</div>)}
      </div>
    </Panel>
    <Panel title="GoodDay parity matrix" icon={<Layers3 className="h-4 w-4 text-emerald-600" />}>
      <div className="grid gap-2">
        {goodDayParityFeatureMatrix().map((item) => <div key={item.feature} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 p-3"><div><div className="text-sm font-bold">{item.feature}</div><div className="text-xs text-slate-500">{item.note}</div></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700">{item.status}</span></div>)}
      </div>
    </Panel>
    <Panel title="Projects health" icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}>
      <div className="space-y-3">
        {state.projects.map((project) => <div key={project.id} className="rounded-2xl bg-slate-50 p-3"><div className="flex justify-between text-sm font-bold"><span>{project.code} · {project.name}</span><span>{project.progress}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${project.progress}%` }} /></div><div className="mt-2 flex justify-between text-xs text-slate-500"><span>{project.phase}</span><span>{project.health}</span></div></div>)}
      </div>
    </Panel>
  </div>;
}

function TasksSection({ state, currentUser, visibleTasks, selectedTask, filters, setFilters, createTask, taskDraft, setTaskDraft, setSelectedTaskId, updateTask, saveCurrentView, applySavedView, deleteTask }: { state: GoodDayParityState; currentUser: GoodDayUser; visibleTasks: GoodDayTask[]; selectedTask: GoodDayTask; filters: GoodDayFilters; setFilters: (filters: GoodDayFilters) => void; createTask: () => void; taskDraft: string; setTaskDraft: (value: string) => void; setSelectedTaskId: (id: string) => void; updateTask: (taskId: string, patch: Partial<GoodDayTask>, action?: string) => void; saveCurrentView: () => void; applySavedView: (id: string) => void; deleteTask: (id: string) => void }) {
  const grouped = statusOptions.map((status) => ({ status, tasks: visibleTasks.filter((task) => task.status === status) }));
  return <div className="space-y-5">
    <Panel title="Task system real" icon={<ClipboardList className="h-4 w-4 text-emerald-600" />} action={<button onClick={createTask} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white"><Plus className="mr-1 inline h-3.5 w-3.5" /> Creeaza task</button>}>
      <div className="mb-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto]">
        <input value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm" placeholder="Titlu task nou" />
        <button onClick={saveCurrentView} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"><Save className="mr-1 inline h-4 w-4" /> Salveaza vedere</button>
        <select onChange={(event) => applySavedView(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold" defaultValue="">
          <option value="" disabled>Aplica saved view</option>
          {state.savedViews.map((view) => <option key={view.id} value={view.id}>{view.name}</option>)}
        </select>
      </div>
      <FilterBar state={state} filters={filters} setFilters={setFilters} />
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Task</th><th>Project</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Due</th><th>Actions</th></tr></thead>
          <tbody>
            {visibleTasks.map((task) => <tr key={task.id} className={`border-t border-slate-100 ${selectedTask.id === task.id ? "bg-emerald-50/60" : "bg-white"}`}>
              <td className="p-3"><button onClick={() => setSelectedTaskId(task.id)} className="text-left font-bold text-slate-900 hover:text-emerald-700">{task.title}</button><div className="text-xs text-slate-500">{task.type} · {task.department} · {task.tags.join(", ")}</div></td>
              <td className="text-xs text-slate-600">{state.projects.find((project) => project.id === task.projectId)?.code}</td>
              <td><select value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as GoodDayStatus }, "Status changed")} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold">{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></td>
              <td><PriorityBadge priority={task.priority} /></td>
              <td><select value={task.assigneeId} onChange={(event) => updateTask(task.id, { assigneeId: event.target.value }, "Assignee changed")} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold">{state.users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></td>
              <td className={isOverdue(task.dueDate) ? "font-bold text-rose-600" : "text-slate-600"}>{task.dueDate}</td>
              <td className="pr-3"><button onClick={() => deleteTask(task.id)} className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-bold text-rose-600">Sterge</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-500">User curent: {currentUser.name} · {currentUser.role}. Lista este filtrata role-aware.</div>
    </Panel>
    <Panel title="Board functional" icon={<KanbanSquare className="h-4 w-4 text-emerald-600" />}>
      <div className="grid gap-3 xl:grid-cols-4 2xl:grid-cols-8">
        {grouped.map((column) => <div key={column.status} className="min-h-[180px] rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="mb-3 flex justify-between text-xs font-black uppercase tracking-wide text-slate-500"><span>{column.status}</span><span>{column.tasks.length}</span></div>{column.tasks.slice(0, 5).map((task) => <button key={task.id} onClick={() => setSelectedTaskId(task.id)} className="mb-2 block w-full rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm"><div className="text-sm font-bold">{task.title}</div><div className="mt-2 flex justify-between text-xs text-slate-500"><span>{task.priority}</span><span>{task.progress}%</span></div><select value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as GoodDayStatus }, "Board move")} className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold">{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></button>)}</div>)}
      </div>
    </Panel>
  </div>;
}

function TicketsSection({ state, ticketDraft, setTicketDraft, createTicket, escalateTicket, convertTicketToTask, updateTicketStatus }: { state: GoodDayParityState; ticketDraft: string; setTicketDraft: (value: string) => void; createTicket: () => void; escalateTicket: (id: string) => void; convertTicketToTask: (ticket: GoodDayTicket) => void; updateTicketStatus: (id: string, status: GoodDayTicketStatus) => void }) {
  return <Panel title="Tickets / Requests / Forms" icon={<AlertTriangle className="h-4 w-4 text-emerald-600" />} action={<button onClick={createTicket} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white"><Plus className="mr-1 inline h-3.5 w-3.5" /> Creeaza ticket</button>}>
    <div className="mb-4 flex gap-2"><input value={ticketDraft} onChange={(event) => setTicketDraft(event.target.value)} className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm" /><button onClick={createTicket} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold">Adauga</button></div>
    <div className="grid gap-3">
      {state.tickets.map((ticket) => <div key={ticket.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-sm font-black">{ticket.title}</div><div className="text-xs text-slate-500">{ticket.type} · SLA {new Date(ticket.slaDueAt).toLocaleString("ro-RO")} · {ticket.escalated ? "Escaladat" : "Normal"}</div></div><div className="flex gap-2"><button onClick={() => escalateTicket(ticket.id)} className="rounded-xl border border-amber-200 px-3 py-1.5 text-xs font-black text-amber-700">Escaladeaza</button><button onClick={() => convertTicketToTask(ticket)} className="rounded-xl border border-emerald-200 px-3 py-1.5 text-xs font-black text-emerald-700">Converteste in task</button></div></div><div className="mt-3 flex gap-2"><PriorityBadge priority={ticket.severity} /><select value={ticket.status} onChange={(event) => updateTicketStatus(ticket.id, event.target.value as GoodDayTicketStatus)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold">{ticketStatusOptions.map((status) => <option key={status}>{status}</option>)}</select></div></div>)}
    </div>
  </Panel>;
}

function ApprovalsSection({ state, approvals, decideApproval }: { state: GoodDayParityState; approvals: GoodDayApproval[]; decideApproval: (id: string, status: GoodDayApproval["status"]) => void }) {
  return <Panel title="Approvals cu audit trail" icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}>
    <div className="grid gap-3">
      {approvals.map((approval) => <div key={approval.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap justify-between gap-3"><div><div className="text-sm font-black">{approval.title}</div><div className="text-xs text-slate-500">Requester: {state.users.find((user) => user.id === approval.requesterId)?.name} · Approver: {state.users.find((user) => user.id === approval.approverId)?.name}</div></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{approval.status}</span></div><div className="mt-3 flex gap-2"><button onClick={() => decideApproval(approval.id, "Approved")} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white">Aproba</button><button onClick={() => decideApproval(approval.id, "Rejected")} className="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-black text-rose-700">Respinge</button></div></div>)}
    </div>
  </Panel>;
}

function TimeWorkloadSection({ state, workload, timerTaskId, startTimer, stopTimer, addTime }: { state: GoodDayParityState; workload: ReturnType<typeof calculateWorkload>; timerTaskId: string | null; startTimer: (id: string) => void; stopTimer: () => void; addTime: (id: string, minutes: number) => void }) {
  return <div className="space-y-5"><Panel title="Time tracking / My Time" icon={<Clock3 className="h-4 w-4 text-emerald-600" />}>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{state.tasks.slice(0, 6).map((task) => <div key={task.id} className="rounded-2xl border border-slate-200 p-4"><div className="text-sm font-black">{task.title}</div><div className="text-xs text-slate-500">{minutesToHours(state.timeEntries.filter((entry) => entry.taskId === task.id).reduce((sum, entry) => sum + entry.minutes, 0))} raportat</div><div className="mt-3 flex gap-2">{timerTaskId === task.id ? <button onClick={stopTimer} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-black text-white"><StopCircle className="mr-1 inline h-3.5 w-3.5" /> Stop</button> : <button onClick={() => startTimer(task.id)} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white"><Play className="mr-1 inline h-3.5 w-3.5" /> Start</button>}<button onClick={() => addTime(task.id, 30)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-black">+30m</button></div></div>)}</div>
  </Panel><Panel title="Workload capacity" icon={<Users className="h-4 w-4 text-emerald-600" />}><div className="space-y-3">{workload.map((row) => <div key={row.user.id} className="rounded-2xl bg-slate-50 p-3"><div className="flex justify-between text-sm font-bold"><span>{row.user.name} · {row.user.department}</span><span className={row.overloaded ? "text-rose-600" : row.underutilized ? "text-blue-600" : "text-emerald-700"}>{row.utilization}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-200"><div className={`h-2 rounded-full ${row.overloaded ? "bg-rose-500" : row.underutilized ? "bg-blue-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(row.utilization, 130)}%` }} /></div><div className="mt-2 text-xs text-slate-500">{row.assignedCount} taskuri · estimate {minutesToHours(row.estimated)} · tracked {minutesToHours(row.tracked)}</div></div>)}</div></Panel></div>;
}

function AutomationsSection({ state, runAutomation }: { state: GoodDayParityState; runAutomation: (id: string) => void }) {
  return <Panel title="Automation rules" icon={<Workflow className="h-4 w-4 text-emerald-600" />}>
    <div className="grid gap-3 md:grid-cols-2">{state.automations.map((rule) => <div key={rule.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between gap-3"><div><div className="text-sm font-black">{rule.name}</div><div className="text-xs text-slate-500">{rule.trigger} · {rule.condition} · {rule.action}</div></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">{rule.enabled ? "ON" : "OFF"}</span></div><div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{rule.runs} rulari</span><button onClick={() => runAutomation(rule.id)} className="rounded-xl border border-emerald-200 px-3 py-1.5 font-black text-emerald-700">Ruleaza</button></div></div>)}</div>
  </Panel>;
}

function ReportsSection({ state, visibleTasks, exportCsv, lastExport }: { state: GoodDayParityState; visibleTasks: GoodDayTask[]; exportCsv: () => void; lastExport: string }) {
  return <Panel title="Reports & analytics" icon={<FileText className="h-4 w-4 text-emerald-600" />} action={<button onClick={exportCsv} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white"><Download className="mr-1 inline h-3.5 w-3.5" /> Export CSV mock</button>}>
    <div className="grid gap-3 md:grid-cols-4"><Metric icon={<ClipboardList />} label="Tasks in report" value={visibleTasks.length} sub="filtru curent" /><Metric icon={<AlertTriangle />} label="Tickets" value={state.tickets.length} sub="SLA inclus" tone="amber" /><Metric icon={<ShieldCheck />} label="Approvals" value={state.approvals.length} sub="history" tone="purple" /><Metric icon={<Clock3 />} label="Time entries" value={state.timeEntries.length} sub="manual/timer" tone="blue" /></div>
    {lastExport ? <textarea readOnly value={lastExport} className="mt-4 h-56 w-full rounded-2xl border border-slate-200 bg-slate-950 p-3 font-mono text-xs text-emerald-200" /> : <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Apasa Export CSV mock pentru raport taskuri/proiecte/timp. Backend PDF/CSV real ramane faza urmatoare.</div>}
  </Panel>;
}

function TaskDetailPanel({ state, task, users, updateTask, addComment, commentDraft, setCommentDraft, toggleChecklist, addChecklistItem, addAttachment, addTime, timeDraft, setTimeDraft, startTimer, stopTimer, timerTaskId }: { state: GoodDayParityState; task: GoodDayTask; users: GoodDayUser[]; updateTask: (taskId: string, patch: Partial<GoodDayTask>, action?: string) => void; addComment: (taskId: string) => void; commentDraft: string; setCommentDraft: (value: string) => void; toggleChecklist: (taskId: string, itemId: string) => void; addChecklistItem: (taskId: string) => void; addAttachment: (taskId: string) => void; addTime: () => void; timeDraft: string; setTimeDraft: (value: string) => void; startTimer: (id: string) => void; stopTimer: () => void; timerTaskId: string | null }) {
  if (!task) return <Panel title="Task detail"><div className="text-sm text-slate-500">Nu exista task selectat.</div></Panel>;
  return <Panel title="Task detail real" icon={<ListChecks className="h-4 w-4 text-emerald-600" />}>
    <input value={task.title} onChange={(event) => updateTask(task.id, { title: event.target.value }, "Title changed")} className="mb-3 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base font-black" />
    <textarea value={task.description} onChange={(event) => updateTask(task.id, { description: event.target.value }, "Description changed")} className="mb-3 h-20 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" />
    <div className="grid gap-2 md:grid-cols-2"><SelectField label="Status" value={task.status} options={statusOptions} onChange={(value) => updateTask(task.id, { status: value as GoodDayStatus }, "Status changed")} /><SelectField label="Prioritate" value={task.priority} options={priorityOptions} onChange={(value) => updateTask(task.id, { priority: value as GoodDayPriority }, "Priority changed")} /><SelectField label="Assignee" value={task.assigneeId} options={users.map((user) => user.id)} labels={Object.fromEntries(users.map((user) => [user.id, user.name]))} onChange={(value) => updateTask(task.id, { assigneeId: value }, "Assignee changed")} /><InputField label="Deadline" value={task.dueDate} onChange={(value) => updateTask(task.id, { dueDate: value }, "Deadline changed")} /></div>
    <div className="mt-4 rounded-2xl bg-slate-50 p-3"><div className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Checklist / subtasks</div>{task.checklist.map((item) => <button key={item.id} onClick={() => toggleChecklist(task.id, item.id)} className="mb-1 flex w-full items-center gap-2 rounded-xl bg-white px-3 py-2 text-left text-sm"><span className={`h-4 w-4 rounded border ${item.done ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`} />{item.title}</button>)}<button onClick={() => addChecklistItem(task.id)} className="mt-2 text-xs font-black text-emerald-700">+ adauga subtask</button></div>
    <div className="mt-4 grid gap-2 md:grid-cols-2"><div><div className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Comentarii</div><textarea value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} className="h-20 w-full rounded-2xl border border-slate-200 p-3 text-sm" placeholder="Adauga comentariu" /><button onClick={() => addComment(task.id)} className="mt-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white">Adauga comentariu</button></div><div><div className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Time / attachments</div><div className="flex gap-2"><input value={timeDraft} onChange={(event) => setTimeDraft(event.target.value)} className="w-20 rounded-xl border border-slate-200 px-2 py-1 text-sm" /><button onClick={addTime} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-black">Log time</button></div><div className="mt-2 flex gap-2">{timerTaskId === task.id ? <button onClick={stopTimer} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-black text-white">Stop timer</button> : <button onClick={() => startTimer(task.id)} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white">Start timer</button>}<button onClick={() => addAttachment(task.id)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-black">Attach mock</button></div></div></div>
    <div className="mt-4 space-y-2"><div className="text-xs font-black uppercase tracking-wide text-slate-500">Activity</div>{task.activity.slice(0, 4).map((activity) => <div key={activity.id} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">{activity.action} · {activity.detail}</div>)}</div>
  </Panel>;
}

function NotificationsPanel({ notifications, markNotificationRead }: { notifications: GoodDayNotification[]; markNotificationRead: (id: string) => void }) {
  return <Panel title="Notification center" icon={<Bell className="h-4 w-4 text-emerald-600" />}>
    <div className="space-y-2">{notifications.length ? notifications.map((notification) => <button key={notification.id} onClick={() => markNotificationRead(notification.id)} className={`block w-full rounded-2xl border p-3 text-left ${notification.read ? "border-slate-100 bg-slate-50" : "border-emerald-200 bg-emerald-50"}`}><div className="text-sm font-bold">{notification.title}</div><div className="text-xs text-slate-500">{notification.body}</div></button>) : <div className="text-sm text-slate-500">Nu ai notificari.</div>}</div>
  </Panel>;
}

function ActivityPanel({ state }: { state: GoodDayParityState }) {
  return <Panel title="Audit activity stream" icon={<Activity className="h-4 w-4 text-emerald-600" />}>
    <div className="space-y-2">{state.auditLog.slice(0, 8).map((activity) => <div key={activity.id} className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600"><span className="font-bold text-slate-900">{activity.action}</span> · {activity.detail ?? activity.entityId}</div>)}</div>
  </Panel>;
}

function TaskMiniList({ tasks, state, onOpen }: { tasks: GoodDayTask[]; state: GoodDayParityState; onOpen: (id: string) => void }) {
  return <div className="space-y-2">{tasks.map((task) => <button key={task.id} onClick={() => onOpen(task.id)} className="block w-full rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left"><div className="text-sm font-bold">{task.title}</div><div className="text-xs text-slate-500">{state.projects.find((project) => project.id === task.projectId)?.code} · {task.status} · {task.dueDate}</div></button>)}</div>;
}

function FilterBar({ state, filters, setFilters }: { state: GoodDayParityState; filters: GoodDayFilters; setFilters: (filters: GoodDayFilters) => void }) {
  const update = (patch: Partial<GoodDayFilters>) => setFilters({ ...filters, ...patch });
  return <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6"><div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={filters.search ?? ""} onChange={(event) => update({ search: event.target.value })} placeholder="Search" className="w-full rounded-2xl border border-slate-200 py-2 pl-9 pr-3 text-sm" /></div><SelectFilter label="Status" value={filters.status ?? "all"} options={["all", ...statusOptions]} onChange={(value) => update({ status: value })} /><SelectFilter label="Priority" value={filters.priority ?? "all"} options={["all", ...priorityOptions]} onChange={(value) => update({ priority: value })} /><SelectFilter label="Assignee" value={filters.assigneeId ?? "all"} options={["all", ...state.users.map((user) => user.id)]} labels={Object.fromEntries([["all", "all"], ...state.users.map((user) => [user.id, user.name])])} onChange={(value) => update({ assigneeId: value })} /><SelectFilter label="Department" value={filters.department ?? "all"} options={["all", ...departmentOptions]} onChange={(value) => update({ department: value })} /><button onClick={() => setFilters({ search: "", status: "all", priority: "all", assigneeId: "all", department: "all", projectId: "all" })} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"><Filter className="mr-1 inline h-4 w-4" /> Reset</button></div>;
}

function SelectFilter({ label, value, options, labels, onChange }: { label: string; value: string; options: string[]; labels?: Record<string, string>; onChange: (value: string) => void }) {
  return <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold">{options.map((option) => <option key={option} value={option}>{labels?.[option] ?? option}</option>)}</select>;
}

function SelectField({ label, value, options, labels, onChange }: { label: string; value: string; options: string[]; labels?: Record<string, string>; onChange: (value: string) => void }) {
  return <label className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-2 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900">{options.map((option) => <option key={option} value={option}>{labels?.[option] ?? option}</option>)}</select></label>;
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}<input value={value} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-2 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900" /></label>;
}

function PriorityBadge({ priority }: { priority: GoodDayPriority }) {
  const tone = priority === "Critical" ? "bg-rose-100 text-rose-700" : priority === "Urgent" ? "bg-amber-100 text-amber-700" : priority === "High" ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600";
  return <span className={`rounded-full px-2 py-1 text-[11px] font-black uppercase tracking-wide ${tone}`}>{priority}</span>;
}
