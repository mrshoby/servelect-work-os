"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  V70_STORAGE_KEY,
  V70_RELEASE_VERSION,
  V70State,
  V70Status,
  V70Ticket,
  V70CustomField,
  V70TaskType,
  V70SavedView,
  V70TimeEntry,
  V70Timesheet,
  buildV70Seed,
  buildNotification,
  calculateV70Workload,
  createTaskFromTicket,
  exportV70Csv,
  minutesToHuman,
  validateTransition,
  v70Id,
  v70Now,
  v70DaysFromNow,
  v70ProgressScores,
  v70ParityFeatureMatrix
} from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";

export type V70GoodDayParityView =
  | "overview"
  | "my-work"
  | "inbox"
  | "tickets"
  | "board"
  | "table"
  | "calendar"
  | "workload"
  | "forms"
  | "timesheets"
  | "reports"
  | "automations"
  | "workflows-admin"
  | "custom-fields-admin"
  | "access-rules-admin"
  | "goodday-parity-admin";

const viewLabels: Record<V70GoodDayParityView, string> = {
  overview: "Overview",
  "my-work": "My Work",
  inbox: "Inbox / Action Required",
  tickets: "Tickets & Requests",
  board: "Board",
  table: "Table",
  calendar: "Calendar / Gantt",
  workload: "Workload",
  forms: "Forms",
  timesheets: "My Time / Timesheets",
  reports: "Reports",
  automations: "Automations",
  "workflows-admin": "Admin Workflows",
  "custom-fields-admin": "Admin Custom Fields",
  "access-rules-admin": "Access Rules",
  "goodday-parity-admin": "GoodDay Parity"
};

const statuses: V70Status[] = ["Backlog", "De facut", "In lucru", "Review", "Aprobare", "Blocat", "Finalizat", "Anulat"];

function loadState(): V70State {
  if (typeof window === "undefined") return buildV70Seed();
  try {
    const raw = window.localStorage.getItem(V70_STORAGE_KEY);
    if (!raw) return buildV70Seed();
    const parsed = JSON.parse(raw) as V70State;
    if (!parsed.tasks || !parsed.tickets || !parsed.requestForms) return buildV70Seed();
    return parsed;
  } catch {
    return buildV70Seed();
  }
}

