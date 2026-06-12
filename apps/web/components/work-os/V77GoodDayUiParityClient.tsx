"use client";

import { useEffect, useMemo, useState } from "react";
import {
  V77_STORAGE_KEY,
  type V77RuntimeState,
  type V77TaskStatus,
  type V77ViewDensity,
  addTaskComment,
  calculateV77Workload,
  createSavedView,
  createTask,
  createTicket,
  createV77RuntimeState,
  escalateTicket,
  markAllNotificationsRead,
  runPrimaryWriteDryRun,
  runProviderRehearsal,
  toggleTimer,
  transitionTask,
  v77GlobalScores,
  v77ProgressScores
} from "@/lib/enterprise/work-os-v77-goodday-ui-parity";

export type V77View = "taskuri" | "overview" | "myWork" | "inbox" | "tickets" | "ticketsNotifications" | "board" | "table" | "calendar" | "gantt" | "workload" | "workloadApprovals" | "activeProjects" | "futureProjects" | "doneProjects" | "forms" | "timesheets" | "reports" | "automations" | "workflowsAdmin" | "customFieldsAdmin" | "accessRulesAdmin" | "gooddayParityAdmin" | "gooddayUiParity" | "providerRehearsal" | "primaryWriteDryRun" | "observabilityAdmin";

const nav: { view: V77View; label: string; route: string; group: string }[] = [
  { view: "taskuri", label: "Taskuri Home", route: "/taskuri", group: "Core" },
  { view: "overview", label: "Overview", route: "/taskuri/overview", group: "Core" },
  { view: "myWork", label: "My Work", route: "/taskuri/my-work", group: "Core" },
  { view: "inbox", label: "Inbox", route: "/taskuri/inbox", group: "Core" },
  { view: "ticketsNotifications", label: "Tickets", route: "/taskuri/tickets-notificari", group: "Service" },
  { view: "board", label: "Board", route: "/taskuri/board", group: "Views" },
  { view: "table", label: "Tabel", route: "/taskuri/tabel", group: "Views" },
  { view: "gantt", label: "Calendar/Gantt", route: "/taskuri/calendar-gantt", group: "Views" },
  { view: "workloadApprovals", label: "Workload", route: "/taskuri/workload-aprobari", group: "Planning" },
  { view: "forms", label: "Forms", route: "/taskuri/forms", group: "Service" },
  { view: "timesheets", label: "Timesheets", route: "/taskuri/timesheets", group: "Planning" },
  { view: "reports", label: "Reports", route: "/taskuri/reports", group: "Planning" },
  { view: "automations", label: "Automations", route: "/taskuri/automations", group: "Automation" },
  { view: "workflowsAdmin", label: "Workflows", route: "/admin/workflows", group: "Admin" },
  { view: "customFieldsAdmin", label: "Custom Fields", route: "/admin/custom-fields", group: "Admin" },
  { view: "observabilityAdmin", label: "Observability", route: "/admin/goodday-observability", group: "Admin" }
];

const statusOrder: V77TaskStatus[] = ["Inbox", "Planning", "In lucru", "Review", "Blocat", "Finalizat"];

function loadState(): V77RuntimeState {
  if (typeof window === "undefined") return createV77RuntimeState();
  try {
    const raw = window.localStorage.getItem(V77_STORAGE_KEY);
    if (!raw) return createV77RuntimeState();
    const parsed = JSON.parse(raw) as V77RuntimeState;
    return parsed.version === "7.7.0" ? parsed : createV77RuntimeState();
  } catch {
    return createV77RuntimeState();
  }
}

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "blue" | "amber" | "red" | "purple" }) {
  const tones: Record<string, string> = { slate: "border-slate-200 bg-slate-50 text-slate-600", green: "border-emerald-200 bg-emerald-50 text-emerald-700", blue: "border-blue-200 bg-blue-50 text-blue-700", amber: "border-amber-200 bg-amber-50 text-amber-700", red: "border-red-200 bg-red-50 text-red-700", purple: "border-purple-200 bg-purple-50 text-purple-700" };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
}

