"use client";

import { useEffect, useMemo, useState } from "react";
import { projects as fallbackProjects, users, type Priority, type Task, type TaskStatus } from "@servelect/shared";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { useWorkOsStore } from "@/lib/store";
import { type TaskuriCreateInput, type TaskuriModalKind, useTaskuriActionRegistry } from "@/lib/work-os/taskuri-action-registry";

type RouteKey =
  | "overview"
  | "my-work"
  | "inbox"
  | "tickets"
  | "tickets-notificari"
  | "proiecte-active"
  | "proiecte-viitoare"
  | "proiecte-finalizate"
  | "board"
  | "tabel"
  | "calendar"
  | "calendar-gantt"
  | "workload"
  | "workload-aprobari";

type SavedView = { id: string; routeKey: string; name: string; filter: string; sort: string; createdAt: string };
type InboxItem = { id: string; type: "mention" | "approval" | "ticket" | "assignment" | "system"; title: string; detail: string; taskId?: string; read: boolean };

const routeMeta: Record<RouteKey, { title: string; subtitle: string }> = {
  overview: { title: "Taskuri · Overview", subtitle: "Command center dens pentru lucru zilnic, fără shell paralel." },
  "my-work": { title: "My Work", subtitle: "Today, Upcoming, Overdue, Delegated, Watched și Mentions într-un singur loc." },
  inbox: { title: "Inbox", subtitle: "Mențiuni, aprobări, ticket responses și sistem alerts cu read/unread real." },
  tickets: { title: "Ticket Center", subtitle: "SLA, severitate, tehnician, escaladare și convertire în task." },
  "tickets-notificari": { title: "Ticket Notifications", subtitle: "Notificări operaționale pentru SLA, client, echipament și teren." },
  "proiecte-active": { title: "Proiecte active", subtitle: "Portofoliu activ cu health, taskuri, risc și milestone-uri." },
  "proiecte-viitoare": { title: "Proiecte viitoare", subtitle: "Pipeline de pregătire, estimări și planificare resurse." },
  "proiecte-finalizate": { title: "Proiecte finalizate", subtitle: "Handover, recepții, documente și lecții învățate." },
  board: { title: "Board", subtitle: "Kanban real, coloane workflow, WIP și mutare status sincronizată." },
  tabel: { title: "Tabel", subtitle: "Tabel enterprise cu selecție, bulk actions, sort și inline status." },
  calendar: { title: "Calendar", subtitle: "Planificare pe scadențe și programări operaționale." },
  "calendar-gantt": { title: "Calendar + Gantt", subtitle: "Timeline, milestone-uri, dependențe și due date update." },
  workload: { title: "Workload", subtitle: "Capacitate, ore alocate, supraîncărcări și recalcul din estimări." },
  "workload-aprobari": { title: "Workload & Aprobări", subtitle: "Manager view pentru capacity, approvals și decizii rapide." },
};

const statuses: TaskStatus[] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat"];
const priorities: Priority[] = ["Scăzut", "Mediu", "Ridicat", "Urgent", "Critic"];
const savedViewsKey = "servelect.taskuri.v21.savedViews";
const inboxKey = "servelect.taskuri.v21.inbox";

function isTicket(task: Task): boolean {
  const haystack = [task.title, task.description, task.priority, ...(task.tags ?? [])].join(" ").toLowerCase();
  return haystack.includes("ticket") || haystack.includes("sla") || haystack.includes("mentenanță") || task.priority === "Critic";
}

function isOverdue(task: Task): boolean {
  return task.dueDate < new Date().toISOString().slice(0, 10) && task.status !== "Finalizat";
}