export function V70GoodDayParityHardeningClient({ view = "overview" }: { view?: V70GoodDayParityView }) {
  const [state, setState] = useState<V70State>(() => loadState());
  const [activeView, setActiveView] = useState<V70GoodDayParityView>(view);
  const [currentUserId, setCurrentUserId] = useState("u_andrei");
  const [selectedTaskId, setSelectedTaskId] = useState(state.tasks[0]?.id ?? "");
  const [selectedTicketId, setSelectedTicketId] = useState(state.tickets[0]?.id ?? "");
  const [statusMessage, setStatusMessage] = useState("v7.0.0 loaded. Local persistent adapter active.");
  const [timerTaskId, setTimerTaskId] = useState<string | null>(null);
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(null);
  const [newTicketTitle, setNewTicketTitle] = useState("Cerere noua interventie client");
  const [newFormName, setNewFormName] = useState("Cerere interna achizitie / suport");
  const [newTaskTitle, setNewTaskTitle] = useState("Task nou creat din v7.0.0");
  const [newViewName, setNewViewName] = useState("View personalizat v7");

  useEffect(() => setActiveView(view), [view]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(V70_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const currentUser = useMemo(() => state.users.find((user) => user.id === currentUserId) ?? state.users[0], [state.users, currentUserId]);
  const selectedTask = useMemo(() => state.tasks.find((task) => task.id === selectedTaskId) ?? state.tasks[0], [state.tasks, selectedTaskId]);
  const selectedTicket = useMemo(() => state.tickets.find((ticket) => ticket.id === selectedTicketId) ?? state.tickets[0], [state.tickets, selectedTicketId]);
  const workload = useMemo(() => calculateV70Workload(state), [state]);
  const unread = state.notifications.filter((notification) => !notification.read).length;
  const pendingApprovals = state.approvals.filter((approval) => approval.status === "Pending").length;
  const slaRiskTickets = state.tickets.filter((ticket) => ticket.escalated || ticket.severity === "Critical").length;
  const blockedTasks = state.tasks.filter((task) => task.status === "Blocat" || task.dependencyIds.length > 0).length;

  function update(mutator: (draft: V70State) => void, message: string) {
    setState((previous) => {
      const draft = structuredClone(previous) as V70State;
      mutator(draft);
      draft.activity.unshift({ id: v70Id("act"), entityKind: "task", entityId: "system", actorId: currentUser.id, action: message, createdAt: v70Now() });
      return draft;
    });
    setStatusMessage(message);
  }

  function createTask() {
    update((draft) => {
      const task = {
        id: v70Id("task"),
        code: `SWO-${3000 + draft.tasks.length}`,
        title: newTaskTitle,
        description: "Task creat real in UI state + local persistent adapter v7.0.0.",
        typeId: "type_task",
        status: "De facut" as V70Status,
        priority: "Normal" as const,
        projectId: draft.projects[0]?.id ?? "p_green_500",
        department: currentUser.department,
        ownerId: currentUser.id,
        assigneeId: currentUser.id,
        watcherIds: [currentUser.id],
        dueDate: v70DaysFromNow(7),
        estimateMinutes: 120,
        progress: 0,
        customFields: { cf_deliverable: "Livrabil nou" },
        checklist: [{ id: v70Id("chk"), title: "Primul pas", done: false }],
        comments: [],
        attachments: [],
        dependencyIds: [],
        createdAt: v70Now(),
        updatedAt: v70Now()
      };
      draft.tasks.unshift(task);
      draft.notifications.unshift(buildNotification(currentUser.id, "Task creat", task.title, "task", task.id, "/taskuri/my-work"));
      setSelectedTaskId(task.id);
    }, "Task creat si persistat local.");
  }

  function editSelectedTask() {
    if (!selectedTask) return;
    update((draft) => {
      const task = draft.tasks.find((item) => item.id === selectedTask.id);
      if (!task) return;
      task.title = `${task.title} · editat`;
      task.progress = Math.min(100, task.progress + 10);
      task.comments.unshift({ id: v70Id("com"), authorId: currentUser.id, body: "Comentariu adaugat prin v7 drawer/action panel.", createdAt: v70Now() });
      task.updatedAt = v70Now();
      draft.notifications.unshift(buildNotification(task.assigneeId, "Task editat", task.title, "task", task.id, "/taskuri/tabel"));
    }, "Task editat: titlu, progres si comentariu actualizate.");
  }

  function transitionSelectedTask(nextStatus: V70Status) {
    if (!selectedTask) return;
    update((draft) => {
      const task = draft.tasks.find((item) => item.id === selectedTask.id);
      const workflow = draft.workflows[0];
      if (!task || !workflow) return;
      const result = validateTransition(task, nextStatus, workflow, draft.customFields);
      if (!result.ok) {
        draft.notifications.unshift(buildNotification(currentUser.id, "Validare workflow", result.message, "workflow", workflow.id, "/admin/workflows"));
        return;
      }
      task.status = nextStatus;
      task.updatedAt = v70Now();
      task.comments.unshift({ id: v70Id("com"), authorId: currentUser.id, body: `Status schimbat in ${nextStatus}.`, createdAt: v70Now() });
      if (nextStatus === "Aprobare") {
        draft.approvals.unshift({ id: v70Id("ap"), title: `Approval gate: ${task.title}`, entityKind: "task", entityId: task.id, requesterId: currentUser.id, approverId: "u_andrei", status: "Pending", createdAt: v70Now() });
        draft.notifications.unshift(buildNotification("u_andrei", "Approval gate", task.title, "approval", task.id, "/work-os/approvals"));
      }
    }, `Workflow transition requested: ${nextStatus}.`);
  }

  function createTicket() {
    update((draft) => {
      const ticket: V70Ticket = {
        id: v70Id("tick"),
        code: `TCK-${500 + draft.tickets.length}`,
        title: newTicketTitle,
        type: "Client",
        severity: "High",
        status: "Nou",
        requester: currentUser.name,
        requesterId: currentUser.id,
        assigneeId: "u_mihai",
        projectId: draft.projects[0]?.id,
        clientName: draft.projects[0]?.clientName,
        slaDueAt: v70DaysFromNow(2),
        escalated: false,
        comments: [{ id: v70Id("com"), authorId: currentUser.id, body: "Ticket creat din Ticket Center v7.", createdAt: v70Now() }],
        attachments: [{ id: v70Id("att"), name: "poza-interventie-mock.jpg", type: "Image", url: "mock://attachments/poza" }],
        activity: [],
        createdAt: v70Now(),
        updatedAt: v70Now()
      };
      draft.tickets.unshift(ticket);
      draft.notifications.unshift(buildNotification(ticket.assigneeId, "Ticket nou", ticket.title, "ticket", ticket.id, "/taskuri/tickets-notificari"));
      setSelectedTicketId(ticket.id);
    }, "Ticket creat cu SLA, requester, assignee, comments si attachment mock.");
  }

  function escalateTicket(ticketId = selectedTicket?.id) {
    if (!ticketId) return;
    update((draft) => {
      const ticket = draft.tickets.find((item) => item.id === ticketId);
      if (!ticket) return;
      ticket.status = "Escaladat";
      ticket.escalated = true;
      ticket.severity = ticket.severity === "Critical" ? "Critical" : "Urgent";
      ticket.activity.unshift({ id: v70Id("act"), entityKind: "ticket", entityId: ticket.id, actorId: currentUser.id, action: "Ticket escalated", detail: "SLA risc ridicat", createdAt: v70Now() });
      draft.notifications.unshift(buildNotification("u_ioana", "Ticket escaladat", ticket.title, "ticket", ticket.id, "/taskuri/tickets-notificari"));
    }, "Ticket escaladat si notificare manager generata.");
  }

  function convertTicketToTask(ticketId = selectedTicket?.id) {
    if (!ticketId) return;
    update((draft) => {
      const ticket = draft.tickets.find((item) => item.id === ticketId);
      if (!ticket) return;
      const task = createTaskFromTicket(ticket, currentUser.id);
      draft.tasks.unshift(task);
      ticket.taskId = task.id;
      ticket.status = "In lucru";
      draft.notifications.unshift(buildNotification(task.assigneeId, "Ticket convertit in task", task.title, "task", task.id, "/taskuri/overview"));
      setSelectedTaskId(task.id);
    }, "Ticket convertit in task functional.");
  }

  function createRequestForm() {
    update((draft) => {
      draft.requestForms.unshift({ id: v70Id("form"), name: newFormName, target: "ticket", department: currentUser.department, active: true, submissions: 0, fields: [
        { id: "subject", label: "Subiect", type: "text", required: true, options: [] },
        { id: "priority", label: "Prioritate", type: "select", required: true, options: ["Normal", "High", "Urgent"] }
      ] });
    }, "Request form creat in form builder simplu.");
  }

  function submitRequest(formId: string) {
    update((draft) => {
      const form = draft.requestForms.find((item) => item.id === formId);
      if (!form) return;
      form.submissions += 1;
      const requestId = v70Id("req");
      draft.requestSubmissions.unshift({ id: requestId, formId, requester: currentUser.name, values: { subject: `Request din ${form.name}`, priority: "High" }, createdAt: v70Now() });
      if (form.target === "ticket") {
        const ticket: V70Ticket = { id: v70Id("tick"), code: `TCK-${700 + draft.tickets.length}`, title: `Request: ${form.name}`, type: "Internal", severity: "High", status: "In triere", requester: currentUser.name, requesterId: currentUser.id, assigneeId: "u_mihai", slaDueAt: v70DaysFromNow(3), escalated: false, comments: [], attachments: [], activity: [], createdAt: v70Now(), updatedAt: v70Now() };
        draft.tickets.unshift(ticket);
        draft.requestSubmissions[0].convertedToKind = "ticket";
        draft.requestSubmissions[0].convertedToId = ticket.id;
        draft.notifications.unshift(buildNotification(ticket.assigneeId, "Request transformat in ticket", ticket.title, "ticket", ticket.id, "/taskuri/tickets"));
      }
    }, "Request trimis si convertit in ticket/task dupa configuratia formularului.");
  }

  function markAllNotificationsRead() {
    update((draft) => {
      draft.notifications = draft.notifications.map((notification) => ({ ...notification, read: true }));
    }, "Toate notificarile marcate ca citite.");
  }

  function markNotificationRead(id: string) {
    update((draft) => {
      const notification = draft.notifications.find((item) => item.id === id);
      if (notification) notification.read = true;
    }, "Notificare marcata ca citita.");
  }

  function decideApproval(id: string, status: "Approved" | "Rejected") {
    update((draft) => {
      const approval = draft.approvals.find((item) => item.id === id);
      if (!approval) return;
      approval.status = status;
      approval.decidedAt = v70Now();
      draft.notifications.unshift(buildNotification(approval.requesterId, `Approval ${status}`, approval.title, "approval", approval.id, "/work-os/approvals"));
    }, `Approval ${status}.`);
  }

  function createSavedView() {
    update((draft) => {
      const view: V70SavedView = { id: v70Id("sv"), name: newViewName, scope: "tasks", route: "/taskuri/tabel", ownerId: currentUser.id, shared: true, filters: { status: "In lucru" }, columns: ["code", "title", "status", "priority", "assignee", "dueDate"], density: "compact", grouping: "status", createdAt: v70Now() };
      draft.savedViews.unshift(view);
    }, "Saved view creat si persistat dupa refresh.");
  }

  function deleteSavedView(id: string) {
    update((draft) => {
      draft.savedViews = draft.savedViews.filter((item) => item.id !== id);
    }, "Saved view sters.");
  }

  function addCustomField() {
    update((draft) => {
      const field: V70CustomField = { id: v70Id("cf"), name: `Camp v7 ${draft.customFields.length + 1}`, type: "text", appliesTo: ["type_task"], required: false, options: [] };
      draft.customFields.unshift(field);
    }, "Custom field adaugat in configuratie.");
  }

  function addTaskType() {
    update((draft) => {
      const type: V70TaskType = { id: v70Id("type"), name: `Tip task v7 ${draft.taskTypes.length + 1}`, icon: "custom", defaultWorkflowId: "wf_standard", requiredFieldIds: [], description: "Tip nou creat in admin mock persistent." };
      draft.taskTypes.unshift(type);
    }, "Task type nou creat si persistat.");
  }

  function addDependency() {
    if (!selectedTask || state.tasks.length < 2) return;
    update((draft) => {
      const task = draft.tasks.find((item) => item.id === selectedTask.id);
      const dependency = draft.tasks.find((item) => item.id !== selectedTask.id);
      if (!task || !dependency) return;
      task.dependencyIds = Array.from(new Set([...task.dependencyIds, dependency.id]));
      task.status = "Blocat";
      draft.notifications.unshift(buildNotification(task.assigneeId, "Dependency blocker", `${task.title} depinde de ${dependency.code}`, "task", task.id, "/taskuri/calendar-gantt"));
    }, "Dependency creata si task marcat blocat.");
  }

  function setRecurrenceAndReminder() {
    if (!selectedTask) return;
    update((draft) => {
      const task = draft.tasks.find((item) => item.id === selectedTask.id);
      if (!task) return;
      task.recurrenceRule = "FREQ=WEEKLY;BYDAY=MO";
      task.reminderAt = v70DaysFromNow(1);
      draft.notifications.unshift(buildNotification(task.assigneeId, "Reminder setat", task.title, "task", task.id, "/taskuri/calendar"));
    }, "Recurrence si reminder setate pe task.");
  }

  function startTimer() {
    if (!selectedTask) return;
    setTimerTaskId(selectedTask.id);
    setTimerStartedAt(Date.now());
    setStatusMessage(`Timer pornit pentru ${selectedTask.code}.`);
  }

  function stopTimer() {
    if (!timerTaskId || !timerStartedAt) return;
    const minutes = Math.max(1, Math.round((Date.now() - timerStartedAt) / 60000));
    update((draft) => {
      const entry: V70TimeEntry = { id: v70Id("time"), taskId: timerTaskId, userId: currentUser.id, date: v70DaysFromNow(0), minutes, note: "Timer v7", source: "Timer", createdAt: v70Now() };
      draft.timeEntries.unshift(entry);
    }, `Timer oprit si time entry creat: ${minutes} minute.`);
    setTimerTaskId(null);
    setTimerStartedAt(null);
  }

  function addManualTimeEntry() {
    if (!selectedTask) return;
    update((draft) => {
      draft.timeEntries.unshift({ id: v70Id("time"), taskId: selectedTask.id, userId: currentUser.id, date: v70DaysFromNow(0), minutes: 45, note: "Manual time entry v7", source: "Manual", createdAt: v70Now() });
    }, "Time entry manual creat.");
  }

  function submitTimesheet() {
    update((draft) => {
      let sheet = draft.timesheets.find((item) => item.userId === currentUser.id && item.status === "Draft");
      const entries = draft.timeEntries.filter((entry) => entry.userId === currentUser.id);
      if (!sheet) {
        sheet = { id: v70Id("ts"), userId: currentUser.id, weekStart: v70DaysFromNow(-2), status: "Draft", entryIds: entries.map((entry) => entry.id), totalMinutes: entries.reduce((sum, entry) => sum + entry.minutes, 0), managerId: currentUser.managerId ?? "u_andrei" };
        draft.timesheets.unshift(sheet);
      }
      sheet.status = "Submitted";
      sheet.submittedAt = v70Now();
      sheet.totalMinutes = entries.reduce((sum, entry) => sum + entry.minutes, 0);
      draft.notifications.unshift(buildNotification(sheet.managerId, "Timesheet submitted", currentUser.name, "timesheet", sheet.id, "/taskuri/timesheets"));
    }, "Timesheet trimis catre manager.");
  }

  function approveTimesheet(id: string) {
    update((draft) => {
      const sheet = draft.timesheets.find((item) => item.id === id);
      if (!sheet) return;
      sheet.status = "Approved";
      sheet.decidedAt = v70Now();
      draft.notifications.unshift(buildNotification(sheet.userId, "Timesheet aprobat", sheet.weekStart, "timesheet", sheet.id, "/taskuri/timesheets"));
    }, "Timesheet aprobat de manager.");
  }

  function runAutomation(ruleId: string) {
    update((draft) => {
      const rule = draft.automations.find((item) => item.id === ruleId);
      if (!rule || !rule.enabled) return;
      rule.runs += 1;
      rule.lastRunAt = v70Now();
      if (rule.action === "create_ticket") {
        const ticket: V70Ticket = { id: v70Id("tick"), code: `AUTO-${900 + draft.tickets.length}`, title: `Automation: ${rule.name}`, type: rule.trigger === "iot_alarm" ? "IoT" : "Internal", severity: "High", status: "Nou", requester: "Automation Engine", assigneeId: "u_mihai", projectId: "p_green_500", clientName: "GreenFactory SA", slaDueAt: v70DaysFromNow(1), escalated: false, comments: [], attachments: [], activity: [], createdAt: v70Now(), updatedAt: v70Now() };
        draft.tickets.unshift(ticket);
        draft.notifications.unshift(buildNotification(ticket.assigneeId, "Automation created ticket", ticket.title, "ticket", ticket.id, "/taskuri/tickets"));
      } else if (rule.action === "create_task" || rule.action === "create_handover_checklist") {
        const task = { ...createTaskFromTicket({ id: "auto", code: "AUTO", title: `Automation task: ${rule.name}`, type: "Internal", severity: "Normal", status: "Nou", requester: "Automation", assigneeId: "u_cristian", slaDueAt: v70DaysFromNow(5), escalated: false, comments: [], attachments: [], activity: [], createdAt: v70Now(), updatedAt: v70Now() }, currentUser.id), typeId: "type_procurement" };
        draft.tasks.unshift(task);
      } else {
        draft.notifications.unshift(buildNotification("u_ioana", "Automation notification", rule.name, "automation", rule.id, "/taskuri/automations"));
      }
    }, "Automation test rule executat.");
  }

  function downloadReport(type: "tasks" | "tickets" | "workload" | "timesheets") {
    const csv = exportV70Csv(state, type);
    if (typeof document === "undefined") return;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `servelect-v70-${type}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage(`CSV export generat: ${type}.`);
  }

  const filteredMyTasks = state.tasks.filter((task) => task.assigneeId === currentUser.id || task.ownerId === currentUser.id || currentUser.role === "Super Admin");

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-950">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">SERVELECT WORK OS · v{V70_RELEASE_VERSION}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">GoodDay Functional Parity Hardening</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">Integrare reala in rutele Taskuri: tickets, forms, workflows, custom fields, saved views, time tracking, workload, reports si automations. Nu copiaza branding GoodDay.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
            <div className="font-bold">Status</div>
            <div>{statusMessage}</div>
            <select className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-slate-700" value={currentUserId} onChange={(event) => setCurrentUserId(event.target.value)}>
              {state.users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.role}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
          <Metric label="Tasks" value={state.tasks.length} />
          <Metric label="Tickets" value={state.tickets.length} tone="amber" />
          <Metric label="Unread" value={unread} tone="red" />
          <Metric label="Approvals" value={pendingApprovals} tone="purple" />
          <Metric label="SLA risk" value={slaRiskTickets} tone="red" />
          <Metric label="Blocked" value={blockedTasks} tone="amber" />
          <Metric label="Views" value={state.savedViews.length} tone="blue" />
          <Metric label="Automations" value={state.automations.length} tone="green" />
        </div>

        <nav className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(viewLabels) as V70GoodDayParityView[]).map((item) => (
            <button key={item} onClick={() => setActiveView(item)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${activeView === item ? "border-emerald-500 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"}`}>{viewLabels[item]}</button>
          ))}
        </nav>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {(activeView === "overview" || activeView === "my-work" || activeView === "table") && <TasksPanel tasks={activeView === "my-work" ? filteredMyTasks : state.tasks} state={state} selectedTaskId={selectedTask?.id} onSelect={setSelectedTaskId} onCreate={createTask} onEdit={editSelectedTask} onTransition={transitionSelectedTask} onDependency={addDependency} onRecurrence={setRecurrenceAndReminder} />}
          {activeView === "inbox" && <NotificationsPanel state={state} onRead={markNotificationRead} onReadAll={markAllNotificationsRead} />}
          {activeView === "tickets" && <TicketsPanel state={state} selectedTicketId={selectedTicket?.id} newTicketTitle={newTicketTitle} setNewTicketTitle={setNewTicketTitle} onSelect={setSelectedTicketId} onCreate={createTicket} onEscalate={escalateTicket} onConvert={convertTicketToTask} />}
          {activeView === "forms" && <FormsPanel state={state} newFormName={newFormName} setNewFormName={setNewFormName} onCreate={createRequestForm} onSubmit={submitRequest} />}
          {activeView === "board" && <BoardPanel state={state} onSelect={setSelectedTaskId} onMove={transitionSelectedTask} />}
          {activeView === "calendar" && <CalendarPanel state={state} onSelect={setSelectedTaskId} onRecurrence={setRecurrenceAndReminder} />}
          {activeView === "workload" && <WorkloadPanel workload={workload} />}
          {activeView === "timesheets" && <TimesheetsPanel state={state} onStart={startTimer} onStop={stopTimer} timerTaskId={timerTaskId} onManual={addManualTimeEntry} onSubmit={submitTimesheet} onApprove={approveTimesheet} />}
          {activeView === "reports" && <ReportsPanel state={state} onExport={downloadReport} />}
          {activeView === "automations" && <AutomationsPanel state={state} onRun={runAutomation} />}
          {activeView === "workflows-admin" && <WorkflowsPanel state={state} selectedTask={selectedTask} onTransition={transitionSelectedTask} />}
          {activeView === "custom-fields-admin" && <CustomFieldsPanel state={state} onAddField={addCustomField} onAddType={addTaskType} />}
          {activeView === "access-rules-admin" && <AccessRulesPanel state={state} currentUserId={currentUserId} />}
          {activeView === "goodday-parity-admin" && <ParityPanel />}
        </div>
        <aside className="space-y-6">
          <SelectedTaskPanel state={state} selectedTask={selectedTask} onEdit={editSelectedTask} onTransition={transitionSelectedTask} />
          <SavedViewsPanel state={state} newViewName={newViewName} setNewViewName={setNewViewName} onCreate={createSavedView} onDelete={deleteSavedView} />
          <ApprovalsPanel state={state} onDecide={decideApproval} />
        </aside>
      </section>
    <style>{`.btn-primary{border-radius:9999px;background:#059669;color:white;padding:0.55rem 0.9rem;font-size:0.75rem;font-weight:800}.btn-secondary{border-radius:9999px;border:1px solid #d1fae5;background:white;color:#047857;padding:0.5rem 0.8rem;font-size:0.75rem;font-weight:800}.btn-chip{border-radius:9999px;border:1px solid #e2e8f0;background:#fff;color:#475569;padding:0.45rem 0.7rem;font-size:0.72rem;font-weight:800}`}</style></main>
  );
}