function Button({ children, onClick, primary = false }: { children: React.ReactNode; onClick?: () => void; primary?: boolean }) {
  return <button type="button" onClick={onClick} className={`rounded-lg px-3 py-2 text-xs font-black transition ${primary ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{children}</button>;
}

function Panel({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><h3 className="text-sm font-black text-slate-900">{title}</h3>{right}</div><div className="p-4">{children}</div></section>;
}

export function V77GoodDayUiParityClient({ view }: { view: V77View }) {
  const [state, setState] = useState<V77RuntimeState>(() => createV77RuntimeState());
  const [mounted, setMounted] = useState(false);
  const [quickTitle, setQuickTitle] = useState("Verificare documentație tehnică și update status proiect");
  const [ticketTitle, setTicketTitle] = useState("Cerere client nouă din portal / teren");
  const [comment, setComment] = useState("Actualizare rapidă din drawer Work OS.");
  const [density, setDensity] = useState<V77ViewDensity>("compact");

  useEffect(() => { setState(loadState()); setMounted(true); }, []);
  useEffect(() => { if (mounted) window.localStorage.setItem(V77_STORAGE_KEY, JSON.stringify(state)); }, [mounted, state]);

  const selectedTask = useMemo(() => state.tasks.find((task) => task.id === state.selectedTaskId) ?? state.tasks[0], [state.tasks, state.selectedTaskId]);
  const unread = state.notifications.filter((item) => !item.read).length;
  const workload = useMemo(() => calculateV77Workload(state), [state]);
  const scores = v77GlobalScores();
  const rows = v77ProgressScores();

  const apply = (next: V77RuntimeState) => setState(next);
  const visibleTasks = view === "myWork" ? state.tasks.filter((task) => task.assigneeId === "u-andrei" || task.status !== "Finalizat") : state.tasks;

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="border-r border-slate-800 bg-[#0c1824] text-slate-200">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 font-black text-white">S</div><div><p className="text-sm font-black text-white">SERVELECT WORK OS</p><p className="text-[11px] text-slate-400">GoodDay-like execution layer · v7.7.0</p></div></div>
          </div>
          <div className="space-y-5 px-3 py-4">
            {["Core", "Service", "Views", "Planning", "Automation", "Admin"].map((group) => <div key={group}><p className="px-2 pb-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{group}</p><div className="space-y-1">{nav.filter((item) => item.group === group).map((item) => <a key={item.route} href={item.route} className={`block rounded-xl px-3 py-2 text-xs font-bold ${item.view === view ? "bg-emerald-500 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{item.label}</a>)}</div></div>)}
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">GoodDay-like Work OS parity hardening</p><h1 className="text-xl font-black text-slate-950">Taskuri, views, tickets, workload și provider rehearsal</h1></div>
              <div className="flex flex-wrap items-center gap-2"><input className="h-9 w-64 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-400" placeholder="Search tasks, tickets, projects..." /><Badge tone="green">Unread {unread}</Badge><Badge tone="blue">Visual {scores.goodDayVisualSimilarity}%</Badge><Badge tone="purple">Backend {scores.backendApiParity}%</Badge></div>
            </div>
            <div className="flex gap-2 overflow-x-auto px-5 pb-3">{nav.slice(0, 13).map((item) => <a href={item.route} key={item.route} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-black ${item.view === view ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}>{item.label}</a>)}</div>
          </header>

          <div className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              <Panel title="Command bar" right={<Badge tone="green">persistent local + API dry-run</Badge>}>
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
                  <input value={quickTitle} onChange={(event) => setQuickTitle(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                  <Button primary onClick={() => apply(createTask(state, quickTitle))}>Create task</Button>
                  <Button onClick={() => apply(createSavedView(state, nav.find((item) => item.view === view)?.route ?? "/taskuri"))}>Save view</Button>
                </div>
              </Panel>

              {(view === "taskuri" || view === "overview" || view === "myWork" || view === "inbox" || view === "table" || view === "gooddayUiParity") && <TaskListPanel state={state} tasks={visibleTasks} density={density} setDensity={setDensity} onSelect={(id) => setState({ ...state, selectedTaskId: id })} onTransition={(id, status) => apply(transitionTask(state, id, status))} onTimer={(id) => apply(toggleTimer(state, id))} />}
              {(view === "board") && <BoardPanel state={state} onTransition={(id, status) => apply(transitionTask(state, id, status))} />}
              {(view === "tickets" || view === "ticketsNotifications" || view === "forms") && <TicketsPanel state={state} ticketTitle={ticketTitle} setTicketTitle={setTicketTitle} onCreate={() => apply(createTicket(state, ticketTitle))} onEscalate={(id) => apply(escalateTicket(state, id))} />}
              {(view === "gantt" || view === "calendar") && <TimelinePanel state={state} />}
              {(view === "workload" || view === "workloadApprovals" || view === "timesheets") && <WorkloadPanel state={state} workload={workload} onApprove={() => apply({ ...state, timeEntries: state.timeEntries.map((entry) => ({ ...entry, approved: true, submitted: true })) })} />}
              {(view === "reports") && <ReportsPanel rows={rows} state={state} />}
              {(view === "automations" || view === "providerRehearsal") && <AutomationsPanel state={state} onRun={() => apply(runProviderRehearsal(state))} />}
              {(view === "workflowsAdmin" || view === "customFieldsAdmin" || view === "accessRulesAdmin" || view === "gooddayParityAdmin" || view === "observabilityAdmin" || view === "primaryWriteDryRun") && <AdminPanel state={state} rows={rows} onDryRun={() => apply(runPrimaryWriteDryRun(state))} />}
              {(view === "activeProjects" || view === "futureProjects" || view === "doneProjects") && <ProjectPanel state={state} view={view} />}
            </div>

            <aside className="space-y-4">
              <Panel title="Task drawer" right={<Badge tone="blue">drawer complet</Badge>}>
                {selectedTask ? <div className="space-y-3"><div><p className="text-xs font-bold text-slate-400">{selectedTask.code}</p><h2 className="text-lg font-black">{selectedTask.title}</h2></div><div className="flex flex-wrap gap-2"><Badge tone="green">{selectedTask.status}</Badge><Badge tone="amber">{selectedTask.priority}</Badge><Badge>{selectedTask.department}</Badge></div><textarea value={comment} onChange={(event) => setComment(event.target.value)} className="min-h-20 w-full rounded-xl border border-slate-200 p-3 text-sm" /><Button primary onClick={() => apply(addTaskComment(state, selectedTask.id, comment))}>Add comment</Button><div className="space-y-2">{selectedTask.checklist.map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs"><span>{item.label}</span><Badge tone={item.done ? "green" : "amber"}>{item.done ? "Done" : "Open"}</Badge></div>)}</div></div> : <p>No task selected.</p>}
              </Panel>
              <Panel title="Notifications" right={<Button onClick={() => apply(markAllNotificationsRead(state))}>Mark all read</Button>}>
                <div className="space-y-2">{state.notifications.slice(0, 5).map((item) => <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="flex justify-between gap-2"><p className="text-sm font-black">{item.title}</p><Badge tone={item.read ? "slate" : "red"}>{item.read ? "Read" : "Unread"}</Badge></div><p className="mt-1 text-xs text-slate-500">{item.body}</p></div>)}</div>
              </Panel>
              <Panel title="Provider / primary dry-run">
                <div className="space-y-2"><Button primary onClick={() => apply(runProviderRehearsal(state))}>Run provider rehearsal</Button><Button onClick={() => apply(runPrimaryWriteDryRun(state))}>Run primary write dry-run</Button>{state.dryRuns.slice(0, 4).map((run) => <div key={run.id} className="rounded-xl bg-slate-50 p-3 text-xs"><b>{run.action}</b><p>{run.evidence}</p></div>)}</div>
              </Panel>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function TaskListPanel({ state, tasks, density, setDensity, onSelect, onTransition, onTimer }: { state: V77RuntimeState; tasks: V77RuntimeState["tasks"]; density: V77ViewDensity; setDensity: (density: V77ViewDensity) => void; onSelect: (id: string) => void; onTransition: (id: string, status: V77TaskStatus) => void; onTimer: (id: string) => void }) {
  return <Panel title="GoodDay-like task list" right={<div className="flex gap-2"><Button onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}>{density}</Button><Badge tone="green">{tasks.length} tasks</Badge></div>}><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Task</th><th>Status</th><th>Owner</th><th>Due</th><th>Actions</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id} className="border-t border-slate-100 hover:bg-emerald-50/40"><td className="px-3 py-3"><button className="text-left font-black" onClick={() => onSelect(task.id)}>{task.code} · {task.title}</button><p className="text-xs text-slate-500">{task.project} / {task.folder}</p></td><td><select value={task.status} onChange={(event) => onTransition(task.id, event.target.value as V77TaskStatus)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold">{statusOrder.map((status) => <option key={status}>{status}</option>)}</select></td><td>{state.users.find((user) => user.id === task.assigneeId)?.name ?? "Unassigned"}</td><td>{task.dueDate}</td><td><Button onClick={() => onTimer(task.id)}>{state.activeTimerTaskId === task.id ? "Stop timer" : "Start timer"}</Button></td></tr>)}</tbody></table></div></Panel>;
}

function BoardPanel({ state, onTransition }: { state: V77RuntimeState; onTransition: (id: string, status: V77TaskStatus) => void }) {
  return <Panel title="Kanban board"><div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">{statusOrder.map((status) => <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-black uppercase text-slate-500">{status}</p><Badge>{state.tasks.filter((task) => task.status === status).length}</Badge></div><div className="space-y-2">{state.tasks.filter((task) => task.status === status).map((task) => <div key={task.id} className="rounded-xl bg-white p-3 shadow-sm"><p className="text-xs font-bold text-slate-400">{task.code}</p><p className="text-sm font-black">{task.title}</p><div className="mt-2 flex gap-1"><Button onClick={() => onTransition(task.id, "In lucru")}>Work</Button><Button onClick={() => onTransition(task.id, "Review")}>Review</Button></div></div>)}</div></div>)}</div></Panel>;
}

function TicketsPanel({ state, ticketTitle, setTicketTitle, onCreate, onEscalate }: { state: V77RuntimeState; ticketTitle: string; setTicketTitle: (value: string) => void; onCreate: () => void; onEscalate: (id: string) => void }) {
  return <Panel title="Tickets / Requests / Forms" right={<Badge tone="amber">SLA aware</Badge>}><div className="mb-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]"><input value={ticketTitle} onChange={(event) => setTicketTitle(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" /><Button primary onClick={onCreate}>Create ticket</Button></div><div className="grid gap-3 md:grid-cols-2">{state.tickets.map((ticket) => <div key={ticket.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between"><p className="font-black">{ticket.code} · {ticket.title}</p><Badge tone={ticket.severity === "S2" ? "red" : "amber"}>{ticket.severity}</Badge></div><p className="mt-1 text-xs text-slate-500">{ticket.client} · SLA {ticket.slaDueAt}</p><div className="mt-3 flex gap-2"><Button onClick={() => onEscalate(ticket.id)}>Escalate</Button><Button>Convert to task</Button></div></div>)}</div></Panel>;
}

function TimelinePanel({ state }: { state: V77RuntimeState }) {
  return <Panel title="Calendar / Gantt / dependencies"><div className="space-y-2">{state.tasks.map((task) => <div key={task.id} className="grid grid-cols-[150px_minmax(0,1fr)_90px] items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 text-sm"><span className="font-bold">{task.dueDate}</span><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(10, task.estimateMinutes / 6))}%` }} /></div><Badge>{task.dependencies.length} deps</Badge></div>)}</div></Panel>;
}

function WorkloadPanel({ state, workload, onApprove }: { state: V77RuntimeState; workload: ReturnType<typeof calculateV77Workload>; onApprove: () => void }) {
  return <Panel title="Workload / My Time / Timesheets" right={<Button primary onClick={onApprove}>Approve timesheets</Button>}><div className="grid gap-3 md:grid-cols-2">{workload.map((row) => <div key={row.user.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{row.user.name}</p><Badge tone={row.overloaded ? "red" : row.underutilized ? "amber" : "green"}>{row.utilization}%</Badge></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(row.utilization, 100)}%` }} /></div><p className="mt-2 text-xs text-slate-500">{row.assignedTasks.length} taskuri · {row.plannedMinutes} planned · {row.trackedMinutes} tracked</p></div>)}</div><div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs">Timesheets: {state.timeEntries.length}. Approved: {state.timeEntries.filter((entry) => entry.approved).length}</div></Panel>;
}