function safeLoad<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T): void {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

function defaultInbox(tasks: Task[]): InboxItem[] {
  return [
    { id: "inbox-mention", type: "mention", title: "Mențiune în task", detail: "Cristian Radu a cerut confirmare pentru teren.", taskId: tasks[0]?.id, read: false },
    { id: "inbox-approval", type: "approval", title: "Aprobare în așteptare", detail: "Buget materiale necesită decizie manager.", taskId: tasks[1]?.id, read: false },
    { id: "inbox-ticket", type: "ticket", title: "Ticket aproape de SLA", detail: "Intervenție invertor cu risc S2.", taskId: tasks.find(isTicket)?.id, read: false },
    { id: "inbox-assignment", type: "assignment", title: "Task nou alocat", detail: "Actualizare Gantt pentru proiect activ.", taskId: tasks[2]?.id, read: false },
    { id: "inbox-system", type: "system", title: "Sistem", detail: "Audit v21: single shell enforced.", taskId: undefined, read: false },
  ];
}

export default function TaskuriUnifiedV21Workspace({ routeKey = "overview" }: { routeKey?: RouteKey }) {
  const tasks = useWorkOsStore((state) => state.tasks);
  const workspaceProjects = useWorkOsStore((state) => state.projects);
  const taskSearch = useWorkOsStore((state) => state.taskSearch);
  const statusFilter = useWorkOsStore((state) => state.statusFilter);
  const priorityFilter = useWorkOsStore((state) => state.priorityFilter);
  const assigneeFilter = useWorkOsStore((state) => state.assigneeFilter);
  const timerTaskId = useWorkOsStore((state) => state.timerTaskId);
  const setTaskSearch = useWorkOsStore((state) => state.setTaskSearch);
  const setStatusFilter = useWorkOsStore((state) => state.setStatusFilter);
  const setPriorityFilter = useWorkOsStore((state) => state.setPriorityFilter);
  const setAssigneeFilter = useWorkOsStore((state) => state.setAssigneeFilter);
  const updateTaskStatus = useWorkOsStore((state) => state.updateTaskStatus);
  const updateTask = useWorkOsStore((state) => state.updateTask);

  const [modal, setModal] = useState<TaskuriModalKind | null>(null);
  const [toast, setToast] = useState("Ready");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [form, setForm] = useState<TaskuriCreateInput>({ title: "", description: "", priority: "Mediu", estimateHours: 4 });

  useEffect(() => {
    setSavedViews(safeLoad(savedViewsKey, [] as SavedView[]));
    setInbox(safeLoad(inboxKey, defaultInbox(tasks)));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => saveLocal(savedViewsKey, savedViews), [savedViews]);
  useEffect(() => saveLocal(inboxKey, inbox), [inbox]);

  const addSavedView = (view: { routeKey: string; name: string; filter: string; sort: string }) => {
    setSavedViews((current) => [
      { id: `view-${Date.now()}`, routeKey: view.routeKey, name: view.name, filter: view.filter, sort: view.sort, createdAt: new Date().toISOString() },
      ...current,
    ].slice(0, 20));
  };

  const markNotificationRead = (id?: string, all = false) => {
    setInbox((current) => current.map((item) => all || item.id === id ? { ...item, read: true } : item));
  };

  const actions = useTaskuriActionRegistry({
    openModal: setModal,
    closeModal: () => setModal(null),
    setToast,
    addSavedView,
    markNotificationRead,
  });

  const filteredTasks = useMemo(() => {
    const query = taskSearch.trim().toLowerCase();
    return tasks.filter((task) => {
      const text = [task.title, task.description, task.projectCode, task.projectName, task.assigneeName, ...(task.tags ?? [])].join(" ").toLowerCase();
      return (!query || text.includes(query))
        && (statusFilter === "Toate" || task.status === statusFilter)
        && (priorityFilter === "Toate" || task.priority === priorityFilter)
        && (assigneeFilter === "Toate" || task.assigneeId === assigneeFilter);
    });
  }, [assigneeFilter, priorityFilter, statusFilter, taskSearch, tasks]);

  const visibleTasks = useMemo(() => {
    switch (routeKey) {
      case "my-work": return filteredTasks.filter((task) => task.assigneeName === "Andrei Popescu" || task.ownerId === "u1" || task.status !== "Finalizat");
      case "tickets":
      case "tickets-notificari": return filteredTasks.filter(isTicket);
      case "workload-aprobari": return filteredTasks.filter((task) => task.status === "Review / QA" || task.priority === "Urgent" || task.priority === "Critic");
      default: return filteredTasks;
    }
  }, [filteredTasks, routeKey]);

  const activeProjects = workspaceProjects.filter((project) => {
    const phase = String(project.phase);
    return phase !== "Recepție" && phase !== "Post-implementare";
  });
  const futureProjects = workspaceProjects.filter((project) => {
    const phase = String(project.phase);
    return phase === "Ofertare" || phase === "Planificat" || project.progress < 20;
  });
  const finalProjects = workspaceProjects.filter((project) => {
    const phase = String(project.phase);
    return phase === "Recepție" || phase === "Post-implementare" || project.progress >= 80;
  });
  const unread = inbox.filter((item) => !item.read).length;
  const blocked = tasks.filter((task) => task.status === "Blocat").length;
  const overdue = tasks.filter(isOverdue).length;
  const ticketRisk = tasks.filter(isTicket).length;
  const estimates = tasks.reduce((sum, task) => sum + task.estimateHours, 0);
  const tracked = tasks.reduce((sum, task) => sum + task.trackedHours, 0);
  const meta = routeMeta[routeKey];

  const submitModal = () => {
    if (modal === "saved-view") {
      actions.saveView({ routeKey, name: form.title || `${meta.title} · view`, filter: `${taskSearch || "all"}/${statusFilter}/${priorityFilter}`, sort: "dueDate" });
      setModal(null);
      setForm({ title: "", description: "", priority: "Mediu", estimateHours: 4 });
      return;
    }
    actions.createItem(modal ?? "task", form);
    setForm({ title: "", description: "", priority: "Mediu", estimateHours: 4 });
  };

  return (
    <section className="space-y-4" data-v21-taskuri-single-shell="true" data-route={routeKey}>
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">v21.0.0 · single Taskuri workspace · no parallel shell</p>
              <h1 className="mt-1 text-2xl font-black text-slate-950">{meta.title}</h1>
              <p className="mt-1 max-w-3xl text-sm font-medium text-slate-500">{meta.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2" data-testid="v21-single-action-bar">
              <button type="button" onClick={actions.openNewTask} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow-sm hover:bg-emerald-700">New Task</button>
              <button type="button" onClick={actions.openNewTicket} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100">New Ticket</button>
              <button type="button" onClick={actions.openNewRequest} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">New Request</button>
              <button type="button" onClick={() => setModal("saved-view")} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">Save View</button>
              <button type="button" onClick={() => actions.exportView(visibleTasks, routeKey)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">Export</button>
            </div>
          </div>
          <div className="mt-4 grid gap-2 lg:grid-cols-[1.2fr_.8fr_.8fr_.8fr_auto]">
            <input value={taskSearch} onChange={(event) => { setTaskSearch(event.target.value); actions.applyFilter("Search aplicat; toate view-urile se filtrează din aceeași sursă."); }} placeholder="Search tasks, projects, assignee, tags..." className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-400" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as TaskStatus | "Toate")} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"><option>Toate</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as Priority | "Toate")} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"><option>Toate</option>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select>
            <select value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"><option value="Toate">Toți</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
            <button type="button" onClick={actions.clearFilters} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">Reset filters</button>
          </div>
        </div>

        <div className="grid gap-2 border-b border-slate-200 bg-slate-50/70 p-3 md:grid-cols-6">
          <Metric label="Visible" value={String(visibleTasks.length)} />
          <Metric label="Overdue" value={String(overdue)} tone={overdue ? "red" : "green"} />
          <Metric label="Blocked" value={String(blocked)} tone={blocked ? "red" : "green"} />
          <Metric label="Ticket SLA" value={String(ticketRisk)} tone="amber" />
          <Metric label="Unread" value={String(unread)} tone={unread ? "amber" : "green"} />
          <Metric label="Tracked" value={`${tracked.toFixed(1)}h / ${estimates}h`} tone="blue" />
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_310px]">
          <main className="min-w-0 space-y-4">
            {(routeKey === "overview" || routeKey === "my-work") && <OverviewContent tasks={visibleTasks} inbox={inbox} savedViews={savedViews} onOpen={actions.openTaskDrawer} onRead={(id) => actions.markRead(id)} />}
            {(routeKey === "inbox" || routeKey === "tickets-notificari") && <InboxContent inbox={inbox} onRead={(id) => actions.markRead(id)} onReadAll={() => actions.markRead(undefined, true)} onOpen={actions.openTaskDrawer} />}
            {routeKey === "tickets" && <TicketsContent tasks={visibleTasks} onOpen={actions.openTaskDrawer} onEscalate={actions.escalateTicket} onConvert={actions.convertTicketToTask} />}
            {routeKey === "board" && <BoardContent tasks={visibleTasks} onOpen={actions.openTaskDrawer} onMove={updateTaskStatus} />}
            {routeKey === "tabel" && <TableContent tasks={visibleTasks} selectedIds={selectedIds} setSelectedIds={setSelectedIds} onOpen={actions.openTaskDrawer} onBulk={(status) => actions.bulkUpdate(selectedIds, status)} onStatus={updateTaskStatus} />}
            {(routeKey === "calendar" || routeKey === "calendar-gantt") && <CalendarGanttContent tasks={visibleTasks} isGantt={routeKey === "calendar-gantt"} onOpen={actions.openTaskDrawer} onReschedule={(id) => updateTask(id, { dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10) })} />}
            {(routeKey === "workload" || routeKey === "workload-aprobari") && <WorkloadContent tasks={visibleTasks} approvals={routeKey === "workload-aprobari"} onOpen={actions.openTaskDrawer} onApprove={actions.approve} onReject={actions.reject} />}
            {routeKey.startsWith("proiecte-") && <ProjectsContent projects={routeKey === "proiecte-active" ? activeProjects : routeKey === "proiecte-viitoare" ? futureProjects : finalProjects} tasks={tasks} />}
          </main>

          <aside className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between"><h2 className="text-sm font-black text-slate-900">Right context panel</h2><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">single</span></div>
              <div className="mt-3 space-y-2 text-xs font-semibold text-slate-600">
                <p>Feedback: {toast}</p>
                <p>Timer activ: {timerTaskId ? "DA" : "NU"}</p>
                <p>Saved views: {savedViews.length}</p>
                <p>Unread badge: {unread}</p>
              </div>
              <button type="button" onClick={() => actions.markRead(undefined, true)} className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-100">Mark all read</button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Saved views</h2>
              <div className="mt-3 space-y-2">{savedViews.slice(0, 6).map((view) => <div key={view.id} className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-xs"><b>{view.name}</b><br /><span className="text-slate-500">{view.routeKey} · {view.filter}</span></div>)}{savedViews.length === 0 && <p className="text-xs font-semibold text-slate-400">Nicio vedere salvată încă.</p>}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Audit v21 guard</h2>
              <ul className="mt-3 space-y-1 text-xs font-semibold text-slate-600">
                <li>✓ shell global păstrat</li>
                <li>✓ action registry unic</li>
                <li>✓ fără V150/V200/V210 stacked imports</li>
                <li>✓ New Task/New Ticket: modal unic</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <TaskDrawer />
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" data-testid="v21-single-taskuri-modal" data-modal-kind={modal}>
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">single modal · v21</p><h2 className="mt-1 text-xl font-black text-slate-950">{modal === "task" ? "New Task" : modal === "ticket" ? "New Ticket" : modal === "request" ? "New Request" : "Save View"}</h2></div>
              <button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600">Închide</button>
            </div>
            <div className="mt-4 grid gap-3">
              <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Titlu<input value={form.title ?? ""} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm normal-case tracking-normal text-slate-900" /></label>
              <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Descriere<textarea value={form.description ?? ""} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm normal-case tracking-normal text-slate-900" /></label>
              {modal !== "saved-view" && <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Prioritate<select value={form.priority ?? "Mediu"} onChange={(event) => setForm({ ...form, priority: event.target.value as Priority })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm normal-case tracking-normal text-slate-900">{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label><label className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Estimare<input type="number" min="1" value={form.estimateHours ?? 4} onChange={(event) => setForm({ ...form, estimateHours: Number(event.target.value) })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm normal-case tracking-normal text-slate-900" /></label></div>}
              <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Proiect<select value={form.projectId ?? ""} onChange={(event) => setForm({ ...form, projectId: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm normal-case tracking-normal text-slate-900"><option value="">Auto</option>{workspaceProjects.concat(fallbackProjects).slice(0, 8).map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label><label className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Responsabil<select value={form.assigneeId ?? ""} onChange={(event) => setForm({ ...form, assigneeId: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm normal-case tracking-normal text-slate-900"><option value="">Auto</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label></div>
            </div>
            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600">Cancel</button><button type="button" onClick={submitModal} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700">Salvează</button></div>
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "red" | "green" | "amber" | "blue" }) {
  const tones = { slate: "text-slate-900", red: "text-red-700", green: "text-emerald-700", amber: "text-amber-700", blue: "text-blue-700" };
  return <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p><p className={`mt-1 text-lg font-black ${tones[tone]}`}>{value}</p></div>;
}

function OverviewContent({ tasks, inbox, savedViews, onOpen, onRead }: { tasks: Task[]; inbox: InboxItem[]; savedViews: SavedView[]; onOpen: (id?: string) => void; onRead: (id?: string) => void }) {
  return <div className="grid gap-4 lg:grid-cols-3"><TaskList title="Action Required" tasks={tasks.filter((task) => task.priority === "Critic" || task.priority === "Urgent" || task.status === "Blocat").slice(0, 8)} onOpen={onOpen} /><TaskList title="My Work Today" tasks={tasks.slice(0, 8)} onOpen={onOpen} /><div className="rounded-2xl border border-slate-200 bg-white p-4"><h3 className="text-sm font-black">Inbox Updates</h3><div className="mt-3 space-y-2">{inbox.slice(0, 6).map((item) => <button key={item.id} type="button" onClick={() => onRead(item.id)} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-2 text-left text-xs"><b>{item.title}</b><br /><span className="text-slate-500">{item.detail}</span></button>)}</div><h3 className="mt-4 text-sm font-black">Saved views</h3><p className="mt-2 text-xs font-semibold text-slate-500">{savedViews.length} view-uri persistate local.</p></div></div>;
}

function TaskList({ title, tasks, onOpen }: { title: string; tasks: Task[]; onOpen: (id?: string) => void }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-black text-slate-900">{title}</h3><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">{tasks.length}</span></div><div className="space-y-2">{tasks.map((task) => <button key={task.id} type="button" data-task-id={task.id} onClick={() => onOpen(task.id)} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-left hover:border-emerald-200 hover:bg-emerald-50/50"><div className="flex items-center justify-between gap-2"><b className="text-sm text-slate-900">{task.title}</b><span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-slate-500">{task.priority}</span></div><p className="mt-1 text-xs font-semibold text-slate-500">{task.projectCode} · {task.assigneeName} · {task.status}</p></button>)}{tasks.length === 0 && <p className="text-xs font-semibold text-slate-400">Nu există elemente.</p>}</div></div>;
}

function InboxContent({ inbox, onRead, onReadAll, onOpen }: { inbox: InboxItem[]; onRead: (id?: string) => void; onReadAll: () => void; onOpen: (id?: string) => void }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><h3 className="text-sm font-black">Inbox & Action Required</h3><button type="button" onClick={onReadAll} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black">Mark all read</button></div><div className="mt-3 grid gap-2">{inbox.map((item) => <div key={item.id} className={`rounded-xl border p-3 ${item.read ? "border-slate-100 bg-slate-50 text-slate-400" : "border-emerald-200 bg-emerald-50/60 text-slate-900"}`}><div className="flex flex-wrap items-center justify-between gap-2"><div><b className="text-sm">{item.title}</b><p className="text-xs font-semibold">{item.type} · {item.detail}</p></div><div className="flex gap-2"><button type="button" onClick={() => onRead(item.id)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-black">Mark read</button>{item.taskId && <button type="button" onClick={() => onOpen(item.taskId)} className="rounded-lg bg-slate-950 px-2 py-1 text-xs font-black text-white">Open</button>}</div></div></div>)}</div></div>;
}

function TicketsContent({ tasks, onOpen, onEscalate, onConvert }: { tasks: Task[]; onOpen: (id?: string) => void; onEscalate: (id: string) => void; onConvert: (id: string) => void }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><h3 className="text-sm font-black">Ticket queue · SLA</h3><div className="mt-3 grid gap-2">{tasks.map((task) => <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="grid gap-3 lg:grid-cols-[1fr_auto]"><button type="button" onClick={() => onOpen(task.id)} className="text-left"><b>{task.title}</b><p className="mt-1 text-xs font-semibold text-slate-500">SLA risk · {task.projectName} · {task.assigneeName} · {task.dueDate}</p></button><div className="flex flex-wrap gap-2"><button type="button" onClick={() => onEscalate(task.id)} className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-black text-red-700">Escalate</button><button type="button" onClick={() => onConvert(task.id)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-black text-slate-700">Convert to Task</button></div></div></div>)}</div></div>;
}

function BoardContent({ tasks, onOpen, onMove }: { tasks: Task[]; onOpen: (id?: string) => void; onMove: (id: string, status: TaskStatus) => void }) {
  return <div className="grid gap-3 xl:grid-cols-6">{statuses.map((status) => { const column = tasks.filter((task) => task.status === status); return <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-black text-slate-800">{status}</h3><span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-slate-500">{column.length}</span></div><div className="space-y-2">{column.slice(0, 10).map((task) => <div key={task.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><button type="button" onClick={() => onOpen(task.id)} className="text-left"><b className="text-xs text-slate-900">{task.title}</b><p className="mt-1 text-[11px] font-semibold text-slate-500">{task.assigneeName} · {task.priority}</p></button><select value={task.status} onChange={(event) => onMove(task.id, event.target.value as TaskStatus)} className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold">{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>)}</div></div>; })}</div>;
}

function TableContent({ tasks, selectedIds, setSelectedIds, onOpen, onBulk, onStatus }: { tasks: Task[]; selectedIds: string[]; setSelectedIds: (ids: string[]) => void; onOpen: (id?: string) => void; onBulk: (status: TaskStatus) => void; onStatus: (id: string, status: TaskStatus) => void }) {
  const toggle = (id: string) => setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-black">Enterprise table</h3><div className="flex gap-2"><button type="button" onClick={() => onBulk("Review / QA")} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-black">Bulk Review</button><button type="button" onClick={() => onBulk("Finalizat")} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-black">Bulk Done</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400"><th className="py-2">Select</th><th>Task</th><th>Project</th><th>Assignee</th><th>Status</th><th>Priority</th><th>Due</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id} className="border-b border-slate-100"><td className="py-2"><input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => toggle(task.id)} /></td><td><button type="button" onClick={() => onOpen(task.id)} className="font-black text-slate-900 hover:text-emerald-700">{task.title}</button></td><td>{task.projectCode}</td><td>{task.assigneeName}</td><td><select value={task.status} onChange={(event) => onStatus(task.id, event.target.value as TaskStatus)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold">{statuses.map((status) => <option key={status}>{status}</option>)}</select></td><td>{task.priority}</td><td>{task.dueDate}</td></tr>)}</tbody></table></div></div>;
}

function CalendarGanttContent({ tasks, isGantt, onOpen, onReschedule }: { tasks: Task[]; isGantt: boolean; onOpen: (id?: string) => void; onReschedule: (id: string) => void }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><h3 className="text-sm font-black">{isGantt ? "Gantt timeline" : "Calendar"}</h3><div className="mt-3 grid gap-2">{tasks.slice(0, 16).map((task, index) => <div key={task.id} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[110px_1fr_auto]"><span className="text-xs font-black text-slate-500">{task.dueDate}</span><button type="button" onClick={() => onOpen(task.id)} className="text-left text-sm font-black text-slate-900">{isGantt ? `${"▰".repeat((index % 5) + 1)} ` : ""}{task.title}<p className="text-xs font-semibold text-slate-500">Deps: {task.dependencies.length || "none"} · {task.projectName}</p></button><button type="button" onClick={() => onReschedule(task.id)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-black">+14 zile</button></div>)}</div></div>;
}

function WorkloadContent({ tasks, approvals, onOpen, onApprove, onReject }: { tasks: Task[]; approvals: boolean; onOpen: (id?: string) => void; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const rows = users.map((user) => ({ user, tasks: tasks.filter((task) => task.assigneeId === user.id || task.assigneeName === user.name) }));
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><h3 className="text-sm font-black">{approvals ? "Workload approvals" : "Workload capacity"}</h3><div className="mt-3 grid gap-2">{rows.map(({ user, tasks: userTasks }) => { const hours = userTasks.reduce((sum, task) => sum + task.estimateHours, 0); return <div key={user.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><b>{user.name}</b><p className="text-xs font-semibold text-slate-500">{hours}h alocate · {userTasks.length} taskuri</p></div><div className="h-2 w-40 overflow-hidden rounded-full bg-white"><div className={`h-full ${hours > 40 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, Math.round((hours / 40) * 100))}%` }} /></div></div>{approvals && userTasks.slice(0, 2).map((task) => <div key={task.id} className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-2 text-xs"><button type="button" onClick={() => onOpen(task.id)} className="font-black">{task.title}</button><span className="flex gap-1"><button type="button" onClick={() => onApprove(task.id)} className="rounded-lg bg-emerald-600 px-2 py-1 font-black text-white">Approve</button><button type="button" onClick={() => onReject(task.id)} className="rounded-lg border border-red-200 px-2 py-1 font-black text-red-700">Reject</button></span></div>)}</div>; })}</div></div>;
}

function ProjectsContent({ projects, tasks }: { projects: typeof fallbackProjects; tasks: Task[] }) {
  return <div className="grid gap-3 lg:grid-cols-2">{projects.map((project) => { const count = tasks.filter((task) => task.projectId === project.id || task.projectCode === project.code).length; return <div key={project.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-black text-slate-900">{project.name}</h3><p className="text-xs font-semibold text-slate-500">{project.clientName} · {project.location}</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">{project.health}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-emerald-500" style={{ width: `${project.progress}%` }} /></div><p className="mt-2 text-xs font-semibold text-slate-500">{project.progress}% · {count} taskuri legate · deadline {project.deadline}</p></div>; })}</div>;
}