function Metric({ label, value, tone = "slate" }: { label: string; value: number | string; tone?: "slate" | "green" | "amber" | "red" | "purple" | "blue" }) {
  const tones = { slate: "bg-slate-50 text-slate-900", green: "bg-emerald-50 text-emerald-800", amber: "bg-amber-50 text-amber-800", red: "bg-red-50 text-red-800", purple: "bg-purple-50 text-purple-800", blue: "bg-blue-50 text-blue-800" };
  return <div className={`rounded-2xl border border-slate-100 p-3 ${tones[tone]}`}><div className="text-xs font-semibold uppercase text-slate-500">{label}</div><div className="text-2xl font-black">{value}</div></div>;
}

function TasksPanel({ tasks, state, selectedTaskId, onSelect, onCreate, onEdit, onTransition, onDependency, onRecurrence }: { tasks: V70State["tasks"]; state: V70State; selectedTaskId?: string; onSelect: (id: string) => void; onCreate: () => void; onEdit: () => void; onTransition: (status: V70Status) => void; onDependency: () => void; onRecurrence: () => void }) {
  return <Panel title="Task Management Core" action={<button onClick={onCreate} className="btn-primary">Creeaza task</button>}>
    <div className="flex flex-wrap gap-2 pb-3"><button onClick={onEdit} className="btn-secondary">Editeaza task</button><button onClick={onDependency} className="btn-secondary">Creeaza dependency</button><button onClick={onRecurrence} className="btn-secondary">Set recurrence/reminder</button>{statuses.map((status) => <button key={status} onClick={() => onTransition(status)} className="btn-chip">{status}</button>)}</div>
    <div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Task</th><th>Status</th><th>Type</th><th>Project</th><th>Due</th><th>Estimate</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id} onClick={() => onSelect(task.id)} className={`cursor-pointer border-t border-slate-100 hover:bg-emerald-50 ${selectedTaskId === task.id ? "bg-emerald-50" : "bg-white"}`}><td className="p-3"><div className="font-bold">{task.code} · {task.title}</div><div className="text-xs text-slate-500">{task.department} · {task.priority}</div></td><td><Badge>{task.status}</Badge></td><td>{state.taskTypes.find((type) => type.id === task.typeId)?.name ?? task.typeId}</td><td>{state.projects.find((project) => project.id === task.projectId)?.code}</td><td>{task.dueDate}</td><td>{minutesToHuman(task.estimateMinutes)}</td></tr>)}</tbody></table></div>
  </Panel>;
}