function ReportsPanel({ rows, state }: { rows: ReturnType<typeof v77ProgressScores>; state: V77RuntimeState }) {
  const csv = `category,before,after\n${rows.map((row) => `${row.category},${row.before},${row.after}`).join("\n")}`;
  return <Panel title="Reports / dashboards / analytics" right={<Button onClick={() => navigator.clipboard?.writeText(csv)}>Copy CSV</Button>}><div className="grid gap-3 md:grid-cols-2">{rows.slice(0, 8).map((row) => <div key={row.category} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between text-sm font-black"><span>{row.category}</span><span>{row.after}%</span></div><p className="mt-1 text-xs text-slate-500">{row.next}</p></div>)}</div><p className="mt-4 text-xs text-slate-500">Audit events: {state.audit.length}. Dry runs: {state.dryRuns.length}.</p></Panel>;
}

function AutomationsPanel({ state, onRun }: { state: V77RuntimeState; onRun: () => void }) {
  return <Panel title="Automations / provider rehearsal" right={<Button primary onClick={onRun}>Run provider rehearsal</Button>}><div className="grid gap-3 md:grid-cols-2">{state.automations.map((automation) => <div key={automation.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{automation.name}</p><Badge tone={automation.enabled ? "green" : "slate"}>{automation.enabled ? "Enabled" : "Off"}</Badge></div><p className="mt-1 text-xs text-slate-500">{automation.trigger} {" -> "} {automation.action}</p><p className="mt-2 text-xs font-bold">Runs: {automation.runs}</p></div>)}</div></Panel>;
}

function AdminPanel({ state, rows, onDryRun }: { state: V77RuntimeState; rows: ReturnType<typeof v77ProgressScores>; onDryRun: () => void }) {
  return <Panel title="Admin / workflows / observability" right={<Button primary onClick={onDryRun}>Primary write dry-run</Button>}><div className="grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Workflow rules</p><p className="text-3xl font-black">{state.workflows.length}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Saved views</p><p className="text-3xl font-black">{state.savedViews.length}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Dry runs</p><p className="text-3xl font-black">{state.dryRuns.length}</p></div></div><div className="mt-4 space-y-2">{rows.slice(0, 6).map((row) => <div key={row.category} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm"><span>{row.category}</span><Badge tone="blue">{row.after}%</Badge></div>)}</div></Panel>;
}

function ProjectPanel({ state, view }: { state: V77RuntimeState; view: V77View }) {
  const groups = Array.from(new Set(state.tasks.map((task) => task.project)));
  return <Panel title={`Project hierarchy / ${view}`}><div className="grid gap-3 md:grid-cols-2">{groups.map((project) => <div key={project} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{project}</p><p className="text-xs text-slate-500">{state.tasks.filter((task) => task.project === project).length} taskuri · hierarchy tree ready</p></div>)}</div></Panel>;
}