function TicketsPanel({ state, selectedTicketId, newTicketTitle, setNewTicketTitle, onSelect, onCreate, onEscalate, onConvert }: { state: V70State; selectedTicketId?: string; newTicketTitle: string; setNewTicketTitle: (value: string) => void; onSelect: (id: string) => void; onCreate: () => void; onEscalate: (id?: string) => void; onConvert: (id?: string) => void }) {
  return <Panel title="Tickets / Requests / SLA Center" action={<button onClick={onCreate} className="btn-primary">Creeaza ticket</button>}>
    <input value={newTicketTitle} onChange={(event) => setNewTicketTitle(event.target.value)} className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
    <div className="grid gap-3 md:grid-cols-2">{state.tickets.map((ticket) => <div key={ticket.id} onClick={() => onSelect(ticket.id)} className={`rounded-2xl border p-4 ${selectedTicketId === ticket.id ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"}`}><div className="flex items-start justify-between gap-3"><div><div className="font-black">{ticket.code} · {ticket.title}</div><p className="text-xs text-slate-500">{ticket.type} · {ticket.requester} · SLA {ticket.slaDueAt}</p></div><Badge>{ticket.status}</Badge></div><div className="mt-3 flex flex-wrap gap-2"><button onClick={(event) => { event.stopPropagation(); onEscalate(ticket.id); }} className="btn-secondary">Escaladeaza</button><button onClick={(event) => { event.stopPropagation(); onConvert(ticket.id); }} className="btn-secondary">Converteste in task</button></div></div>)}</div>
  </Panel>;
}

function FormsPanel({ state, newFormName, setNewFormName, onCreate, onSubmit }: { state: V70State; newFormName: string; setNewFormName: (value: string) => void; onCreate: () => void; onSubmit: (id: string) => void }) {
  return <Panel title="Request Forms & Form Builder" action={<button onClick={onCreate} className="btn-primary">Creeaza form</button>}>
    <input value={newFormName} onChange={(event) => setNewFormName(event.target.value)} className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
    <div className="grid gap-3 md:grid-cols-2">{state.requestForms.map((form) => <div key={form.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="font-black">{form.name}</div><p className="text-xs text-slate-500">Target: {form.target} · Departament: {form.department} · Submissions: {form.submissions}</p><ul className="mt-3 space-y-1 text-xs text-slate-600">{form.fields.map((field) => <li key={field.id}>• {field.label} {field.required ? "(required)" : ""}</li>)}</ul><button onClick={() => onSubmit(form.id)} className="btn-secondary mt-3">Trimite request demo</button></div>)}</div>
  </Panel>;
}

function NotificationsPanel({ state, onRead, onReadAll }: { state: V70State; onRead: (id: string) => void; onReadAll: () => void }) {
  return <Panel title="Notification Center" action={<button onClick={onReadAll} className="btn-primary">Mark all read</button>}>
    <div className="space-y-2">{state.notifications.map((notification) => <div key={notification.id} className={`rounded-2xl border p-4 ${notification.read ? "border-slate-100 bg-white" : "border-emerald-200 bg-emerald-50"}`}><div className="flex justify-between gap-3"><div><div className="font-bold">{notification.title}</div><p className="text-sm text-slate-500">{notification.body}</p><p className="text-xs text-slate-400">{notification.route}</p></div><button onClick={() => onRead(notification.id)} className="btn-secondary">Read</button></div></div>)}</div>
  </Panel>;
}

function BoardPanel({ state, onSelect, onMove }: { state: V70State; onSelect: (id: string) => void; onMove: (status: V70Status) => void }) {
  return <Panel title="Board / Kanban"><div className="grid gap-3 lg:grid-cols-4">{["De facut", "In lucru", "Review", "Finalizat"].map((status) => <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="mb-3 font-black">{status}</div>{state.tasks.filter((task) => task.status === status).map((task) => <button key={task.id} onClick={() => { onSelect(task.id); onMove(status as V70Status); }} className="mb-2 block w-full rounded-xl border border-slate-200 bg-white p-3 text-left text-sm shadow-sm"><b>{task.code}</b><br />{task.title}</button>)}</div>)}</div></Panel>;
}

function CalendarPanel({ state, onSelect, onRecurrence }: { state: V70State; onSelect: (id: string) => void; onRecurrence: () => void }) {
  return <Panel title="Calendar / Gantt / Dependencies" action={<button onClick={onRecurrence} className="btn-primary">Set reminder</button>}><div className="space-y-2">{state.tasks.slice().sort((a,b) => a.dueDate.localeCompare(b.dueDate)).map((task) => <button key={task.id} onClick={() => onSelect(task.id)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left"><span><b>{task.dueDate}</b> · {task.code} · {task.title}</span><span className="text-xs text-slate-500">Deps: {task.dependencyIds.length} · {task.recurrenceRule ?? "none"}</span></button>)}</div></Panel>;
}

function WorkloadPanel({ workload }: { workload: ReturnType<typeof calculateV70Workload> }) {
  return <Panel title="Workload / Resource Planning"><div className="grid gap-3 md:grid-cols-2">{workload.map((row) => <div key={row.user.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between text-sm font-bold"><span>{row.user.name}</span><span>{row.utilization}%</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className={`h-3 rounded-full ${row.overloaded ? "bg-red-500" : row.underutilized ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${Math.min(row.utilization, 140)}%` }} /></div><p className="mt-2 text-xs text-slate-500">{row.user.department} · {row.assignedTasks.length} tasks · {minutesToHuman(row.plannedMinutes)} / {minutesToHuman(row.capacityMinutes)}</p></div>)}</div></Panel>;
}

function TimesheetsPanel({ state, onStart, onStop, timerTaskId, onManual, onSubmit, onApprove }: { state: V70State; onStart: () => void; onStop: () => void; timerTaskId: string | null; onManual: () => void; onSubmit: () => void; onApprove: (id: string) => void }) {
  return <Panel title="My Time / Timesheets" action={<div className="flex gap-2"><button onClick={onStart} className="btn-secondary">Start timer</button><button onClick={onStop} className="btn-primary">Stop timer</button></div>}><p className="mb-3 text-sm text-slate-500">Timer activ: {timerTaskId ?? "none"}</p><div className="flex flex-wrap gap-2 pb-3"><button onClick={onManual} className="btn-secondary">Manual time entry</button><button onClick={onSubmit} className="btn-secondary">Submit timesheet</button></div><div className="grid gap-3 md:grid-cols-2">{state.timesheets.map((sheet) => <div key={sheet.id} className="rounded-2xl border border-slate-200 bg-white p-4"><b>{sheet.userId}</b><p className="text-sm text-slate-500">{sheet.weekStart} · {sheet.status} · {minutesToHuman(sheet.totalMinutes)}</p><button onClick={() => onApprove(sheet.id)} className="btn-secondary mt-2">Manager approve</button></div>)}</div></Panel>;
}

function ReportsPanel({ state, onExport }: { state: V70State; onExport: (type: "tasks" | "tickets" | "workload" | "timesheets") => void }) {
  return <Panel title="Reports / Analytics / CSV Export"><div className="grid gap-3 md:grid-cols-2">{state.reports.map((report) => <div key={report.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="font-black">{report.name}</div><p className="text-sm text-slate-500">Type: {report.type}</p><button onClick={() => onExport(report.type === "projects" ? "tasks" : report.type)} className="btn-secondary mt-3">Export CSV</button></div>)}</div></Panel>;
}

function AutomationsPanel({ state, onRun }: { state: V70State; onRun: (id: string) => void }) {
  return <Panel title="Automation Rules"><div className="grid gap-3 md:grid-cols-2">{state.automations.map((rule) => <div key={rule.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="font-black">{rule.name}</div><p className="text-sm text-slate-500">{rule.trigger} · {rule.condition} · runs {rule.runs}</p><button onClick={() => onRun(rule.id)} className="btn-secondary mt-3">Test rule</button></div>)}</div></Panel>;
}

function WorkflowsPanel({ state, selectedTask, onTransition }: { state: V70State; selectedTask?: V70State["tasks"][number]; onTransition: (status: V70Status) => void }) {
  return (
    <Panel title="Workflow Admin / Custom Statuses / Validations">
      <div className="space-y-4">
        {state.workflows.map((workflow) => (
          <div key={workflow.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-black">{workflow.name}</div>
            <p className="text-xs text-slate-500">Approval gates: {workflow.approvalGateStatuses.join(", ")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {workflow.statuses.map((workflowStatus) => {
                const targetStatus: V70Status = workflowStatus.id;
                return (
                  <button key={workflowStatus.id} onClick={() => onTransition(targetStatus)} className="btn-chip">
                    {selectedTask?.status ?? "No task"} -&gt; {workflowStatus.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CustomFieldsPanel({ state, onAddField, onAddType }: { state: V70State; onAddField: () => void; onAddType: () => void }) {
  return <Panel title="Custom Fields & Task Types" action={<div className="flex gap-2"><button onClick={onAddField} className="btn-secondary">Add field</button><button onClick={onAddType} className="btn-primary">Add type</button></div>}><div className="grid gap-3 md:grid-cols-2"><div>{state.customFields.map((field) => <div key={field.id} className="mb-2 rounded-xl border border-slate-200 bg-white p-3 text-sm"><b>{field.name}</b> · {field.type} · {field.required ? "required" : "optional"}</div>)}</div><div>{state.taskTypes.map((type) => <div key={type.id} className="mb-2 rounded-xl border border-slate-200 bg-white p-3 text-sm"><b>{type.name}</b><p className="text-xs text-slate-500">{type.description}</p></div>)}</div></div></Panel>;
}

function AccessRulesPanel({ state, currentUserId }: { state: V70State; currentUserId: string }) {
  const user = state.users.find((item) => item.id === currentUserId) ?? state.users[0];
  return <Panel title="RBAC / Custom Access Rules"><div className="grid gap-3 md:grid-cols-3"><Metric label="User" value={user.name} /><Metric label="Role" value={user.role} /><Metric label="Department" value={user.department} /></div><p className="mt-4 text-sm text-slate-500">Reguli active: Super Admin vede tot; Department Admin vede departamentul; Manager vede echipa/subordonatii; Client vede doar date permise. Backend policy enforcement ramane pasul critic v7.1.</p></Panel>;
}

function ParityPanel() {
  return <Panel title="GoodDay Parity & Progress"><div className="space-y-3">{v70ParityFeatureMatrix().map((item) => <div key={item.feature} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between font-bold"><span>{item.feature}</span><span>{item.score}%</span></div><p className="text-sm text-slate-500">{item.status} · {item.note}</p></div>)}</div><div className="mt-6 overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Categorie</th><th>Inainte</th><th>Actual</th><th>Lipseste</th></tr></thead><tbody>{v70ProgressScores().map((row) => <tr key={row.category} className="border-t border-slate-100"><td className="p-3 font-semibold">{row.category}</td><td>{row.before}%</td><td>{row.current}%</td><td className="text-slate-500">{row.missing}</td></tr>)}</tbody></table></div></Panel>;
}

function SelectedTaskPanel({ state, selectedTask, onEdit, onTransition }: { state: V70State; selectedTask?: V70State["tasks"][number]; onEdit: () => void; onTransition: (status: V70Status) => void }) {
  if (!selectedTask) return <Panel title="Task drawer">No task selected.</Panel>;
  const type = state.taskTypes.find((item) => item.id === selectedTask.typeId);
  return <Panel title="Task drawer / detail"><div className="font-black">{selectedTask.code} · {selectedTask.title}</div><p className="mt-1 text-sm text-slate-500">{type?.name} · {selectedTask.status} · {selectedTask.priority}</p><div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500"><div>Estimate: {minutesToHuman(selectedTask.estimateMinutes)}</div><div>Progress: {selectedTask.progress}%</div><div>Dependencies: {selectedTask.dependencyIds.length}</div><div>Reminder: {selectedTask.reminderAt ?? "none"}</div></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={onEdit} className="btn-primary">Quick edit</button><button onClick={() => onTransition("Review")} className="btn-secondary">Move Review</button><button onClick={() => onTransition("Aprobare")} className="btn-secondary">Request approval</button></div><div className="mt-4 space-y-2">{selectedTask.checklist.map((item) => <div key={item.id} className="rounded-xl bg-slate-50 p-2 text-sm">{item.done ? "✓" : "○"} {item.title}</div>)}</div></Panel>;
}

function SavedViewsPanel({ state, newViewName, setNewViewName, onCreate, onDelete }: { state: V70State; newViewName: string; setNewViewName: (value: string) => void; onCreate: () => void; onDelete: (id: string) => void }) {
  return <Panel title="Saved views"><input value={newViewName} onChange={(event) => setNewViewName(event.target.value)} className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /><button onClick={onCreate} className="btn-primary mb-3">Create saved view</button><div className="space-y-2">{state.savedViews.map((view) => <div key={view.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><div className="font-bold">{view.name}</div><p className="text-xs text-slate-500">{view.scope} · {view.shared ? "shared" : "private"} · {view.route}</p><button onClick={() => onDelete(view.id)} className="mt-2 text-xs font-bold text-red-600">delete</button></div>)}</div></Panel>;
}

function ApprovalsPanel({ state, onDecide }: { state: V70State; onDecide: (id: string, status: "Approved" | "Rejected") => void }) {
  return <Panel title="Approvals"><div className="space-y-2">{state.approvals.map((approval) => <div key={approval.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><div className="font-bold">{approval.title}</div><p className="text-xs text-slate-500">{approval.status}</p><div className="mt-2 flex gap-2"><button onClick={() => onDecide(approval.id, "Approved")} className="btn-secondary">Approve</button><button onClick={() => onDecide(approval.id, "Rejected")} className="btn-secondary">Reject</button></div></div>)}</div></Panel>;
}

function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-black tracking-tight">{title}</h2>{action}</div>{children}</section>;
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{children}</span>;
}
